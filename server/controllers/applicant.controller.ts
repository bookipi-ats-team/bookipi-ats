import type { Request, Response } from "express";
import { Types } from "mongoose";
import { Applicant } from "../models/Applicant.js";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const toSingleValue = (value: unknown): string | undefined => {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value) && value.length > 0) {
    return value[0];
  }

  return undefined;
};

const parseLimit = (value: unknown): number => {
  const raw = toSingleValue(value);
  const parsed = Number.parseInt(raw ?? "", 10);

  if (Number.isNaN(parsed) || parsed <= 0) {
    return DEFAULT_LIMIT;
  }

  return Math.min(parsed, MAX_LIMIT);
};

const buildSearchRegex = (value: string | undefined): RegExp | undefined => {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return undefined;
  }

  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(escaped, "i");
};

export const getApplicants = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const businessIdValue = toSingleValue(req.query.businessId);
    const searchValue = toSingleValue(req.query.q);
    const cursorValue = toSingleValue(req.query.cursor);
    const limit = parseLimit(req.query.limit);

    if (businessIdValue && !Types.ObjectId.isValid(businessIdValue)) {
      res.status(400).json({ error: "Invalid businessId" });
      return;
    }

    if (cursorValue && !Types.ObjectId.isValid(cursorValue)) {
      res.status(400).json({ error: "Invalid cursor" });
      return;
    }

    const query = Applicant.find({
      ...(businessIdValue
        ? { businessId: new Types.ObjectId(businessIdValue) }
        : {}),
    }).sort({ _id: 1 });

    const search = buildSearchRegex(searchValue);

    if (search) {
      query.where({ $or: [{ name: search }, { email: search }] });
    }

    if (cursorValue) {
      query.where({ _id: { $gt: new Types.ObjectId(cursorValue) } });
    }

    const applicants = await query.limit(limit + 1).exec();
    const hasMore = applicants.length > limit;
    const items = hasMore ? applicants.slice(0, limit) : applicants;
    const nextCursorDoc = hasMore ? applicants[limit] : undefined;
    const nextCursor = nextCursorDoc?.id;

    res.status(200).json(
      nextCursor
        ? {
            items,
            nextCursor,
          }
        : { items },
    );
  } catch (error) {
    console.error("Failed to fetch applicants", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getApplicantById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid applicant id" });
      return;
    }

    const applicant = await Applicant.findById(id).exec();

    if (!applicant) {
      res.status(404).json({ error: "Applicant not found" });
      return;
    }

    res.status(200).json(applicant);
  } catch (error) {
    console.error("Failed to fetch applicant", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
