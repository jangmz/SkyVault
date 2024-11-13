import { Router } from "express";
import logInController from "../controllers/logInController.js";

const logInRouter = Router();

logInRouter.get("/", logInController.logInGet);
logInRouter.post("/", logInController.logInPost);

export default logInRouter;