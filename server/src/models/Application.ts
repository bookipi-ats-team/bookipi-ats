import { Schema, model, type Document, type Types } from "mongoose";

export const stageCodes = [
  "NEW",
  "SCREEN",
  "INTERVIEW",
  "OFFER",
  "HIRED",
  "REJECTED",
] as const;

export type StageCode = (typeof stageCodes)[number];

export const sourceCodes = [
  "BOOKIPI",
  "LINKEDIN",
  "SEEK",
  "INDEED",
  "GLASSDOOR",
  "REFERRAL",
] as const;

export type SourceCode = (typeof sourceCodes)[number];

export type Application = {
  _id: Types.ObjectId;
  applicantId: Types.ObjectId;
  jobId: Types.ObjectId;
  businessId: Types.ObjectId;

  source: SourceCode;
  stage: StageCode;

  score?: number;
  cvScore?: number;
  cvTips?: string[];

  // encrypted at rest
  notesCount: number;

  createdAt: Date;
  updatedAt: Date;
};

export interface IApplication extends Document {
  _id: Types.ObjectId;
  applicantId: Types.ObjectId;
  jobId: Types.ObjectId;
  businessId: Types.ObjectId;

  source: SourceCode;
  stage: StageCode;

  score?: number;
  cvScore?: number;
  cvTips?: string[];

  // encrypted at rest
  notesCount: number;

  resumeFileId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
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
      required: true,
      index: true,
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },
    source: {
      type: String,
      enum: sourceCodes,
      default: "BOOKIPI",
      index: true,
    },
    stage: {
      type: String,
      enum: stageCodes,
      default: "NEW",
      index: true,
    },
    score: {
      type: Number,
    },
    cvScore: {
      type: Number,
    },
    cvTips: {
      type: [String],
      default: [],
    },
    notesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    resumeFileId: {
      type: Schema.Types.ObjectId,
      ref: "ResumeFile",
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

applicationSchema.index({ jobId: 1, stage: 1, _id: 1 });
applicationSchema.index({ applicantId: 1, jobId: 1 }, { unique: false });

applicationSchema.virtual("applicant", {
  ref: "Applicant",
  localField: "applicantId",
  foreignField: "_id",
  justOne: true,
});

applicationSchema.virtual("job", {
  ref: "Job",
  localField: "jobId",
  foreignField: "_id",
  justOne: true,
});

applicationSchema.virtual("resumeFile", {
  ref: "ResumeFile",
  localField: "resumeFileId",
  foreignField: "_id",
  justOne: true,
});

export const Application = model<IApplication>("Application", applicationSchema);
