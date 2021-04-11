const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const personalNoteSchema = new Schema(
  {
    title: String,
    decription: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PersonalNote", personalNoteSchema);
