const Joi = require("joi");
const errors = require("./dz-errors");
/*
 Name : checkJoiValidation
 Purpose : checkJoiValidation
 Original Author : Meet Aghera
 Created At : 24th April 2020
*/

const checkJoiValidation = (data, validateObj) => {
  return new Promise((resolve, reject) => {
    try {
      const Schema = Joi.object().keys(validateObj);
      const result = Schema.validate(data);
      const { value, error } = result;

      if (error) {
        reject(
          errors.validationError(
            true,
            error.details[0].message,
            error.name,
            "EN"
          )
        );
        return;
      }
      resolve(200);
      return;
    } catch (error) {
      console.trace(error);
      reject(error);
      return;
    }
  });
};

module.exports = {
  checkJoiValidation,
};
