const Sequelize = require("sequelize");

const sequelize = require("../../database");

const UserProfileImage = sequelize.define("userProfileImage", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  file_type: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  file_size: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  file_path: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  file_url: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = UserProfileImage;
