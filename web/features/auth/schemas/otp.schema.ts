import { z } from "zod";

export const otpSchema = z.object({
  email: z.string().trim().email("Invalid email format"),
  otpNumber: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export type OtpSchemaInput = z.infer<typeof otpSchema>;
