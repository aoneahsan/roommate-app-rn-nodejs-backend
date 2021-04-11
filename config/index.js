let DB, DB_USER, DB_PASS, DB_HOST, DB_DIALECT, DB_PORT;
// const ACTIVE_DB_ENV = "local";
const ACTIVE_DB_ENV = "production";
if (ACTIVE_DB_ENV == "local") {
  DB = "nodejs_fiverr_roommate-app-db";
  DB_USER = "root";
  DB_PASS = "root";
  DB_HOST = "localhost";
  DB_DIALECT = "mysql";
  DB_PORT = 3306;
} else {
  DB = "nodejs_fiverr_roommate-app-db";
  DB_USER = "roommate";
  DB_PASS = "roommateroommate";
  DB_HOST = "roommate.cqsbgyke98wi.ap-southeast-1.rds.amazonaws.com";
  DB_DIALECT = "mysql";
  DB_PORT = 3306;
}

module.exports = {
  // Server Related Config
  SERVER_PORT: 80,

  // Database Config
  DB_DETAILS: {
    DB: DB,
    DB_USER: DB_USER,
    DB_PASS: DB_PASS,
    DB_HOST: DB_HOST,
    DB_PORT: DB_PORT,
    DB_DIALECT: DB_DIALECT,
  },

  // JWT Related Config
  JWT_SECRET: "JWT_SECRET, this should be uniqe and long for security reasons.",
  JWT_EXPIRE_TIME: "20 days",

  // Request Related Config
  HEADER_AUTH_KEY: "X-Authorization",

  // bcryptjs hash default lenght
  BCRYPTJS_HASH_LENGHT: 12,

  // Twilio Details
  TWILIO_SSID: "AC946841aa981127898b9ed08d314e6d43",
  TWILIO_TOKEN: "a53a9e6ab66dc82eca45ccc2d5483f7d",
  TWILIO_FROM_NUMBER: "+19414512860",

  // Default Models Data Config
  // Default Roles
  DEFAULT_ROLES: {
    admin: {
      title: "admin",
      description: "admin user role",
    },
    customer: {
      title: "customer",
      description: "customer user role",
    },
  },

  // Default Users
  DEFAULT_USERS: {
    admin: {
      name: "admin user",
      username: "admin",
      email: "admin@demo.com",
      password: "123456",
      online_status: "active",
      phone: "3046619706",
      country_code: "+92",
      // role: //this will be set automatically while creating default user
    },
    customer: {
      full_name: "customer user",
      username: "customer",
      email: "customer@demo.com",
      tag_line: "customer user of chat app",
      password: "123456",
      online_status: "active",
      phone: "3084618263",
      country_code: "+92",
      // role: //this will be set automatically while creating default user
    },
  },
};
