const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const activityQuestionSchema = new mongoose.Schema(
  {
    activityId: {
      type: Schema.Types.ObjectId, // Dùng "Schema.Types.ObjectId" thay vì "Schema.ObjectId"
      ref: "Activity", // Thêm ref để liên kết với bảng ""
      required: true,
    },
    questionId: {
      type: Schema.Types.ObjectId, // Dùng "Schema.Types.ObjectId" thay vì "Schema.ObjectId"
      ref: "Question", // Thêm ref để liên kết với bảng ""
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const ActivityQuestion = mongoose.model(
  "ActivityQuestion",
  activityQuestionSchema
);
module.exports = ActivityQuestion;
