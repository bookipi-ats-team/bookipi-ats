import type { RequestHandler } from "express";
import { Job } from "../models/Job.js";
import type { CreateJobBody } from "../validation/jobs.js";

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
