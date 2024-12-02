import { Router } from "express";

const logOutRouter = Router();

logOutRouter.get("/", (req, res, next) => {
    req.logout(error => {
        if (error) return next(error);

    req.session.destroy(err => {
        if (err) return next(err);
        res.clearCookie("connect.sid");
        res.redirect("/log-in");
    })
    });
});

export default logOutRouter;