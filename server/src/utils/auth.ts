import { Applicant } from "../models/Applicant.js";
import { NotFoundError } from "../errors/AppError.js";

/**
 * Extracts the auth token from a Bearer authorization header.
 * Returns the token string if header is in the form "Bearer <token>", otherwise undefined.
 */
export function extractAuthToken(
  authorization?: string | string[] | undefined,
): string | undefined {
  if (!authorization) return undefined;
  const header = Array.isArray(authorization)
    ? authorization[0]
    : authorization;
  const match = header.match(/^\s*Bearer\s+(.+)$/i);
  return match ? match[1] : undefined;
}

/**
 * Extracts the first and last name from a full name string.
 * Returns an object with firstName and lastName properties.
 */
export function extractNameFromFullName(fullName?: string) {
  if (!fullName) {
    return { firstName: "", lastName: "" };
  }

  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return { firstName: "", lastName: "" };
  }

  const lastName = parts.length > 1 ? parts.pop()! : "";
  const firstName = parts.join(" ");

  return { firstName, lastName };
}

export async function getApplicantForAuthUser(me: {
  userId?: string;
  email?: string;
}) {
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
    throw new NotFoundError(
      "Applicant profile not found, please complete signup.",
    );
  }

  return applicant;
}
