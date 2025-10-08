import type { RequestHandler } from "express";
import fs from "node:fs/promises";
import { Types } from "mongoose";
import { Applicant } from "../models/Applicant.js";
import { Job } from "../models/Job.js";
import { ResumeFile } from "../models/ResumeFile.js";
import {
  createSignedResumeUpload,
  finalizeResumeUpload,
  getFinalResumeAbsolutePath,
  removeTempResumeUpload,
  writeTempResumeUpload,
} from "../services/resumeStorage.js";
import { enqueueResumeParsing } from "../services/resumeProcessing.js";
import type {
  ResumeConfirmBody,
  ResumeSignBody,
  ResumeUploadParams,
} from "../validation/files.js";

const errorStatusMap = new Map<string, number>([
  ["Unsupported resume mime type", 400],
  ["Resume file size is invalid", 400],
  ["Resume upload payload size is invalid", 400],
  ["Resume upload has not been initiated", 404],
  ["Resume upload not found", 404],
  ["Resume upload size is invalid", 400],
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

export const signResumeUpload: RequestHandler = async (req, res) => {
  try {
    const { mimeType, sizeBytes } = req.body as ResumeSignBody;

    const result = await createSignedResumeUpload({ mimeType, sizeBytes });

    res.status(200).json(result);
  } catch (error) {
    handleError(res, error);
  }
};

export const uploadResumeFile: RequestHandler = async (req, res) => {
  try {
    const { fileId } = req.params as ResumeUploadParams;

    if (!(req.body instanceof Buffer)) {
      res.status(400).json({ error: "Resume upload must be binary data" });
      return;
    }

    await writeTempResumeUpload(fileId, req.body);

    res.status(200).json({ success: true });
  } catch (error) {
    handleError(res, error);
  }
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

export const confirmResumeUpload: RequestHandler = async (req, res) => {
  const { fileId, applicantId, jobId, originalName, mimeType, sizeBytes } =
    req.body as ResumeConfirmBody;

  try {
    const [existingByFileId, entityCheck] = await Promise.all([
      ResumeFile.findOne({ fileId }).exec(),
      ensureEntitiesExist(applicantId, jobId),
    ]);

    if (existingByFileId) {
      await removeTempResumeUpload(fileId);
      res.status(409).json({ error: "Resume upload already confirmed" });
      return;
    }

    if ("error" in entityCheck) {
      await removeTempResumeUpload(fileId);
      res.status(404).json({ error: entityCheck.error });
      return;
    }

    const { applicantRecord, jobRecord } = entityCheck;

    const finalizeResult = await finalizeResumeUpload({ fileId, originalName });

    if (finalizeResult.sizeBytes !== sizeBytes) {
      const absolutePath = getFinalResumeAbsolutePath(
        finalizeResult.storagePath,
      );
      await fs.rm(absolutePath, { force: true });
      res.status(400).json({ error: "Resume file size mismatch" });
      return;
    }

    const resumeFile = await ResumeFile.create({
      fileId,
      applicantId: applicantRecord?._id,
      jobId: jobRecord?._id,
      originalName,
      mimeType,
      sizeBytes: finalizeResult.sizeBytes,
      storagePath: finalizeResult.storagePath,
      url: finalizeResult.url,
    });

    await enqueueResumeParsing(resumeFile._id as Types.ObjectId);

    res.status(200).json(resumeFile);
  } catch (error) {
    try {
      await removeTempResumeUpload(fileId);
    } catch (cleanupError) {
      if (cleanupError instanceof Error) {
        // eslint-disable-next-line no-console
        console.warn("Failed to clean up temp resume upload", cleanupError);
      }
    }

    handleError(res, error);
  }
};
