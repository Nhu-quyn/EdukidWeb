const LearningGoalService = require("../services/LearningGoalService");

const createLearningGoal = async (req, res) => {
  try {
    const { userId, targetWords, targetTimes, repeat, startDate, status } =
      req.body;
    // console.log(req.body);
    // Kiểm tra trường bắt buộc
    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "User ID is required",
      });
    }

    // Gọi service để tạo mục tiêu học tập
    const result = await LearningGoalService.createLearningGoal(
      userId,
      targetWords,
      targetTimes,
      repeat,
      startDate,
      status
    );
    // console.log(result);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal Server Error",
    });
  }
};
const getAllLearningGoal = async (req, res) => {
  try {
    const userId = req.params.userId;
    // console.log(req.body);
    // Kiểm tra trường bắt buộc
    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "User ID is required",
      });
    }

    // Gọi service để tạo mục tiêu học tập
    const result = await LearningGoalService.getAllLearningGoal(userId);
    // console.log(result);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal Server Error",
    });
  }
};
const updateStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    // console.log(req.body);
    // Kiểm tra trường bắt buộc
    if (!id) {
      return res.status(400).json({
        status: "ERR",
        message: "ID is required",
      });
    }

    // Gọi service để tạo mục tiêu học tập
    const result = await LearningGoalService.updateStatus(id, status);
    // console.log(result);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal Server Error",
    });
  }
};

module.exports = { createLearningGoal, getAllLearningGoal, updateStatus };
