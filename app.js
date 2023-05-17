var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

require("dotenv").config();

require("./models/connection");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var projectsRouter = require("./routes/projects");
var offersRouter = require("./routes/offers");
var rolesRouter = require("./routes/roles");
var locationsRouter = require("./routes/locations");
var experiencesRouter = require("./routes/experiences");
var diplomasRouter = require("./routes/diplomas");
var jobsRouter = require("./routes/jobs");
var contactsRouter = require("./routes/contacts");
var skillsRouter = require("./routes/skills");

var app = express();
const cors = require("cors");
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/projects", projectsRouter);
app.use("/offers", offersRouter);
app.use("/roles", rolesRouter);
app.use("/locations", locationsRouter);
app.use("/experiences", experiencesRouter);
app.use("/diplomas", diplomasRouter);
app.use("/jobs", jobsRouter);
app.use("/contacts", contactsRouter);
app.use("/skills", skillsRouter);

module.exports = app;
