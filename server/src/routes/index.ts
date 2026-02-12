import { Router } from "express";

import CodeAuthorization from "./authorizeCode.js"
import Users from "./users.js"
import verifyAuth from "../middleware/index.js";

const router = Router();

router.use(CodeAuthorization)

router.use(verifyAuth)
router.use(Users)


export default router