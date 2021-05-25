const jsonResponse = require('./json-response');
const DzErros = require('./dz-errors');
const responseCodes = require('./../helpers/response-codes');

module.exports = (fn) => async(err, req, res, next) => {
    jsonResponse(res, responseCodes.UnprocessableEntity, DzErros.missingParamsResApp(true, err.joi.message), "")
};