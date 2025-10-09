import { Schema, model, type Document, type Types } from "mongoose";

export interface IResumeFile extends Document {
  fileId: string;
  applicantId?: Types.ObjectId;
  jobId?: Types.ObjectId;
  url: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  createdAt: Date;
  updatedAt: Date;
}

const resumeFileSchema = new Schema<IResumeFile>(
  {
    fileId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: "Applicant",
      required: false,
      index: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      index: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
      trim: true,
    },
    sizeBytes: {
      type: Number,
      required: true,
      min: 0,
    },
    storagePath: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

resumeFileSchema.index({ applicantId: 1, createdAt: -1 });
resumeFileSchema.index({ jobId: 1, createdAt: -1 });

export const ResumeFile = model<IResumeFile>("ResumeFile", resumeFileSchema);
