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
    const token = authToken.split(" ")[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, CONFIG.JSON_WEB_TOKEN_SECRET);
    } catch (error) {
      // error occured while verifing token, so mark auth as false and continue to next middleware
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
      req.userId = decodedToken.userId.toString();
      req.userPhone = decodedToken.phone;
      return next();
    }
  }
};

module.exports = authMiddleware;
