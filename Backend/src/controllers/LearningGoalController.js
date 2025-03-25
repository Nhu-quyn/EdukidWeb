const LearningGoalService = require("../services/LearningGoalService");

const createLearningGoal = async (req, res) => {
  try {
    const { userId, targetWords, targetTimes, repeat, startDate, status } =
      req.body;

    // Kiểm tra trường bắt buộc
    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "User ID is required",
      });
    }

    // Gọi service để tạo mục tiêu học tập
    const result = await LearningGoalService.createLearningGoal({
      userId,
      targetWords,
      targetTimes,
      repeat,
      startDate,
      status,
    });

    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal Server Error",
    });
  }
};

module.exports = { createLearningGoal };
