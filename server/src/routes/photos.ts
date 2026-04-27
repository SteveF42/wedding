import { Router, type Request, type Response } from "express";
import multer from "multer";
import fs from "node:fs";
import path from "node:path";

const router = Router();

const photosDirectory = path.resolve(process.cwd(), "uploads", "photos");
fs.mkdirSync(photosDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, photosDirectory);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase() || ".jpg";
    const sanitizedBase = path
      .basename(file.originalname, extension)
      .replace(/[^a-z0-9_-]/gi, "-")
      .slice(0, 60);

    cb(null, `${Date.now()}-${sanitizedBase}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024,
    files: 20,
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image uploads are allowed"));
      return;
    }

    cb(null, true);
  },
});

router.get("/photos", async (_req: Request, res: Response) => {
  try {
    const entries = await fs.promises.readdir(photosDirectory, { withFileTypes: true });
    const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".gif"]);

    const photosWithStats = await Promise.all(
      entries
        .filter((entry) => entry.isFile())
        .map(async (entry) => {
          const extension = path.extname(entry.name).toLowerCase();
          if (!imageExtensions.has(extension)) {
            return null;
          }

          const absolutePath = path.join(photosDirectory, entry.name);
          const stats = await fs.promises.stat(absolutePath);

          return {
            filename: entry.name,
            size: stats.size,
            createdAt: stats.birthtime.toISOString(),
            url: `/uploads/photos/${entry.name}`,
          };
        }),
    );

    const photos = photosWithStats
      .filter((photo): photo is NonNullable<typeof photo> => photo !== null)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.status(200).json({ photos });
  } catch (error) {
    console.error("Error loading photos:", error);
    return res.status(500).json({ message: "Failed to load photo gallery" });
  }
});

router.post(
  "/photos/upload",
  upload.fields([
    { name: "photos", maxCount: 20 },
    { name: "photo", maxCount: 1 },
  ]),
  (req: Request, res: Response) => {
    const filesByField = req.files as Record<string, Express.Multer.File[]> | undefined;
    const files = [...(filesByField?.photos ?? []), ...(filesByField?.photo ?? [])];

    if (!files.length) {
      return res.status(400).json({ message: "No photo files provided" });
    }

    const uploadedPhotos = files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      url: `/uploads/photos/${file.filename}`,
    }));

    return res.status(201).json({
      message: `Uploaded ${uploadedPhotos.length} photo${uploadedPhotos.length === 1 ? "" : "s"} successfully`,
      photos: uploadedPhotos,
      photo: uploadedPhotos[0],
    });
  },
);

export default router;