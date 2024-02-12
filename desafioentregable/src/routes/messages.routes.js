import { Router } from "express";
import MessagesManager from "../dao/dbManagers/messages.manager.js";

const router = Router();

router.get("/", async (req, res) => {
  res.send("Route messages for later");
});

export default router;
