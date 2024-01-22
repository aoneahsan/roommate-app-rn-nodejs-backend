// Core Imports
const Sequelize = require('sequelize')

// Custom Imports
const Role = require('./../../models/role')
const User = require('./../../models/user')
const CONFIG = require('./../../config')

module.exports = async (req, res, next) => {
	try {
		// get Default users data from config
		const adminData = CONFIG.DEFAULT_USERS.admin
		const customerData = CONFIG.DEFAULT_USERS.customer

		// search for default users in DB
		const defaultUsers = await User.findAll({
			where: {
				username: {
					[Sequelize.Op.in]: ['admin', 'customer'],
				},
			},
		})

		// get default users index
		const adminUserIndex = defaultUsers.findIndex(
			(el) => el.username == 'admin'
		)
		const customerUserIndex = defaultUsers.findIndex(
			(el) => el.username == 'customer'
		)

		let availableRoles = null
		if (adminUserIndex < 0) {
			// get admin role id
			availableRoles = await Role.findAll()
			const adminRole = availableRoles.find((el) => el.title == 'admin')
			const createdAdminUser = await User.create({
				username: adminData.username,
				name: adminData.name,
				phone: adminData.phone,
				country_code: adminData.country_code,
				status: adminData.status,
				age: adminData.age,
				gender: adminData.gender,
				constellations: adminData.constellations,
				hometown: adminData.hometown,
				language: adminData.language,
			})
			await createdAdminUser.addRole(adminRole)
		}

		if (customerUserIndex < 0) {
			if (!availableRoles) {
				availableRoles = await Role.findAll()
			}
			// get customer role id
			const customerRole = availableRoles.find((el) => el.title == 'customer')
			const createdCustomer = await User.create({
				username: customerData.username,
				name: customerData.name,
				status: customerData.status,
				phone: customerData.phone,
				country_code: customerData.country_code,
				age: customerData.age,
				gender: customerData.gender,
				constellations: customerData.constellations,
				hometown: customerData.hometown,
				language: customerData.language,
			})
			await createdCustomer.addRole(customerRole)
		}

		return next()
	} catch (error) {
		return next(error)
	}
}
