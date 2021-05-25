"use strict";

const path = require("path");
const _ = require("underscore");
const fs = require("fs");
const admin = require("firebase-admin");

process.env.DZ_PORT = "9001";

module.exports = {
  appName: "App Name",
  port: process.env.DZ_PORT,
  // baseUrl: "http://localhost:" + process.env.DZ_PORT,
  baseUrl: "http://3.135.89.223:9001",
};
