import type { RequestHandler } from "express";
import { Business } from "../models/Business.js";
import type {
  CreateBusinessBody,
  UpdateBusinessBody,
  UpdateBusinessParams,
} from "../validation/business.js";

export const getMyBusiness: RequestHandler = async (_req, res) => {
  try {
    const business = await Business.findOne();

    if (!business) {
      res.status(404).json({ error: "Business not found" });
      return;
    }

    res.status(200).json(business);
  } catch (error) {
    console.error("Failed to fetch business", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createBusiness: RequestHandler = async (req, res) => {
  try {
    const { name, description, industry } = req.body as CreateBusinessBody;

    const business = new Business({
      name,
      description,
      industry,
    });

    await business.save();

    res.status(200).json(business);
  } catch (error) {
    console.error("Failed to create business", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateBusiness: RequestHandler = async (req, res) => {
  try {
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
      res.status(404).json({ error: "Business not found" });
      return;
    }

    res.status(200).json(business);
  } catch (error) {
    console.error("Failed to update business", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
