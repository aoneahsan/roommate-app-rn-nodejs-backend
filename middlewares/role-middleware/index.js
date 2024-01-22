// Core Imports
const Sequelize = require('sequelize')

// Custom Imports
const Role = require('./../../models/role')
const CONFIG = require('./../../config')

module.exports = async (req, res, next) => {
	const adminRole = CONFIG.DEFAULT_ROLES.admin
	const customerRole = CONFIG.DEFAULT_ROLES.customer

	const defaultRoles = await Role.findAll({
		where: {
			title: {
				[Sequelize.Op.in]: [adminRole.title, customerRole.title],
			},
		},
	})

	const adminRoleIndex = defaultRoles.findIndex(
		(el) => el.title == adminRole.title
	)
	const customerRoleIndex = defaultRoles.findIndex(
		(el) => el.title == customerRole.title
	)
	// creating admin role if does not exists
	if (adminRoleIndex < 0) {
		await Role.create({
			title: adminRole.title,
			description: adminRole.description,
		})
	}
	// creating customer role if does not exists
	if (customerRoleIndex < 0) {
		await Role.create({
			title: customerRole.title,
			description: customerRole.description,
		})
	}

	return next()
}
