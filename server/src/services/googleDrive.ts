import { Readable } from "node:stream";
import { google, type drive_v3 } from "googleapis";
import env from "../config/env.js";

const DRIVE_SCOPES = ["https://www.googleapis.com/auth/drive.file"];

let driveClientPromise: Promise<drive_v3.Drive> | null = null;

type ServiceAccountCredentials = {
  client_email: string;
  private_key: string;
};

const loadServiceAccountCredentials = async (): Promise<ServiceAccountCredentials> => {
  if (!env.googleDriveCredentialsBase64) {
    throw new Error(
      "GOOGLE_DRIVE_CREDENTIALS_BASE64 environment variable is not set",
    );
  }

  try {
    const decoded = Buffer.from(
      env.googleDriveCredentialsBase64,
      "base64",
    ).toString("utf8");
    const parsed = JSON.parse(decoded) as {
      client_email?: string;
      private_key?: string;
    };

    if (!parsed.client_email || !parsed.private_key) {
      throw new Error(
        "Google service account credentials must include client_email and private_key",
      );
    }

    return {
      client_email: parsed.client_email,
      private_key: parsed.private_key,
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(
        "Invalid JSON in GOOGLE_DRIVE_CREDENTIALS_BASE64 environment variable",
      );
    }

    throw error;
  }
};

const getJwtClient = (credentials: ServiceAccountCredentials) => {
  const formattedKey = credentials.private_key.includes("\\n")
    ? credentials.private_key.replace(/\\n/g, "\n")
    : credentials.private_key;

  return new google.auth.JWT({
    email: credentials.client_email,
    key: formattedKey,
    scopes: DRIVE_SCOPES,
    subject: env.googleDriveImpersonatedUser,
  });
};

const getDriveClient = async () => {
  if (!driveClientPromise) {
    driveClientPromise = (async () => {
      const credentials = await loadServiceAccountCredentials();
      const auth = getJwtClient(credentials);

      await auth.authorize();

      return google.drive({
        version: "v3",
        auth,
      });
    })();
  }

  return driveClientPromise;
};

export interface UploadDriveFileOptions {
  name: string;
  data: Buffer;
  mimeType: string;
  parents?: string[];
  makePublic?: boolean;
}

export interface UploadDriveFileResult {
  fileId: string;
  sizeBytes: number;
  webViewLink?: string;
  webContentLink?: string;
}

export interface DownloadDriveFileResult {
  data: Buffer;
  mimeType?: string;
  name?: string;
  sizeBytes?: number;
}

export const uploadFileToDrive = async ({
  name,
  data,
  mimeType,
  parents,
  makePublic = true,
}: UploadDriveFileOptions): Promise<UploadDriveFileResult> => {
  const drive = await getDriveClient();

  const createResponse = await drive.files.create({
    requestBody: {
      name,
      parents,
    },
    media: {
      mimeType,
      body: Readable.from(data),
    },
    fields: "id,size,webViewLink,webContentLink",
    supportsAllDrives: true,
  });

  const file = createResponse.data;

  if (!file.id) {
    throw new Error("Failed to upload file to Google Drive");
  }

  if (makePublic) {
    try {
      await drive.permissions.create({
        fileId: file.id,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
        supportsAllDrives: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        // eslint-disable-next-line no-console
        console.warn("Unable to set Google Drive file permission", error);
      }
    }
  }

  let webViewLink = file.webViewLink ?? undefined;
  let webContentLink = file.webContentLink ?? undefined;
  let sizeString = file.size ?? undefined;

  if (!webViewLink || !webContentLink || !sizeString) {
    const { data: refreshed } = await drive.files.get({
      fileId: file.id,
      fields: "id,size,webViewLink,webContentLink",
      supportsAllDrives: true,
    });

    webViewLink = refreshed.webViewLink ?? webViewLink;
    webContentLink = refreshed.webContentLink ?? webContentLink;
    sizeString = refreshed.size ?? sizeString;
  }

  return {
    fileId: file.id,
    sizeBytes: sizeString ? Number(sizeString) : data.byteLength,
    webViewLink,
    webContentLink,
  };
};

export const downloadFileFromDrive = async (
  fileId: string,
): Promise<DownloadDriveFileResult> => {
  const drive = await getDriveClient();

  const [metadataResponse, mediaResponse] = await Promise.all([
    drive.files.get({
      fileId,
      fields: "id,name,mimeType,size",
      supportsAllDrives: true,
    }),
    drive.files.get(
      {
        fileId,
        alt: "media",
        supportsAllDrives: true,
      },
      {
        responseType: "arraybuffer",
      },
    ),
  ]);

  const mediaData = mediaResponse.data;
  const buffer = Buffer.isBuffer(mediaData)
    ? mediaData
    : Buffer.from(mediaData as ArrayBuffer);

  const metadata = metadataResponse.data;

  return {
    data: buffer,
    mimeType: metadata.mimeType ?? undefined,
    name: metadata.name ?? undefined,
    sizeBytes: metadata.size ? Number(metadata.size) : undefined,
  };
};

export const deleteFileFromDrive = async (fileId: string) => {
  const drive = await getDriveClient();

  await drive.files.delete({
    fileId,
    supportsAllDrives: true,
  });
};
