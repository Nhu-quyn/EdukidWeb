const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const learningGoalSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      // Liên kết với bảng User để xác định người dùng đặt mục tiêu học tập
    },
    targetWords: {
      type: Number,
      // Số lượng từ vựng mục tiêu mà người dùng muốn học
    },
    targetTimes: {
      type: String, // Lưu dưới dạng "HH:mm"
      // Thời gian mục tiêu học tập mỗi ngày (giờ:phút)
    },
    repeatDaily: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: Date,
      required: true,
      // Ngày bắt đầu thực hiện mục tiêu học tập
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "completed", "paused"], // Chỉ cho phép 3 giá trị này
      default: "active", // Mặc định là "active"
      // Trạng thái của mục tiêu học tập:
      // - "active": Mục tiêu đang được thực hiện
      // - "completed": Mục tiêu đã hoàn thành
      // - "paused": Mục tiêu đang tạm dừng
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const LearningGoal = mongoose.model("LearningGoal", learningGoalSchema);
module.exports = LearningGoal;
