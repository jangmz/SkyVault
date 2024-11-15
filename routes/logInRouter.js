import { Router } from "express";
import logInController from "../controllers/logInController.js";
import passport from "passport";

const logInRouter = Router();

logInRouter.get("/", logInController.logInGet);
logInRouter.post("/", passport.authenticate("local", {
    successRedirect: "/sky-vault",
    failureRedirect: "/log-in",
    failureFlash: true
}));

export default logInRouter;