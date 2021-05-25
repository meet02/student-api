const express = require("express");
const router = express.Router();
const commonFunction = require("../../utils/common-function");
const Joi = require("joi");
const jsonResponse = require("./../../utils/json-response");
const adminUserHandler = require("../../model_handlers/adminUser-handler");
const responseCodes = require("../../helpers/response-codes");
const errors = require("../../utils/dz-errors");
const _ = require("underscore");

/*
Name : create-user
Purpose : create-user
Original Author : Meet Aghera
Created At : 26th April 2021 
*/

router.post("/create-admin-user", async (req, res) => {
  try {
    const { body, files } = req;

    let obj = {
      name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      gender: Joi.string().required().valid("male", "female"),
      weight: Joi.number().required(),
      length: Joi.number().required(),
      age: Joi.number().required(),
    };
    let checkJoiValidationValidate = await commonFunction.checkJoiValidation(
      body,
      obj
    );
    let response = await adminUserHandler.creatAdminUser(body, files);
    jsonResponse(res, responseCodes.OK, errors.noError(), response);
  } catch (error) {
    try {
      console.log("error", error);
      jsonResponse(res, error.code, errors.formatErrorForWire(error), null);
      return;
    } catch (error) {
      console.log("error", error);
      jsonResponse(
        res,
        responseCodes.BadRequest,
        errors.internalServer(true),
        null
      );
      return;
    }
  }
});

/*
Name : login-user
Purpose : login-user
Original Author : Meet Aghera
Created At : 26th April 2021 
*/

router.post("/login-admin-user", async (req, res) => {
  try {
    const { body } = req;

    let obj = {
      email: Joi.string().required(),
      password: Joi.string().required(),
    };
    let checkJoiValidationValidate = await commonFunction.checkJoiValidation(
      body,
      obj
    );
    let response = await adminUserHandler.loginUserName(body);
    jsonResponse(res, responseCodes.OK, errors.noError(), response);
  } catch (error) {
    try {
      console.log("error", error);
      jsonResponse(res, error.code, errors.formatErrorForWire(error), null);
      return;
    } catch (error) {
      console.log("error", error);
      jsonResponse(
        res,
        responseCodes.BadRequest,
        errors.internalServer(true),
        null
      );
      return;
    }
  }
});

/*
Name : update-user
Purpose : update-user
Original Author : Meet Aghera
Created At : 26th April 2021 
*/

router.put("/update-admin-user", async (req, res) => {
  try {
    const { body, files } = req;

    let obj = {
      name: Joi.string(),
      email: Joi.string(),
      password: Joi.string(),
      gender: Joi.string().valid("male", "female"),
      weight: Joi.number(),
      length: Joi.number(),
      age: Joi.number(),
      userId: Joi.string().required(),
    };
    let checkJoiValidationValidate = await commonFunction.checkJoiValidation(
      body,
      obj
    );
    let response = await adminUserHandler.updateAdminUser(body, files);
    jsonResponse(res, responseCodes.OK, errors.noError(), response);
  } catch (error) {
    try {
      console.log("error", error);
      jsonResponse(res, error.code, errors.formatErrorForWire(error), null);
      return;
    } catch (error) {
      console.log("error", error);
      jsonResponse(
        res,
        responseCodes.BadRequest,
        errors.internalServer(true),
        null
      );
      return;
    }
  }
});

/*
Name : get-user
Purpose : get-user
Original Author : Meet Aghera
Created At : 26th April 2021 
*/

router.get("/get-admin-user", async (req, res) => {
  try {
    let response = await adminUserHandler.getAdminUser(req.query);
    jsonResponse(res, responseCodes.OK, errors.noError(), response);
  } catch (error) {
    try {
      console.log("error", error);
      jsonResponse(res, error.code, errors.formatErrorForWire(error), null);
      return;
    } catch (error) {
      console.log("error", error);
      jsonResponse(
        res,
        responseCodes.BadRequest,
        errors.internalServer(true),
        null
      );
      return;
    }
  }
});

/*
Name : active-admin-user
Purpose : active-admin-user
Original Author : Meet Aghera
Created At : 25th April 2021 
*/

router.put("/active-admin-user", async (req, res) => {
  try {
    let response = await adminUserHandler.activeAdminUser(req.body);
    jsonResponse(res, responseCodes.OK, errors.noError(), response);
  } catch (error) {
    try {
      console.log("error", error);
      jsonResponse(res, error.code, errors.formatErrorForWire(error), null);
      return;
    } catch (error) {
      console.log("error", error);
      jsonResponse(
        res,
        responseCodes.BadRequest,
        errors.internalServer(true),
        null
      );
      return;
    }
  }
});

/*
Name : inactive-admin-user
Purpose : inactive-admin-user
Original Author : Meet Aghera
Created At : 25th April 2021 
*/

router.put("/inactive-admin-user", async (req, res) => {
  try {
    let response = await adminUserHandler.inactiveAdminUser(req.body);
    jsonResponse(res, responseCodes.OK, errors.noError(), response);
  } catch (error) {
    try {
      console.log("error", error);
      jsonResponse(res, error.code, errors.formatErrorForWire(error), null);
      return;
    } catch (error) {
      console.log("error", error);
      jsonResponse(
        res,
        responseCodes.BadRequest,
        errors.internalServer(true),
        null
      );
      return;
    }
  }
});

router.put("/delete-admin-user", async (req, res) => {
  try {
    let response = await adminUserHandler.deleteAdminUser(req.body);
    jsonResponse(res, responseCodes.OK, errors.noError(), response);
  } catch (error) {
    try {
      console.log("error", error);
      jsonResponse(res, error.code, errors.formatErrorForWire(error), null);
      return;
    } catch (error) {
      console.log("error", error);
      jsonResponse(
        res,
        responseCodes.BadRequest,
        errors.internalServer(true),
        null
      );
      return;
    }
  }
});

router.post("/forgot-password-send-otp", async (req, res) => {
  try {
    let { body } = req;
    let obj = {
      email: Joi.string().required(),
    };
    let checkJoiValidationValidate = await commonFunction.checkJoiValidation(
      body,
      obj
    );
    let response = await adminUserHandler.forgotPasswordSendOtp(req.body);
    jsonResponse(res, responseCodes.OK, errors.noError(), response);
  } catch (error) {
    try {
      console.log("error", error);
      jsonResponse(res, error.code, errors.formatErrorForWire(error), null);
      return;
    } catch (error) {
      console.log("error", error);
      jsonResponse(
        res,
        responseCodes.BadRequest,
        errors.internalServer(true),
        null
      );
      return;
    }
  }
});

router.post("/veridy-otp", async (req, res) => {
  try {
    let { body } = req;
    let obj = {
      email: Joi.string().required(),
      otp: Joi.number(),
    };
    let checkJoiValidationValidate = await commonFunction.checkJoiValidation(
      body,
      obj
    );
    let response = await adminUserHandler.verifyOtp(req.body);
    jsonResponse(res, responseCodes.OK, errors.noError(), response);
  } catch (error) {
    try {
      console.log("error", error);
      jsonResponse(res, error.code, errors.formatErrorForWire(error), null);
      return;
    } catch (error) {
      console.log("error", error);
      jsonResponse(
        res,
        responseCodes.BadRequest,
        errors.internalServer(true),
        null
      );
      return;
    }
  }
});

module.exports = router;
