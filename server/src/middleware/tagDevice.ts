import crypto from "crypto";
import { NextFunction, Request, Response } from "express";

function deviceIdMiddleware(req: Request, res: Response, next: NextFunction) {
  let deviceId = req.signedCookies.deviceId;

  if (!deviceId) {
    deviceId = crypto.randomUUID();

    res.cookie("deviceId", deviceId, {
      httpOnly: true,
      signed: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    });
  }

  next();
}

export default deviceIdMiddleware