// Core Imports
const fs = require("fs");
const path = require("path");

// Custom Imports
const RESPONSE_TYPES = require("./../response-types");

// Util Functions
module.exports.removeImage = async (filePath) => {
  fs.unlink(path.join(__dirname, filePath), (err) => {
    console.log(`utils/index.js === removeImage == ${{ err }}`);
  });
};

// RESPONSE Functions
module.exports.UNAUTHENTICATED_RESPONSE = (res) => {
  return res.status(RESPONSE_TYPES.UNAUTHENTICATED.statusCode).json({
    message: RESPONSE_TYPES.UNAUTHENTICATED.message,
    data: null,
    success: false,
    status_code: RESPONSE_TYPES.UNAUTHENTICATED.statusCode,
    errors: [],
  });
};

module.exports.NOT_FOUND_RESPONSE = (res) => {
  return res.status(RESPONSE_TYPES.NOT_FOUND.statusCode).json({
    message: RESPONSE_TYPES.NOT_FOUND.message,
    data: null,
    success: false,
    status_code: RESPONSE_TYPES.NOT_FOUND.statusCode,
    errors: [],
  });
};

module.exports.TRY_CATCH_ERROR_RESPONSE = (res, error) => {
  return res.status(RESPONSE_TYPES.INTERNAL_SERVER_ERROR.statusCode).json({
    message: RESPONSE_TYPES.INTERNAL_SERVER_ERROR.message,
    data: null,
    success: false,
    status_code: RESPONSE_TYPES.INTERNAL_SERVER_ERROR.statusCode,
    errors: [{ key: "error", value: error }],
  });
};

module.exports.INVALID_INPUT_RESPONSE = (res, errors) => {
  return res.status(RESPONSE_TYPES.INVALID_INPUT.statusCode).json({
    message: RESPONSE_TYPES.INVALID_INPUT.message,
    data: null,
    success: false,
    status_code: RESPONSE_TYPES.INVALID_INPUT.statusCode,
    errors: errors,
  });
};

module.exports.USER_EXISTS_RESPONSE = (res) => {
  return res.status(RESPONSE_TYPES.USER_EXISTS.statusCode).json({
    message: RESPONSE_TYPES.USER_EXISTS.message,
    data: null,
    success: false,
    status_code: RESPONSE_TYPES.USER_EXISTS.statusCode,
    errors: [],
  });
};

module.exports.SUCCESS_RESPONSE = (res, data) => {
  return res.status(RESPONSE_TYPES.SUCCESS.statusCode).json({
    message: RESPONSE_TYPES.SUCCESS.message,
    data: data,
    success: true,
    status_code: RESPONSE_TYPES.SUCCESS.statusCode,
    errors: [],
  });
};

module.exports.JWT_TOKEN_CREATION_ERROR_RESPONSE = (res, error) => {
  return res.status(RESPONSE_TYPES.JWT_TOKEN_CREATION_ERROR.statusCode).json({
    message: RESPONSE_TYPES.JWT_TOKEN_CREATION_ERROR.message,
    data: null,
    success: false,
    status_code: RESPONSE_TYPES.JWT_TOKEN_CREATION_ERROR.statusCode,
    errors: [{ key: "error", value: error }],
  });
};
