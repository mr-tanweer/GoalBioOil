const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const authRoutes = require("./routes/route");
const connectdb = require("./connectDb");
const hbs = require("hbs");
const passport2 = require("./passport/passport");
require("dotenv").config();
const flash = require("connect-flash");
const moment = require("moment");
const app = express();


const PORT = (process.env.API_URL)

connectdb();


app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

hbs.registerPartials(__dirname + "/views/partials");
app.set("view engine", "hbs");

app.use(
  session({
    secret: "your-secret-key",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use("", authRoutes);

hbs.registerHelper("formatTimestamp", function (timestamp) {
  return moment(timestamp).format("MMM D, YYYY h:mm:ss A");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
