import { z } from "zod";

export const updateProfileSchema = z.object({
    userName: z.string().trim().min(2, "Name must be at least 2 characters").optional(),
    phoneNumber: z.string().trim().regex(/^\d{10}$/, "Invalid phone number").optional(),
    profileImage: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>;
