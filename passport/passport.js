// index.js
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const Agent = require('../modals/agent');
const bcrypt = require("bcrypt");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await Agent.findOne({ username: username });

      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return done(null, false, { message: "Incorrect password." });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  // Assuming 'user.id' is the unique identifier to store in the session
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Agent.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
