export function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) next();
    else {
        const error = new Error();

        error.status = 401;
        error.message = "Unauthorized";
        error.details = "You are not authorized to view this page.";

        return next(error);
    }
}

// sets the user to be accessed in ejs files
export function setLocalsUser(req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }

    next();
}