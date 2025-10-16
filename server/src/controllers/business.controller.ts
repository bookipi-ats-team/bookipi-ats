import type { RequestHandler } from "express";
import { Business } from "../models/Business.js";
import type {
  CreateBusinessBody,
  UpdateBusinessBody,
  UpdateBusinessParams,
} from "../validation/business.js";
import { NotFoundError } from "../errors/AppError.js";

export const getMyBusiness: RequestHandler = async (_req, res) => {
  const business = await Business.findOne();

  if (!business) {
    throw new NotFoundError("Business not found");
  }

  res.status(200).json(business);
};

export const createBusiness: RequestHandler = async (req, res) => {
  const { name, description, industry } = req.body as CreateBusinessBody;

  const business = new Business({
    name,
    description,
    industry,
  });

  await business.save();

  res.status(200).json(business);
};

export const updateBusiness: RequestHandler = async (req, res) => {
  const { id } = req.params as UpdateBusinessParams;
  const { name, description, industry } = req.body as UpdateBusinessBody;

  const updateData: Record<string, unknown> = {};

  if (name !== undefined) {
    updateData.name = name;
  }

  if (description !== undefined) {
    updateData.description = description;
  }

  if (industry !== undefined) {
    updateData.industry = industry;
  }

  const business = await Business.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!business) {
    throw new NotFoundError("Business not found");
  }

  res.status(200).json(business);
};
