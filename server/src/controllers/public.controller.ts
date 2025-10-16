import type { RequestHandler } from "express";
import type { HydratedDocument, ObjectId } from "mongoose";
import { Types } from "mongoose";
import { Applicant } from "../models/Applicant.js";
import { Application, ApplicationStageCode } from "../models/Application.js";
import { Job, type IJob } from "../models/Job.js";
import type { IBusiness } from "../models/Business.js";
import { ResumeFile } from "../models/ResumeFile.js";
import { NotFoundError } from "../errors/AppError.js";
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

  if (query.keyword) {
    filter.$or = [
      { title: { $regex: query.keyword, $options: "i" } },
      { description: { $regex: query.keyword, $options: "i" } },
      { industry: { $regex: query.keyword, $options: "i" } },
      { tags: { $regex: query.keyword, $options: "i" } },
    ];
  }

  if (query.location) {
    const andArr = [];
    andArr.push({
      $or: [
        { "location.city": { $regex: query.location, $options: "i" } },
        { "location.region": { $regex: query.location, $options: "i" } },
        { "location.country": { $regex: query.location, $options: "i" } },
      ],
    });
    filter.$and = andArr;
  }

  if (query.industry) {
    filter.industry = { $regex: query.industry, $options: "i" };
  }

  if (query.workModes && query.workModes.length > 0) {
    filter.workModes = { $in: query.workModes };
  }

  if (query.employmentType) {
    filter.employmentType = query.employmentType;
  }

  if (query.publishedAt) {
    const start = new Date(query.publishedAt);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    filter.publishedAt = { $gte: start, $lt: end };
  }

  if (query.cursor) {
    filter._id = { $gt: new Types.ObjectId(query.cursor) };
  }

  return filter;
};

const findOrCreateApplicant = async (
  businessId: ObjectId,
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

const ensurePublishedJob = async (jobId: string) => {
  const job = await Job.findOne({ _id: jobId, status: "PUBLISHED" })
    .populate<{
      businessId: HydratedDocument<IBusiness>;
    }>("businessId", "name description industry")
    .exec();
  return job;
};

export const getPublicJobs: RequestHandler<
  unknown,
  unknown,
  unknown,
  GetPublicJobsQuery
> = async (req, res) => {
  const query = req.query;
  const filter = buildJobsFilter(query);
  const limit = query.limit;

  // Determine sort
  let sort: Record<string, 1 | -1> = { _id: 1 };
  if (query.sortBy === "publishedAt") {
    sort = { publishedAt: query.sortOrder === "asc" ? 1 : -1, _id: 1 };
  } else if (query.sortBy === "relevance" && query.keyword) {
    // Placeholder relevance: prioritize title matches then recent publishedAt
    // Could be improved with text index later.
    sort = { publishedAt: -1, _id: 1 };
  }

  const jobs = await Job.find(filter)
    .populate<{ businessId: HydratedDocument<IBusiness> }>(
      "businessId",
      "name description industry",
    )
    .sort(sort)
    .limit(limit + 1)
    .exec();

  const hasMore = jobs.length > limit;
  const items = hasMore ? jobs.slice(0, limit) : jobs;
  const nextCursor = hasMore ? items[items.length - 1].id : undefined;

  // Check if there are previous items (when cursor is provided and we have items)
  let previousCursor: string | undefined;
  if (query.cursor && items.length > 0) {
    // Check if there are items before the first item in current results
    const beforeFilter = {
      ...buildJobsFilter({ ...query, cursor: undefined }),
      _id: { $lt: new Types.ObjectId(items[0].id) },
    };

    const hasPrevious = await Job.exists(beforeFilter).exec();
    if (hasPrevious) {
      previousCursor = items[0].id;
    }
  }

  // Transform jobs to include business field
  const transformedItems = items.map((job) => {
    const jobObj = job.toObject();
    const businessData = job.businessId;
    return {
      ...jobObj,
      businessId: job._id,
      business: {
        name: businessData?.name,
        description: businessData?.description,
        industry: businessData?.industry,
      },
    };
  });

  const response: any = { items: transformedItems };
  if (nextCursor) response.nextCursor = nextCursor;
  if (previousCursor) response.previousCursor = previousCursor;

  res.status(200).json(response);
};

export const getPublicJobById: RequestHandler = async (req, res) => {
  const { jobId } = req.params as GetPublicJobParams;

  const job = await ensurePublishedJob(jobId);

  if (!job) {
    throw new NotFoundError("Job not found");
  }

  // Transform job to include business field
  const jobObj = job.toObject();
  const businessData = job.businessId;
  const transformedJob = {
    ...jobObj,
    businessId: job._id,
    business: {
      name: businessData?.name,
      description: businessData?.description,
      industry: businessData?.industry,
    },
  };

  res.status(200).json(transformedJob);
};

export const postPublicApply: RequestHandler = async (req, res) => {
  const {
    jobId,
    applicant: applicantPayload,
    resumeFileId,
  } = req.body as PostPublicApplyBody;

  const job = await ensurePublishedJob(jobId);

  if (!job) {
    throw new NotFoundError("Job not found");
  }

  const businessId = job.businessId._id as ObjectId;
  const applicant = await findOrCreateApplicant(businessId, applicantPayload);

  let resumeObjectId: Types.ObjectId | undefined;

  if (resumeFileId) {
    resumeObjectId = new Types.ObjectId(resumeFileId);
    const resumeExists = await ResumeFile.exists({
      _id: resumeObjectId,
    }).exec();

    if (!resumeExists) {
      throw new NotFoundError("Resume file not found");
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
    stage: ApplicationStageCode.NEW,
    resumeFileId: resumeObjectId,
  });

  res.status(200).json(application);
};

export const getPublicApplications: RequestHandler = async (req, res) => {
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
    .populate<{
      job: HydratedDocument<
        IJob & { businessId?: HydratedDocument<IBusiness> }
      >;
    }>("job")
    .exec();

  res.status(200).json({ items: applications });
};
