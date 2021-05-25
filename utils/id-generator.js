const randomString = require("random-string");
const moment = require("moment");

const dbConstants = require("../constants/db-constants");
const generateOldId = (label) => {
  let generatedId = `${label}${moment().unix()}${Math.floor(
    Math.random() * 999999999 + 1
  )}`;
  return generatedId;
};

const generateRandom = (label) => {
  let generatedId = `${label}${moment().unix()}${randomStr()}${Math.floor(
    Math.random() * 99999 + 11111
  )}`;
  return generatedId;
};

const randomStr = () => {
  let length = 3;
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

module.exports = {
  generateOldId,
  generateRandom,
  randomStr,
};
