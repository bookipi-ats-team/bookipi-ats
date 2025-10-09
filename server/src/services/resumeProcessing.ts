import type { Types } from "mongoose";

// Placeholder async queue integration. Replace with actual worker implementation.
export const enqueueResumeParsing = async (resumeFileId: Types.ObjectId) => {
  if (!resumeFileId) {
    return;
  }

  // eslint-disable-next-line no-console
  console.info(`Queued resume parsing job for resumeFileId=${resumeFileId.toString()}`);
};
