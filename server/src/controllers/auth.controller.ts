import { SessionClient } from "@bookipi/auth-sdk";
import { RequestHandler } from "express";
import env from "../config/env.js";
import { extractAuthToken, extractNameFromFullName } from "../utils/auth.js";
import { Applicant } from "../models/Applicant.js";
import { SignupBody } from "../validation/auth.js";
import { executeIfAsync } from "../utils/executeIf.js";

export const login: RequestHandler<unknown, unknown, SignupBody> = async (
  req,
  res,
) => {
  const authToken = extractAuthToken(req.headers.authorization);

  const type = req.body.type;

  if (!authToken) {
    return res
      .status(401)
      .json({ message: "Missing or invalid Authorization header" });
  }

  const authClient = new SessionClient(
    env.authModule.serverUrl,
    authToken as string,
  );

  const me = await authClient.auth.me();

  if (!me || !me.email) {
    return res.status(500).json({ message: "User not found" });
  }

  const returnedApplicant = await executeIfAsync(
    type === "applicant",
    async () => {
      const linkedUser = await Applicant.findOne({
        authModuleUserId: me.userId,
      })
        .read("secondaryPreferred")
        .lean();

      let user =
        linkedUser ||
        (await Applicant.findOne({ email: me.email })
          .read("secondaryPreferred")
          .lean());

      if (!user) {
        const { firstName, lastName } = extractNameFromFullName(me.fullName);

        const created = await Applicant.create({
          email: me.email,
          authModuleUserId: me.userId,
          name:
            me.fullName ||
            `${me.firstName || firstName} ${me.lastName || lastName}`,
          firstName: me.firstName || firstName,
          lastName: me.lastName || lastName,
          preferences: me.metadata?.currency
            ? { salary: { currency: me.metadata.currency } }
            : undefined,
        });

        return created;
      } else {
        // If we found a user by email but it's not linked yet, link it
        if (!user.authModuleUserId && me.userId) {
          await Applicant.updateOne(
            { _id: user._id },
            { authModuleUserId: me.userId },
          ).exec();
          user.authModuleUserId = me.userId;
        }
        return user;
      }
    },
  );

  // TODO: Handle business signup

  res
    .status(200)
    .json({ message: "Signup successful", applicant: returnedApplicant });
};
