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
      ref: "LearningGoadl", // Thêm ref để liên kết với bảng "Category"
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
    // status: String("pending" | "sent" | "dismissed"),
    //
  },
  {
    timestamps: true,
  }
);
const Reminder = mongoose.model("Reminder", reminderSchema);
module.exports = Reminder;
