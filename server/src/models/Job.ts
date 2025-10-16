import { Schema, model, type Document } from "mongoose";

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERN"
  | "TEMPORARY";

export type JobStatus = "DRAFT" | "PUBLISHED" | "PAUSED" | "CLOSED";

export type JobEducationalAttainment =
  | "NONE"
  | "HIGH_SCHOOL"
  | "ASSOCIATE"
  | "BACHELORS"
  | "MASTERS"
  | "DOCTORATE"
  | "VOCATIONAL"
  | "OTHER";

export interface IJob extends Document {
  businessId: Schema.Types.ObjectId;
  title: string;
  description: string;
  mustHaves: string[];
  niceToHaves?: string[];
  location?: {
    city?: string;
    region?: string;
    country?: string;
    remote?: boolean;
  };
  employmentType: EmploymentType;
  industry?: string;
  salary?: {
    currency: string;
    min?: number;
    max?: number;
    type: "YEAR" | "MONTH" | "HOUR";
  };
  benefits?: string[];
  workModes?: ("ONSITE" | "REMOTE" | "HYBRID")[];
  visaSponsorship?: boolean;
  equity?: {
    min?: number;
    max?: number;
  };
  visible?: boolean;
  disabled?: boolean;
  educationalAttainment?: JobEducationalAttainment;
  expiresAt?: string;
  tags?: string[];
  openings?: number;
  applyMethod?: "BOOKIPI" | "LINKEDIN" | "SEEK" | "INDEED";
  externalRefs?: {
    linkedin?: string;
    seek?: string;
    indeed?: string;
    glassdoor?: string;
  };
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
    niceToHaves: {
      type: [String],
      default: [],
    },
    location: {
      city: { type: String, trim: true },
      region: { type: String, trim: true },
      country: { type: String, trim: true },
      remote: { type: Boolean, default: false },
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
    salary: {
      currency: { type: String },
      min: { type: Number },
      max: { type: Number },
      type: { type: String, enum: ["YEAR", "MONTH", "HOUR"] },
    },
    benefits: {
      type: [String],
      default: [],
    },
    workModes: {
      type: [String],
      enum: ["ONSITE", "REMOTE", "HYBRID"],
      default: undefined,
    },
    visaSponsorship: {
      type: Boolean,
      default: false,
    },
    equity: {
      min: { type: Number },
      max: { type: Number },
    },
    visible: {
      type: Boolean,
      default: true,
      index: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    educationalAttainment: {
      type: String,
      enum: [
        "NONE",
        "HIGH_SCHOOL",
        "ASSOCIATE",
        "BACHELORS",
        "MASTERS",
        "DOCTORATE",
        "VOCATIONAL",
        "OTHER",
      ],
    },
    expiresAt: {
      type: Date,
    },
    tags: {
      type: [String],
      default: [],
    },
    openings: {
      type: Number,
      default: 1,
      min: 1,
    },
    applyMethod: {
      type: String,
      enum: ["BOOKIPI", "LINKEDIN", "SEEK", "INDEED"],
    },
    externalRefs: {
      linkedin: { type: String, trim: true },
      seek: { type: String, trim: true },
      indeed: { type: String, trim: true },
      glassdoor: { type: String, trim: true },
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
  },
);

jobSchema.index({ businessId: 1, status: 1 });
jobSchema.index({ status: 1, createdAt: -1 });

export const Job = model<IJob>("Job", jobSchema);
