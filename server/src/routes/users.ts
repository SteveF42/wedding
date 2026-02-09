import { Request, Response, Router } from "express";
import { prisma } from "../config/prisma";

const router = Router();

router.get("/rsvp", async (req: Request, res: Response) => {
  const { user } = req.query;
  if (!user) {
    return res.sendStatus(404);
  }

  const match = await prisma.user.findFirst();
  {
    where: {
      firstname: String(user);
    }
  }
  console.log(match);

  return res.status(200).json({ match });
});

export default router;
