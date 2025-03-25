const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const leaderBoardSchema = new mongoose.Schema(
  {
    rank: {
      type: Number,
      required: true,
    },
    score: {
      type: Number, // Mongoose không có kiểu float, dùng Number thay thế
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId, // Dùng "Schema.Types.ObjectId" thay vì "Schema.ObjectId"
      ref: "User", // Thêm ref để liên kết với bảng "Category"
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId, // Dùng "Schema.Types.ObjectId" thay vì "Schema.ObjectId"
      ref: "Category", // Thêm ref để liên kết với bảng "Category"
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const LeaderBoard = mongoose.model("LeaderBoard", leaderBoardSchema);
module.exports = LeaderBoard;
