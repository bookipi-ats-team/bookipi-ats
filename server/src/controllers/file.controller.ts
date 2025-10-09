import { randomUUID } from "node:crypto";
import type { RequestHandler } from "express";
import { Types } from "mongoose";
import env from "../config/env.js";
import { Applicant } from "../models/Applicant.js";
import { Job } from "../models/Job.js";
import { ResumeFile } from "../models/ResumeFile.js";
import {
  deleteResumeFromDrive,
  saveResumeToDrive,
  type SaveResumeToDriveResult,
} from "../services/resumeStorage.js";
import { enqueueResumeParsing } from "../services/resumeProcessing.js";
import type { ResumeUploadQuery } from "../validation/files.js";

const errorStatusMap = new Map<string, number>([
  ["Unsupported resume mime type", 400],
  ["Resume file size is invalid", 400],
]);

const handleError = (res: Parameters<RequestHandler>[1], error: unknown) => {
  if (error instanceof Error) {
    const status = errorStatusMap.get(error.message);

    if (status) {
      res.status(status).json({ error: error.message });
      return;
    }

    // eslint-disable-next-line no-console
    console.error("Resume file handler failed", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }

  res.status(500).json({ error: "Internal server error" });
};

const ensureEntitiesExist = async (applicantId?: string, jobId?: string) => {
  const applicantRecord = applicantId
    ? await Applicant.findById(applicantId).exec()
    : null;

  if (applicantId && !applicantRecord) {
    return { error: "Applicant not found" } as const;
  }

  const jobRecord = jobId ? await Job.findById(jobId).exec() : null;

  if (jobId && !jobRecord) {
    return { error: "Job not found" } as const;
  }

  if (applicantRecord && applicantRecord.businessId && jobRecord) {
    if (!applicantRecord.businessId.equals(jobRecord.businessId.toString())) {
      return { error: "Applicant belongs to a different business" } as const;
    }
  }

  return { applicantRecord, jobRecord } as const;
};

const mimeExtensionMap = new Map<string, string>([
  ["application/pdf", "pdf"],
  ["application/msword", "doc"],
  [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "docx",
  ],
  ["application/vnd.oasis.opendocument.text", "odt"],
  ["text/plain", "txt"],
]);

const resolveOriginalName = (
  provided: string | undefined,
  fileId: string,
  mimeType: string,
) => {
  if (provided && provided.trim().length > 0) {
    return provided;
  }

  const extension = mimeExtensionMap.get(mimeType) ?? "bin";
  return `${fileId}.${extension}`;
};

const resolveMimeType = (req: Parameters<RequestHandler>[0]) => {
  const header = req.headers["content-type"];

  if (typeof header !== "string") {
    return null;
  }

  const [mimeType] = header.split(";");
  const trimmed = mimeType.trim();

  return trimmed.length > 0 ? trimmed : null;
};

export const uploadResume: RequestHandler = async (req, res) => {
  const { applicantId, jobId, originalName } =
    req.query as ResumeUploadQuery;

  if (!(req.body instanceof Buffer)) {
    res.status(400).json({ error: "Resume upload must be binary data" });
    return;
  }

  const fileBuffer = req.body;

  if (fileBuffer.length === 0) {
    res.status(400).json({ error: "Resume file must include data" });
    return;
  }

  const mimeType = resolveMimeType(req);

  if (!mimeType) {
    res.status(400).json({ error: "Resume mime type is required" });
    return;
  }

  if (!env.allowedResumeMimeTypes.has(mimeType)) {
    res.status(400).json({ error: "Unsupported resume mime type" });
    return;
  }

  const sizeBytes = fileBuffer.byteLength;

  if (sizeBytes <= 0 || sizeBytes > env.maxResumeFileSize) {
    res.status(400).json({ error: "Resume file size is invalid" });
    return;
  }

  const entityCheck = await ensureEntitiesExist(applicantId, jobId);

  if ("error" in entityCheck) {
    res.status(404).json({ error: entityCheck.error });
    return;
  }

  const { applicantRecord, jobRecord } = entityCheck;
  const fileId = randomUUID();
  const normalizedOriginalName = resolveOriginalName(originalName, fileId, mimeType);
  let driveResult: SaveResumeToDriveResult | null = null;

  try {
    driveResult = await saveResumeToDrive({
      fileId,
      originalName: normalizedOriginalName,
      mimeType,
      data: fileBuffer,
    });

    const resumeFile = await ResumeFile.create({
      fileId,
      applicantId: applicantRecord?._id,
      jobId: jobRecord?._id,
      originalName: normalizedOriginalName,
      mimeType,
      sizeBytes: driveResult.sizeBytes,
      storagePath: driveResult.storagePath,
      url: driveResult.url,
    });

    await enqueueResumeParsing(resumeFile._id as Types.ObjectId);

    res.status(200).json(resumeFile);
  } catch (error) {
    if (driveResult) {
      await deleteResumeFromDrive(driveResult.storagePath).catch((cleanupError) => {
        if (cleanupError instanceof Error) {
          // eslint-disable-next-line no-console
          console.warn("Failed to clean up Google Drive file", cleanupError);
        }
      });
    }

    handleError(res, error);
  }
};
