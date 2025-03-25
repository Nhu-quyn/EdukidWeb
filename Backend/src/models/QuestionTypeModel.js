const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const questionTypeSchema = new mongoose.Schema(
  {
    questionTypeId: {
      type: String,
      required: true,
    },
    questionTypeName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const QuestionType = mongoose.model("QuestionType", questionTypeSchema);
module.exports = QuestionType;
