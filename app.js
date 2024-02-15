// **********************************************************************************
// **********************************************************************************
// Core Imports
// **********************************************************************************
// **********************************************************************************
// NMP Packages Imports
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');

// **********************************************************************************
// **********************************************************************************
// Custom File Imports
// **********************************************************************************
// **********************************************************************************
// Database Import
const sequelize = require('./database');

// **********************************************************************************
// Config Import
const CONFIG = require('./config');

// **********************************************************************************
// Response Types
const RESPONSE_TYPES = require('./response-types');

// **********************************************************************************
// Models Imports
const UserModel = require('./models/user');
const UserProfileImageModel = require('./models/user-profile-image');
const RoleModel = require('./models/role');
const UserRoleModel = require('./models/user-role');

// **********************************************************************************
// Routes Imports
const authRoutes = require('./routes/auth-routes');
const userRoutes = require('./routes/user-routes');

// **********************************************************************************
// Controller Imports

// **********************************************************************************
// Middleware Imports
const roleMiddleware = require('./middlewares/role-middleware');
const userMiddleware = require('./middlewares/user-middleware');
const authMiddleware = require('./middlewares/auth-middleware');

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
// multer
// const multerFileStorageConfig = multer.diskStorage({
//   destination: (res, file, callback) => {
//     callback(null, "images"); // this callback is required to let req continue to next middleware, (first parameter of this callback is an optional error object, throw error if you need or pass null to let request continue, like we did here)
//   },
//   filename: (res, file, callback) => {
//     const random = new Date().toISOString();
//     callback(null, random + "-" + file.originalname);
//   },
// });

// **********************************************************************************
// **********************************************************************************
// Adding Middlewares
// **********************************************************************************
// **********************************************************************************
// body-parser middleware to add this package functionality
expressApp.use(bodyParser.urlencoded({ extended: false }));
expressApp.use(bodyParser.json());

// **********************************************************************************
// multer middleware to add this package functionality
expressApp.use(multer().single('file')); // here "file" is the file name we will receive inside req object while processing upload file requests

// **********************************************************************************
// site images/static-resources middleware (this will return site static files)
expressApp.use(
	'/images',
	express.static(path.join(__dirname, 'public', 'images'))
);

// **********************************************************************************
// static files (images/videos/files) middleware (this will return uploaded static files)
expressApp.use(
	'/files',
	express.static(path.join(__dirname, 'public', 'uploaded-files'))
);

// **********************************************************************************
// cors headers middleware, this will set any required request headers
expressApp.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');

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
// **********************************************************************************
// Global Error Handling Middleware (this middleware will handle any error (custom generated error using new Error))
// **********************************************************************************
// **********************************************************************************
expressApp.use((err, req, res, next) => {
	console.error(
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
	return res.status(statusCode).json(response);
});

// **********************************************************************************
// **********************************************************************************
// Adding Routes Middlewares
// **********************************************************************************
// **********************************************************************************
// Auth Routes Middleware
expressApp.use('/api/v1', authRoutes);
// User Routes Middleware
expressApp.use('/api/v1', userRoutes);

// test middleware to test if app working fine
expressApp.get('/', (req, res, next) => {
	return res.json({ data: '<h1>Server Up and Running :)</h1>' });
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
	onDelete: 'CASCADE',
});

// **********************************************************************************
// **********************************************************************************
// Connecting to Mysql, Checking/Creating required tables and Starting Node Server
// **********************************************************************************
// **********************************************************************************
sequelize
	// .sync({ force: true }) // don't uncomment in production, this will delete all tables and data from Database
	.sync()
	.then((_) => {
		expressApp.listen(CONFIG.SERVER_PORT);
		console.info(
			'Roommate App Backend Server running on port http://localhost:' +
				CONFIG.SERVER_PORT
		);
	})
	.catch((err) => {
		console.error(`app.js === sequelize.sync == error = `, { err });
	});
