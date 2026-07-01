import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";
import { ZodSchema } from "zod";

declare global {
  namespace Express {
    interface Request {
      validatedBody?: any;
      validatedQuery?: any;
      validatedParams?: any;
    }
  }
}
export {};

export const validateRequest = (schema: ZodSchema, source: "body" | "query" | "params") => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = 
        result.error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
      console.log(errors)
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    if (source === "body") {
      req.validatedBody = result.data;
    } else if (source === "query") {
      req.validatedQuery = result.data;
    } else if (source === "params") {
      req.validatedParams = result.data;
    }

    next();
  };
};