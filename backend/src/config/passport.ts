import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { User } from '../modules/auth/user.schema.js'
import { userRole } from '../modules/auth/user.model.js'
import "dotenv/config";

const toPassportUser = (user: { _id: unknown; role: userRole }) => ({
  _id: String(user._id),
  role: user.role,
})

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL:  process.env.GOOGLE_CALLBACK_URL!,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value?.toLowerCase()
      const googleId = profile.id

      if (!email) {
        console.error("Google OAuth error: No email found in Google profile");
        return done(new Error("No email returned from Google profile"), false)
      }

      let user = await User.findOne({ googleId })

      if (user) {
        return done(null, toPassportUser(user))
      }

      user = await User.findOne({ email })

      if (user) {
        user.googleId = googleId
        user.authProvider = 'google'
        user.isVerified = true
        await user.save()
        return done(null, toPassportUser(user))
      }

      const fullName =
        profile.displayName ||
        [profile.name?.givenName, profile.name?.familyName].filter(Boolean).join(" ") ||
        email.split("@")[0] ||
        "User";

      user = await User.create({
        fullName,
        email,
        googleId,
        authProvider: 'google',
        profileImage: profile.photos?.[0]?.value || '',  
        isVerified: true,  
        isActive: true,
      })

      return done(null, toPassportUser(user))

    } catch (err) {
      console.error("GoogleStrategy authentication error:", err)
      return done(err as Error, false)
    }
  }
))

export default passport
