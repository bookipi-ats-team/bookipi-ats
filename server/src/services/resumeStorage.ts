import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import env from "../config/env.js";
import {
  deleteFileFromDrive,
  uploadFileToDrive,
} from "./googleDrive.js";

const RESUME_UPLOAD_ROOT = path.resolve(process.cwd(), "uploads", "resumes");
const TEMP_UPLOAD_DIR = path.join(RESUME_UPLOAD_ROOT, "tmp");

const ensureDir = async (dirPath: string) => {
  await fs.mkdir(dirPath, { recursive: true });
};

export const ensureResumeUploadBaseDir = async () => {
  await ensureDir(TEMP_UPLOAD_DIR);
};

const sanitizeFileName = (name: string) => {
  const base = path.basename(name);
  return base.replace(/[^a-zA-Z0-9_.-]+/g, "_");
};

export interface CreateSignedResumeUploadOptions {
  mimeType: string;
  sizeBytes: number;
}

export interface CreateSignedResumeUploadResult {
  fileId: string;
  uploadUrl: string;
}

export const createSignedResumeUpload = async (
  { mimeType, sizeBytes }: CreateSignedResumeUploadOptions,
  uploadRouteBase = "/api/v1/files/resume/upload",
): Promise<CreateSignedResumeUploadResult> => {
  if (!env.allowedResumeMimeTypes.has(mimeType)) {
    throw new Error("Unsupported resume mime type");
  }

  if (sizeBytes <= 0 || sizeBytes > env.maxResumeFileSize) {
    throw new Error("Resume file size is invalid");
  }

  await ensureResumeUploadBaseDir();

  const fileId = randomUUID();
  const tempFilePath = path.join(TEMP_UPLOAD_DIR, fileId);

  await fs.writeFile(tempFilePath, Buffer.alloc(0));

  return {
    fileId,
    uploadUrl: `${uploadRouteBase}/${fileId}`,
  };
};

export interface FinalizeResumeUploadOptions {
  fileId: string;
  originalName: string;
  mimeType: string;
}

export interface FinalizeResumeUploadResult {
  storagePath: string;
  url: string;
  sizeBytes: number;
}

export const finalizeResumeUpload = async (
  { fileId, originalName, mimeType }: FinalizeResumeUploadOptions,
): Promise<FinalizeResumeUploadResult> => {
  await ensureResumeUploadBaseDir();

  const driveFolderId = env.googleDriveFolderId;

  if (!driveFolderId) {
    throw new Error("Google Drive folder ID is not configured");
  }

  const tempFilePath = path.join(TEMP_UPLOAD_DIR, fileId);
  const tempStat = await fs.stat(tempFilePath).catch(() => undefined);

  if (!tempStat || !tempStat.isFile()) {
    throw new Error("Resume upload not found");
  }

  if (tempStat.size <= 0 || tempStat.size > env.maxResumeFileSize) {
    await fs.rm(tempFilePath, { force: true });
    throw new Error("Resume upload size is invalid");
  }

  const sanitizedName = sanitizeFileName(originalName);
  const fileBuffer = await fs.readFile(tempFilePath);

  const driveResult = await uploadFileToDrive({
    name: sanitizedName,
    data: fileBuffer,
    mimeType,
    parents: [driveFolderId],
  });

  await fs.rm(tempFilePath, { force: true });

  const shareableUrl = driveResult.webViewLink ?? driveResult.webContentLink;

  if (!shareableUrl) {
    await deleteFileFromDrive(driveResult.fileId).catch((error) => {
      if (error instanceof Error) {
        // eslint-disable-next-line no-console
        console.warn("Failed to clean up Google Drive file", error);
      }
    });

    throw new Error("Unable to create a shareable Google Drive link");
  }

  return {
    storagePath: driveResult.fileId,
    url: shareableUrl,
    sizeBytes: driveResult.sizeBytes,
  };
};

export const writeTempResumeUpload = async (fileId: string, data: Buffer) => {
  if (data.byteLength <= 0 || data.byteLength > env.maxResumeFileSize) {
    throw new Error("Resume upload payload size is invalid");
  }

  await ensureResumeUploadBaseDir();

  const tempFilePath = path.join(TEMP_UPLOAD_DIR, fileId);
  const existing = await fs.stat(tempFilePath).catch(() => undefined);

  if (!existing || !existing.isFile()) {
    throw new Error("Resume upload has not been initiated");
  }

  await fs.writeFile(tempFilePath, data);
};

export const removeTempResumeUpload = async (fileId: string) => {
  const tempFilePath = path.join(TEMP_UPLOAD_DIR, fileId);
  await fs.rm(tempFilePath, { force: true });
};

export const deleteFinalResumeUpload = async (storagePath: string) => {
  await deleteFileFromDrive(storagePath);
};
