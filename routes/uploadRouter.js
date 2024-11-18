import { Router } from "express";
import {isAuthenticated} from "../middleware/authCheck.js";
import uploadController from "../controllers/uploadController.js";
import multer from "multer";

const upload = multer({ dest: "../public/uploads"});


const uploadRouter = Router();

uploadRouter.get("/", isAuthenticated, uploadController.uploadGet);
uploadRouter.post("/", isAuthenticated, upload.single("file"), uploadController.uploadPost);

export default uploadRouter;