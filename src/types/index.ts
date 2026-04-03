import { Role, User } from "../../prisma/generated/prisma/client";

/**
 * Defines the structure of the API response for all endpoints in the application.
 */
export interface ApiResponse<T = null> {
  success: boolean;
  statusCode?: number | string;
  message: string;
  data?: T;
  errorCode?: string;
  errors?: any;
  timestamp: string;
}

export interface JwtPayload {
  userId: string;
  role: Role;
}

export interface UserResponse{
  user: Partial<User>;
  accessToken: string;
  refreshToken: string;
}

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}
