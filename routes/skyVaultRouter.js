import { Router } from "express";
import { isAuthenticated } from "../middleware/authCheck.js";
import skyVaultController from "../controllers/skyVaultController.js";

const skyVaultRouter = Router();

skyVaultRouter.get("/", isAuthenticated, skyVaultController.skyVaultGet);
skyVaultRouter.get("/folder/:folderID", isAuthenticated, skyVaultController.skyVaultFolderGet);
skyVaultRouter.get("/delete-file/:fileID", isAuthenticated, skyVaultController.deleteFilePost);
skyVaultRouter.get("/edit-file/:fileID", isAuthenticated, skyVaultController.editFileGet);
skyVaultRouter.post("/edit-file/:fileID", isAuthenticated, skyVaultController.editFilePost);

export default skyVaultRouter;