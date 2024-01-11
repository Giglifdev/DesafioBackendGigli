import passport from "passport";
import GitHubStrategy from "passport-github2";
import local from "passport-local";
import { passportStrategiesEnum } from "./enums.js";
import { PRIVATE_KEY_JWT } from "./constants.js";

import { usersModel } from "../dao/dbManagers/models/users.model.js";
import jwt from "passport-jwt";
import { createHash, isValidPassword } from "../utils.js";

// local auth
const LocalStrategy = local.Strategy;

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

export const initializePassport = () => {
  passport.use(
    passportStrategiesEnum.JWT,
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY_JWT,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload.user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // github auth
  passport.use(
    passportStrategiesEnum.GITHUB,
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          const user = await usersModel.findOne({ email });

          if (!user) {
            const newUser = {
              first_name: profile._json.name,
              last_name: profile._json.name,
              age: 18,
              email,
              password: "123",
              role: "user",
            };
            const result = await usersModel.create(newUser);
            return done(null, result);
          } else {
            return done(null, user);
          }
        } catch (error) {
          console.log(error);
          return done("incorrect credentials");
        }
      }
    )
  );
  // password auth
  passport.use(
    "local-register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, age } = req.body;

          const user = await usersModel.findOne({ email: username });
          if (user) {
            return done(null, false);
          }
          const hashedPassword = createHash(password);
          const userToSave = {
            first_name,
            last_name,
            email: username,
            age,
            password: hashedPassword,
            role: "user",
          };
          const result = await usersModel.create(userToSave);
          return done(null, result);
        } catch (error) {
          return done("Incorrect credentials");
        }
      }
    )
  );

  // local login
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          if (
            username.trim() === "adminCoder@coder.com" &&
            password === "adminCod3r123"
          ) {
            const user = {
              _id: 1,
              first_name: `Admin`,
              last_name: "Coder",
              email: username,
              role: "admin",
            };
            return done(null, user);
          }
          const user = await usersModel.findOne({ email: username });
          const validPassword = isValidPassword(password, user.password);

          if (!user || !validPassword) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done("Incorrect credentials");
        }
      }
    )
  );

  // serialize and deserealize
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    if (id == 1)
      return done(null, {
        first_name: `Admin Coder`,
        email: "adminCoder@coder.com",
        role: "admin",
      });
    const user = await usersModel.findById(id);
    done(null, user);
  });
};

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["coderCookieToken"];
  }
  return token;
};

export const passportCall = (strategy) => (req, res, next) => {
  if (strategy === passportStrategiesEnum.JWT) {
    // passport call
    passport.authenticate(
      strategy,
      { session: false },
      function (err, user, info) {
        if (err) return next(err);
        if (!user)
          return res.status(401).send({
            status: "error",
            messages: info.messages ? info.messages : info.toString(),
          });
        req.user = user;

        next();
      }
    )(req, res, next);
  } else {
    next();
  }
};
