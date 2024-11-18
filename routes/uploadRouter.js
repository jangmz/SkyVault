import { Router } from "express";
import {isAuthenticated} from "../middleware/authCheck.js";
import uploadController from "../controllers/uploadController.js";

const uploadRouter = Router();

uploadRouter.get("/", isAuthenticated, uploadController.uploadGet);
uploadRouter.post("/", isAuthenticated, uploadController.upload.single("file"), uploadController.uploadPost);

export default uploadRouter;