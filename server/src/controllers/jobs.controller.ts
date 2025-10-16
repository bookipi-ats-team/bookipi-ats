import type { RequestHandler } from "express";
import { Job, JobStatus, type IJob } from "../models/Job.js";
import { Business } from "../models/Business.js";
import { NotFoundError } from "../errors/AppError.js";
import type {
  CreateJobBody,
  JobIdParams,
  UpdateJobBody,
  GetJobsQuery,
} from "../validation/jobs.js";

const findJobByIdOrThrow = async (id: string): Promise<IJob> => {
  const job = await Job.findById(id);
  if (!job) {
    throw new NotFoundError("Job not found");
  }
  return job;
};

const setPublishedAtIfNeeded = (job: IJob, newStatus: string): void => {
  if (newStatus === "PUBLISHED" && !job.publishedAt) {
    job.publishedAt = new Date();
  }
};

export const createJob: RequestHandler = async (req, res) => {
  const {
    businessId,
    title,
    description,
    mustHaves,
    location,
    employmentType,
    industry,
  } = req.body as CreateJobBody;

  const businessExists = await Business.findById(businessId);
  if (!businessExists) {
    throw new NotFoundError("Business not found");
  }

  const job = new Job({
    businessId,
    title,
    description,
    mustHaves,
    location,
    employmentType,
    industry,
    status: "DRAFT",
  });

  await job.save();

  res.status(200).json(job);
};

export const getJobById: RequestHandler = async (req, res) => {
  const { id } = req.params as JobIdParams;

  const job = await findJobByIdOrThrow(id);

  res.status(200).json(job);
};

export const publishJob: RequestHandler = async (req, res) => {
  const { id } = req.params as JobIdParams;

  const job = await findJobByIdOrThrow(id);

  job.status = JobStatus.PUBLISHED;
  setPublishedAtIfNeeded(job, "PUBLISHED");
  await job.save();

  res.status(200).json({ status: job.status });
};

export const pauseJob: RequestHandler = async (req, res) => {
  const { id } = req.params as JobIdParams;

  const job = await findJobByIdOrThrow(id);

  job.status = JobStatus.PAUSED;
  await job.save();

  res.status(200).json({ status: job.status });
};

export const closeJob: RequestHandler = async (req, res) => {
  const { id } = req.params as JobIdParams;

  const job = await findJobByIdOrThrow(id);

  job.status = JobStatus.CLOSED;
  await job.save();

  res.status(200).json({ status: job.status });
};

export const updateJob: RequestHandler = async (req, res) => {
  const { id } = req.params as JobIdParams;
  const {
    title,
    description,
    mustHaves,
    location,
    employmentType,
    industry,
    status,
  } = req.body as UpdateJobBody;

  const updateData: Record<string, unknown> = {};

  if (title !== undefined) {
    updateData.title = title;
  }

  if (description !== undefined) {
    updateData.description = description;
  }

  if (mustHaves !== undefined) {
    updateData.mustHaves = mustHaves;
  }

  if (location !== undefined) {
    updateData.location = location;
  }

  if (employmentType !== undefined) {
    updateData.employmentType = employmentType;
  }

  if (industry !== undefined) {
    updateData.industry = industry;
  }

  if (status !== undefined) {
    updateData.status = status;
  }

  const job = await Job.findById(id);

  if (!job) {
    throw new NotFoundError("Job not found");
  }

  Object.assign(job, updateData);

  if (status !== undefined) {
    setPublishedAtIfNeeded(job, status);
  }

  await job.save();

  res.status(200).json(job);
};

export const getJobs: RequestHandler<
  unknown,
  unknown,
  unknown,
  GetJobsQuery
> = async (req, res) => {
  const {
    businessId,
    status,
    q,
    location,
    industry,
    employmentType,
    publishedAfter,
    cursor,
    limit,
  } = req.query;

  const filter: Record<string, unknown> = {};

  if (businessId) {
    filter.businessId = businessId;
  }

  if (status) {
    filter.status = status;
  }

  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ];
  }

  if (location) {
    filter.location = { $regex: location, $options: "i" };
  }

  if (industry) {
    filter.industry = { $regex: industry, $options: "i" };
  }

  if (employmentType) {
    filter.employmentType = employmentType;
  }

  if (publishedAfter) {
    filter.publishedAt = { $gte: publishedAfter };
  }

  if (cursor) {
    filter._id = { $gt: cursor };
  }

  const limitNumber = Number(limit ?? 20);

  const jobs: IJob[] = await Job.find(filter)
    .sort({ _id: 1 })
    .limit(limitNumber + 1);

  const hasMore = jobs.length > limitNumber;
  const items: IJob[] = hasMore ? jobs.slice(0, limitNumber) : jobs;
  const nextCursor = hasMore ? items[items.length - 1].id : undefined;

  res.status(200).json({
    items,
    nextCursor,
  });
};
