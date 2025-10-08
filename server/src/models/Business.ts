import { Schema, model, type Document } from "mongoose";

export interface IBusiness extends Document {
  name: string;
  description?: string;
  industry?: string;
  createdAt: Date;
  updatedAt: Date;
}

const businessSchema = new Schema<IBusiness>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Business = model<IBusiness>("Business", businessSchema);
