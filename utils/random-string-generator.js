const randomString = require("random-string");
const generateString = (length, numeric, letters, special) => {
  let generatedString = randomString({
    length: length,
    numeric: numeric,
    letters: letters,
    special: special,
  });
  return generatedString;
};

const generateRandomString = function () {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var timestamp = new Date().getTime();

  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return String(timestamp) + text;
};

const cardFormatter = (card) => {
  let cardNo = card.toString();
  let last4Digits = cardNo.substr(cardNo.length - 4);
  let remainingDigits = cardNo.substring(0, cardNo.length - 4);
  remainingDigits = remainingDigits.replace(/[0-9]/g, "*");
  return remainingDigits + last4Digits;
};

module.exports = {
  generateString,
  cardFormatter,
  generateRandomString,
};
