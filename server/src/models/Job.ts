import { Schema, model, type Document } from "mongoose";

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERN"
  | "TEMPORARY";

export type JobStatus = "DRAFT" | "PUBLISHED" | "PAUSED" | "CLOSED";

export interface IJob extends Document {
  businessId: Schema.Types.ObjectId;
  title: string;
  description: string;
  mustHaves: string[];
  location?: string;
  employmentType: EmploymentType;
  industry?: string;
  status: JobStatus;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    mustHaves: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      trim: true,
    },
    employmentType: {
      type: String,
      enum: ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN", "TEMPORARY"],
      required: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "PAUSED", "CLOSED"],
      default: "DRAFT",
      index: true,
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ businessId: 1, status: 1 });
jobSchema.index({ status: 1, createdAt: -1 });

export const Job = model<IJob>("Job", jobSchema);
