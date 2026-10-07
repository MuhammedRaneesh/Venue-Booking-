import { z } from "zod";

const STRICT_EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu|co)$/i;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email address is required")
    .email("Please enter a valid email address")
    .regex(
      STRICT_EMAIL_REGEX,
      "Email must end with a valid domain (e.g. .com, .in, .org)"
    ),
});

export type ForgotPasswordSchemaInput = z.infer<typeof forgotPasswordSchema>;
