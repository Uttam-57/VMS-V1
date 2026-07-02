/**
 * @file auth.controller.js
 * @description Controller for auth feature.
 */
import catchAsync from "../../utils/catchAsync.js";
import authService from "./auth.service.js";
export const register = catchAsync.catchAsync(async (req, res) => {
  const { user, token, refreshToken } = await authService.registerUser(
    req.body,
  );

  const isProd = process.env.NODE_ENV === "production";
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});
export const login = catchAsync.catchAsync(async (req, res) => {
  const { user, token, refreshToken } = await authService.loginUser(req.body);

  const isProd = process.env.NODE_ENV === "production";
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});
export const getMe = catchAsync.catchAsync(async (req, res) => {
  // requires auth middleware to set req.user
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
});

import { verifyRefreshToken, signToken } from "../../utils/jwt.utils.js";
import appError from "../../utils/appError.js";

export const refresh = catchAsync.catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return next(
      new appError("No refresh token found", 401, "TOKEN_NOT_PROVIDED"),
    );
  }

  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded || !decoded.id) {
    return next(
      new appError("Invalid or expired refresh token", 401, "TOKEN_EXPIRED"),
    );
  }

  // Issue new access token
  const token = signToken(decoded.id);

  res.status(200).json({
    status: "success",
    token,
  });
});

export const logout = catchAsync.catchAsync(async (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    expires: new Date(0),
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});
export default { register, login, getMe, refresh, logout };
