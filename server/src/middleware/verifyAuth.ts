import { Request, Response, NextFunction } from 'express';

const verifyAuth = (req: Request, res: Response, next: NextFunction) => {
  const isCookieAuth = req.signedCookies?.auth === 'true';

  if (!isCookieAuth) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};

export default verifyAuth;