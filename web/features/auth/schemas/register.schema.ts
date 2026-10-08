import { z } from "zod";

const STRICT_EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu|co)$/i;

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(20, "Full name cannot exceed 20 characters"),
  email: z.email("Please enter a valid email address")
    .regex(
      STRICT_EMAIL_REGEX,
      "Email must end with a valid domain (e.g. .com, .in, .org)"
    ),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type RegisterSchemaInput = z.infer<typeof registerSchema>;
