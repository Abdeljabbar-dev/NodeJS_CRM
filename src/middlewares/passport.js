const nconf = require("nconf");

const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const { jwt } = require("../../config/dev");
const LocalStrategy = require("passport-local").Strategy;
const GooglePlusTokenStrategy = require("passport-google-plus-token");

let options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = nconf.get("jwt:secret");

passport.use(
  new JwtStrategy(options, async function(jwt_payload, done) {
    try {
      // Find the user specified in token
      const user = await User.findById(jwt_payload.sub);

      // If user doesn't exists, handle it
      if (!user) {
        return done(null, false);
      }

      // Otherwise, return the user
      else {
        done(null, user);
      } // req.user = user;
    } catch (error) {
      done(error, false);
    }
  })
);

// google authentification

passport.use(
  "googleToken",
  new GooglePlusTokenStrategy(
    {
      clientID:
        "650095489393-arg00b8hb6c5fllq38d5aoeh26810o4c.apps.googleusercontent.com",
      clientSecret: "4rEKSJ-XXkjzxbRxNobPhLeI"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // console.log('profile', profile)
        // console.log('accessToken', accessToken)
        // console.log('refreshToken', refreshToken)

        // Check if we have someone with the same email
        existingUser = await User.findOne({
          "google.id": profile.id
        });
        if (existingUser) {
          // We want to merge google's data with local auth
          return done(null, existingUser);
        }

        const newUser = new User({
          method: "google",
          google: {
            id: profile.id,
            email: profile.emails[0].value
          }
        });

        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false, error.message);
      }
    }
  )
);

// LOCAL STRATEGY
passport.use(
  new LocalStrategy(
    {
      usernameField: "email"
    },
    async (email, password, done) => {
      try {
        // Find the user given the email
        const user = await User.findOne({ "local.email": email });

        // If not, handle it
        if (!user) {
          return done(null, false);
        }

        // Check if the password is correct
        const isMatch = await user.isValidPassword(password);

        // If not, handle it
        if (!isMatch) {
          return done(null, false);
        }

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
