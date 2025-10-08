import type { RequestHandler } from "express";
import { Job } from "../models/Job.js";
import type { CreateJobBody, JobIdParams } from "../validation/jobs.js";

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

    const job = await Job.findById(id);

    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("Failed to fetch job", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
