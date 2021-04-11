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
      const { userPhone } = req;
      const users = await User.findAll({ where: { phone: userPhone } });
      const user = users[0];
      if (!user) {
        return res.status(RESPONSE_TYPES.NOT_FOUND.statusCode).json({
          message: RESPONSE_TYPES.NOT_FOUND.message,
          success: false,
          status_code: RESPONSE_TYPES.NOT_FOUND.statusCode,
        });
      } else {
        return res.status(RESPONSE_TYPES.SUCCESS.statusCode).json({
          data: user,
          success: true,
          status_code: RESPONSE_TYPES.SUCCESS.statusCode,
        });
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
