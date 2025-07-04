import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  getAllMessagesForChat,
  getAllUsersForSideBar,
  sendMessage,
} from "../controllers/message.controllers.js";

const router = Router();

router.use(isLoggedIn);

router.route("/users").get(getAllUsersForSideBar);

router.route("/:id").get(getAllMessagesForChat);

router.route("/:id").post(sendMessage);

export default router;
