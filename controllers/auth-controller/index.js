// Core Imports
const JWT = require("jsonwebtoken");
const colors = require("colors");
const AWS_SNS_SENDER = require("aws-sdk");

// Custom Imports
const {
  TRY_CATCH_ERROR_RESPONSE,
  SUCCESS_RESPONSE,
  NOT_FOUND_RESPONSE,
  INVALID_INPUT_RESPONSE,
  USER_EXISTS_RESPONSE,
  UNAUTHENTICATED_RESPONSE,
  JWT_TOKEN_CREATION_ERROR_RESPONSE,
} = require("./../../utils");
const CONFIG = require("./../../config");
const twilioClient = require("./../../twilio-client");
// Models
const User = require("./../../models/user");
const Role = require("../../models/role");

AWS_SNS_SENDER.config.update({
  accessKeyId: CONFIG.AWS_SNS_ACCESS_KEY,
  secretAccessKey: CONFIG.AWS_SNS_SECRET_KEY,
  region: CONFIG.AWS_SNS_REGION,
});

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
      return INVALID_INPUT_RESPONSE(res, errors);
    }
    const users = await User.findAll({ where: { phone: phone } });
    const userExists = users[0];
    if (userExists) {
      return USER_EXISTS_RESPONSE(res);
    }
    const availableRoles = await Role.findAll({
      where: {
        title: "customer",
      },
    });
    const customerRole = availableRoles[0];
    if (!customerRole) {
      return NOT_FOUND_RESPONSE(res);
    }
    const user = await User.create({
      phone: phone,
      country_code: countryCode,
    });
    user.addRole(customerRole);
    const result = await storeUserVerifyCodeAndSendAwsSns(user);
    const userData = user.dataValues;
    return SUCCESS_RESPONSE(res, userData);
  } catch (error) {
    return TRY_CATCH_ERROR_RESPONSE(res, error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const users = await User.findAll({ where: { phone: phone } });
    const user = users[0];
    if (!user) {
      return NOT_FOUND_RESPONSE(res);
    }
    const result = await storeUserVerifyCodeAndSendAwsSns(user);
    const userData = user.dataValues;
    return SUCCESS_RESPONSE(res, userData);
  } catch (error) {
    console.log("auth-controller === login == trycatch", { error });
    return TRY_CATCH_ERROR_RESPONSE(res, error);
  }
};

module.exports.verifyPhone = async (req, res, next) => {
  try {
    const { phone, verifyCode } = req.body;
    console.log({ phone, verifyCode });
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
      return INVALID_INPUT_RESPONSE(res, errors);
    }
    const users = await User.findAll({ where: { phone: phone } });
    const user = users[0];
    if (!user) {
      return NOT_FOUND_RESPONSE(res);
    }
    if (user.phone_verify_code != verifyCode) {
      const errors = [
        { key: "verify_code", message: "Invalid verification code" },
      ];
      return INVALID_INPUT_RESPONSE(res, errors);
    }
    const token = await createAuthTokenAndClearVerifyCode(user);
    if (!token) {
      return JWT_TOKEN_CREATION_ERROR_RESPONSE(res, error);
    }
    const userData = user.dataValues;
    const resData = {
      ...userData,
      token: token,
    };
    return SUCCESS_RESPONSE(res, resData);
  } catch (error) {
    return TRY_CATCH_ERROR_RESPONSE(res, error);
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
      return INVALID_INPUT_RESPONSE(res, errors);
    }
    const users = await User.findAll({ where: { phone: phone } });
    const user = users[0];
    if (!user) {
      return NOT_FOUND_RESPONSE(res);
    }
    const storeUserVerifyCodeResult = await storeUserVerifyCodeAndSendAwsSns(
      user
    );
    return SUCCESS_RESPONSE(res, null);
  } catch (error) {
    return TRY_CATCH_ERROR_RESPONSE(res, error);
  }
};

module.exports.checkLoginStatus = async (req, res, next) => {
  try {
    if (!req.isAuth) {
      return UNAUTHENTICATED_RESPONSE(res);
    } else {
      const { userPhone } = req;
      const users = await User.findAll({ where: { phone: userPhone } });
      const user = users[0];
      if (!user) {
        return NOT_FOUND_RESPONSE(res);
      } else {
        const userData = user.dataValues;
        return SUCCESS_RESPONSE(res, userData);
      }
    }
  } catch (error) {
    return TRY_CATCH_ERROR_RESPONSE(res, error);
  }
};

// Private Funstions

const sendSms = async (phone, message) => {
  const response = await twilioClient.messages.create({
    body: message,
    from: CONFIG.TWILIO_FROM_NUMBER,
    to: phone,
  });
  console.log("auth-controller === sendSms == res = ".bgGreen, { response });
  return response;
  // return true; // when uncomment above code remove this line
};

// const storeUserVerifyCode = async (user) => {  // leave for reference, if needed twilio integration again
//   // using twilio
//   const completePhoneNumber = "+" + user.country_code + user.phone;
//   const newCode = Math.floor(10000000 + Math.random() * 90000000)
//     .toString()
//     .slice(0, 4);
//   const messageBody = "your verification code is " + newCode;
//   const codeExpireTime = new Date(new Date().getTime() + 5 * 60 * 60 * 1000); // code expire time 5h from now
//   const smsresponse = await sendSms(completePhoneNumber, messageBody);
//   user.phone_verify_code = newCode;
//   user.phone_verify_code_expireIn = codeExpireTime;
//   const result = await user.save();
//   return result;
// };

const createAuthTokenAndClearVerifyCode = async (user) => {
  user.phone_verify_code = null;
  user.phone_verify_code_expireIn = null;
  const result = await user.save();
  const token = await JWT.sign(
    { userId: user.id, userPhone: user.phone, userName: user.name },
    CONFIG.JWT_SECRET,
    { expiresIn: CONFIG.JWT_EXPIRE_TIME }
  );
  return token;
};

const storeUserVerifyCodeAndSendAwsSns = async (user) => {
  // user AWS SNS
  const completePhoneNumber = "+" + user.country_code + user.phone;
  const newCode = Math.floor(10000000 + Math.random() * 90000000)
    .toString()
    .slice(0, 4);
  const messageBody = "your verification code is " + newCode;
  const codeExpireTime = new Date(new Date().getTime() + 5 * 60 * 60 * 1000); // code expire time 5h from now
  // const smsresponse = await sendSms(completePhoneNumber, messageBody);
  user.phone_verify_code = newCode;
  user.phone_verify_code_expireIn = codeExpireTime;
  const result = await user.save();
  var params = {
    Message: messageBody,
    PhoneNumber: completePhoneNumber,
    MessageAttributes: {
      "AWS.SNS.SMS.SenderID": {
        DataType: "String",
        StringValue: "PikyMe",
      },
    },
  };

  var publishTextPromise = new AWS_SNS_SENDER.SNS({ apiVersion: "2010-03-31" })
    .publish(params)
    .promise();

  const awsSNSResponse = await publishTextPromise;
  console.log(
    "auth-controller === storeUserVerifyCodeAWSSNS == awsSNSResponse = ",
    { awsSNSResponse }
  );
  return awsSNSResponse;
};
