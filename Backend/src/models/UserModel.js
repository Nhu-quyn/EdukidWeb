const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema(
  {
    // topicId: {
    //   type: Number,
    //   required: true,
    // },
    username: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      //   required: true,
    },
    parentEmail: {
      type: String,
      //   required: true,
    },
    password: {
      type: String,
      //   required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isOAuth: {
      type: Boolean,
      required: true,
      default: false,
    },
    accessToken: {
      type: String,
      // required: true,
    },
    refreshToken: {
      type: String,
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);
module.exports = User;
