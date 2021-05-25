"use strict";

//configurations
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("./utils/logger");
const jsonResponse = require("./utils/json-response");
const errors = require("./utils/dz-errors");
const cors = require("cors");

const dbConnection = require("./utils/db-connection");

//other configurations
const passport = require("passport");
const favicon = require("serve-favicon");
const multiparty = require("connect-multiparty");
const expressUpload = require("express-fileupload");
const multipartyMiddleWare = multiparty();
const robots = require("robots.txt");

// App API route

const apiRoute = require("./routes/index");
const apiAdmin = require("./routes/api/adminUser");

//express configurations
const app = express();

app.use(robots(path.join(__dirname, "./public", "robots.txt")));
app.use(favicon(path.join(__dirname, "./public/img", "favicon.png")));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json({ limit: "5000mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "5000mb" }));
app.use(cookieParser());

app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cors());
app.use(expressUpload());
app.use(passport.initialize());
app.use(passport.session());
// app.use(multipartyMiddleWare);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// console.log("==>", __dirname + "/admin/dist/index.html");
// app.use("/admin", express.static(path.join(__dirname, "/admin")));
// app.get("/admin/*", function (req, res) {
//   res.sendFile(path.join(__dirname + "/admin/dist/index.html"));
// });

//For deployment of admin panel
app.use("/web", express.static(path.join(__dirname, "/web")));
app.get("/web/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/web/admin/index.html"));
});

app.use("/api", apiRoute);
app.use("/api/admin", apiAdmin);

// catch 404 and forward to error handler

var cron = require("node-cron");
var request = require("request");

var swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");

app.use("/api-swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use((req, res) => {
  logger("Error: No route found or Wrong method name");
  // res.send(jsonResponse(req, res, errors.resourceNotFound(true), null))
});

module.exports = app;
