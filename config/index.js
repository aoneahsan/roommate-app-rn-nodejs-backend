let DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_DIALECT, DB_PORT, SERVER_PORT
const ACTIVE_DB_ENV = 'local'
// const ACTIVE_DB_ENV = "production";

if (ACTIVE_DB_ENV == 'local') {
	DB_NAME = 'nodejs_personal_roommate-app-v2'
	DB_USER = 'root'
	DB_PASS = ''
	DB_HOST = 'localhost'
	DB_DIALECT = 'mysql'
	DB_PORT = 3306
	SERVER_PORT = 3020
} else {
	DB_NAME = ''
	DB_USER = ''
	DB_PASS = ''
	DB_HOST = ''
	DB_DIALECT = 'mysql'
	DB_PORT = 3306

	SERVER_PORT = 3020
}

module.exports = {
	// Server Related Config
	SERVER_PORT: SERVER_PORT,

	// Database Config
	DB_DETAILS: {
		DB: DB_NAME,
		DB_USER: DB_USER,
		DB_PASS: DB_PASS,
		DB_HOST: DB_HOST,
		DB_PORT: DB_PORT,
		DB_DIALECT: DB_DIALECT,
	},

	// JWT Related Config
	JWT_SECRET:
		'Ahsan Mahmood - Aoneahsan - Manager and Team Lead Here at Zaions Software House - Portfolio Website (https://aoneahsan.com) - Business Website: (https://zaions.com) - Contact Us Now: +923046619706',
	JWT_EXPIRE_TIME: '20 days',

	// Request Related Config
	HEADER_AUTH_KEY: 'X-Authorization',

	// bcryptjs hash default lenght
	BCRYPTJS_HASH_LENGHT: 12,

	// Twilio Details
	TWILIO_SSID: '',
	TWILIO_TOKEN: '',
	TWILIO_FROM_NUMBER: '',

	// AWS Details
	AWS_ACCESS_KEY: '',
	AWS_SECRET_KEY: '',
	AWS_S3_BUCKET_NAME: '',
	AWS_S3_BUCKET_REGION: '',

	// AWS SNS Details
	AWS_SNS_ACCESS_KEY: '',
	AWS_SNS_SECRET_KEY: '',
	AWS_SNS_REGION: '',

	// Default Models Data Config
	// Default Roles
	DEFAULT_ROLES: {
		admin: {
			title: 'admin',
			description: 'admin user role',
		},
		customer: {
			title: 'customer',
			description: 'customer user role',
		},
	},

	// Default Users
	DEFAULT_USERS: {
		admin: {
			name: 'Ahsan Mahmood',
			username: 'aoneahsan',
			email: 'aoneahsan@gmail.com',
			tag_line: 'SaaS App Developer - Portfolio (https://aoneahsan.com)',
			password: '123456',
			online_status: 'active',
			phone: '3046619706',
			country_code: '92',
			age: '25-30',
			gender: 'female',
			constellations: 'Aries',
			hometown: 'Ontario2',
			language: 'English',
			// role: //this will be set automatically while creating default user
		},
		customer: {
			name: 'Zaions Company',
			username: 'zaions',
			email: 'hello@zaions.com',
			tag_line: 'Software Development House Visit us at (https://zaions.com)',
			password: '123456',
			online_status: 'active',
			phone: '3084618263',
			country_code: '92',
			age: '30-35',
			gender: 'male',
			constellations: 'Aries',
			hometown: 'Ontario2',
			language: 'Franch',
			// role: //this will be set automatically while creating default user
		},
	},
}
