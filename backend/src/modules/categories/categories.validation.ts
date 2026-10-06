import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(80, "Category name cannot exceed 80 characters"),
  slug: z
    .string()
    .trim()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    )
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),
  status: z
    .enum(["active", "inactive"])
    .default("active"),
});

export const categoryQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  status: z.enum(["active", "inactive"]).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(80, "Category name cannot exceed 80 characters")
    .optional(),
  slug: z
    .string()
    .trim()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    )
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),
  status: z
    .enum(["active", "inactive"])
    .optional(),
});

export const categoryParamsSchema = z.object({
  id: z.string().min(1, "Category ID is required"),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryQuery = z.infer<typeof categoryQuerySchema>;
export type CategoryParams = z.infer<typeof categoryParamsSchema>;
