const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const questionSchema = new mongoose.Schema(
  {
    questionContent: {
      type: String,
      // required: true,
    },
    answer: {
      type: String,
      required: true,
    },

    options: {
      type: [String],
      // required: true,
    },
    word: {
      type: String,
      //   required: true,
    },
    image: {
      type: String,
      //   required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    questionLevel: {
      type: String,
      required: true,
      enum: ["easy", "medium", "hard"], // Các mức độ: Dễ, Trung bình, Khó
    },
    questionTypeId: {
      type: Schema.Types.ObjectId, // Dùng "Schema.Types.ObjectId" thay vì "Schema.ObjectId"
      ref: "QuestionType", // Thêm ref để liên kết với bảng "Category"
      required: true,
    },
    topicId: {
      type: Schema.Types.ObjectId, // Dùng "Schema.Types.ObjectId" thay vì "Schema.ObjectId"
      ref: "Topic", // Thêm ref để liên kết với bảng "Category"
      // required: true,
    },
    vocabularyId: {
      type: Schema.Types.ObjectId, // Dùng "Schema.Types.ObjectId" thay vì "Schema.ObjectId"
      ref: "Vocabulary", // Thêm ref để liên kết với bảng "Category"
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
