import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";
import { workerConfig } from "../config/worker.js";

export interface ParseResumeOptions {
  buffer: Buffer;
  mimeType: string;
  fileName?: string;
}

export interface ParsedResumeResult {
  text: string;
  summary: string;
}

export class ResumeParsingError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "ResumeParsingError";
  }
}

const SUPPORTED_PDF_TYPES = new Set(["application/pdf"]);

const SUPPORTED_DOCX_TYPES = new Set([
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const SUPPORTED_TEXT_TYPES = new Set(["text/plain"]);

const sanitizeText = (value: string): string => {
  const normalizedNewlines = value
    .replace(/\r\n?/g, "\n")
    .replace(/\u0000/g, "");

  const collapsedSpaces = normalizedNewlines
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trimEnd())
    .join("\n");

  return collapsedSpaces.replace(/\n{3,}/g, "\n\n").trim();
};

const clampText = (value: string, limit: number): string => {
  if (value.length <= limit) {
    return value;
  }

  return `${value.slice(0, limit)}\n…`;
};

export const normalizeResumeText = (value: string): string =>
  clampText(sanitizeText(value), workerConfig.maxParseResumeLength);

const buildSummary = (text: string): string => {
  if (!text) {
    return "";
  }

  const paragraphs = text
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6);

  const summaryCandidate = paragraphs.join("\n\n");

  return clampText(
    summaryCandidate || text,
    workerConfig.maxResumeSummaryLength,
  );
};

export const createResumeSummary = (text: string): string => buildSummary(text);

const parsePdf = async (buffer: Buffer): Promise<string> => {
  const result = await pdfParse(buffer);

  if (!result.text) {
    throw new ResumeParsingError("No text content extracted from PDF");
  }

  return result.text;
};

const parseDocx = async (buffer: Buffer): Promise<string> => {
  const result = await mammoth.extractRawText({ buffer });
  const { value } = result;

  if (!value) {
    throw new ResumeParsingError("No text content extracted from DOCX");
  }

  return value;
};

const parsePlainText = (buffer: Buffer): string => buffer.toString("utf8");

export const parseResume = async ({
  buffer,
  mimeType,
  fileName,
}: ParseResumeOptions): Promise<ParsedResumeResult> => {
  try {
    let rawText: string;

    if (SUPPORTED_PDF_TYPES.has(mimeType)) {
      rawText = await parsePdf(buffer);
    } else if (SUPPORTED_DOCX_TYPES.has(mimeType)) {
      rawText = await parseDocx(buffer);
    } else if (SUPPORTED_TEXT_TYPES.has(mimeType)) {
      rawText = parsePlainText(buffer);
    } else if (mimeType === "application/msword") {
      throw new ResumeParsingError(
        "Legacy Word documents (.doc) are not supported for parsing",
      );
    } else {
      throw new ResumeParsingError(`Unsupported resume mime type: ${mimeType}`);
    }

    const sanitized = sanitizeText(rawText);

    if (sanitized.length < 40) {
      throw new ResumeParsingError(
        "Parsed resume text was unexpectedly short. Please upload a clearer copy.",
      );
    }

    const text = clampText(sanitized, workerConfig.maxParseResumeLength);

    return {
      text,
      summary: buildSummary(text),
    };
  } catch (error) {
    if (error instanceof ResumeParsingError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    const displayName = fileName ?? "resume";

    throw new ResumeParsingError(
      `Failed to parse ${displayName}: ${message}`,
      error,
    );
  }
};
