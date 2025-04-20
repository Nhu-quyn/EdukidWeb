const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reminderSchema = new mongoose.Schema(
  {
    // topicId: {
    //   type: Number,
    //   required: true,
    // },
    learningGoalId: {
      type: Schema.Types.ObjectId, // Dùng "Schema.Types.ObjectId" thay vì "Schema.ObjectId"
      ref: " LearningGoal", // Thêm ref để liên kết với bảng "Category"
      required: true,
    },
    reminderTitle: {
      type: String,
      required: true,
    },
    reminderContent: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    sentCount: {
      type: Number,
      default: 0,
    },
    lastSentAt: {
      type: Date,
      default: null, // Lưu trữ thời gian gửi gần nhất
    },
    // status: String("pending" | "sent" | "dismissed"),
    //
  },
  {
    timestamps: true,
  }
);
const Reminder = mongoose.model("Reminder", reminderSchema);
module.exports = Reminder;
