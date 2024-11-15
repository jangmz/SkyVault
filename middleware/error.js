export function errorHandler(err, req, res, next) {
    res.render("error", {
        title: "Error occured",
        error: {
            status: err.status || 500,
            message: err.message || "Internal server error.",
            details: err.details || "Something went wrong."
        }
    });
}