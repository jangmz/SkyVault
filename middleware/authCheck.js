export function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
        //console.log("Authentication successfull");
    }
    else {
        //console.log("Authentication unsuccessfull");
        const error = new Error();
        error.status = 401;
        error.message = "Unauthorized";
        error.details = "You are not authorized to view this page.";

        next(error);
    }
}

// sets the user to be accessed in ejs files
// in server.js -> app.use(setLocalsUser)
export function setLocalsUser(req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }

    next();
}