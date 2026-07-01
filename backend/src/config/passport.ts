import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { User } from '../modules/auth/user.schema.js'
import { userRole } from '../modules/auth/user.model.js'
import "dotenv/config";
console.log(process.env.GOOGLE_CALLBACK_URL)

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
      const email   = profile.emails?.[0].value
      const googleId = profile.id

      let user = await User.findOne({ googleId })

      if (user) {
        return done(null , toPassportUser(user))
      }

    
      user = await User.findOne({ email })

      if (user) {
        user.googleId    = googleId
        user.authProvider = 'google'
        user.isVerified  = true
        await user.save()
        return done(null , toPassportUser(user))
      }

    console.log("Google Strategy Loaded");
      user = await User.create({
        userName:     profile.displayName,
        email,
        googleId,
        authProvider: 'google',
        profileImage: profile.photos?.[0].value || '',  
        isVerified:   true,  
        isActive:     true,
      })

      return done(null , toPassportUser(user))

    } catch (err) {
      return done(err, false)
    }
  }
))

export default passport
