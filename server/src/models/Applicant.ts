import { Schema, model, type Document, type Types } from "mongoose";

export type WorkExperience = {
  company: string;
  role: string;
  start: string;
  end?: string;
  current?: boolean;
  summary?: string;
  skills?: string[];
  achievements?: string[];
};

export type Education = {
  school: string;
  degree?: string;
  field?: string;
  start?: string;
  end?: string;
};

export type Certification = {
  name: string;
  issuer?: string;
  issued?: string;
  expires?: string;
  id?: string;
  url?: string;
};

export interface IApplicant extends Document {
  _id: Types.ObjectId;
  businessId?: Types.ObjectId;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  location?: string;
  profilePhoto?: string;
  bio?: string;
  visibility?: "PUBLIC" | "PRIVATE" | "ANONYMOUS";
  status?: "ACTIVE" | "WITHDRAWN" | "HIRED" | "REJECTED" | "ARCHIVED";
  disabled?: boolean;
  skills?: string[];
  relocate?: "NO" | "DOMESTIC" | "INTERNATIONAL";
  socials?: {
    linkedin?: string;
    github?: string;
    website?: string;
    twitter?: string;
    portfolio?: string;
  };
  workAuth?: {
    country: string;
    status: "CITIZEN" | "PR" | "SPONSORED" | "NONE";
    expiry?: string;
  };
  experience?: WorkExperience[];
  education?: Education[];
  certifications?: Certification[];
  languages?: {
    code: string;
    level: "A2" | "B1" | "B2" | "C1" | "C2" | "NATIVE";
  }[];
  preferences?: {
    salary?: { currency: string; min?: number };
    noticePeriodDays?: number;
  };
  createdAt: Date;
  updatedAt?: Date;
}

const workExperienceSchema = new Schema<WorkExperience>(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    start: { type: String, required: true, trim: true },
    end: { type: String, trim: true },
    current: { type: Boolean, default: false },
    summary: { type: String, trim: true },
    skills: [{ type: String }],
    achievements: [{ type: String }],
  },
  { _id: false },
);

const educationSchema = new Schema<Education>(
  {
    school: { type: String, required: true, trim: true },
    degree: { type: String, trim: true },
    field: { type: String, trim: true },
    start: { type: String, trim: true },
    end: { type: String, trim: true },
  },
  { _id: false },
);

const certificationSchema = new Schema<Certification>(
  {
    name: { type: String, required: true, trim: true },
    issuer: { type: String, trim: true },
    issued: { type: String, trim: true },
    expires: { type: String, trim: true },
    id: { type: String, trim: true },
    url: { type: String, trim: true },
  },
  { _id: false },
);

const applicantSchema = new Schema<IApplicant>(
  {
    businessId: { type: Schema.Types.ObjectId, ref: "Business", index: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    profilePhoto: { type: String, trim: true },
    bio: { type: String, trim: true },
    visibility: {
      type: String,
      enum: ["PUBLIC", "PRIVATE", "ANONYMOUS"],
      default: "PUBLIC",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "WITHDRAWN", "HIRED", "REJECTED", "ARCHIVED"],
      default: "ACTIVE",
    },
    disabled: { type: Boolean, default: false },
    skills: [{ type: String }],
    relocate: { type: String, enum: ["NO", "DOMESTIC", "INTERNATIONAL"] },
    socials: {
      linkedin: { type: String, trim: true },
      github: { type: String, trim: true },
      website: { type: String, trim: true },
      twitter: { type: String, trim: true },
      portfolio: { type: String, trim: true },
    },
    workAuth: {
      country: { type: String, trim: true },
      status: { type: String, enum: ["CITIZEN", "PR", "SPONSORED", "NONE"] },
      expiry: { type: String, trim: true },
    },
    experience: { type: [workExperienceSchema], default: undefined },
    education: { type: [educationSchema], default: undefined },
    certifications: { type: [certificationSchema], default: undefined },
    languages: {
      type: [
        {
          code: { type: String, trim: true },
          level: {
            type: String,
            enum: ["A2", "B1", "B2", "C1", "C2", "NATIVE"],
          },
        },
      ],
      default: undefined,
    },
    preferences: {
      salary: {
        currency: { type: String, trim: true },
        min: { type: Number },
      },
      noticePeriodDays: { type: Number },
    },
  },
  { timestamps: true },
);

export const Applicant = model<IApplicant>("Applicant", applicantSchema);
