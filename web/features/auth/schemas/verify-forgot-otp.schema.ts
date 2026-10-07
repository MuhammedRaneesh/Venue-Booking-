import { z } from "zod";

export const verifyForgotOtpSchema = z.object({
  otpNumber: z
    .string()
    .length(6, "Please enter all 6 digits of the code")
    .regex(/^\d{6}$/, "Code must contain only digits"),
});

export type VerifyForgotOtpSchemaInput = z.infer<typeof verifyForgotOtpSchema>;
