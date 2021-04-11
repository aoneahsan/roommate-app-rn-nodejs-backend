// Core Imports

// Custom Imports
const Role = require("./../../models/role");
const CONFIG = require("./../../config");

module.exports = async (req, res, next) => {
  const adminRole = CONFIG.DEFAULT_ROLES.admin;
  const tutorRole = CONFIG.DEFAULT_ROLES.tutor;
  const studentRole = CONFIG.DEFAULT_ROLES.student;

  const defaultRoles = await Role.find({
    title: [adminRole.title, tutorRole.title, studentRole.title],
  });
  // console.log("role-middleware/index.js === mainfunction == ", {defaultRoles});
  const adminRoleIndex = defaultRoles.findIndex(
    (el) => el.title == adminRole.title
  );
  const tutorRoleIndex = defaultRoles.findIndex(
    (el) => el.title == tutorRole.title
  );
  const studentRoleIndex = defaultRoles.findIndex(
    (el) => el.title == studentRole.title
  );
  // creating admin role if does not exists
  if (adminRoleIndex < 0) {
    await Role.create({
      title: adminRole.title,
      description: adminRole.description,
    });
  }
  // creating tutor role if does not exists
  if (tutorRoleIndex < 0) {
    await Role.create({
      title: tutorRole.title,
      description: tutorRole.description,
    });
  }
  // creating student role if does not exists
  if (studentRoleIndex < 0) {
    await Role.create({
      title: studentRole.title,
      description: studentRole.description,
    });
  }

  return next();
};
