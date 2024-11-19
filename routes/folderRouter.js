import { Router } from "express";
import { isAuthenticated } from "../middleware/authCheck.js"
import folderController from "../controllers/folderController.js";

const folderRouter = Router();

folderRouter.get("/create", isAuthenticated, folderController.folderGet);
folderRouter.post("/create", isAuthenticated, folderController.folderPost);

export default folderRouter;