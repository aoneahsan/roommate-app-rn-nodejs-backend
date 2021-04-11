const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    body: {
      type: String,
      required: true,
    },
    file_path: {
      type: String,
    },
    sender_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reciver_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    group_id: {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
    is_direct_message: {
      type: Boolean,
      default: true,
    },
    is_forwarded_message: {
      type: Boolean,
      default: false,
    },
    quoted_message_id: {
      type: Schema.Types.ObjectId, // reply of a message
      ref: "Message",
    },
    type: {
      type: String,
      default: "text", // text | image | video | link | file(any file zip, doc any format (except image/video))
    },
    read_by: {
      type: [
        {
          user: {
            type: Schema.Types.ObjectId,
          },
          read_at: Date,
        },
      ],
    },
    reactions: {
      type: [
        {
          user: Schema.Types.ObjectId,
          reaction: String,
          created_at: Date,
          updated_at: Date,
        },
      ],
    },
    status: {
      type: String, // send, received | seen,
      default: "send",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
