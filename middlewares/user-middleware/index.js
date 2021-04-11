// Core Imports
const bcryptjs = require("bcryptjs");

// Custom Imports
const Role = require("./../../models/role");
const User = require("./../../models/user");
const CONFIG = require("./../../config");

module.exports = async (req, res, next) => {
  // get Default users data from config
  const adminData = CONFIG.DEFAULT_USERS.admin;
  const tutorData = CONFIG.DEFAULT_USERS.tutor;
  const studentData = CONFIG.DEFAULT_USERS.student;

  // search for default users in DB
  const defaultUsers = await User.find({
    username: ["admin", "tutor", "student"],
  });

  // get default users index
  const adminUserIndex = defaultUsers.findIndex((el) => el.username == "admin");
  const tutorUserIndex = defaultUsers.findIndex((el) => el.username == "tutor");
  const studentUserIndex = defaultUsers.findIndex(
    (el) => el.username == "student"
  );

  if (adminUserIndex < 0) {
    // get admin role id
    const adminRole = await Role.findOne({ title: "admin" });
    // create users pass
    const adminPass = await bcryptjs.hash(
      adminData.password,
      CONFIG.BCRYPTJS_HASH_LENGHT
    );
    await User.create({
      full_name: adminData.full_name,
      username: adminData.username,
      email: adminData.email,
      tag_line: adminData.tag_line,
      status: adminData.status,
      last_seen: adminData.last_seen,
      role: adminRole,
      password: adminPass,
      contacts: adminData.contacts,
      groups: adminData.groups,
    });
  }

  if (tutorUserIndex < 0) {
    // get tutor role id
    const tutorRole = await Role.findOne({ title: "tutor" });
    // create users pass
    const tutorPass = await bcryptjs.hash(
      tutorData.password,
      CONFIG.BCRYPTJS_HASH_LENGHT
    );
    await User.create({
      full_name: tutorData.full_name,
      username: tutorData.username,
      email: tutorData.email,
      tag_line: tutorData.tag_line,
      status: tutorData.status,
      last_seen: tutorData.last_seen,
      role: tutorRole,
      password: tutorPass,
      contacts: tutorData.contacts,
      groups: tutorData.groups,
    });
  }

  if (studentUserIndex < 0) {
    // get student role id
    const studentRole = await Role.findOne({ title: "student" });
    // create users pass
    const studentPass = await bcryptjs.hash(
      studentData.password,
      CONFIG.BCRYPTJS_HASH_LENGHT
    );
    await User.create({
      full_name: studentData.full_name,
      username: studentData.username,
      email: studentData.email,
      tag_line: studentData.tag_line,
      status: studentData.status,
      last_seen: studentData.last_seen,
      role: studentRole,
      password: studentPass,
      contacts: studentData.contacts,
      groups: studentData.groups,
    });
  }

  // console.log("user-middleware/index.js === defaultusers middleware done");
  return next();
};
