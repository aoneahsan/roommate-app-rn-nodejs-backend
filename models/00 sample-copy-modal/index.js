const Sequelize = require("sequelize");

const sequelize = require("./../../database");

const MODAL_NAME = sequelize.define("MODAL_NAME", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = MODAL_NAME;
