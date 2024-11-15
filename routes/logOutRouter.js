import { Router } from "express";

const logOutRouter = Router();

logOutRouter.get("/", (req, res, next) => {
    req.logout(error => {
        if (error) return next(error);
    });

    res.redirect("/log-in");
});

export default logOutRouter;