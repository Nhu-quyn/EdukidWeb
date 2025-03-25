const cron = require("node-cron");
const Reminder = require("../models/ReminderModel");
const LearningGoal = require("../models/LearningGoalModel");
const User = require("../models/UserModel");
const sendEmail = require("./emailService");

// Hàm kiểm tra và gửi email lời nhắc
const checkReminders = async () => {
  const now = new Date();
  now.setSeconds(0, 0); // Loại bỏ giây và milliseconds để so sánh chính xác

  try {
    // Lấy tất cả lời nhắc cần gửi
    const reminders = await Reminder.find({
      date: { $lte: now },
      status: "pending",
    }).populate({
      path: "learningGoalId",
      populate: { path: "userId", select: "email parentEmail" },
    });

    for (const reminder of reminders) {
      if (!reminder.learningGoalId || !reminder.learningGoalId.userId) {
        console.warn("⚠️ Không tìm thấy user cho lời nhắc:", reminder._id);
        continue;
      }

      const user = reminder.learningGoalId.userId;
      const learningGoalId = reminder.learningGoalId._id;
      const emailsToSend = [];

      if (user.email) emailsToSend.push(user.email);
      if (user.parentEmail) emailsToSend.push(user.parentEmail);

      if (emailsToSend.length === 0) {
        console.warn(`❌ Không có email để gửi cho lời nhắc ${reminder._id}`);
        continue;
      }

      console.log(
        `🔔 Gửi lời nhắc: ${reminder.reminderTitle} đến ${emailsToSend.join(
          ", "
        )}`
      );

      try {
        // Gửi email
        for (const email of emailsToSend) {
          await sendEmail(
            email,
            reminder.reminderTitle,
            reminder.reminderContent
          );
        }

        // Cập nhật trạng thái của Reminder thành "sent"
        await Reminder.findByIdAndUpdate(reminder._id, { status: "sent" });

        // Kiểm tra xem LearningGoal đã hoàn tất tất cả lời nhắc chưa
        const remainingReminders = await Reminder.countDocuments({
          learningGoalId: learningGoalId,
          status: "pending",
        });

        if (remainingReminders === 0) {
          // Nếu không còn lời nhắc nào "pending", cập nhật trạng thái của LearningGoal
          //   await LearningGoal.findByIdAndUpdate(learningGoalId, {
          //     status: "completed",
          //   });
          console.log(`✅ LearningGoal ${learningGoalId} đã hoàn thành!`);
        }
      } catch (emailError) {
        console.error(`❌ Lỗi gửi email:`, emailError);
      }
    }
  } catch (error) {
    console.error("❌ Lỗi khi kiểm tra lời nhắc:", error);
  }
};

// Kiểm tra mỗi phút (cho lời nhắc dựa trên TargetTimes)
cron.schedule("* * * * *", async () => {
  console.log("⏳ Kiểm tra lời nhắc mỗi phút...");
  await checkReminders();
});

// Kiểm tra hàng ngày lúc 8:30 sáng
cron.schedule("30 8 * * *", async () => {
  console.log("📅 Kiểm tra lời nhắc hàng ngày...");
  await checkReminders();
});
