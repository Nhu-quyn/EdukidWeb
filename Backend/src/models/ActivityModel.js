const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activitySchema = new mongoose.Schema(
  {
    activityId: {
      type: String,
    },
    activityName: {
      type: String,
      required: true,
    },
    activityDescription: {
      type: String,
    },
    // testTime: {
    //   type: String, // Lưu thời gian dưới dạng chuỗi "HH:mm:ss"
    //   validate: {
    //     validator: function (value) {
    //       return /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(value); // Định dạng 24 giờ
    //     },
    //     message: "testTime must be in HH:mm:ss format",
    //   },
    // },
    activityLevel: {
      type: String,
      enum: ["easy", "normal", "hard"],
      // required: true,
    },

    testTime: {
      type: Number, // Lưu số phút hoặc giây
      min: 0,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;
