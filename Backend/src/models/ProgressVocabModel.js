const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const progressVocabSchema = new mongoose.Schema(
  {
    hasLearned: {
      type: Boolean,
      required: true,
      default: false,
    },
    priorityLevel: {
      type: String,
      required: true,
      enum: ["normal", "high"],
      default: "normal",
    },
    studyDate: {
      type: Date, // Mongoose không có kiểu float, dùng Number thay thế
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId, // Dùng "Schema.Types.ObjectId" thay vì "Schema.ObjectId"
      ref: "User", // Thêm ref để liên kết với bảng "Category"
      required: true,
    },
    vocabularyId: {
      type: Schema.Types.ObjectId, // Dùng "Schema.Types.ObjectId" thay vì "Schema.ObjectId"
      ref: "Vocabulary", // Thêm ref để liên kết với bảng "Category"
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const ProgressVocab = mongoose.model("ProgressVocab", progressVocabSchema);
module.exports = ProgressVocab;
