const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const catalogRouter = require("./routes/catalog");

const app = express();

// Set up mongoose connection --------------------------------------------------
// Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
mongoose.set("strictQuery", false);

// Define the database URL to connect to.
const devMongoDB =
  "mongodb+srv://davidnode:test1234@nodetuts.irfnmwr.mongodb.net/library_project?retryWrites=true&w=majority";
const mongoDB = process.env.MONGODB_URI || devMongoDB;

// Connect to the database
mongoose.connect(mongoDB).catch((err) => console.log(err));

// view engine setup
// where the views will be stored
app.set("views", path.join(__dirname, "views"));
// what is the view engine in use
app.set("view engine", "pug");

// Set up rate limiter: maximum of twenty requests per minute
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});

// Apply rate limiter to all requests
app.use(limiter);
// Add helmet to the middleware chain.
// Set CSP headers to allow our Bootstrap and Jquery to be served
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  })
);
// Compress all routes
app.use(compression());
// set the logger to dev mode
app.use(logger("dev"));
// Needed to populate the req.body with form fields
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// set the directory to serve static assets
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// use imported routers to handle views
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/catalog", catalogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
