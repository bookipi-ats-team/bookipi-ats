export const workerConfig = {
  maxParseAttempts: 3,
  baseRetryDelayMs: 5_000,
  maxRetryDelayMs: 60_000,
  maxParseResumeLength: 12_000,
  maxResumeSummaryLength: 2_000,
};
