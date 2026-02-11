import express, { Application, Request, Response } from "express";
import API from "./routes";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan"
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(helmet())
app.use(morgan("dev"))

app.use("/api/v1", API);

app.get("/", (req: Request, res: Response) => {
  res.send("API is up and running! 🚀");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
