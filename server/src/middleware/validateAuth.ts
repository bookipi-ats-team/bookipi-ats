import type { RequestHandler } from "express";
import { SessionClient } from "@bookipi/auth-sdk";
import env from "../config/env.js";
import { extractAuthToken } from "../utils/auth.js";
import { Applicant } from "../models/Applicant.js";
import { UnauthorizedError, NotFoundError } from "../errors/AppError.js";

export type EnhanceRequest<T extends Record<string, any>> = RequestHandler<
  any,
  any,
  any,
  any,
  T
>;

type ApplicantType = Awaited<ReturnType<typeof Applicant.findOne>>;

export interface ApplicantLocals {
  applicant: NonNullable<ApplicantType>;
}

export const validateAuth: EnhanceRequest<ApplicantLocals> = async (
  req,
  _res,
  next,
) => {
  const authToken = extractAuthToken(req.headers.authorization);

  if (!authToken) {
    throw new UnauthorizedError("Missing or invalid Authorization header");
  }

  const authClient = new SessionClient(env.authModule.serverUrl, authToken);

  const me = await authClient.auth.me();

  if (!me || !me.email) {
    throw new UnauthorizedError("Invalid auth token");
  }

  // Try to find the applicant by authModule user id first, then by email
  let applicant = null as any;

  if (me.userId) {
    applicant = await Applicant.findOne({ authModuleUserId: me.userId })
      .read("secondaryPreferred")
      .lean();
  }

  if (!applicant) {
    // If an applicant exists by email, link it to the authModule user id so subsequent requests are linked
    const applicantByEmail = await Applicant.findOne({ email: me.email })
      .read("secondaryPreferred")
      .lean();

    if (applicantByEmail) {
      // Link if possible (non-destructive)
      if (me.userId && !applicantByEmail.authModuleUserId) {
        await Applicant.updateOne(
          { _id: applicantByEmail._id },
          { authModuleUserId: me.userId },
        ).exec();
        applicantByEmail.authModuleUserId = me.userId;
      }
      applicant = applicantByEmail;
    }
  }

  if (!applicant) {
    // Local profile missing — require user to sign up locally first
    throw new NotFoundError("Applicant profile not found, please complete signup.");
  }

  req.app.locals.applicant = applicant;

  next();
};
