import { Router } from "express";
import { isAuthenticated } from "../middleware/authCheck.js";
import skyVaultController from "../controllers/skyVaultController.js";

const skyVaultRouter = Router();

skyVaultRouter.get("/", isAuthenticated, skyVaultController.skyVaultGet);

export default skyVaultRouter;