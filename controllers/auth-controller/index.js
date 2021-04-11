// Core Imports
// const bcrypt = require("bcryptjs");
const validator = require("validator");
const JWT = require("jsonwebtoken");
const colors = require("colors");

// Custom Imports
const User = require("./../../models/user");
const CONFIG = require("./../../config");
const RESPONSE_TYPES = require("./../../response-types");
const twilioClient = require("./../../twilio-client");
const Role = require("../../models/role");

// *********************************************************************

module.exports.signup = async (req, res, next) => {
  try {
    const { phone, countryCode } = req.body;
    let errors = [];
    if (!phone) {
      errors.push({ key: "phone", message: "phone number is required!" });
    }
    if (!countryCode) {
      errors.push({ key: "countryCode", message: "country code is required!" });
    }
    if (errors.length > 0) {
      return res.status(RESPONSE_TYPES.INVALID_INPUT.statusCode).json({
        message: RESPONSE_TYPES.INVALID_INPUT.message,
        success: false,
        status_code: RESPONSE_TYPES.INVALID_INPUT.statusCode,
        errors: errors,
      });
    }
    const users = await User.findAll({ where: { phone: phone } });
    const userExists = users[0];
    if (userExists) {
      return res
        .status(RESPONSE_TYPES.INVALID_INPUT.statusCode)
        .json({ message: "User Already Exists!" });
    }
    const availableRoles = await Role.findAll({
      where: {
        title: "customer",
      },
    });
    const customerRole = availableRoles[0];
    if (!customerRole) {
      return res.status(RESPONSE_TYPES.NOT_FOUND.statusCode).json({
        message: RESPONSE_TYPES.NOT_FOUND.message,
        suucess: false,
        detail: "customer role not found, auth-controller === ",
      });
    }
    const user = await User.create({
      phone: phone,
      country_code: countryCode,
    });
    user.addRole(customerRole);
    const result = await storeUserVerifyCode(user);
    console.log("AuthController === signup == user = ", { user, result });
    return res.status(RESPONSE_TYPES.SUCCESS.statusCode).json({
      data: user,
      success: true,
      status_code: RESPONSE_TYPES.SUCCESS.statusCode,
    });
  } catch (error) {
    return res.status(RESPONSE_TYPES.INTERNAL_SERVER_ERROR.statusCode).json({
      message: RESPONSE_TYPES.INTERNAL_SERVER_ERROR.message,
      status_code: RESPONSE_TYPES.INTERNAL_SERVER_ERROR.statusCode,
      detail: "auth-controller === signup == trycatch",
      error,
    });
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const users = await User.findAll({ where: { phone: phone } });
    const user = users[0];
    if (!user) {
      return res.status(RESPONSE_TYPES.NOT_FOUND.statusCode).json({
        message: RESPONSE_TYPES.NOT_FOUND.message,
        success: false,
        status_code: RESPONSE_TYPES.NOT_FOUND.statusCode,
      });
    }
    const result = await storeUserVerifyCode(user);
    return res.status(RESPONSE_TYPES.SUCCESS.statusCode).json({
      data: user,
      success: true,
      status_code: RESPONSE_TYPES.SUCCESS.statusCode,
    });
  } catch (error) {
    return res.status(RESPONSE_TYPES.INTERNAL_SERVER_ERROR.statusCode).json({
      message: RESPONSE_TYPES.INTERNAL_SERVER_ERROR.message,
      status_code: RESPONSE_TYPES.INTERNAL_SERVER_ERROR.statusCode,
      detail: "auth-controller === login == trycatch",
      error,
    });
  }
};

module.exports.verifyPhone = async (req, res, next) => {
  try {
    const { phone, verifyCode } = req.body;
    let errors = [];
    if (!phone) {
      errors.push({ key: "phone", message: "phone number is required!" });
    }
    if (!verifyCode) {
      errors.push({
        key: "verifyCode",
        message: "verification code is required!",
      });
    }
    if (errors.length > 0) {
      return res.status(RESPONSE_TYPES.INVALID_INPUT.statusCode).json({
        message: RESPONSE_TYPES.INVALID_INPUT.message,
        success: false,
        status_code: RESPONSE_TYPES.INVALID_INPUT.statusCode,
        errors: errors,
      });
    }
    const users = await User.findAll({ where: { phone: phone } });
    const user = users[0];
    if (!user) {
      return res.status(RESPONSE_TYPES.NOT_FOUND.statusCode).json({
        message: RESPONSE_TYPES.NOT_FOUND.message,
        success: false,
        status_code: RESPONSE_TYPES.NOT_FOUND.statusCode,
      });
    }
    if (user.phone_verify_code != verifyCode) {
      return res.status(RESPONSE_TYPES.INVALID_INPUT.statusCode).json({
        message: RESPONSE_TYPES.INVALID_INPUT.message,
        success: false,
        status_code: RESPONSE_TYPES.INVALID_INPUT.statusCode,
        errors: [{ key: "verify_code", message: "Invalid verification code" }],
      });
    }
    const token = await createAuthTokenAndClearVerifyCode(user);
    if (!token) {
      return res
        .status(RESPONSE_TYPES.JWT_TOKEN_CREATION_ERROR.statusCode)
        .json({
          message: RESPONSE_TYPES.JWT_TOKEN_CREATION_ERROR.message,
          status_code: RESPONSE_TYPES.JWT_TOKEN_CREATION_ERROR.statusCode,
          detail: "auth-controller === verifyPhone == if (!token) return",
          error,
        });
    }
    return res.status(RESPONSE_TYPES.SUCCESS.statusCode).json({
      data: {
        ...user,
        token: token,
      },
      success: true,
      status_code: RESPONSE_TYPES.SUCCESS.statusCode,
    });
  } catch (error) {
    return res.status(RESPONSE_TYPES.INTERNAL_SERVER_ERROR.statusCode).json({
      message: RESPONSE_TYPES.INTERNAL_SERVER_ERROR.message,
      status_code: RESPONSE_TYPES.INTERNAL_SERVER_ERROR.statusCode,
      detail: "auth-controller === verifyPhone == trycatch",
      error,
    });
  }
};

module.exports.resendVerificationCode = async (req, res, next) => {
  try {
    const { phone } = req.body;
    let errors = [];
    if (!phone) {
      errors.push({ key: "phone", message: "phone number is required!" });
    }
    if (errors.length > 0) {
      return res.status(RESPONSE_TYPES.INVALID_INPUT.statusCode).json({
        message: RESPONSE_TYPES.INVALID_INPUT.message,
        success: false,
        status_code: RESPONSE_TYPES.INVALID_INPUT.statusCode,
        errors: errors,
      });
    }
    const users = await User.findAll({ where: { phone: phone } });
    const user = users[0];
    if (!user) {
      return res.status(RESPONSE_TYPES.NOT_FOUND.statusCode).json({
        message: RESPONSE_TYPES.NOT_FOUND.message,
        success: false,
        status_code: RESPONSE_TYPES.NOT_FOUND.statusCode,
      });
    }
    const storeUserVerifyCodeResult = await storeUserVerifyCode(user);
    return res.status(RESPONSE_TYPES.SUCCESS.statusCode).json({
      data: {
        message: "Code send successfully!",
      },
      success: true,
      status_code: RESPONSE_TYPES.SUCCESS.statusCode,
    });
  } catch (error) {
    return res.status(RESPONSE_TYPES.INTERNAL_SERVER_ERROR.statusCode).json({
      message: RESPONSE_TYPES.INTERNAL_SERVER_ERROR.message,
      status_code: RESPONSE_TYPES.INTERNAL_SERVER_ERROR.statusCode,
      detail: "auth-controller === verifyPhone == trycatch",
      error,
    });
  }
};

module.exports.checkLoginStatus = async (req, res, next) => {
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
      detail: "auth-controller === getProfileData == trycatch",
      error,
    });
  }
};

// Private Funstions

const sendSms = async (phone, message) => {
  // const response = await twilioClient.messages.create({
  //   body: message,
  //   from: CONFIG.TWILIO_FROM_NUMBER,
  //   to: phone,
  // });
  // console.log("auth-controller === sendSms == res = ".bgGreen, { response });
  // return response;
  return true; // when uncomment above code remove this line
};

const storeUserVerifyCode = async (user) => {
  const completePhoneNumber = "+" + user.country_code + user.phone;
  const newCode = Math.floor(10000000 + Math.random() * 90000000)
    .toString()
    .slice(0, 4);
  const messageBody = "your verification code is " + newCode;
  const codeExpireTime = new Date(new Date().getTime() + 5 * 60 * 60 * 1000); // code expire time 5h from now
  const smsresponse = await sendSms(completePhoneNumber, messageBody);
  user.phone_verify_code = newCode;
  user.phone_verify_code_expireIn = codeExpireTime;
  const result = await user.save();
  return result;
};

const createAuthTokenAndClearVerifyCode = async (user) => {
  user.phone_verify_code = null;
  user.phone_verify_code_expireIn = null;
  const result = await user.save();
  const token = await JWT.sign(
    { id: user.id, phone: user.phone, name: user.name },
    CONFIG.JWT_SECRET,
    { expiresIn: CONFIG.JWT_EXPIRE_TIME }
  );
  return token;
};
