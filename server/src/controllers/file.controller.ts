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
import { NotFoundError, BadRequestError } from "../errors/AppError.js";

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

const ensureEntitiesExist = async (applicantId?: string, jobId?: string) => {
  const applicantRecord = applicantId
    ? await Applicant.findById(applicantId).exec()
    : null;

  if (applicantId && !applicantRecord) {
    throw new NotFoundError("Applicant not found");
  }

  const jobRecord = jobId ? await Job.findById(jobId).exec() : null;

  if (jobId && !jobRecord) {
    throw new NotFoundError("Job not found");
  }

  return { applicantRecord, jobRecord };
};

export const uploadResume: RequestHandler = async (req, res) => {
  const { applicantId, jobId, originalName } = req.query as ResumeUploadQuery;

  if (!(req.body instanceof Buffer)) {
    throw new BadRequestError("Resume upload must be binary data");
  }

  const fileBuffer = req.body;

  if (fileBuffer.length === 0) {
    throw new BadRequestError("Resume file must include data");
  }

  const mimeType = resolveMimeType(req);

  if (!mimeType) {
    throw new BadRequestError("Resume mime type is required");
  }

  if (!env.allowedResumeMimeTypes.has(mimeType)) {
    throw new BadRequestError("Unsupported resume mime type");
  }

  const sizeBytes = fileBuffer.byteLength;

  if (sizeBytes <= 0 || sizeBytes > env.maxResumeFileSize) {
    throw new BadRequestError("Resume file size is invalid");
  }

  const entityCheck = await ensureEntitiesExist(applicantId, jobId);

  const { applicantRecord, jobRecord } = entityCheck;
  const fileId = randomUUID();
  const normalizedOriginalName = resolveOriginalName(
    originalName,
    fileId,
    mimeType,
  );
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
      await deleteResumeFromDrive(driveResult.storagePath).catch(
        (cleanupError) => {
          if (cleanupError instanceof Error) {
            console.warn("Failed to clean up Google Drive file", cleanupError);
          }
        },
      );
    }

    // Bubble up the error to global handler
    throw error;
  }
};
