import type { RequestHandler } from "express";
import {
  generateJobDescription,
  scoreResume,
  suggestJobTitles,
  suggestMustHaves,
} from "../services/ai.js";
import type {
  GenerateJobDescriptionBody,
  ScoreResumeApplicationBody,
  ScoreResumeInlineBody,
  SuggestJobTitlesBody,
  SuggestMustHavesBody,
} from "../validation/ai.js";

export const postSuggestJobTitles: RequestHandler = async (req, res) => {
  const body = req.body as SuggestJobTitlesBody;
  const mode = (req.query.mode as string | undefined)?.toLowerCase();
  const forceStatic = mode === "static";
  const result = await suggestJobTitles(body, { forceStatic });
  res.status(200).json(result);
};

export const postSuggestMustHaves: RequestHandler = async (req, res) => {
  const body = req.body as SuggestMustHavesBody;
  const mode = (req.query.mode as string | undefined)?.toLowerCase();
  const forceStatic = mode === "static";
  const result = await suggestMustHaves(body, { forceStatic });
  res.status(200).json(result);
};

export const postGenerateJobDescription: RequestHandler = async (req, res) => {
  const body = req.body as GenerateJobDescriptionBody;
  const mode = (req.query.mode as string | undefined)?.toLowerCase();
  const forceStatic = mode === "static";
  const result = await generateJobDescription(body, { forceStatic });
  res.status(200).json(result);
};

export const postScoreResume: RequestHandler = async (req, res) => {
  const body = req.body as ScoreResumeApplicationBody | ScoreResumeInlineBody;
  const mode = (req.query.mode as string | undefined)?.toLowerCase();
  const forceStatic = mode === "static";
  const result = await scoreResume(body, { forceStatic });

  if (result.status === "pending") {
    res.status(202).json(result);
    return;
  }

  if (result.status === "failed") {
    res.status(422).json(result);
    return;
  }

  res.status(200).json(result);
};
