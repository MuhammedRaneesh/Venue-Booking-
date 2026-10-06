import express from "express";
import { protect, authorize } from "../../middleware/authMiddleware.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { uploadCategoryImage } from "../../middleware/upload.js";
import {
  createCategorySchema,
  categoryQuerySchema,
  updateCategorySchema,
  categoryParamsSchema,
} from "./categories.validation.js";
import {
  createCategoryHandler,
  getCategoriesHandler,
  adminGetCategoriesHandler,
  updateCategoryHandler,
  toggleCategoryStatusHandler,
  deleteCategoryHandler,
} from "./categories.controller.js";

const router = express.Router();

router.get("/", getCategoriesHandler);

// admin
router.get("/admin-categori", protect, authorize(["admin"]), validateRequest(categoryQuerySchema, "query"), adminGetCategoriesHandler);
router.post("/", protect, authorize(["admin"]), uploadCategoryImage.single("image"), validateRequest(createCategorySchema, "body"), createCategoryHandler);
router.patch("/:id", protect, authorize(["admin"]), uploadCategoryImage.single("image"), validateRequest(categoryParamsSchema, "params"), validateRequest(updateCategorySchema, "body"), updateCategoryHandler);
router.put("/:id", protect, authorize(["admin"]), uploadCategoryImage.single("image"), validateRequest(categoryParamsSchema, "params"), validateRequest(updateCategorySchema, "body"), updateCategoryHandler);
router.patch("/:id/toggle-status", protect, authorize(["admin"]), validateRequest(categoryParamsSchema, "params"), toggleCategoryStatusHandler);
router.patch("/:id/status", protect, authorize(["admin"]), validateRequest(categoryParamsSchema, "params"), toggleCategoryStatusHandler);
router.delete("/:id", protect, authorize(["admin"]), validateRequest(categoryParamsSchema, "params"), deleteCategoryHandler);

export default router;
