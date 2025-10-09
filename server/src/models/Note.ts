import { Schema, model, type Document, type Types } from "mongoose";

export interface INote extends Document {
  applicationId: Types.ObjectId;
  businessId: Types.ObjectId;
  authorId?: Types.ObjectId;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
    },
    body: {
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

noteSchema.index({ applicationId: 1, createdAt: -1 });

export const Note = model<INote>("Note", noteSchema);
