import { Router } from "express";

import CodeAuthorization from "./authorizeCode.js"
import LinkPreview from "./linkPreview.js"
import Users from "./users.js"
import verifyAuth from "../middleware/index.js";

const router = Router();

router.use(CodeAuthorization)
router.use(LinkPreview)

router.use(verifyAuth)
router.use(Users)


export default router