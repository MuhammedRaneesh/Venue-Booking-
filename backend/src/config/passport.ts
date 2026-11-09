import "./env.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../modules/auth/user.schema.js";
import { userRole } from "../modules/auth/user.model.js";
import { ENV } from "./env.js";

const toPassportUser = (user: { _id: unknown; role: userRole }) => ({
  _id: String(user._id),
  role: user.role,
});

if (!ENV.GOOGLE_CLIENT_ID || !ENV.GOOGLE_CLIENT_SECRET || !ENV.GOOGLE_CALLBACK_URL) {
  console.warn(
    "[Google OAuth] Warning: Missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_CALLBACK_URL in environment variables."
  );
}

passport.use(
  new GoogleStrategy(
    {
      clientID: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
      callbackURL: ENV.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase().trim();
        const googleId = profile.id;

        if (!email) {
          console.error("[Google OAuth] Error: No email found in Google profile");
          return done(new Error("No email returned from Google profile"), false);
        }

        // 1. Check if user already exists by googleId
        let user = await User.findOne({ googleId });

        if (user) {
          if (!user.isActive) {
            return done(new Error("Your account has been deactivated. Please contact support."), false);
          }
          if (!user.fullName) {
            user.fullName =
              (user as any).userName ||
              profile.displayName ||
              email.split("@")[0] ||
              "User";
            await user.save();
          }
          return done(null, toPassportUser(user));
        }

        // 2. Check if user already exists by email (linked account)
        user = await User.findOne({ email });

        if (user) {
          if (!user.isActive) {
            return done(new Error("Your account has been deactivated. Please contact support."), false);
          }
          user.googleId = googleId;
          user.authProvider = "google";
          user.isVerified = true;
          if (!user.fullName) {
            user.fullName =
              (user as any).userName ||
              profile.displayName ||
              email.split("@")[0] ||
              "User";
          }
          if (!user.profileImage && profile.photos?.[0]?.value) {
            user.profileImage = profile.photos[0].value;
          }
          await user.save();
          return done(null, toPassportUser(user));
        }

        // 3. Create a new user
        const fullName =
          profile.displayName?.trim() ||
          [profile.name?.givenName, profile.name?.familyName].filter(Boolean).join(" ").trim() ||
          email.split("@")[0] ||
          "User";

        user = await User.create({
          fullName,
          email,
          googleId,
          authProvider: "google",
          profileImage: profile.photos?.[0]?.value || "",
          isVerified: true,
          isActive: true,
          ownerStatus: "NONE",
        });

        return done(null, toPassportUser(user));
      } catch (err) {
        console.error("[Google OAuth] Authentication error in GoogleStrategy:", err);
        return done(err as Error, false);
      }
    }
  )
);

export default passport;
