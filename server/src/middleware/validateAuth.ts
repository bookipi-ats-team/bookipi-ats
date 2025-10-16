import { SessionClient } from "@bookipi/auth-sdk";
import type { RequestHandler } from "express";
import env from "../config/env.js";
import { UnauthorizedError } from "../errors/AppError.js";
import { extractAuthToken, getApplicantForAuthUser } from "../utils/auth.js";
import { executeIfAsync } from "../utils/executeIf.js";
import { LoginType } from "../validation/auth.js";
import { IBusiness } from "../models/Business.js";
import { IApplicant } from "../models/Applicant.js";

export type EnhanceRequest<T extends Record<string, any>> = RequestHandler<
  any,
  any,
  any,
  any,
  T
>;

export interface Locals {
  applicant?: IApplicant;
  business?: IBusiness;
}

export const validateAuth: EnhanceRequest<Locals> = async (req, _res, next) => {
  const type = req.headers["x-user-type"] as LoginType;
  const authToken = extractAuthToken(req.headers.authorization);

  if (!authToken || !type) {
    throw new UnauthorizedError("Missing or invalid Authorization header");
  }

  const authClient = new SessionClient(env.authModule.serverUrl, authToken);

  const me = await authClient.auth.me();

  if (!me || !me.email) {
    throw new UnauthorizedError("Invalid auth token");
  }

  const applicant = await executeIfAsync(type === "applicant", async () => {
    const applicant = await getApplicantForAuthUser(me);
    req.app.locals.applicant = applicant;
  });

  if (applicant) {
    return next();
  }

  const business = await executeIfAsync(type === "business", async () => {
    // TODO: Update business logic
    const business = "business";
    req.app.locals.business = business;
  });

  if (!business && !applicant) {
    throw new UnauthorizedError("Invalid auth token");
  }

  next();
};
