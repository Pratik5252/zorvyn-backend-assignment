import { is } from "zod/locales";
import { User } from "../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { JwtPayload, AuthResponse } from "../../types";
import AppError from "../../utils/appError";
import { comparePassword, hashPassword } from "../../utils/bcrypt";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/token";
import { LoginInput, RegisterInput } from "../../validators/schema";

export const authService = {
  /**
   * Registers a new user
   * @param {RegisterInput} data - User registration data
   * @returns {Promise<AuthResponse>} The created user and authentication tokens
   */
  async register(data: RegisterInput): Promise<AuthResponse> {
    const existingUser = await prisma.user.findFirst({
      where: { email: data.email, deletedAt: null },
    });

    if (existingUser) {
      throw AppError.conflict("Email already registered", "EMAIL_EXISTS");
    }

    //Hash password using bcrypt
    const hashedPassword = await hashPassword(data.password);

    //Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role || "ADMIN",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw AppError.internal("Failed to create user", "USER_CREATION_FAILED");
    }
    // Create JWT payload
    const payload: JwtPayload = {
      userId: user.id,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { user, accessToken, refreshToken };
  },

  /**
   * Logs in a user with email and password
   * @param email 
   * @param password 
   * @returns {Promise<AuthResponse>} The authenticated user and new authentication tokens
   */
  async login(data: LoginInput): Promise<AuthResponse> {
    const user = await prisma.user.findFirst({
      where: { email: data.email, deletedAt: null },
    });
    
    if (!user) {
      throw AppError.badRequest(
        "Invalid credentials",
        "INVALID_CREDENTIALS",
      );
    }

    if(!user?.email){
      throw AppError.badRequest(
        "Invalid credentials",
        "INVALID_CREDENTIALS"
      );
    }


    if (!user.isActive) {
      throw AppError.forbidden("User account is inactive", "INACTIVE_USER");
    }

    // Verify password
    const isValidPassword = await comparePassword(data.password, user.password);
    if (!isValidPassword) {
      throw AppError.badRequest(
        "Invalid credentials",
        "INVALID_CREDENTIALS",
      );
    }

    // Generate NEW tokens (same as register)
    const payload: JwtPayload = {
      userId: user.id,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      }
    };
  },


  /**
   * Refreshes the access token using a valid refresh token
   * @param refreshToken - The refresh token provided by the client
   * @returns 
   */
  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = verifyRefreshToken(refreshToken);

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user || !user.isActive) {
        throw AppError.unauthorized('User not found or inactive', 'INVALID_USER');
      }

      // Generate NEW access token
      const payload: JwtPayload = {
        userId: user.id,
        role: user.role
      };

      const newAccessToken = generateAccessToken(payload);

      return {
        accessToken: newAccessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
        }
      };
    } catch (error) {
      throw AppError.unauthorized('Invalid refresh token', 'INVALID_REFRESH_TOKEN');
    }
  }
};
