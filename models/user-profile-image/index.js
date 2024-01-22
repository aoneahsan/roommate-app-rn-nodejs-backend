const Sequelize = require('sequelize')

const sequelize = require('../../database')

const UserProfileImage = sequelize.define('userProfileImage', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	type: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	size: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	name: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	url: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	order: {
		type: Sequelize.STRING,
		allowNull: true,
	},
})

module.exports = UserProfileImage
