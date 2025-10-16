import type { RequestHandler } from "express";
import { Types } from "mongoose";
import { Application } from "../models/Application.js";
import { Job } from "../models/Job.js";
import { Note } from "../models/Note.js";
import { ResumeFile } from "../models/ResumeFile.js";
import { NotFoundError } from "../errors/AppError.js";
import type {
  CreateApplicationBody,
  GetApplicationByIdParams,
  GetApplicationNotesParams,
  GetJobApplicationsParams,
  GetJobApplicationsQuery,
  PatchApplicationBody,
  PatchApplicationParams,
  PostApplicationNoteBody,
  PostApplicationNoteParams,
} from "../validation/applications.js";

const buildCursorFilter = (cursor?: string) => {
  if (!cursor) {
    return {};
  }

  return { _id: { $gt: new Types.ObjectId(cursor) } };
};

export const getJobApplications: RequestHandler<
  GetJobApplicationsParams,
  unknown,
  unknown,
  GetJobApplicationsQuery
> = async (req, res) => {
  const { jobId } = req.params;
  const { stage, cursor, limit } = req.query;

  const jobExists = await Job.exists({ _id: jobId }).exec();

  if (!jobExists) {
    throw new NotFoundError("Job not found");
  }

  const filter = {
    jobId: new Types.ObjectId(jobId),
    ...(stage ? { stage } : {}),
    ...buildCursorFilter(cursor),
  };

  const applications = await Application.find(filter)
    .sort({ _id: 1 })
    .limit(limit + 1)
    .populate("applicant")
    .exec();

  const hasMore = applications.length > limit;
  const items = hasMore ? applications.slice(0, limit) : applications;
  const nextCursor = hasMore ? applications[limit]?.id : undefined;

  res.status(200).json(nextCursor ? { items, nextCursor } : { items });
};

export const getApplicationById: RequestHandler = async (req, res) => {
  const { id } = req.params as GetApplicationByIdParams;

  const application = await Application.findById(id)
    .populate("applicant")
    .populate("job")
    .populate("resumeFile")
    .exec();

  if (!application) {
    throw new NotFoundError("Application not found");
  }

  res.status(200).json(application);
};

export const createApplication: RequestHandler<
  unknown,
  unknown,
  CreateApplicationBody,
  unknown
> = async (req, res) => {
  const applicant = req.app.locals.applicant;
  const { jobId, resumeFileId } = req.body;

  const job = await Job.findById(jobId).exec();

  if (!job) {
    throw new NotFoundError("Job not found");
  }

  const jobBusinessId = new Types.ObjectId(job.businessId.toString());

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
    applicantId: applicant._id,
    businessId: jobBusinessId,
    stage: "NEW",
    resumeFileId: resumeObjectId,
  });

  res.status(200).json(application);
};

export const patchApplication: RequestHandler = async (req, res) => {
  const { id } = req.params as PatchApplicationParams;
  const { stage } = req.body as PatchApplicationBody;

  const application = await Application.findByIdAndUpdate(
    id,
    { stage },
    { new: true },
  ).exec();

  if (!application) {
    throw new NotFoundError("Application not found");
  }

  res.status(200).json(application);
};

export const postApplicationNote: RequestHandler = async (req, res) => {
  const { id } = req.params as PostApplicationNoteParams;
  const { body } = req.body as PostApplicationNoteBody;

  const application = await Application.findById(id).exec();

  if (!application) {
    throw new NotFoundError("Application not found");
  }

  const trimmedBody = body.trim();

  const note = await Note.create({
    applicationId: application._id,
    businessId: application.businessId,
    body: trimmedBody,
  });

  application.notesCount += 1;
  await application.save();

  res.status(200).json(note);
};

export const getApplicationNotes: RequestHandler = async (req, res) => {
  const { id } = req.params as GetApplicationNotesParams;

  const applicationExists = await Application.exists({ _id: id }).exec();

  if (!applicationExists) {
    throw new NotFoundError("Application not found");
  }

  const notes = await Note.find({ applicationId: id })
    .sort({ createdAt: -1 })
    .exec();

  res.status(200).json(notes);
};
