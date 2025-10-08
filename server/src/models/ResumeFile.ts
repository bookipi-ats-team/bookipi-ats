import { Schema, model, type Document, type Types } from "mongoose";

export interface IResumeFile extends Document {
  applicantId: Types.ObjectId;
  jobId?: Types.ObjectId;
  url: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: Date;
  updatedAt: Date;
}

const resumeFileSchema = new Schema<IResumeFile>(
  {
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: "Applicant",
      required: true,
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

export const ResumeFile = model<IResumeFile>("ResumeFile", resumeFileSchema);
