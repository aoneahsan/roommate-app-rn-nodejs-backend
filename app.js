// **********************************************************************************
// **********************************************************************************
// Core Imports
// **********************************************************************************
// **********************************************************************************
// NMP Packages Imports
const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");

// **********************************************************************************
// **********************************************************************************
// Custom File Imports
// **********************************************************************************
// **********************************************************************************
// Database Import
const sequelize = require("./database");

// **********************************************************************************
// Utils Import
const UTILS = require("./utils");

// **********************************************************************************
// Config Import
const CONFIG = require("./config");

// **********************************************************************************
// Response Types
const RESPONSE_TYPES = require("./response-types");

// **********************************************************************************
// Routes Imports
const userRoutes = require("./routes/user-routes");
const messageRoutes = require("./routes/auth-routes");

// **********************************************************************************
// Models Imports
const UserModel = require("./models/user");
const UserProfileImageModel = require("./models/user-profile-image");
const RoleModel = require("./models/role");
const UserRoleModel = require("./models/user-role");

// **********************************************************************************
// Routes Imports
const authRoutes = require("./routes/auth-routes");

// **********************************************************************************
// Controller Imports

// **********************************************************************************
// Middleware Imports
const roleMiddleware = require("./middlewares/role-middleware");
const userMiddleware = require("./middlewares/user-middleware");
const authMiddleware = require("./middlewares/auth-middleware");

// **********************************************************************************
// creating app instance
const expressApp = express();

// **********************************************************************************
// **********************************************************************************
// Configuring Packages
// **********************************************************************************
// **********************************************************************************
// CORS middleware
expressApp.use(cors());

// **********************************************************************************
// bodyParser
expressApp.use(bodyParser.urlencoded({ extended: false }));

// **********************************************************************************
// multer
const multerFileStorageConfig = multer.diskStorage({
  destination: (res, file, callback) => {
    callback(null, "images"); // this callback is required to let req continue to next middleware, (first parameter of this callback is an optional error object, throw error if you need or pass null to let request continue, like we did here)
  },
  filename: (res, file, callback) => {
    const random = new Date().toISOString();
    callback(null, random + "-" + file.originalname);
  },
});

// **********************************************************************************
// **********************************************************************************
// Adding Middlwares
// **********************************************************************************
// **********************************************************************************
// body-parser middleware to add this package functionality
expressApp.use(bodyParser.json());

// **********************************************************************************
// multer middleware to add this package functionality
expressApp.use(multer({ storage: multerFileStorageConfig }).single("file")); // here "file" is the file name we will recieve inside req object while processing upload file requests

// **********************************************************************************
// site images/static-resources middleware (this will return site static files)
expressApp.use(
  "/images",
  express.static(path.join(__dirname, "public", "images"))
);

// **********************************************************************************
// static files (images/videos/files) middleware (this will return uploaded static files)
expressApp.use(
  "/files",
  express.static(path.join(__dirname, "public", "uploaded-files"))
);

// **********************************************************************************
// cors headers middleware, this will set any required request headers
expressApp.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  return next();
});

// **********************************************************************************
// Checking/Creating Default Roles | Middleware
expressApp.use(roleMiddleware);

// **********************************************************************************
// Checking/Creating Default Users | Middleware
expressApp.use(userMiddleware);

// **********************************************************************************
// auth middlware
expressApp.use(authMiddleware);

// **********************************************************************************
// upload files middleware (to allow files upload)
expressApp.use("/upload-file", (req, res, next) => {
  let error;
  //  check if user is loggedin othervise throw error
  if (!req.isAuth) {
    error = new Error(RESPONSE_TYPES.UNAUTHENTICATED.message);
    error.statusCode = RESPONSE_TYPES.UNAUTHENTICATED.statusCode;
    throw error;
  }
  if (!req.file) {
    // this "req.file" is automated generated by multer package, and by now, file is uploaded in system and this "file" object contains file path in "path" veriable inside it.
    return res.status(RESPONSE_TYPES.INVALID_INPUT.statusCode).json({
      message: RESPONSE_TYPES.INVALID_INPUT.message,
      errors: {
        file: "this is required.",
        oldFilePath:
          "provide old file path, this will save storage space by deleting that file",
      },
      statusCode: RESPONSE_TYPES.INVALID_INPUT.statusCode,
    });
  } else {
    if (req.body.oldFilePath) {
      UTILS.removeImage(req.body.oldFilePath);
    }
    return res.status(RESPONSE_TYPES.SUCCESS.statusCode).json({
      message: RESPONSE_TYPES.SUCCESS.message,
      statusCode: RESPONSE_TYPES.SUCCESS.statusCode,
      filepath: req.file.path,
    });
  }
});

// **********************************************************************************
// Global Error Handling Middleware (this middleware will handle any error (custom generated error using new Error))
expressApp.use((err, req, res, next) => {
  console.log(
    `app.js === Global Error Handler Middlware(GEHM) == ${{ err, req }}`
  );
  let message = RESPONSE_TYPES.GEHM_DEFAULT_RESPONSE.message;
  let statusCode = RESPONSE_TYPES.GEHM_DEFAULT_RESPONSE.statusCode;
  let errors = RESPONSE_TYPES.GEHM_DEFAULT_RESPONSE.errors;
  if (err.message) {
    message = err.message;
  }
  if (err.statusCode) {
    statusCode = err.statusCode;
  }
  if (err.errors) {
    errors = err.errors;
  }
  const response = { message, statusCode, errors };
  return res.status(422).json(response);
});

// **********************************************************************************
// **********************************************************************************
// Adding Routes Middlewares
// **********************************************************************************
// **********************************************************************************
// Auth Routes Middleware
expressApp.use(authRoutes);
// User Routes Middleware
expressApp.use(userRoutes);

// test middleware to test if app working fine
expressApp.get("/", (req, res, next) => {
  return res.json({ data: "<h1>Server Up and Running :)</h1>" });
});

// **********************************************************************************
// **********************************************************************************
// Checking/Creating Sequelize Tables in DB
// **********************************************************************************
// **********************************************************************************
UserModel.belongsToMany(RoleModel, {
  through: UserRoleModel,
});
RoleModel.belongsToMany(UserModel, {
  through: UserRoleModel,
});
UserModel.hasMany(UserProfileImageModel);
UserProfileImageModel.belongsTo(UserModel, {
  constraints: true,
  onDelete: "CASCADE",
});

// **********************************************************************************
// **********************************************************************************
// Connecting to Mysql, Checking/Creating required tables and Starting Node Server
// **********************************************************************************
// **********************************************************************************
sequelize
  // .sync({force: true})
  .sync()
  .then((res) => {
    // console.log(`app.js === sequelize.sync == success = `, {res});
    console.log(`app.js === sequelize.sync == success`);
    expressApp.listen(CONFIG.SERVER_PORT);
    console.log(
      "Roommate App Backend Server running on port http://localhost:" +
        CONFIG.SERVER_PORT
    );
  })
  .catch((err) => {
    console.log(`app.js === sequelize.sync == error = `, { err });
  });
