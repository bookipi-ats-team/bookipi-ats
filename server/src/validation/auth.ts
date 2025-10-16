import { z } from "zod";

export enum LoginType {
  Applicant = "applicant",
  Business = "business",
}

const loginTypeSchema = z.nativeEnum(LoginType);

export const loginBodySchema = z.object({
  type: loginTypeSchema,
});

export type SignupBody = z.infer<typeof loginBodySchema>;
