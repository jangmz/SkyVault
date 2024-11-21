export function flashMessages(req, res, next) {
    res.locals.message = req.flash();
    next();
}