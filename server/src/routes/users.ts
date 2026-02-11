import { Request, Response, Router } from "express";
import { prisma } from "../config/prisma";

const router = Router();

router.get("/rsvp", async (req: Request, res: Response) => {
  const { user } = req.query;
  if (!user) {
    return res.sendStatus(404);
  }

  const [firstname, lastname] = String(user).split(" ");

  const matchedUser = await prisma.user.findFirst({
    where: {
      AND: [
        {
          firstName: {
            equals: String(firstname),
            mode: "insensitive",
          },
        },
        {
          lastName: {
            equals: String(lastname),
            mode: "insensitive",
          },
        },
      ],
    },
    include: {
      plusOne: true,
    },
  });

  console.log(matchedUser);

  if (!matchedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!matchedUser.groupId) {
    return res.status(200).json({
      groupId: null,
      members: [matchedUser],
    });
  }

  // 3️⃣ Otherwise return the whole group
  const groupMembers = await prisma.user.findMany({
    where: {
      groupId: matchedUser.groupId,
    },
    include: {
      plusOne: true,
    },
    orderBy: {
      lastName: "asc",
    },
  });

  return res.status(200).json({
    groupId: matchedUser.groupId,
    members: groupMembers,
  });
});

router.patch("/:userId/rsvp", async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { rsvpStatus, plusOneName, dietaryRestrictions } = req.body;

  try {
    // Validate rsvpStatus
    if (!["ACCEPTED", "DECLINED", "PENDING"].includes(rsvpStatus)) {
      return res.status(400).json({ message: "Invalid RSVP status" });
    }

    // Update user RSVP status
    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        rsvpStatus,
        dietaryRestrictions
        // ...(dietaryRestrictions && { dietaryRestrictions }),
      },
      include: {
        plusOne: true,
      },
    });

    // Handle plus one if provided and user can bring plus one
    if (updatedUser.canBringPlusOne && plusOneName) {
      if (updatedUser.plusOne) {
        // Update existing plus one
        await prisma.plusOne.update({
          where: { id: updatedUser.plusOne.id },
          data: { name: plusOneName },
        });
      } else {
        // Create new plus one
        await prisma.plusOne.create({
          data: {
            name: plusOneName,
            userId: updatedUser.id,
          },
        });
      }
    }

    return res.status(200).json({ message: "RSVP updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating RSVP:", error);
    return res.status(500).json({ message: "Failed to update RSVP" });
  }
});

export default router;
