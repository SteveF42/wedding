import { Router } from "express";

import CodeAuthorization from "./authorizeCode"
import Users from "./users"
import verifyAuth from "../middleware";

const router = Router();

router.use(CodeAuthorization)

router.use(verifyAuth)
router.use(Users)


export default router