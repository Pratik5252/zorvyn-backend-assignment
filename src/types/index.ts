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

export interface AuthResponse{
  user: Partial<User>;
  accessToken: string;
  refreshToken: string;
}

//User
export interface IUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUsers {
  users: IUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
   };
}

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}
