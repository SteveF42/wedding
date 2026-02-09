import express, { Application, Request, Response } from "express";
import API from "./routes";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
console.log(process.env.COOKIE_SECRET);
app.use(cookieParser(process.env.COOKIE_SECRET))

app.use("/api/v1", API);

app.get("/", (req: Request, res: Response) => {
  res.send("API is up and running! 🚀");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
