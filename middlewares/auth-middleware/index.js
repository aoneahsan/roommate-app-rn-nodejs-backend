// Core Imports
// Packages Imports
const jwt = require("jsonwebtoken");

// Custom Imports
const CONFIG = require("./../../config");

const authMiddleware = async (req, res, next) => {
  const authToken = req.get(CONFIG.HEADER_AUTH_KEY);
  console.log(`auth-middlware/index.js === authMiddleware == res = `, {
    authToken,
  });
  if (!authToken) {
    // if not auth token found, mark user as unauthenticated and continue to next middleware
    req.isAuth = false;
    return next();
  } else {
    // const token = authToken.split(" ")[1]; // if you are a fan of send auth token with 'Bearer ' from frontend then use this, i'm just passing auth token from frontend that's why directly parsing token
    const token = authToken;
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, CONFIG.JWT_SECRET);
    } catch (error) {
      // error occured while verifing token, so mark auth as false and continue to next middleware
      console.log("auth-middleware === trycatch jwt.verify == error = ", {
        error,
      });
      req.isAuth = false;
      return next();
    }
    console.log(`auth-middlware/index.js === authMiddleware == res = `, {
      authToken,
      decodedToken,
    });
    if (!decodedToken) {
      // if token not matched, mark user as unauthenticated and continue to next middleware
      req.isAuth = false;
      return next();
    } else {
      req.isAuth = true;
      req.userId = decodedToken.userId;
      req.userName = decodedToken.userName;
      req.userPhone = decodedToken.userPhone;
      return next();
    }
  }
};

module.exports = authMiddleware;
