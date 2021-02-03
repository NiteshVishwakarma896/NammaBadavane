const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const Admins = require("../models/admin");
const LocalStrategy = require("passport-local").Strategy;

//JWT Strategy
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      secretOrKey: process.env.JWT_ADMIN_SECRET,
    },
    async (payload, done) => {
      try {
        //Find the user specified in token
        const Admin = await Admins.findById(payload.sub);
        if (!Admin) {
          done(null, false);
        }
        return done(null, Admin);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

//Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email"
    },
    async (email,password, done) => {
      try {
        //Find the user specified in token
        const Admin = await Admins.findOne({"email":email});
        if (!Admin) {
          return done(null, false);
        }

        const isMatch = await Admin.isValidPassword(password);

        if (!isMatch) {
          return done(null, false);
        }
        done(null, Admin);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

