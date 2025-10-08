import type { RequestHandler } from "express";
import { Types } from "mongoose";
import { Applicant } from "../models/Applicant.js";
import type {
  GetApplicantByIdParams,
  GetApplicantsQuery,
} from "../validation/applicants.js";

const buildSearchRegex = (value: string | undefined): RegExp | undefined => {
  if (!value) {
    return undefined;
  }

  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(escaped, "i");
};

export const getApplicants: RequestHandler = async (req, res) => {
  try {
    const { businessId, q, cursor, limit } = req.query as unknown as GetApplicantsQuery;

    const query = Applicant.find({
      ...(businessId ? { businessId: new Types.ObjectId(businessId) } : {}),
    }).sort({ _id: 1 });

    const search = buildSearchRegex(q);

    if (search) {
      query.where({ $or: [{ name: search }, { email: search }] });
    }

    if (cursor) {
      query.where({ _id: { $gt: new Types.ObjectId(cursor) } });
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

export const getApplicantById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params as GetApplicantByIdParams;

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
