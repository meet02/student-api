'use strict';

var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var password = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
const {
    generateString,
    cardFormatter,
} = require('../utils/random-string-generator');
var self = module.exports = {
    _saltLength: 16,

    _saltSet: '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ',

    encrypt: function (text, done) {
        var cipher = crypto.createCipher(algorithm, password)
        var crypted = cipher.update(text, 'utf8', 'hex')
        crypted += cipher.final('hex');
        done(crypted);
    },

    decrypt: function (text, done) {
        var decipher = crypto.createDecipher(algorithm, password)
        var dec = decipher.update(text, 'hex', 'utf8')
        dec += decipher.final('utf8');
        done(dec);
    },

    /*
     * gets a new hash for password and salt
     * @param {Function} Callback with params {boolean}
     */
    newHash: function (pwToHashAndSalt, done) {
        this._createHash(pwToHashAndSalt, this._salt(), done);
    },

    /*
     * creates a new hash for password using sha256 and hexadecimal digest
     * @param {Function} Callback with params {saltObject}
     */
    _createHash: function (password, salt, done) {
        let saltedPW = crypto.createHash('sha256').update(salt + password).digest("hex");
        done(salt + saltedPW);
    },


    /*
     * Verifies an incoming password
     * @param {Function} Callback with params {boolean}
     */
    verify: function (incomingPW, hashedPw, done) {

        this._createHash(incomingPW, this._getSalt(hashedPw), function (newHash) {
            done(newHash === hashedPw);
        });
    },

    /*
     * creates a new salt for password of Admin User
     * @param {Value} Salt
     */
    _salt: function () {
        var saltString = '';
        for (let i = 0; i < this._saltLength; i++) {
            let target = Math.floor(Math.random() * this._saltSet.length);
            saltString += this._saltSet[target];
        }

        return saltString;
    },

    /*
     * Gets the new salt for password of Admin User
     * @param {Value} Salt
     */
    _getSalt: function (hashedAndSaltedPassword) {

        return hashedAndSaltedPassword.substring(0, this._saltLength);
    },

    randString: (x) => {
        let s = "";
        while (s.length < x && x > 0) {
            let r = Math.random();
            s += (r < 0.1 ? Math.floor(r * 100) : String.fromCharCode(Math.floor(r * 26) + (r > 0.5 ? 97 : 65)));
        }
        return s;
    },
    encryptCard: (card, done) => {
        let encObj = {}
        for (let x in card) {
            self.encrypt(card[x], (encCard) => {
                encObj[x] = encCard
            })
        }
        done(encObj)
        return
    },

    decryptCard: (card, done) => {
        let decObj = {}
        for (let x in card) {
            if (x == 'card_image') {
                decObj[x] = card[x]
            } else {
                self.decrypt(card[x], (decCard) => {
                    if (x == 'card_number') {
                        decObj[x] = cardFormatter(decCard)

                    } else {
                        decObj[x] = decCard
                    }

                })
            }

        }
        done(decObj)
        return
    }

};