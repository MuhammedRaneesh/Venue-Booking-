import mongoose from "mongoose";
import { Category } from "./categories.schema.js";
import { Venue } from "../venue/venue.schema.js";
import { CreateCategoryInput, UpdateCategoryInput, CategoryQuery } from "./categories.validation.js";
import { AppError } from "../../utils/AppError.js";

const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const createCategory = async (
  data: CreateCategoryInput,
  imageUrl: string
) => {
  const trimmedName = data.name.trim();

  const existingName = await Category.findOne({
    name: { $regex: `^${escapeRegex(trimmedName)}$`, $options: "i" },
  });

  if (existingName) {
    throw new AppError("Category with this name already exists", 409);
  }

  const generatedSlug = data.slug && data.slug.trim()
    ? slugify(data.slug)
    : slugify(trimmedName);

  if (!generatedSlug) {
    throw new AppError("Unable to generate a valid slug from category name", 400);
  }
  const existingSlug = await Category.findOne({ slug: generatedSlug });
  if (existingSlug) {
    throw new AppError("Category with this slug already exists", 409);
  }

  const category = await Category.create({
    name: trimmedName,
    slug: generatedSlug,
    description: data.description?.trim() || "",
    image: imageUrl,
    status: data.status,
  });

  return category;
};


export const getActiveCategories = async () => {
  return Category.find({ status: "active" })
    .select("name slug description image status createdAt")
    .sort({ createdAt: -1 })
    .lean();
};

export const getAllCategoriesAdmin = async (data: CategoryQuery) => {
  const { search, status, page, limit } = data;

  const filter: Record<string, any> = {};
  if (status) filter.status = status;
  if (search) filter.name = { $regex: escapeRegex(search), $options: "i" };

  const Page = Math.max(1, Number(page) || 1);
  const Limit = Math.max(1, Math.min(Number(limit) || 10, 50));
  const Skip = (Page - 1) * Limit;

  const [totalCount, categories] = await Promise.all([
    Category.countDocuments(filter),
    Category.find(filter).sort({ createdAt: -1 }).skip(Skip).limit(Limit).lean(),
  ]);

  return {
    categories,
    totalCount,
    pagination: {
      currentPage: Page,
      Limit,
      totalPages: Math.ceil(totalCount / Limit) || 1,
      hasNextPage: Page < Math.ceil(totalCount / Limit),
      hasPreviousPage: Page > 1,
    },
  };
};

export const updateCategory = async (
  categoryId: string,
  data: UpdateCategoryInput,
  imageUrl?: string
) => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new AppError("Invalid category ID", 400);
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new AppError("Category not found", 404);
  }

  if (data.name !== undefined) {
    const trimmedName = data.name.trim();
    if (trimmedName.toLowerCase() !== category.name.toLowerCase()) {
      const existingName = await Category.findOne({
        _id: { $ne: categoryId },
        name: { $regex: `^${escapeRegex(trimmedName)}$`, $options: "i" },
      });
      if (existingName) {
        throw new AppError("Category with this name already exists", 409);
      }
    }
    category.name = trimmedName;
  }

  if (data.slug && data.slug.trim()) {
    const newSlug = slugify(data.slug);
    if (newSlug !== category.slug) {
      const existingSlug = await Category.findOne({
        _id: { $ne: categoryId },
        slug: newSlug,
      });
      if (existingSlug) {
        throw new AppError("Category with this slug already exists", 409);
      }
      category.slug = newSlug;
    }
  }

  if (data.description !== undefined) {
    category.description = data.description.trim();
  }

  if (data.status !== undefined) {
    category.status = data.status;
  }

  if (imageUrl) {
    category.image = imageUrl;
  }

  await category.save();
  return category;
};

export const toggleCategoryStatus = async (categoryId: string) => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new AppError("Invalid category ID", 400);
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new AppError("Category not found", 404);
  }

  category.status = category.status === "active" ? "inactive" : "active";
  await category.save();

  return category;
};

export const deleteCategory = async (categoryId: string) => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new AppError("Invalid category ID", 400);
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new AppError("Category not found", 404);
  }

  const venueCount = await Venue.countDocuments({
    $or: [{ category: category.name }, { category: category.slug }],
  } as any);

  if (venueCount > 0) {
    throw new AppError(
      `Cannot delete category: ${venueCount} venue(s) are currently associated with it. Please deactivate the category instead.`,
      400
    );
  }

  await Category.findByIdAndDelete(categoryId);

  return { message: "Category deleted successfully" };
};
