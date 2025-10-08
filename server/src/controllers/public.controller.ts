import type { RequestHandler } from "express";
import { Types } from "mongoose";
import { Applicant } from "../models/Applicant.js";
import { Application } from "../models/Application.js";
import { Job, type IJob } from "../models/Job.js";
import { ResumeFile } from "../models/ResumeFile.js";
import type {
  GetPublicApplicationsParams,
  GetPublicJobParams,
  GetPublicJobsQuery,
  PostPublicApplyBody,
} from "../validation/public.js";

const normalizeOptionalField = (
  value: string | undefined,
): string | undefined => {
  if (value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const buildJobsFilter = (query: GetPublicJobsQuery) => {
  const filter: Record<string, unknown> = {
    status: "PUBLISHED",
  };

  if (query.q) {
    filter.$or = [
      { title: { $regex: query.q, $options: "i" } },
      { description: { $regex: query.q, $options: "i" } },
    ];
  }

  if (query.location) {
    filter.location = { $regex: query.location, $options: "i" };
  }

  if (query.industry) {
    filter.industry = { $regex: query.industry, $options: "i" };
  }

  if (query.employmentType) {
    filter.employmentType = query.employmentType;
  }

  if (query.cursor) {
    filter._id = { $gt: new Types.ObjectId(query.cursor) };
  }

  return filter;
};

const findOrCreateApplicant = async (
  businessId: Types.ObjectId,
  payload: PostPublicApplyBody["applicant"],
) => {
  const email = payload.email.trim().toLowerCase();
  const name = payload.name.trim();
  const phone = normalizeOptionalField(payload.phone);
  const location = normalizeOptionalField(payload.location);

  const existingApplicant = await Applicant.findOne({
    businessId,
    email,
  }).exec();

  if (existingApplicant) {
    existingApplicant.name = name;

    if (phone !== undefined) {
      existingApplicant.phone = phone;
    }

    if (location !== undefined) {
      existingApplicant.location = location;
    }

    await existingApplicant.save();

    return existingApplicant;
  }

  const applicant = new Applicant({
    businessId,
    email,
    name,
    phone,
    location,
  });

  await applicant.save();

  return applicant;
};

const ensurePublishedJob = async (jobId: string): Promise<IJob | null> => {
  const job = await Job.findOne({ _id: jobId, status: "PUBLISHED" }).exec();

  return job ?? null;
};

export const getPublicJobs: RequestHandler<
  unknown,
  unknown,
  unknown,
  GetPublicJobsQuery
> = async (req, res) => {
  try {
    const query = req.query;
    const filter = buildJobsFilter(query);
    const limit = (query.limit as number | undefined) ?? 20;

    const jobs = await Job.find(filter)
      .sort({ _id: 1 })
      .limit(limit + 1)
      .exec();

    const hasMore = jobs.length > limit;
    const items = hasMore ? jobs.slice(0, limit) : jobs;
    const nextCursor = hasMore ? items[items.length - 1].id : undefined;

    res.status(200).json(nextCursor ? { items, nextCursor } : { items });
  } catch (error) {
    console.error("Failed to fetch public jobs", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPublicJobById: RequestHandler = async (req, res) => {
  try {
    const { jobId } = req.params as GetPublicJobParams;

    const job = await ensurePublishedJob(jobId);

    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("Failed to fetch public job", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const postPublicApply: RequestHandler = async (req, res) => {
  try {
    const {
      jobId,
      applicant: applicantPayload,
      resumeFileId,
    } = req.body as PostPublicApplyBody;

    const job = await ensurePublishedJob(jobId);

    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    const businessId = new Types.ObjectId(job.businessId.toString());
    const applicant = await findOrCreateApplicant(businessId, applicantPayload);

    let resumeObjectId: Types.ObjectId | undefined;

    if (resumeFileId) {
      resumeObjectId = new Types.ObjectId(resumeFileId);
      const resumeExists = await ResumeFile.exists({
        _id: resumeObjectId,
      }).exec();

      if (!resumeExists) {
        res.status(404).json({ error: "Resume file not found" });
        return;
      }
    }

    const existingApplication = await Application.findOne({
      jobId: job._id,
      applicantId: applicant._id,
    }).exec();

    if (existingApplication) {
      if (resumeObjectId) {
        existingApplication.resumeFileId = resumeObjectId;
        await existingApplication.save();
      }

      res.status(200).json(existingApplication);
      return;
    }

    const application = await Application.create({
      jobId: job._id,
      businessId,
      applicantId: applicant._id,
      stage: "NEW",
      resumeFileId: resumeObjectId,
    });

    res.status(200).json(application);
  } catch (error) {
    console.error("Failed to create public application", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPublicApplications: RequestHandler = async (req, res) => {
  try {
    const { email } = req.params as GetPublicApplicationsParams;

    const applicants = await Applicant.find({ email }).select("_id").exec();

    if (applicants.length === 0) {
      res.status(200).json({ items: [] });
      return;
    }

    const applicantIds = applicants.map((applicant) => applicant._id);

    const applications = await Application.find({
      applicantId: { $in: applicantIds },
    })
      .sort({ createdAt: -1 })
      .populate("job")
      .exec();

    res.status(200).json({ items: applications });
  } catch (error) {
    console.error("Failed to fetch public applications", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
