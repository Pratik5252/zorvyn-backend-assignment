import { NextFunction, Request, Response } from "express";
import { loginSchema, registerSchema } from "../../validators/schema";
import { sendError, sendSuccess } from "../../utils/apiResponse";
import { authService } from "./auth.service";

// Controller for handling user registration
// Validates input, creates user, and returns tokens
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = registerSchema.parse(req.body);
    const { user, accessToken, refreshToken } =
      await authService.register(data);

    res.cookie("refeshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json(
      sendSuccess(201, "User registered successfully. You are now logged in.", {
        user,
        accessToken,
      }),
    );
  } catch (error) {
    next(error);
  }
};

// Controller for handling user login
// Validates input, checks credentials, and returns tokens
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const { user, accessToken, refreshToken } = await authService.login({
      email,
      password,
    });

    res.cookie("refeshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(
      sendSuccess(200, "Login successful", {
        user,
        accessToken,
      }),
    );
  } catch (error) {
    next(error);
  }
};

// Controller for refreshing access token using refresh token
// Validates refresh token and returns new access token
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refeshToken || req.body.refreshToken;

    if (!refreshToken) {
        return res.status(400).json(
            sendError(400, "Refresh token is required", "MISSING_REFRESH_TOKEN")
        );
    }

    const { accessToken , user} = await authService.refreshAccessToken(refreshToken);
    res.status(200).json(
      sendSuccess(200, "Access token refreshed successfully", {
        accessToken,
        user
      }),
    );
  } catch (error) {
    next(error);
  }
};
