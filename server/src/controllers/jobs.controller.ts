import type { RequestHandler, Response } from "express";
import { Job, type IJob } from "../models/Job.js";
import type {
  CreateJobBody,
  JobIdParams,
  UpdateJobBody,
} from "../validation/jobs.js";

const findJobByIdOrRespond404 = async (
  id: string,
  res: Response,
): Promise<IJob | null> => {
  const job = await Job.findById(id);
  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return null;
  }

  return job;
};

export const createJob: RequestHandler = async (req, res) => {
  try {
    const {
      businessId,
      title,
      description,
      mustHaves,
      location,
      employmentType,
      industry,
    } = req.body as CreateJobBody;

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
  } catch (error) {
    console.error("Failed to create job", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getJobById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params as JobIdParams;

    const job = await findJobByIdOrRespond404(id, res);
    if (!job) {
      return;
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("Failed to fetch job", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const publishJob: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params as JobIdParams;

    const job = await findJobByIdOrRespond404(id, res);
    if (!job) {
      return;
    }

    job.status = "PUBLISHED";
    await job.save();

    res.status(200).json({ status: job.status });
  } catch (error) {
    console.error("Failed to publish job", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const pauseJob: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params as JobIdParams;

    const job = await findJobByIdOrRespond404(id, res);
    if (!job) {
      return;
    }

    job.status = "PAUSED";
    await job.save();

    res.status(200).json({ status: job.status });
  } catch (error) {
    console.error("Failed to pause job", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const closeJob: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params as JobIdParams;

    const job = await findJobByIdOrRespond404(id, res);
    if (!job) {
      return;
    }

    job.status = "CLOSED";
    await job.save();

    res.status(200).json({ status: job.status });
  } catch (error) {
    console.error("Failed to close job", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateJob: RequestHandler = async (req, res) => {
  try {
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

    const job = await Job.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("Failed to update job", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
