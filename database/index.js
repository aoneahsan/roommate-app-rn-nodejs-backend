// Core Imports
const Sequelize = require("sequelize");

// Custom Imports
const CONFIG = require("./../config");

const sequelize = new Sequelize(
  CONFIG.DB_DETAILS.DB,
  CONFIG.DB_DETAILS.DB_USER,
  CONFIG.DB_DETAILS.DB_PASS,
  {
    host: CONFIG.DB_DETAILS.DB_HOST,
    dialect: CONFIG.DB_DETAILS.DB_DIALECT,
    port: CONFIG.DB_DETAILS.DB_PORT,
  }
);

module.exports = sequelize;
