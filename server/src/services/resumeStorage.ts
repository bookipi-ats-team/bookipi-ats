import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import env from "../config/env.js";

const RESUME_UPLOAD_ROOT = path.resolve(process.cwd(), "uploads", "resumes");
const TEMP_UPLOAD_DIR = path.join(RESUME_UPLOAD_ROOT, "tmp");
const FINAL_UPLOAD_DIR = path.join(RESUME_UPLOAD_ROOT, "files");

const ensureDir = async (dirPath: string) => {
  await fs.mkdir(dirPath, { recursive: true });
};

export const ensureResumeUploadBaseDir = async () => {
  await Promise.all([ensureDir(TEMP_UPLOAD_DIR), ensureDir(FINAL_UPLOAD_DIR)]);
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
}

export interface FinalizeResumeUploadResult {
  storagePath: string;
  url: string;
  sizeBytes: number;
}

export const finalizeResumeUpload = async (
  { fileId, originalName }: FinalizeResumeUploadOptions,
  staticRouteBase = "/static/resumes",
): Promise<FinalizeResumeUploadResult> => {
  await ensureResumeUploadBaseDir();

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
  const finalDir = path.join(FINAL_UPLOAD_DIR, fileId);
  await ensureDir(finalDir);

  const destinationPath = path.join(finalDir, sanitizedName);

  await fs.rename(tempFilePath, destinationPath).catch(async (error) => {
    if (error && "code" in error && error.code === "EXDEV") {
      const data = await fs.readFile(tempFilePath);
      await fs.writeFile(destinationPath, data);
      await fs.rm(tempFilePath, { force: true });
      return;
    }

    throw error;
  });

  const relativePath = path.relative(RESUME_UPLOAD_ROOT, destinationPath);

  return {
    storagePath: relativePath,
    url: `${staticRouteBase}/${fileId}/${encodeURIComponent(sanitizedName)}`,
    sizeBytes: tempStat.size,
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

export const getFinalResumeAbsolutePath = (storagePath: string) => {
  return path.join(RESUME_UPLOAD_ROOT, storagePath);
};
