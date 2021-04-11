const Sequelize = require("sequelize");

const sequelize = require("./../../database");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  country_code: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  age: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  gender: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  constellations: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  hometown: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  language: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  profile_image: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  phone_verify_code: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  phone_verify_code_expireIn: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  online_status: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = User;
