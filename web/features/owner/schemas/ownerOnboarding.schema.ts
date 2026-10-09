import { z } from "zod";

export const ownerOnboardingSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name is too long"),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number (e.g. 9876543210)"),
  businessName: z
    .string()
    .trim()
    .min(3, "Business name must be at least 3 characters")
    .max(100, "Business name is too long"),
  address: z
    .string()
    .trim()
    .min(5, "Enter your full address (min 5 characters)")
    .max(200, "Address is too long (max 200 characters)"),
  city: z
    .string()
    .trim()
    .min(2, "Enter your city")
    .max(50, "City name is too long"),
  state: z
    .string()
    .trim()
    .min(2, "Enter your state")
    .max(50, "State name is too long"),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Pincode must be exactly 6 digits (e.g. 682001)"),
  gstNumber: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
});

export type OwnerOnboardingInput = z.infer<typeof ownerOnboardingSchema>;
