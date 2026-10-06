import { Request, Response } from "express";
import {
  createCategory,
  getActiveCategories,
  getAllCategoriesAdmin,
  updateCategory,
  toggleCategoryStatus,
  deleteCategory,
} from "./categories.service.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/AppError.js";


export const createCategoryHandler = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError("Category image is required", 400);
    }

    const imageUrl = req.file.path;
    const category = await createCategory(req.body, imageUrl);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  }
);

export const getCategoriesHandler = catchAsync(
  async (_req: Request, res: Response) => {
    const categories = await getActiveCategories();
    res.status(200).json({ success: true, categories });
  }
);

export const adminGetCategoriesHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getAllCategoriesAdmin(req.validatedQuery);
    
    res.status(200).json({
      success: true,
      categories: result.categories,
      totalCount: result.totalCount,
      pagination: result.pagination,
    });
  }
);

export const updateCategoryHandler = catchAsync(
  async (req: Request, res: Response) => {
    const categoryId = (req.validatedParams?.id || req.params.id) as string;
    const imageUrl = req.file ? req.file.path : undefined;

    const category = await updateCategory(categoryId, req.body, imageUrl);

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  }
);

export const toggleCategoryStatusHandler = catchAsync(
  async (req: Request, res: Response) => {
    const categoryId = (req.validatedParams?.id || req.params.id) as string;
    const category = await toggleCategoryStatus(categoryId);

    res.status(200).json({
      success: true,
      message: `Category ${category.status === "active" ? "activated" : "deactivated"} successfully`,
      category,
    });
  }
);

export const deleteCategoryHandler = catchAsync(
  async (req: Request, res: Response) => {
    const categoryId = (req.validatedParams?.id || req.params.id) as string;
    const result = await deleteCategory(categoryId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  }
);
