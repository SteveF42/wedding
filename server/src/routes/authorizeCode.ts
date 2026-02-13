import { Request, Response, Router } from "express";

const router = Router();

// In-memory store for tracking attempts by IP
const attempts = new Map<string, { count: number; lockUntil?: number }>();

router.post("/auth", (req: Request, res: Response) => {
  const SECRET_CODE = process.env.SECRET_CODE;
  const { code } = req.body;

  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const MAX_ATTEMPTS = 4;
  const LOCK_DURATION = 20 * 60 * 1000; // 20 minutes

  // Check if IP is locked
  const record = attempts.get(ip);
  if (record?.lockUntil && Date.now() < record.lockUntil) {
    return res.status(429).json({ error: "Too many attempts. Please try again later :)" });
  }
  if (code === SECRET_CODE) {
    attempts.delete(ip); // Clear attempts on success
    res.cookie("auth", "true", {
      secure: process.env.NODE_ENV === 'production',
      signed: true,
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });
    return res.status(200).json({ success: true });
  }

  // Increment attempts
  const currentAttempts = record?.count || 0;
  const newAttempts = currentAttempts + 1;

  if (newAttempts >= MAX_ATTEMPTS) {
    attempts.set(ip, { count: newAttempts, lockUntil: Date.now() + LOCK_DURATION });
    return res.status(429).json({ error: "Too many attempts. Locked for 20 minutes." });
  }

  attempts.set(ip, { count: newAttempts });
  return res.status(401).json({ error: `Incorrect code, Attemps remaining: ${MAX_ATTEMPTS - newAttempts}` });
});

// Check if user is authorized
router.get("/auth/check", (req: Request, res: Response) => {
  const authCookie = req.signedCookies.auth;

  if (authCookie === "true") {
    return res.status(200).json({ authorized: true });
  }

  return res.status(401).json({ authorized: false });
});

export default router;
