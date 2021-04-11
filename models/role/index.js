const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roleSchema = new Schema(
  {
    title: String,
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);
