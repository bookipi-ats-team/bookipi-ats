import { Types } from "mongoose";
import { ResumeFile } from "../models/ResumeFile.js";
import { downloadFileFromDrive } from "./googleDrive.js";
import { parseResume, ResumeParsingError } from "./resumeParser.js";
import { workerConfig } from "../config/worker.js";

type ResumeId = string;

const queue: ResumeId[] = [];
const enqueued = new Set<ResumeId>();
let workerRunning = false;
let workerInitialized = false;

const truncateMessage = (value: string, limit = 600): string => {
  if (value.length <= limit) {
    return value;
  }

  return `${value.slice(0, limit)}…`;
};

const scheduleWorker = () => {
  if (workerRunning) {
    return;
  }

  workerRunning = true;
  setImmediate(() => {
    void processQueue();
  });
};

const enqueueInternal = (id: ResumeId) => {
  if (enqueued.has(id)) {
    return;
  }

  enqueued.add(id);
  queue.push(id);
  scheduleWorker();
};

const processQueue = async (): Promise<void> => {
  const nextId = queue.shift();

  if (!nextId) {
    workerRunning = false;
    return;
  }

  enqueued.delete(nextId);

  try {
    await processResumeFile(new Types.ObjectId(nextId));
  } catch (error) {
    const message =
      error instanceof Error ? (error.stack ?? error.message) : String(error);
    // eslint-disable-next-line no-console
    console.error(`Failed to process resume ${nextId}`, message);
  } finally {
    if (queue.length > 0) {
      setImmediate(() => {
        void processQueue();
      });
    } else {
      workerRunning = false;
    }
  }
};

const canRetry = (attempts: number) => attempts < workerConfig.maxParseAttempts;

const scheduleRetry = (id: ResumeId, nextAttempt: number) => {
  if (nextAttempt > workerConfig.maxParseAttempts) {
    return;
  }

  const delay = Math.min(
    workerConfig.maxRetryDelayMs,
    workerConfig.baseRetryDelayMs * nextAttempt,
  );

  setTimeout(() => {
    enqueueInternal(id);
  }, delay);
};

const processResumeFile = async (resumeFileId: Types.ObjectId) => {
  const resumeFile = await ResumeFile.findById(resumeFileId).exec();

  if (!resumeFile) {
    return;
  }

  if (resumeFile.parseStatus === "ready") {
    return;
  }

  resumeFile.parseStatus = "processing";
  resumeFile.parseError = undefined;
  resumeFile.parseAttempts = (resumeFile.parseAttempts ?? 0) + 1;

  await resumeFile.save();

  try {
    const { data, mimeType } = await downloadFileFromDrive(
      resumeFile.storagePath,
    );

    const parsed = await parseResume({
      buffer: data,
      mimeType: mimeType ?? resumeFile.mimeType,
      fileName: resumeFile.originalName,
    });

    resumeFile.parsedText = parsed.text;
    resumeFile.parsedSummary = parsed.summary;
    resumeFile.parseStatus = "ready";
    resumeFile.parsedAt = new Date();
    resumeFile.parseError = undefined;

    await resumeFile.save();
    console.log(`[Resume Parsing] Parsed resume ${resumeFileId}`);
  } catch (error) {
    const attempts = resumeFile.parseAttempts ?? 1;
    const message =
      error instanceof ResumeParsingError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Unknown resume parsing failure";

    resumeFile.parseError = truncateMessage(message);
    const canAttemptAgain = canRetry(attempts);
    resumeFile.parseStatus = canAttemptAgain ? "pending" : "failed";

    if (!canAttemptAgain) {
      resumeFile.parsedText = undefined;
      resumeFile.parsedSummary = undefined;
    }

    await resumeFile.save();

    if (canAttemptAgain) {
      const nextAttempt = attempts + 1;
      scheduleRetry(resumeFileId.toString(), nextAttempt);
    }
  }
};

export const enqueueResumeParsing = async (
  resumeFileId: Types.ObjectId,
): Promise<void> => {
  enqueueInternal(resumeFileId.toString());
};

export const startResumeParsingWorker = async () => {
  if (workerInitialized) {
    return;
  }

  workerInitialized = true;

  console.log("[Resume Parsing] Starting worker");

  const pending = await ResumeFile.find({
    $or: [
      { parseStatus: { $in: ["pending", "processing"] } },
      { parseStatus: { $exists: false } },
    ],
  })
    .select("_id")
    .lean()
    .exec();

  console.log("[Resume Parsing] Found", pending.length, "pending resumes");
  for (const entry of pending) {
    if (entry && typeof entry._id !== "undefined") {
      enqueueInternal(entry._id.toString());
    }
  }
};
