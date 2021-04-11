// Core Imports
// const bcrypt = require("bcryptjs");
const validator = require("validator");
const JWT = require("jsonwebtoken");

// Custom Imports
const User = require("./../../models/user");
const CONFIG = require("./../../config");
const RESPONSE_TYPES = require("./../../response-types");
const twilioClient = require("./../../twilio-client");
const Role = require("../../models/role");

module.exports.signup = async (req, res, next) => {
  try {
    const { phone, countryCode } = req.body;
    // console.log("AuthController === signup == req.body = ", {
    //   phone,
    //   countryCode,
    // });
    let errors = [];
    if (!phone) {
      errors.push({ key: "phone", message: "phone number is required!" });
    }
    if (!countryCode) {
      errors.push({ key: "countryCode", message: "country code is required!" });
    }
    if (errors.length > 0) {
      return res.status(400).json({
        message: "Invalid Data!",
        errors: errors,
        success: false,
        status_code: 422,
      });
    }
    const users = await User.findAll({ where: { phone: phone } });
    const userExists = users[0];
    if (userExists) {
      return res.status(400).json({ message: "User Already Exists!" });
    }
    const availableRoles = await Role.findAll({
      where: {
        title: "customer",
      },
    });
    const customerRole = availableRoles[0];
    if (!customerRole) {
      return res.status(500).json({ message: "Customer Role Not Found!" });
    }
    const user = await User.create({
      phone: phone,
      country_code: countryCode,
    });
    user.addRole(customerRole);
    console.log("AuthController === signup == user = ", { user });
    return res.json(user);
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
    const user = await User.findOne({ email: email });
    if (!user) {
      error = new Error("No User Found!");
      error.statusCode = 404;
      throw error;
    }
    const correctPW = await bcryptjs.compare(password, user.password);
    if (!correctPW) {
      error = new Error("Incorrect Password!");
      error.statusCode = 401;
      throw error;
    }
    const token = await JWT.sign(
      { id: user.id, email: email, name: user.name },
      jwtSecret,
      { expiresIn: "1h" }
    );
    if (!token) {
      error = new Error("Token creating failed!");
      error.statusCode = 500;
      throw error;
    }
    return {
      id: user.id.toString(),
      token: token,
    };
  } catch (error) {
    return res.status(RESPONSE_TYPES.INTERNAL_SERVER_ERROR.statusCode).json({
      message: RESPONSE_TYPES.INTERNAL_SERVER_ERROR.message,
      status_code: RESPONSE_TYPES.INTERNAL_SERVER_ERROR.statusCode,
      detail: "auth-controller === signup == trycatch",
      error,
    });
  }
};
