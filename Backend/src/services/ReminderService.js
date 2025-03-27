const cron = require("node-cron");
const mongoose = require("mongoose");
const LearningGoal = require("../models/LearningGoalModel");
const Reminder = require("../models/ReminderModel");
const sendEmail = require("./emailService");

// Hàm kiểm tra và gửi email lời nhắc
const check = async () => {
  try {
    console.log("tới đấy");
    const reminders = await Reminder.find();
    console.log(reminders);
    console.log("tới đấy");
  } catch (error) {
    console.error("❌ Lỗi khi kiểm tra lời nhắc:", error);
  }
};
const checkTargetWords = async () => {
  try {
    const activeGoals = await LearningGoal.find({
      status: "active",
      targetWords: { $gt: 0 }, // Chỉ lấy những mục tiêu có targetWords > 0
    });

    if (!activeGoals.length) {
      console.log("⏳ Không có mục tiêu học tập hợp lệ.");
      return;
    }

    // Lấy ngày hiện tại (chỉ lấy phần ngày, không tính giờ)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const goal of activeGoals) {
      const { userId, targetWords } = goal;

      if (!userId) {
        console.log(`⚠️ Bỏ qua mục tiêu ${goal._id} do thiếu userId.`);
        continue;
      }

      // Đếm số từ vựng user đã học trong ngày hôm nay
      const learnedWordsCount = await ProgressVocab.countDocuments({
        userId: userId,
        date: today,
      });

      if (learnedWordsCount >= targetWords) {
        await LearningGoal.findByIdAndUpdate(goal._id, { status: "complete" });
        console.log(
          `✅ Mục tiêu ${goal._id} đã hoàn thành (${learnedWordsCount}/${targetWords} từ)!`
        );
      } else {
        console.log(
          `📌 Mục tiêu ${goal._id} chưa đạt (${learnedWordsCount}/${targetWords} từ).`
        );
      }
    }

    console.log("🏁 Kiểm tra mục tiêu học tập hoàn tất.");
  } catch (error) {
    console.error("❌ Lỗi khi kiểm tra targetWords:", error);
  }
};

const getActiveLearningProgress = async () => {
  try {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Đặt giờ phút giây về 0 để so sánh chính xác

    const activeLearningProgress = await LearningGoal.find({
      status: "active",

      // { startDate: now }, // Nếu là ngày hiện tại => không cần repeat
      // { startDate: { $lt: now }, repeat: true }, // Nếu là ngày trước đó => cần repeat = true
      startDate: { $lte: now },
    });

    // console.log("🎯 Learning Progress hợp lệ:", activeLearningProgress);
    return activeLearningProgress;
  } catch (error) {
    console.error("❌ Lỗi khi lấy learningProgress:", error);
    return [];
  }
};
// Hàm kiểm tra và tạo lời nhắc nếu chưa có

const generateRemindersForActiveGoals = async () => {
  try {
    const activeGoals = await getActiveLearningProgress();
    if (!activeGoals.length) {
      console.log("⏳ Không có LearningGoal nào hợp lệ.");
      return [];
    }

    const reminders = await Promise.all(
      activeGoals.map(async (goal) => {
        const existingReminder = await Reminder.findOne({
          learningGoalId: goal._id,
        });

        // if (!existingReminder) {
        //   const goalName = "Mục tiêu học tập";
        //   const { targetWords, targetTimes } = goal;

        //   // 🏷️ Xây dựng reminderTitle dựa trên targetWords & targetTime
        //   let reminderTitle = "📚 Nhắc nhở học tập từ vựng của bạn";
        //   if (targetWords && targetTimes) {
        //     reminderTitle = `🎯 Học ${targetWords} từ vào lúc ${targetTimes}!`;
        //   } else if (targetWords) {
        //     reminderTitle = `📝 Học ${targetWords} từ hôm nay!`;
        //   } else if (targetTimes) {
        //     reminderTitle = `⏰ Đến giờ học vào ${targetTimes}!`;
        //   }

        //   // 📌 Xây dựng reminderContent linh hoạt
        //   let reminderContent = `Đừng quên hoàn thành mục tiêu học tập của bạn hôm nay!`;
        //   if (targetWords && targetTimes) {
        //     reminderContent = `Hãy nhớ học ${targetWords} từ vựng vào lúc ${targetTimes} nhé!`;
        //   } else if (targetWords) {
        //     reminderContent = `Đừng quên hôm nay bạn cần học ${targetWords} từ vựng nhé!`;
        //   } else if (targetTimes) {
        //     reminderContent = `Đừng quên học vào lúc ${targetTimes} hôm nay nhé!`;
        //   }

        //   const newReminder = new Reminder({
        //     learningGoalId: goal._id,
        //     reminderTitle,
        //     reminderContent,
        //     date: new Date(), // Ngày hiện tại
        //     status: "pending",
        //   });

        //   await newReminder.save();
        //   console.log(`✅ Tạo Reminder mới: ${reminderTitle}`);
        //   return newReminder;
        // }
        //  else {
        //   console.log(
        //     `🔔 Reminder đã tồn tại cho mục tiêu "${
        //       goal.name || "Chưa có tên"
        //     }"`
        //   );
        //   return existingReminder;
        // }
      })
    );

    console.log("🎯 Hoàn thành kiểm tra/tạo Reminders.");
    console.log(reminders);
    return reminders;
  } catch (error) {
    console.error("❌ Lỗi khi tạo Reminder:", error);
    return [];
  }
};

const getPendingRemindersFromGenerated = async () => {
  try {
    // Gọi hàm để tạo hoặc lấy danh sách reminders
    // const generatedReminders = await generateRemindersForActiveGoals();
    // console.log("generatedReminders", generatedReminders);
    // if (!generatedReminders.length) {
    //   console.log("⏳ Không có Reminder nào được tạo.");
    //   return [];
    // }
    // // console.log(generatedReminders);

    // // Lấy danh sách _id của reminders vừa tạo
    // const reminderIds = generatedReminders.map((reminder) => reminder._id);
    // console.log(reminderIds);
    // Tìm các reminders có trạng thái "pending" từ danh sách trên
    // const pendingReminders = await Reminder.find({
    //   _id: { $in: reminderIds },
    //   status: "pending",
    // }).populate({
    //   path: "learningGoalId",
    //   populate: { path: "userId" }, // Populate luôn userId của LearningGoal
    // });
    const pendingReminders = await Reminder.aggregate([
      {
        $match: {
          // _id: { $in: reminderIds },
          status: "pending",
        },
      },
      {
        $lookup: {
          from: "learninggoals", // Tên collection của LearningGoal
          localField: "learningGoalId",
          foreignField: "_id",
          as: "learningGoal",
        },
      },
      { $unwind: "$learningGoal" },
      {
        $match: {
          "learningGoal.status": "active", // Điều kiện cho learningGoalId
        },
      },
      {
        $lookup: {
          from: "users", // Tên collection của User
          localField: "learningGoal.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
    ]);
    console.log(pendingReminders);

    if (!pendingReminders.length) {
      console.log("🔕 Không có Reminder nào đang chờ xử lý.");
      return [];
    }

    console.log(
      `📌 Tìm thấy ${pendingReminders.length} Reminder(s) đang chờ xử lý.`
    );
    return pendingReminders;
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách Reminder pending:", error);
    return [];
  }
};
const updateLearningProgressEndOfDay = async () => {
  try {
    // Lấy danh sách các mục tiêu đã hoàn thành trong ngày
    const completedGoals = await LearningGoal.find({ status: "complete" });

    if (!completedGoals.length) {
      console.log("⏳ Không có mục tiêu nào cần cập nhật.");
      return;
    }

    let updatedCount = 0;

    for (const goal of completedGoals) {
      if (goal.repeat) {
        await LearningGoal.findByIdAndUpdate(goal._id, { status: "active" });
        console.log(`🔄 Mục tiêu ${goal._id} đã được đặt lại thành "active".`);
        updatedCount++;
      }
    }

    console.log(
      `🏁 Hoàn tất cập nhật: ${updatedCount} mục tiêu được đặt lại thành "active".`
    );
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật LearningGoal cuối ngày:", error);
  }
};
const resetRemindersForActiveGoals = async () => {
  try {
    // Lấy danh sách các mục tiêu đang ở trạng thái "active"
    const activeGoals = await LearningGoal.find({ status: "active" });

    if (!activeGoals.length) {
      console.log("⏳ Không có LearningGoal nào đang active.");
      return;
    }

    // Cập nhật Reminder của các mục tiêu đó về trạng thái "pending"
    const updatedReminders = await Reminder.updateMany(
      { learningGoalId: { $in: activeGoals.map((goal) => goal._id) } },
      { status: "pending" }
    );

    console.log(
      `🔄 Đã cập nhật ${updatedReminders.modifiedCount} Reminder(s) thành "pending".`
    );
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật Reminder:", error);
  }
};
const sendToEmail = async () => {
  try {
    console.log("📩 Bắt đầu gửi email nhắc nhở...");

    const pendingReminders = await getPendingRemindersFromGenerated();
    // console.log(pendingReminders);
    if (!pendingReminders.length) {
      console.log("🔕 Không có Reminder nào đang chờ xử lý.");
      return;
    }

    for (const reminder of pendingReminders) {
      if (!reminder.learningGoal || !reminder.user) {
        console.warn(`⚠️ Reminder ${reminder._id} không có thông tin user.`);
        continue;
      }

      const user = reminder.user;
      const emailsToSend = [];

      if (user.email) emailsToSend.push(user.email);
      // if (user.parentEmail) emailsToSend.push(user.parentEmail);

      if (emailsToSend.length === 0) {
        console.warn(`⚠️ Không tìm thấy email cho user ${user._id}.`);
        continue;
      }

      // Nội dung email
      const emailOptions = {
        to: emailsToSend,
        subject: reminder.reminderTitle,
        text: reminder.reminderContent,
      };
      // console.log("emailOption", emailOptions);

      try {
        await sendEmail(emailOptions);
        console.log(`✅ Email gửi thành công đến: ${emailsToSend.join(", ")}`);

        // Cập nhật trạng thái của Reminder sau khi gửi
        await Reminder.findByIdAndUpdate(reminder._id, { status: "pending" });
      } catch (emailError) {
        console.error(`❌ Lỗi khi gửi email cho ${emailsToSend}:`, emailError);
      }
    }

    console.log("📬 Hoàn tất gửi email nhắc nhở!");
  } catch (error) {
    console.error("❌ Lỗi khi xử lý gửi email:", error);
  }
};

const resetReminders = async () => {
  try {
    console.log("🔄 Bắt đầu quá trình reset Reminder...");

    await updateLearningProgressEndOfDay();
    await resetRemindersForActiveGoals();

    console.log("✅ Reset Reminder hoàn tất!");
    return {
      status: "OK",
    };
  } catch (error) {
    console.error("❌ Lỗi khi reset Reminder:", error);
  }
};

// viết 1 hàm sendToEmail

// const checkReminders = async () => {
//   console.log("tới đấy");
//   const now = new Date();
//   now.setSeconds(0, 0); // Loại bỏ giây và milliseconds để so sánh chính xác

//   try {
//     // Lấy tất cả lời nhắc cần gửi
//     const reminders = await Reminder.find({
//       // date: { $lte: now },
//       status: "pending",
//     }).populate({
//       path: "learningGoalId",
//       populate: { path: "userId", select: "email parentEmail" },
//     });

//     console.log(reminders);

//     if (reminders.length === 0) return;

//     const emailPromises = [];
//     const updatedReminders = [];

//     const learningGoalMap = new Map(); // Lưu danh sách LearningGoal để xử lý sau

//     for (const reminder of reminders) {
//       if (!reminder.learningGoalId || !reminder.learningGoalId.userId) {
//         console.warn("⚠️ Không tìm thấy user cho lời nhắc:", reminder._id);
//         continue;
//       }

//       const user = reminder.learningGoalId.userId;
//       const emailsToSend = [];

//       if (user.email) emailsToSend.push(user.email);
//       if (user.parentEmail) emailsToSend.push(user.parentEmail);

//       if (emailsToSend.length === 0) {
//         console.warn(`❌ Không có email để gửi cho lời nhắc ${reminder._id}`);
//         continue;
//       }

//       console.log(
//         `🔔 Gửi lời nhắc: ${reminder.reminderTitle} đến ${emailsToSend.join(
//           ", "
//         )}`
//       );

//       // Tạo promises gửi email
//       emailsToSend.forEach((email) => {
//         emailPromises.push(
//           sendEmail(email, reminder.reminderTitle, reminder.reminderContent)
//             .then(() => ({ success: true, reminderId: reminder._id }))
//             .catch((error) => ({
//               success: false,
//               reminderId: reminder._id,
//               error,
//             }))
//         );
//       });

//       // Đánh dấu reminder đã được xử lý
//       updatedReminders.push(reminder._id);

//       // Thêm vào danh sách LearningGoal cần kiểm tra
//       const learningGoalId = reminder.learningGoalId._id.toString();
//       if (!learningGoalMap.has(learningGoalId)) {
//         learningGoalMap.set(learningGoalId, 0);
//       }
//       learningGoalMap.set(
//         learningGoalId,
//         learningGoalMap.get(learningGoalId) + 1
//       );
//     }

//     // Gửi tất cả email song song
//     const results = await Promise.all(emailPromises);

//     // Cập nhật trạng thái của lời nhắc thành "sent" nếu gửi email thành công
//     const successfulIds = results
//       .filter((res) => res.success)
//       .map((res) => res.reminderId);

//     if (successfulIds.length > 0) {
//       await Reminder.updateMany(
//         { _id: { $in: successfulIds } },
//         { status: "sent" }
//       );
//     }

//     // Ghi log lỗi nếu có email gửi thất bại
//     results
//       .filter((res) => !res.success)
//       .forEach((res) =>
//         console.error(
//           `❌ Lỗi gửi email cho Reminder ${res.reminderId}:`,
//           res.error
//         )
//       );

//     // Kiểm tra và cập nhật trạng thái LearningGoal
//     for (const [learningGoalId, reminderCount] of learningGoalMap.entries()) {
//       const remainingReminders = await Reminder.countDocuments({
//         learningGoalId,
//         status: "pending",
//       });

//       if (remainingReminders === 0) {
//         console.log(`✅ LearningGoal ${learningGoalId} đã hoàn thành!`);
//         // Cập nhật trạng thái của LearningGoal
//         await LearningGoal.findByIdAndUpdate(learningGoalId, {
//           status: "completed",
//         });
//       }
//     }
//   } catch (error) {
//     console.error("❌ Lỗi khi kiểm tra lời nhắc:", error);
//   }
// };

// Kiểm tra mỗi phút (cho lời nhắc dựa trên TargetTimes)
// cron.schedule("*/1 * * * *", async () => {
//   console.log("⏳ Kiểm tra lời nhắc mỗi phút...");
//   await check();
// });

// // Kiểm tra hàng ngày lúc 8:30 sáng
// cron.schedule("30 8 * * *", async () => {
//   console.log("📅 Kiểm tra lời nhắc hàng ngày...");
//   // await checkReminders();
// });
module.exports = {
  resetReminders,
  checkTargetWords,
  sendToEmail,
};
cron.schedule("*/30 * * * *", async () => {
  console.log("🔄 Kiểm tra tiến độ học tập mỗi 30 phút...");
  await checkTargetWords();
});

cron.schedule("* * * * *", async () => {
  console.log("📧 Gửi email báo cáo mỗi phút...");
  await sendToEmail();
});

cron.schedule("0 0 * * *", async () => {
  console.log("🔄 Reset trạng thái học tập và lời nhắc vào đầu ngày...");
  await updateLearningProgressEndOfDay();
  await resetRemindersForActiveGoals();
});
