import type { Request, Response } from "express";
import { Business } from "../models/Business.js";

export const getMyBusiness = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const business = await Business.findOne();

    if (!business) {
      res.status(404).json({ error: "Business not found" });
      return;
    }

    res.status(200).json(business);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createBusiness = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description, industry } = {
      ...req.query,
      ...req.body,
    };

    if (!name) {
      res.status(400).json({ error: "Name is required" });
      return;
    }

    const business = new Business({
      name,
      description,
      industry,
    });

    await business.save();

    res.status(200).json(business);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateBusiness = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, industry } = req.body;

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
    res.status(500).json({ error: "Internal server error" });
  }
};
