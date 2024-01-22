const Sequelize = require('sequelize')

const sequelize = require('./../../database')

const Role = sequelize.define('role', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	title: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	description: {
		type: Sequelize.STRING,
		allowNull: true,
	},
})

module.exports = Role
