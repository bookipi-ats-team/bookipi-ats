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
  try {
    const body = req.body as SuggestJobTitlesBody;
    const mode = (req.query.mode as string | undefined)?.toLowerCase();
    const forceStatic = mode === "static";
    const result = await suggestJobTitles(body, { forceStatic });
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to suggest job titles", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const postSuggestMustHaves: RequestHandler = async (req, res) => {
  try {
    const body = req.body as SuggestMustHavesBody;
    const mode = (req.query.mode as string | undefined)?.toLowerCase();
    const forceStatic = mode === "static";
    const result = await suggestMustHaves(body, { forceStatic });
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to suggest must haves", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const postGenerateJobDescription: RequestHandler = async (req, res) => {
  try {
    const body = req.body as GenerateJobDescriptionBody;
    const mode = (req.query.mode as string | undefined)?.toLowerCase();
    const forceStatic = mode === "static";
    const result = await generateJobDescription(body, { forceStatic });
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to generate job description", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const postScoreResume: RequestHandler = async (req, res) => {
  try {
    const body = req.body as ScoreResumeApplicationBody | ScoreResumeInlineBody;
    const mode = (req.query.mode as string | undefined)?.toLowerCase();
    const forceStatic = mode === "static";
    const result = await scoreResume(body, { forceStatic });
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to score resume", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
