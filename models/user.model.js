const mongoose = require("mongoose");
const generate = require("../helpers/generate");
const userSchema = new mongoose.Schema(
  {
    fullname: String,
    email: String,
    password: String,
    tokenUser: {
      type: String,
      default: () => generate.generateRandomString(30),
    },
    phone: String,
    avatar: String,
    status: {
      type: String,
      default: "active",
    },
    requestFriends: Array,
    acceptFriends: Array,
    friendList: [
      {
        user_id: String,
        room_chat_id: String,
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
