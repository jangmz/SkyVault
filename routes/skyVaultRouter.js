import { Router } from "express";
import { isAuthenticated } from "../middleware/authCheck.js";
import skyVaultController from "../controllers/skyVaultController.js";

const skyVaultRouter = Router();

skyVaultRouter.get("/", isAuthenticated, skyVaultController.skyVaultGet);
skyVaultRouter.get("/folder", isAuthenticated, skyVaultController.skyVaultGet);
skyVaultRouter.get("/folder/:folderID", isAuthenticated, skyVaultController.skyVaultFolderGet);
skyVaultRouter.get("/delete-file/:fileID", isAuthenticated, skyVaultController.deleteFile);
skyVaultRouter.get("/edit-file/:fileID", isAuthenticated, skyVaultController.editFileGet);
skyVaultRouter.post("/edit-file/:fileID", isAuthenticated, skyVaultController.editFilePost);
skyVaultRouter.get("/delete-folder/:folderID", isAuthenticated, skyVaultController.deleteFolder);
skyVaultRouter.get("/edit-folder/:folderID", isAuthenticated, skyVaultController.editFolderGet);
skyVaultRouter.post("/edit-folder/:folderID", isAuthenticated, skyVaultController.editFolderPost);

export default skyVaultRouter;