const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const Customers = require("../models/customers");
const LocalStrategy = require("passport-local").Strategy;

//JWT Strategy
passport.use('jwt-local',
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      secretOrKey: process.env.JWT_LOCAL_SECRET ,
    },
    async (payload, done) => {
      try {
        //Find the user specified in token
        const Customer = await Customers.findById(payload.sub);
        
        if (!Customer) {
          done(null, false);
        }
        return done(null, Customer);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

//Local Strategy
passport.use("local-customer",
  new LocalStrategy(
    {
      usernameField: "contact",
      passwordField:"otp",
    },
    async (contact,otp, done) => {
      try {
       
        //Find the user specified in token
        const Customer = await Customers.findOne({"contact":contact});
       
        if (!Customer) {
          
          return done(null, false);
        }

        const isMatch = await Customer.isValidOTP(otp);

        if (!isMatch) {
          return done(null, false);
        }
        return done(null, Customer);
        
      } catch (error) {
        done(error, false);
      }
    }
  )
);

