// Core Imports
// const validator = require("validator");

// Custom Imports
const User = require("./../../models/user");
const CONFIG = require("./../../config");
const RESPONSE_TYPES = require("./../../response-types");
// const Role = require("../../models/role");

module.exports.getProfileData = async (req, res, next) => {
  try {
    if (!req.isAuth) {
      return res.status(RESPONSE_TYPES.UNAUTHENTICATED.statusCode).json({
        message: RESPONSE_TYPES.UNAUTHENTICATED.message,
        success: false,
        status_code: RESPONSE_TYPES.UNAUTHENTICATED.statusCode,
      });
    } else {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(RESPONSE_TYPES.NOT_FOUND.statusCode).json({
          message: RESPONSE_TYPES.NOT_FOUND.message,
          success: false,
          status_code: RESPONSE_TYPES.NOT_FOUND.statusCode,
        });
      } else {
        return res.status(200).json(user);
      }
    }
  } catch (error) {
    return res.status(RESPONSE_TYPES.INTERNAL_SERVER_ERROR.statusCode).json({
      message: RESPONSE_TYPES.INTERNAL_SERVER_ERROR.message,
      status_code: RESPONSE_TYPES.INTERNAL_SERVER_ERROR.statusCode,
      detail: "user-controller === getProfileData == trycatch",
      error,
    });
  }
};
