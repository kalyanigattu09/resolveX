import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { cookieOptions, REFRESH_COOKIE } from "../auth/auth.controller";
import * as demoService from "./demo.service";
import type { Role } from "../../models/User";

export const demoLogin = asyncHandler(async (req, res: Response) => {
  const role = (req.body?.role ?? "CUSTOMER") as Role;
  if (!["CUSTOMER", "EMPLOYEE", "ADMIN"].includes(role)) {
    res.status(400).json({ success: false, message: "Invalid role specified for demo" });
    return;
  }

  const result = await demoService.getDemoLogin(role);
  res.cookie(REFRESH_COOKIE, result.refreshToken, cookieOptions());
  sendSuccess(res, { user: result.user, accessToken: result.accessToken }, `Entered demo mode as ${role}`);
});

export const demoReset = asyncHandler(async (_req, res: Response) => {
  await demoService.seedDemoData();
  sendSuccess(res, null, "Demo data reset successfully to clean state");
});

