import Router from "express";
import { authorization } from "../utils.js";
import { passportCall } from "../config/passport.config.js";
import { ShowUserInfo } from "../controllers/current.controller.js";

const router = Router();

router.get("/", passportCall("jwt"), authorization("USER"), ShowUserInfo);

export default router;
