import { ZodError } from "zod";
import AppError from "../utils/appError";
import { NextFunction, Response, Request } from "express";
import { sendError } from "../utils/apiResponse";

export const errorHandler = (
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Error:", err);

  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json(sendError(err.statusCode, err.message, err.errorCode ));
  }

  if (err instanceof ZodError) {
    const errors = err.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return res
      .status(400)
      .json(sendError(res.statusCode, "Validation Error", "VALIDATION_ERROR", errors));
  }

  return res
    .status(500)
    .json(sendError(res.statusCode, "Internal Server Error", "INTERNAL_SERVER"));
};
