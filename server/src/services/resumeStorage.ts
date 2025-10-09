import path from "node:path";
import env from "../config/env.js";
import {
  deleteFileFromDrive,
  uploadFileToDrive,
} from "./googleDrive.js";

const sanitizeFileName = (name: string) => {
  const base = path.basename(name);
  return base.replace(/[^a-zA-Z0-9_.-]+/g, "_");
};

export interface SaveResumeToDriveOptions {
  fileId: string;
  originalName: string;
  mimeType: string;
  data: Buffer;
}

export interface SaveResumeToDriveResult {
  storagePath: string;
  url: string;
  sizeBytes: number;
}

export const saveResumeToDrive = async ({
  fileId,
  originalName,
  mimeType,
  data,
}: SaveResumeToDriveOptions): Promise<SaveResumeToDriveResult> => {
  const driveFolderId = env.googleDriveFolderId;

  if (!driveFolderId) {
    throw new Error("Google Drive folder ID is not configured");
  }

  const sanitizedName = sanitizeFileName(originalName);
  const driveFileName = `${fileId}_${sanitizedName}`;

  const driveResult = await uploadFileToDrive({
    name: driveFileName,
    data,
    mimeType,
    parents: [driveFolderId],
  });

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

export const deleteResumeFromDrive = async (storagePath: string) => {
  await deleteFileFromDrive(storagePath);
};
