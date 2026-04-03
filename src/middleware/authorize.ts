import { Request, Response, NextFunction } from "express";
import { Role } from "../../prisma/generated/prisma/client";
import AppError from "../utils/appError";

const authorize = (...role: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!role.includes(req.user.role)) {
      throw AppError.forbidden(
        "You do not have permission to access this resource",
      );
    }
    next();
  };
};

export default authorize;
