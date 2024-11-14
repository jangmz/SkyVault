import { Router } from "express";
import signUpController from "../controllers/signUpController.js";
import signUpValidation from "../validation/signUpValidation.js";

const signUpRouter = Router();

signUpRouter.get("/", signUpController.signUpGet);
signUpRouter.post("/", signUpValidation, signUpController.signUpPost);

export default signUpRouter;