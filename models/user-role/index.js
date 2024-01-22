const Sequelize = require('sequelize')

const sequelize = require('./../../database')

const UserRole = sequelize.define('userRole', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
})

module.exports = UserRole
