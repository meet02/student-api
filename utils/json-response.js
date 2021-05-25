"use strict";
const _ = require("underscore");

/*
 * Standardizes json responses from the server to client
 *
 * @param {Object} Express response object
 * @param {Int} Response status code
 * @param {Object} Any Error thrown that should be propagated to client
 * @param {Object, Array, Number, String} Any object that should be sent that can be serialized
 */
var main_body_lan_code;
module.exports = function (res, status, error, payload) {
  res.status(status).send(
    JSON.stringify({
      error: error,
      data: payload,
      status: status,
    })
  );
};
