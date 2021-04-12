// Core Imports
const AWS = require("aws-sdk");

// Custom Imports
const {
  TRY_CATCH_ERROR_RESPONSE,
  SUCCESS_RESPONSE,
  NOT_FOUND_RESPONSE,
  UNAUTHENTICATED_RESPONSE,
  INVALID_INPUT_RESPONSE,
} = require("./../../utils");
const CONFIG = require("./../../config");
// Models
const User = require("./../../models/user");
const UserProfileImage = require("./../../models/user-profile-image");

// Update AWS Config
AWS.config.update({
  secretAccessKey: CONFIG.AWS_SECRET_KEY,
  accessKeyId: CONFIG.AWS_ACCESS_KEY,
  region: CONFIG.AWS_S3_BUCKET_REGION,
});

// Create S3 Instance
const S3 = new AWS.S3();

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
        type,
        age,
        gender,
        constellations,
        hometown,
        language,
      } = req.body;
      console.log("user-controller === updateProfile == req.body = ", {
        name,
        age,
        gender,
        constellations,
        hometown,
        language,
      });
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
      const users = await User.findAll({
        include: [
          {
            model: UserProfileImage,
          },
        ],
      });
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

module.exports.uploadImage = async (req, res, next) => {
  try {
    const { userId, userPhone } = req; // stored in req from auth-middleware, for detail read auth-middlware fiel
    const { base64ImageData, imageOrderNo } = req.body;
    console.log({ imageOrderNo });
    let errors = [];
    if (!base64ImageData) {
      errors.push({
        key: "base64ImageData",
        message: "base64ImageData is required!",
      });
    }
    if (!imageOrderNo) {
      errors.push({
        key: "imageOrderNo",
        message: "imageOrderNo is required!",
      });
    }
    if (errors.length > 0) {
      return INVALID_INPUT_RESPONSE(res, errors);
    }
    const base64Data = new Buffer.from(
      base64ImageData.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const type = base64ImageData.split(";")[0].split("/")[1];

    const fileName = Date.now().toString(); // generating a random name

    const params = {
      Bucket: CONFIG.AWS_S3_BUCKET_NAME,
      Key: `${fileName}.${type}`, // type is not required
      Body: base64Data,
      ACL: "public-read",
      ContentEncoding: "base64", // required
      ContentType: `image/${type}`, // required
    };

    const { Location, Key } = await S3.upload(params).promise();
    const fileLocation = Location;
    const fileKey = Key;

    console.log("user-controller === uploadImage == res =  ", {
      fileLocation,
      fileKey,
    });
    const data = { url: fileLocation, filename: fileKey };
    let profileImage = await UserProfileImage.findOne({
      where: { userId: userId, order: imageOrderNo },
    });
    if (!profileImage) {
      const loggedInUser = await User.findOne({ where: { phone: userPhone } });
      if (!loggedInUser) {
        return NOT_FOUND_RESPONSE(res);
      }
      const newlyCreatedImage = await loggedInUser.createUserProfileImage({
        order: imageOrderNo,
        url: fileLocation,
        name: fileKey,
        type: type,
      });
      console.log("user-controller === uploadImage == newlyCreatedImage = ", {
        newlyCreatedImage,
      });
    } else {
      profileImage.url = Location;
      profileImage.name = fileKey;
      profileImage.type = type;
      await profileImage.save();
    }
    console.log("user-controller === uploadImage == profileImage = ", {
      profileImage,
    });
    return SUCCESS_RESPONSE(res, data);
  } catch (error) {
    console.log("user-controller === uploadImage == trycatch error = ", {
      error,
    });
    return TRY_CATCH_ERROR_RESPONSE(res, { ...error });
  }
};
