const LearningGoal = require("../models/LearningGoalModel");
const Reminder = require("../models/ReminderModel");
const User = require("../models/UserModel");
const createLearningGoal = (
  userId,
  targetWords,
  targetTimes,
  repeat,
  startDate,
  status
) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log("userId", userId);
      const checkUser = await User.findById(userId);
      // console.log(checkUser);
      if (!checkUser) {
        return resolve({
          status: "ERR",
          message: "User không tồn tại",
        });
      }

      // // Kiểm tra xem mục tiêu học tập của user đã tồn tại chưa
      // const existingGoal = await LearningGoal.findOne({ userId });

      // if (existingGoal) {
      //   return resolve({
      //     status: "ERR",
      //     message: "Mục tiêu học tập đã tồn tại cho người dùng này",
      //     data: existingGoal,
      //   });
      // }
      console.log("startDate:", startDate); // Kiểm tra giá trị của startDate
      console.log("Loại của startDate:", typeof startDate);

      const newGoal = await LearningGoal.create({
        userId: checkUser._id,
        targetWords,
        targetTimes,
        repeatDaily: repeat,
        startDate: startDate ? new Date(startDate) : null, // Chuyển thành Date object
        status: status,
      });
      console.log(newGoal);
      // Danh sách lời nhắc cần tạo
      const reminders = [];

      // Nếu có targetWords → Tạo lời nhắc về số từ cần học
      if (targetWords) {
        reminders.push({
          learningGoalId: newGoal._id,
          reminderTitle: "📚 Hôm nay học từ vựng gì nhỉ?",
          reminderContent: `Mục tiêu hôm nay là học ${targetWords} từ mới. Hãy cùng nhau học tập thật vui nhé!`,
          date: new Date(), // Nhắc ngay khi tạo
          status: "pending",
        });
      }

      // Nếu có targetTimes → Tạo thêm lời nhắc theo thời gian học
      if (targetTimes) {
        const [hours, minutes] = targetTimes.split(":").map(Number);
        const combinedReminderDate = new Date();
        combinedReminderDate.setHours(hours, minutes, 0, 0); // Đặt thời gian nhắc nhở

        reminders.push({
          learningGoalId: newGoal._id,
          reminderTitle: "📅 Đến giờ học rồi!",
          reminderContent: `Đến ${targetTimes}, hãy dành thời gian học từ vựng để đạt mục tiêu nhé! Cố gắng lên nào!`,
          date: new Date(),
          status: "pending",
        });
      }

      // Tạo tất cả lời nhắc
      const createdReminders = await Reminder.insertMany(reminders);

      resolve({
        status: "OK",
        message: "Tạo mục tiêu học tập thành công",
        data: {
          learningGoal: newGoal,
          reminders: createdReminders,
        },
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Lỗi hệ thống",
      });
    }
  });
};
const getAllLearningGoal = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const learningGoals = await LearningGoal.find({ userId });
      resolve({
        status: "OK",
        message: "Lấy danh sách mục tiêu học tập thành công",
        data: learningGoals,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Lỗi hệ thống",
      });
    }
  });
};
const updateStatus = (id, status) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updatedGoal = await LearningGoal.findByIdAndUpdate(
        id,
        {
          status,
          ...(status === "paused" && { repeat: false }), // Nếu status là "paused", cập nhật repeat = false
        },
        { new: true }
      );
      await Reminder.findOneAndUpdate(
        { learningGoalId: id },
        {
          status: "pending",
          sentCount: 0,
        },
        { new: true }
      );

      resolve({
        status: "OK",
        message: "Cập nhật trạng thái mục tiêu học tập thành công",
        data: updatedGoal,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Lỗi hệ thống",
      });
    }
  });
};
const deleteLearningGoal = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const deletedGoal = await LearningGoal.findByIdAndDelete(id);
      if (!deletedGoal) {
        return resolve({
          status: "ERR",
          message: "Không tìm thấy mục tiêu học tập để xóa",
        });
      }

      await Reminder.deleteMany({ learningGoalId: id });
      resolve({
        status: "OK",
        message: "Xóa mục tiêu học tập thành công",
        data: deletedGoal,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Lỗi hệ thống",
      });
    }
  });
};
const updateLearningGoal = async (id, data) => {
  try {
    // Loại bỏ các trường không cần thiết nếu tồn tại
    const removeFields = ["_id", "__v", "createdAt", "updatedAt"];
    const cleanData = { ...data };

    removeFields.forEach((field) => {
      if (field in cleanData) {
        delete cleanData[field];
      }
    });

    const updatedGoal = await LearningGoal.findByIdAndUpdate(id, cleanData, {
      new: true,
    });

    return {
      status: "OK",
      message: "Cập nhật mục tiêu học tập thành công",
      data: updatedGoal,
    };
  } catch (error) {
    return {
      status: "ERROR",
      message: "Có lỗi xảy ra khi cập nhật mục tiêu học tập",
      error: error.message,
    };
  }
};

//check trước rồi hẳn tạo (check Date đến chưa => tạo reminders để gửi mail)
module.exports = {
  createLearningGoal,
  getAllLearningGoal,
  updateStatus,
  deleteLearningGoal,
  updateLearningGoal,
};
