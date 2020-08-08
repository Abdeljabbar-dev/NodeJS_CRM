const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const nconf = require("nconf");
const mongoose = require("mongoose");
const passport = require("passport");
const bluebird = require("bluebird");
const passportJwt = passport.authenticate("jwt", { session: false });
var cors = require("cors");
var validationUser = require("./middlewares/validationUser");
// const requestId = require("../../resources");
const fs = require("fs-extra");

require("./middlewares/requestId");
require("./middlewares/errorHandler");
// Middlewares
// const cors = require("./middlewares/cors");
const responseNormalizer = require("./middlewares/responseNormalizer");
const passportStrat = require("./middlewares/passport");

const activite = require("./routes/activity");
const processus = require("./routes/process");
const portfolio = require("./routes/portfolio");

// Mongoose configuration
mongoose.Promise = bluebird;
mongoose.set("debug", false);
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

// mongoose.set("useNewUrlParser", true);
mongoose.set("useFindOneAndDelete", true);
mongoose.set("useFindOneAndRemove", true);
mongoose.set("useFindOneAndUpdate", true);

// mongoose.set("useCreateIndex", true);
// mongoose.set("useFindAndModify", true);
// console.log(
//   ' nconf.get("database: dev: url")   #######  ',
//   nconf.get("database:dev:url")
// );

mongoose.connect(nconf.get("database:dev:url"));
// mongoose.connect(nconf.get("database:dev:url"), {
//   useNewUrlParser: true
// });

mongoose.connect(nconf.get("database:dev:url"));

mongoose.connection.once("connected", () =>
  console.log("Successfully connected to the database")
);
mongoose.connection.once("error", err =>
  console.log("error connected to the database ", err)
);

const Users = require("./routes/users");
const Collaborator = require("./routes/collaborator");
const Auth = require("./routes/auth");

const Applications = require("./routes/applications");
const Forms = require("./routes/form/forms");
const ProcessInstances = require("./routes/processInstances");
const FormGeneriques = require("./routes/form/formGeneriques");
const Team = require("./routes/team");
const labels = require("./routes/labels");
const dashboard = require("./routes/dashboard");
const events = require("./routes/events");
const startups = require("./routes/startups");
const testimonials = require("./routes/testimonials");
const lafactory = require("./routes/lafactory");
// Creates and configures an ExpressJS web server.
const app = express();
try {
  const dir0 = `../resources/`;
  if (!fs.existsSync(dir0)) fs.mkdir(dir0);

  const dir = `../resources/startups`;
  if (!fs.existsSync(dir)) fs.mkdir(dir);
  const dir1 = `../resources/users`;
  if (!fs.existsSync(dir1)) fs.mkdir(dir1);

  if (!fs.existsSync(dir00)) fs.mkdir(dir00);
  const dir001 = `../resources/testimonials`;
  if (!fs.existsSync(dir001)) fs.mkdir(dir001);

  const dirPortfolio = `../resources/portfolios`;
  if (!fs.existsSync(dirPortfolio)) fs.mkdir(dirPortfolio);
} catch (error) {
  console.log("create folders ### ", error.message);
}

app.use(bodyParser.json());

app.use(bodyParser.text());
// app.use(bodyParser.raw({ type: "*/*" }));
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// Local imports
// // Models
// require("./models/User");
// require("./models/User");
// require("./models/Collaborator");

// Routes

app.use("/users", passportJwt, Users);
app.use("/collaborators", passportJwt, Collaborator);
app.use("/Auth", Auth);
app.use("/applications", passportJwt, Applications);
app.use("/forms", passportJwt, Forms);
app.use("/processInstances", passportJwt, ProcessInstances);
app.use("/formGeneriques", passportJwt, FormGeneriques);
app.use("/activities", passportJwt, activite);
app.use("/processes", passportJwt, processus);
app.use("/portfolios", portfolio);
app.use("/teams", passportJwt, Team);
// app.use("/startups, Team);
app.use("/labels", passportJwt, labels);
app.use("/dashboard", passportJwt, dashboard);
app.use("/events", passportJwt, events);
app.use("/startups", passportJwt, startups);
app.use("/testimonials", passportJwt, testimonials);
app.use("/lafactory", lafactory);
// app.use("/startup_images", express.static("../."));
app.use(passport.initialize());

app.use(responseNormalizer);

app.use("/images", express.static("../resources/"));
module.exports = app;
