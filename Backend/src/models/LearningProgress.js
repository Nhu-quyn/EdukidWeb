const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const learningProgressSchema = new mongoose.Schema(
  {
    percentComplete: {
      type: Number,
      required: true,
    },
    score: {
      type: Number, // Mongoose không có kiểu float, dùng Number thay thế
      required: true,
    },
    lastUpdate: {
      type: Date, // Mongoose không có kiểu float, dùng Number thay thế
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId, // Dùng "Schema.Types.ObjectId" thay vì "Schema.ObjectId"
      ref: "User", // Thêm ref để liên kết với bảng "Category"
      required: true,
    },
    activityId: {
      type: Schema.Types.ObjectId, // Dùng "Schema.Types.ObjectId" thay vì "Schema.ObjectId"
      ref: "Activity", // Thêm ref để liên kết với bảng "Category"
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const LearningProgress = mongoose.model(
  "LearningProgress",
  learningProgressSchema
);
module.exports = LearningProgress;
