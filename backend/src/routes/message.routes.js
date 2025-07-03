import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware";
import {
  getAllMessagesForChat,
  getAllUsersForSideBar,
  sendMessage,
} from "../controllers/message.controllers";

const router = Router();

router.use(isLoggedIn);

router.route("/").get(getAllUsersForSideBar);

router.route("/:id").get(getAllMessagesForChat);

router.route("/").post(sendMessage);

export default router;
