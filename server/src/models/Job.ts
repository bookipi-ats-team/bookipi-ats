import { Schema, model, type Document } from "mongoose";
import { ApplicationSourceCode } from "./Application.js";

export enum EmploymentType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  INTERN = "INTERN",
  TEMPORARY = "TEMPORARY",
}

export enum JobStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  PAUSED = "PAUSED",
  CLOSED = "CLOSED",
}

export enum JobEducationalAttainment {
  NONE = "NONE",
  HIGH_SCHOOL = "HIGH_SCHOOL",
  ASSOCIATE = "ASSOCIATE",
  BACHELORS = "BACHELORS",
  MASTERS = "MASTERS",
  DOCTORATE = "DOCTORATE",
  VOCATIONAL = "VOCATIONAL",
  OTHER = "OTHER",
}

export enum WorkMode {
  ONSITE = "ONSITE",
  REMOTE = "REMOTE",
  HYBRID = "HYBRID",
}

export enum JobSalaryType {
  YEAR = "YEAR",
  MONTH = "MONTH",
  HOUR = "HOUR",
}

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
  workModes?: WorkMode[];
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
      enum: EmploymentType,
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
      type: { type: String, enum: JobSalaryType },
    },
    benefits: {
      type: [String],
      default: [],
    },
    workModes: {
      type: [String],
      enum: WorkMode,
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
      enum: JobEducationalAttainment,
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
      enum: ApplicationSourceCode,
    },
    externalRefs: {
      linkedin: { type: String, trim: true },
      seek: { type: String, trim: true },
      indeed: { type: String, trim: true },
      glassdoor: { type: String, trim: true },
    },
    status: {
      type: String,
      enum: JobStatus,
      default: JobStatus.DRAFT,
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
