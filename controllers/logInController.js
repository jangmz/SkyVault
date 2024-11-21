import db from "../prisma/queries.js";
import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcryptjs";

// passport
passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            // find username in DB
            const result = await db.findUserByUsername(username);
            const user = result[0];
            if (!user) return done(null, false, { message: "Incorrect username!" });

            // password comparison
            const match = await bcrypt.compare(password, user.password);
            if (!match) return done(null, false, { message: "Incorrect password!" });

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    })
)

// serialization/deserialization
passport.serializeUser(async (user, done) => {
    done(null, user.id); // save userID into the session
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.findUserById(id);
        if (!user) {
            console.error("User not found");
            return done(null, false); // no user
        }
        done(null, user); // user object attached to REQ.USER
    } catch (error) {
        console.log("Error during deserialization.");
        done(error);        
    }
})

// GET /log-in -> form
function logInGet(req, res, next) {
    res.render("log-in", {
        title: "Log In",
    });
}

export default {
    logInGet,
}