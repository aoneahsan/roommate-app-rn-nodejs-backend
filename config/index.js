const DB = "chat";
const DB_USER = "ahsan";
const DB_PASS = "xshuZ8COLgL09x3n";

module.exports = {
  // Server Related Config
  SERVER_PORT: 3020,

  // MongoDB Related Config
  MONGODB_URI: `mongodb+srv://${DB_USER}:${DB_PASS}@ivylab.x3o5y.mongodb.net/${DB}?retryWrites=true&w=majority`,
  DB_DETAILS: {
    DB: DB,
    DB_USER: DB_USER,
    DB_PASS: DB_PASS,
  },

  // GraphQL Realated Config
  GRAPHQL_URL: "/graphql",

  // JWT Related Config
  JWT_SECRET:
    "JWT_SECRET, this should be uniqe and long for security reasons.",
  JWT_EXPIRE_TIME: "3h",

  // Request Related Config
  HEADER_AUTH_KEY: "X-Authorization",

  // bcryptjs hash default lenght
  BCRYPTJS_HASH_LENGHT: 12,

  // Default Models Data Config
  // Default Roles
  DEFAULT_ROLES: {
    admin: {
      title: "admin",
      description: "admin user",
    },
    tutor: {
      title: "tutor",
      description: "tutor user",
    },
    student: {
      title: "student",
      description: "student user",
    },
  },

  // Default Users
  DEFAULT_USERS: {
    admin: {
      full_name: "admin user",
      username: "admin",
      email: "admin@demo.com",
      tag_line: "admin user of chat app",
      password: "123456",
      status: "active",
      last_seen: new Date(),
      // role: //this will be set automatically while creating default user
      contacts: [],
      groups: [],
    },
    tutor: {
      full_name: "tutor user",
      username: "tutor",
      email: "tutor@demo.com",
      tag_line: "tutor user of chat app",
      password: "123456",
      status: "inactive",
      last_seen: new Date(),
      // role: //this will be set automatically while creating default user
      contacts: [],
      groups: [],
    },
    student: {
      full_name: "student user",
      username: "student",
      email: "student@demo.com",
      tag_line: "student user of chat app",
      password: "123456",
      status: "away",
      last_seen: new Date(),
      // role: //this will be set automatically while creating default user
      contacts: [],
      groups: [],
    },
  },
};
