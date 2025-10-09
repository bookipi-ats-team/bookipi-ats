import { Schema, model, type Document, type Types } from "mongoose";

export interface IApplicant extends Document {
  businessId?: Types.ObjectId;
  email: string;
  name: string;
  phone?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

const applicantSchema = new Schema<IApplicant>(
  {
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Applicant = model<IApplicant>("Applicant", applicantSchema);
