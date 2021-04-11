// Core Imports
const bcryptjs = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

// Custom Imports
// Global Files
const RESPONSE_TYPES = require("./../../response-types");
const CONFIG = require("./../../config");
const UTILS = require("./../../utils");
// Models
const User = require("./../../models/user");
const Role = require("./../../models/role");
const Group = require("./../../models/group");
const Message = require("./../../models/message");
const PersonalNotes = require("./../../models/personal-notes");

module.exports = {
  // Queries
  hello: async function (agrs, req) {
    return "Hellow World!";
  },
  getProfileData: async function (agrs, req) {
    if (!req.isAuth) {
      // check if user is not autheticated then throw a error and return
      const error = new Error(RESPONSE_TYPES.UNAUTHENTICATED.message);
      error.statusCode = RESPONSE_TYPES.UNAUTHENTICATED.statusCode;
      throw error;
    } else {
      return {}; // need to return a complete user object
    }
  },
  // Mutations
  login: async function ({ userInput }, req) {
    try {
      const { email, password } = userInput;
      let error;
      const user = await User.findOne({ email: email });
      if (!user) {
        error = new Error("No User Found!");
        error.statusCode = 404;
        throw error;
      }
      const correctPW = await bcryptjs.compare(password, user.password);
      if (!correctPW) {
        error = new Error(RESPONSE_TYPES.INVALID_INPUT.message);
        error.statusCode = RESPONSE_TYPES.INVALID_INPUT.statusCode;
        throw error;
      }
      const token = await jwt.sign(
        { userId: user._id, email: email, name: user.name },
        CONFIG.JWT_SECRET,
        { expiresIn: CONFIG.JWT_EXPIRE_TIME }
      );
      return {
        _id: user._id.toString(),
        token: token,
        ...user._doc,
        password: null,
      };
    } catch (error) {
      throw error;
    }
  },
  register: async function ({ userInput }, req) {
    // function trycatch if anything goes wrong stop exicution and send back error
    try {
      // check is user already exists, if yes throw error and return, otherwise continue
      const userExists = await User.findOne({ email: userInput.email });
      if (userExists) {
        let err = new Error(RESPONSE_TYPES.USER_EXISTS.message);
        err.statusCode = RESPONSE_TYPES.USER_EXISTS.statusCode;
        throw err;
      }
      const {
        full_name,
        username,
        email,
        password,
        tag_line,
        status,
        role,
      } = userInput;
      // validate input data if input is not correct throw error and return
      let errors = [];
      if (validator.isEmpty(username)) {
        errors.push({ key: "username", message: "username is required!" });
      }
      if (!validator.isEmail(email)) {
        errors.push({ key: "email", message: "E-Mail is required!" });
      }
      if (
        validator.isEmpty(password) ||
        !validator.isLength(password, { min: 5 })
      ) {
        errors.push({ key: "password", message: "Password is required!" });
      }
      if (validator.isEmpty(role)) {
        errors.push({ key: "role", message: "role is required!" });
      }
      if (errors.length > 0) {
        // errors found in user input throw error and return
        let err = new Error(RESPONSE_TYPES.INVALID_INPUT.message);
        err.statusCode = RESPONSE_TYPES.INVALID_INPUT.statusCode;
        err.errors = errors;
        throw err;
      }
      // user input is correct creating a hash password
      const hashedPW = await bcryptjs.hash(
        password,
        CONFIG.BCRYPTJS_HASH_LENGHT
      );
      // get all available roles (exacpt "admin")
      const availableRoles = await Role.find({ title: ["tutor", "student"] });
      // check if requested roles exists
      const roleObj = availableRoles.find((el) => el.title == role);
      if (!roleObj) {
        // requested role didnot found throw error and return
        const error = new Error(RESPONSE_TYPES.INVALID_INPUT.message);
        error.statusCode = RESPONSE_TYPES.INVALID_INPUT.statusCode;
        throw error;
      } else {
        // role found, create user and return
        const user = await User.create({
          full_name,
          username,
          email,
          password: hashedPW,
          tag_line,
          status,
          role: roleObj,
        });

        const token = await jwt.sign(
          { userId: user._id, email: email, name: user.name },
          CONFIG.JWT_SECRET,
          { expiresIn: CONFIG.JWT_EXPIRE_TIME }
        );
        return {
          ...user._doc,
          _id: user._id.toString(),
          password: null,
          token: token,
        }; // need to return a complete user object
      }
    } catch (error) {
      throw error;
    }
  },
};
