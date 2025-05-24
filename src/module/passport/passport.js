import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../userModule/userModel.js";
import dotenv from "dotenv";

dotenv.config();

// serialize / deserialize
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Google strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });
                if (!user) {
                    user = await User.create({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        phoneNumber: "N/A", // Default value for phoneNumber
                        gender: "Other", // Default value for gender
                        dateOfBirth: new Date("2000-01-01"), // Default value for dateOfBirth
                        weight: 0, // Default value for weight
                        height: 0, // Default value for height
                        password: "google-auth", // Placeholder password
                        termsAccepted: true, // Default value
                    });
                }
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

export default passport;
