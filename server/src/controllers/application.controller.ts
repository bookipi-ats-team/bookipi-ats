import type { RequestHandler } from "express";
import { Types } from "mongoose";
import { Applicant } from "../models/Applicant.js";
import { Application } from "../models/Application.js";
import { Job } from "../models/Job.js";
import { Note } from "../models/Note.js";
import { ResumeFile } from "../models/ResumeFile.js";
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

const normalizeOptionalField = (
  value: string | undefined,
): string | undefined => {
  if (value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export const getJobApplications: RequestHandler<
  GetJobApplicationsParams,
  unknown,
  unknown,
  GetJobApplicationsQuery
> = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { stage, cursor, limit } = req.query;

    const jobExists = await Job.exists({ _id: jobId }).exec();

    if (!jobExists) {
      res.status(404).json({ error: "Job not found" });
      return;
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
  } catch (error) {
    console.error("Failed to fetch job applications", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getApplicationById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params as GetApplicationByIdParams;

    const application = await Application.findById(id)
      .populate("applicant")
      .populate("job")
      .populate("resumeFile")
      .exec();

    if (!application) {
      res.status(404).json({ error: "Application not found" });
      return;
    }

    res.status(200).json(application);
  } catch (error) {
    console.error("Failed to fetch application", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// const findOrCreateApplicant = async (
//   jobBusinessId: Types.ObjectId,
//   payload: CreateApplicationBody["applicant"],
// ) => {
//   if (payload.id) {
//     const application = await Application.findById(payload.id).exec();
//
//     if (application) {
//       return { error: "Application already exists" } as const;
//     }
//
//     if (
//       application.businessId &&
//       !application.businessId.equals(jobBusinessId)
//     ) {
//       return { error: "Applicant belongs to a different business" } as const;
//     }
//
//     if (!applicant.businessId) {
//       applicant.businessId = jobBusinessId;
//       const phone = normalizeOptionalField(payload.phone);
//       const location = normalizeOptionalField(payload.location);
//
//       if (phone !== undefined) {
//         applicant.phone = phone;
//       }
//       if (location !== undefined) {
//         applicant.location = location;
//       }
//
//       await applicant.save();
//     }
//
//     return { applicant } as const;
//   }
//
//   const email = payload.email!.trim().toLowerCase();
//   const name = payload.name!.trim();
//   const phone = normalizeOptionalField(payload.phone);
//   const location = normalizeOptionalField(payload.location);
//
//   const existingApplicant = await Applicant.findOne({
//     businessId: jobBusinessId,
//     email,
//   }).exec();
//
//   if (existingApplicant) {
//     existingApplicant.name = name;
//
//     if (phone !== undefined) {
//       existingApplicant.phone = phone;
//     }
//
//     if (location !== undefined) {
//       existingApplicant.location = location;
//     }
//
//     await existingApplicant.save();
//
//     return { applicant: existingApplicant } as const;
//   }

//   const applicant = new Applicant({
//     businessId: jobBusinessId,
//     email,
//     name,
//     phone,
//     location,
//   });
//
//   await applicant.save();
//
//   return { applicant } as const;
// };

export const createApplication: RequestHandler<
  unknown,
  unknown,
  CreateApplicationBody
> = async (req, res) => {
  try {
    const {
      jobId,
      // applicant: applicantPayload,
      resumeFileId,
    } = req.body;

    const applicant = req.app.locals.applicant;

    const job = await Job.findById(jobId).exec();

    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    const jobBusinessId = new Types.ObjectId(job.businessId.toString());

    // const applicantResult = await Applicant.findOne({
    //   jobBusinessId,
    //   applicantPayload,
    // });

    // if ("error" in applicantResult) {
    //   res.status(400).json({ error: applicantResult.error });
    //   return;
    // }

    // const { applicant } = applicantResult;

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
      applicantId: applicant._id,
      businessId: jobBusinessId,
      stage: "NEW",
      resumeFileId: resumeObjectId,
    });

    res.status(200).json(application);
  } catch (error) {
    console.error("Failed to create application", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const patchApplication: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params as PatchApplicationParams;
    const { stage } = req.body as PatchApplicationBody;

    const application = await Application.findByIdAndUpdate(
      id,
      { stage },
      { new: true },
    ).exec();

    if (!application) {
      res.status(404).json({ error: "Application not found" });
      return;
    }

    res.status(200).json(application);
  } catch (error) {
    console.error("Failed to update application", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const postApplicationNote: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params as PostApplicationNoteParams;
    const { body } = req.body as PostApplicationNoteBody;

    const application = await Application.findById(id).exec();

    if (!application) {
      res.status(404).json({ error: "Application not found" });
      return;
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
  } catch (error) {
    console.error("Failed to create note", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getApplicationNotes: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params as GetApplicationNotesParams;

    const applicationExists = await Application.exists({ _id: id }).exec();

    if (!applicationExists) {
      res.status(404).json({ error: "Application not found" });
      return;
    }

    const notes = await Note.find({ applicationId: id })
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json(notes);
  } catch (error) {
    console.error("Failed to fetch application notes", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
