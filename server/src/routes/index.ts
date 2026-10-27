import { Request, Response, Router } from "express";

import CodeAuthorization from "./authorizeCode.js"
import LinkPreview from "./linkPreview.js"
import Photos from "./photos.js"
import Users from "./users.js"
import verifyAuth from "../middleware/index.js";

const router = Router();

router.post("/secret", (req:Request, res: Response) =>{
  const file = process.env.SECRET_FILE || "./package.json";
  res.download(file)
})

router.use(CodeAuthorization)
router.use(LinkPreview)

router.use(Photos)
router.use(verifyAuth)
router.use(Users)


export default router