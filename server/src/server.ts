import express, { Application, Request, Response } from "express";
import API from "./routes";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import deviceIdMiddleware from "./middleware/tagDevice";
dotenv.config();

const app: Application = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 3001;
const isDevelopment = process.env.NODE_ENV !== "production";

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(helmet());
app.use(morgan("dev"));
app.use(deviceIdMiddleware)

if (isDevelopment) {
  // Development-specific Middlewares
  // app.use(cors({ origin: "*" }));
  app.use(morgan("dev"));
} else {
  // Production-specific Middleware
  app.use(compression());
  app.use(helmet());

  // Serve static files
  app.use(express.static(path.join(__dirname, "client")));

  // Cache Control
  app.use((req: any, res: any, next: any) => {
    if (req.url.startsWith("/static/")) {
      res.setHeader("Cache-Control", "public, max-age=31536000");
    }
    next();
  });
}

app.use("/api/v1", API);

// Handle any requests that don't match the ones above
app.get("/{*splat}", (req: any, res: any) => {
  console.log(__dirname);
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

app.get("/test", async (req, res) => {
  res.send("ok");
});

// Error Handling
app.use((err: any, req: any, res: any, next: any) => {
  if (isDevelopment) {
    console.error(err.stack);
    res.status(500).send(err.message);
  } else {
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
