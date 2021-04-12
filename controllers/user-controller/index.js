// Core Imports

// Custom Imports
const {
  TRY_CATCH_ERROR_RESPONSE,
  SUCCESS_RESPONSE,
  NOT_FOUND_RESPONSE,
  UNAUTHENTICATED_RESPONSE,
} = require("./../../utils");
const CONFIG = require("./../../config");
// Models
const User = require("./../../models/user");

module.exports.getProfileData = async (req, res, next) => {
  try {
    if (!req.isAuth) {
      return UNAUTHENTICATED_RESPONSE(res);
    } else {
      const { userPhone } = req; // stored in req from auth-middleware, for detail read auth-middlware fiel
      const users = await User.findAll({ where: { phone: userPhone } });
      const user = users[0];
      if (!user) {
        return NOT_FOUND_RESPONSE(res);
      } else {
        const userData = user.dataValues;
        const profileImages = await user.getUserProfileImages();
        const resData = { ...userData, profileImages: profileImages };
        return SUCCESS_RESPONSE(res, resData);
      }
    }
  } catch (error) {
    return TRY_CATCH_ERROR_RESPONSE(res, error);
  }
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    if (!req.isAuth) {
      return UNAUTHENTICATED_RESPONSE(res);
    } else {
      const { userPhone } = req; // stored in req from auth-middleware, for detail read auth-middlware fiel
      const {
        name,
        age,
        gender,
        constellations,
        hometown,
        language,
      } = req.body;
      const users = await User.findAll({ where: { phone: userPhone } });
      const user = users[0];
      if (!user) {
        return NOT_FOUND_RESPONSE(res);
      } else {
        user.name = name ? name : user.name;
        user.age = age ? age : user.age;
        user.gender = gender ? gender : user.gender;
        user.constellations = constellations
          ? constellations
          : user.constellations;
        user.hometown = hometown ? hometown : user.hometown;
        user.language = language ? language : user.language;
        const result = await user.save();
        const userData = user.dataValues;
        return SUCCESS_RESPONSE(res, userData);
      }
    }
  } catch (error) {
    return TRY_CATCH_ERROR_RESPONSE(res, error);
  }
};

module.exports.getUsersList = async (req, res, next) => {
  try {
    if (!req.isAuth) {
      return UNAUTHENTICATED_RESPONSE(res);
    } else {
      const users = await User.findAll();
      if (!users) {
        return NOT_FOUND_RESPONSE(res);
      } else {
        return SUCCESS_RESPONSE(res, users);
      }
    }
  } catch (error) {
    return TRY_CATCH_ERROR_RESPONSE(res, error);
  }
};
