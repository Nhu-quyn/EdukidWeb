const LearningGoal = require("../models/LearningGoalModel");
const Reminder = require("../models/ReminderModel");

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
      // Kiểm tra xem mục tiêu học tập của user đã tồn tại chưa
      const existingGoal = await LearningGoal.findOne({ userId });

      if (existingGoal) {
        return resolve({
          status: "ERR",
          message: "Mục tiêu học tập đã tồn tại cho người dùng này",
          data: existingGoal,
        });
      }

      // Tạo mới mục tiêu học tập
      const newGoal = await LearningGoal.create({
        userId,
        targetWords,
        targetTimes,
        repeatDaily: repeat,
        startDate,
        status,
      });

      // Danh sách lời nhắc cần tạo
      const reminders = [];

      // Nếu có targetWords → Tạo lời nhắc về số từ cần học
      if (!targetTimes && targetWords) {
        reminders.push({
          learningGoalId: newGoal._id,
          reminderTitle: "📚 Nhắc nhở học từ vựng!",
          reminderContent: `Bạn đã đặt mục tiêu học ${targetWords} từ mới. Đừng quên ôn tập nhé!`,
          date: new Date(), // Nhắc ngay khi tạo
          status: "pending",
        });
      }

      // Nếu có targetTimes → Tạo lời nhắc theo thời gian học
      if (targetTimes && !targetWords) {
        const [hours, minutes] = targetTimes.split(":").map(Number);
        const reminderDate = new Date();
        reminderDate.setHours(hours, minutes, 0, 0); // Đặt thời gian nhắc nhở

        reminders.push({
          learningGoalId: newGoal._id,
          reminderTitle: "⏰ Đến giờ học rồi!",
          reminderContent: `Đã đến ${targetTimes}, đừng quên dành thời gian học từ vựng nhé!`,
          date: reminderDate,
          status: "pending",
        });
      }

      // Nếu có cả hai → Tạo thêm lời nhắc kết hợp
      if (targetWords && targetTimes) {
        const [hours, minutes] = targetTimes.split(":").map(Number);
        const combinedReminderDate = new Date();
        combinedReminderDate.setHours(hours, minutes, 0, 0); // Đặt thời gian nhắc nhở

        reminders.push({
          learningGoalId: newGoal._id,
          reminderTitle: "📅 Kế hoạch học tập hôm nay!",
          reminderContent: `Hôm nay bạn cần học ${targetWords} từ mới vào lúc ${targetTimes}. Hãy đảm bảo hoàn thành mục tiêu nhé!`,
          date: combinedReminderDate,
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

module.exports = {
  createLearningGoal,
};
