const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const vocabularySchema = new mongoose.Schema(
  {
    topicId: {
      type: Schema.Types.ObjectId, // Dùng "Schema.Types.ObjectId" thay vì "Schema.ObjectId"
      ref: "Topic", // Thêm ref để liên kết với bảng "Category"
      required: true,
    },
    vocabulary: {
      type: String,
      required: true,
    },
    meaning: {
      type: String,
      required: true,
    },
    partOfSpeech: {
      type: String,
      required: true,
    },
    vocabularyImage: {
      type: String,
      required: true,
    },
    vocabularyIpa: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Vocabulary = mongoose.model("Vocabulary", vocabularySchema);
module.exports = Vocabulary;
