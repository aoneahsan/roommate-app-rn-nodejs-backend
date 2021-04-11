const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    full_name: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    tag_line: String,
    status: {
      type: String, //active | inactive | away
      required: false,
    },
    last_seen: {
      type: Date,
      required: false,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
    },
    contacts: {
      type: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
          is_favourite: {
            type: Boolean,
            default: false,
          },
          blocked: {
            type: Boolean,
            default: false,
          },
          is_friend: {
            type: Boolean,
            default: false,
          },
          is_colleague: {
            type: Boolean,
            default: false,
          },
          last_message: {
            type: Schema.Types.ObjectId,
            ref: "Message",
          },
        },
      ],
    },
    groups: {
      type: [
        {
          group: Schema.Types.ObjectId,
          is_favourite: {
            type: Boolean,
            default: false,
          },
          blocked: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
