export function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) next();
    else {
        const error = {
            status: 401,
            message: "Unauthorized",
            details: "You are not authorized to view this page."
        };

        return next(error);
    }
}

// sets the user to be accessed in ejs files
export function setLocalsUser(req, res, next) {
    if (req.isAuthenticated()) res.locals.user = req.user;

    next();
}