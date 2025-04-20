const cron = require("node-cron");
const mongoose = require("mongoose");
const LearningGoal = require("../models/LearningGoalModel");
const ProgressVocab = require("../models/ProgressVocabModel");
const Reminder = require("../models/ReminderModel");
const sendEmail = require("./EmailService");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const isBetween = require("dayjs/plugin/isBetween");
// Sử dụng plugin
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);
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
// const checkTargetWords = async () => {
//   try {
//     const activeGoals = await LearningGoal.find({
//       status: "active",
//       targetWords: { $gt: 0 }, // Chỉ lấy những mục tiêu có targetWords > 0
//     });

//     if (!activeGoals.length) {
//       console.log("⏳ Không có mục tiêu học tập hợp lệ.");
//       return;
//     }

//     // Lấy ngày hiện tại (chỉ lấy phần ngày, không tính giờ)
//     const today = dayjs().tz("Asia/Ho_Chi_Minh").format("DD-MM-YYYY");
//     // today.setHours(0, 0, 0, 0);

//     for (const goal of activeGoals) {
//       const { userId, targetWords } = goal;

//       if (!userId) {
//         console.log(`⚠️ Bỏ qua mục tiêu ${goal._id} do thiếu userId.`);
//         continue;
//       }
//       let learnedWordsCount = 0;
//       // Đếm số từ vựng user đã học trong ngày hôm nay
//       // const progressVocabToDay = await ProgressVocab.find({ userId });
//       learnedWordsCount = await ProgressVocab.countDocuments({
//         userId: userId,
//         studyDate: today,
//       });

//       if (learnedWordsCount >= targetWords) {
//         await LearningGoal.findByIdAndUpdate(goal._id, { status: "complete" });
//         console.log(
//           `✅ Mục tiêu ${goal._id} đã hoàn thành (${learnedWordsCount}/${targetWords} từ)!`
//         );
//       } else {
//         console.log(
//           `📌 Mục tiêu ${goal._id} chưa đạt (${learnedWordsCount}/${targetWords} từ).`
//         );
//       }
//     }

//     console.log("🏁 Kiểm tra mục tiêu học tập hoàn tất.");
//   } catch (error) {
//     console.error("❌ Lỗi khi kiểm tra targetWords:", error);
//   }
// };
const checkTargetWords = async () => {
  try {
    const activeGoals = await LearningGoal.find({
      status: "active",
      targetWords: { $gt: 0 },
    });

    if (!activeGoals.length) {
      console.log("⏳ Không có mục tiêu học tập hợp lệ.");
      return;
    }

    // Lấy thời gian bắt đầu của ngày hôm nay (00:00:00) theo múi giờ VN
    const todayStart = dayjs().tz("Asia/Ho_Chi_Minh").startOf("day").toDate();
    const todayEnd = dayjs().tz("Asia/Ho_Chi_Minh").endOf("day").toDate();

    for (const goal of activeGoals) {
      const { userId, targetWords } = goal;

      if (!userId) {
        console.log(`⚠️ Bỏ qua mục tiêu ${goal._id} do thiếu userId.`);
        continue;
      }

      const learnedWordsCount = await ProgressVocab.countDocuments({
        userId: userId,
        studyDate: {
          $gte: todayStart,
          $lte: todayEnd,
        },
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
    // })
    // // Lấy thời gian hiện tại ở múi giờ "Asia/Ho_Chi_Minh"
    const currentTime = dayjs().tz("Asia/Ho_Chi_Minh").toDate();
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
          "learningGoal.startDate": { $lte: currentTime },
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
    console.log("pendingReminders", pendingReminders);

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
const getPendingRemindersSchedule = async () => {
  try {
    const currentTime = dayjs().tz("Asia/Ho_Chi_Minh").toDate();
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
          "learningGoal.startDate": { $lte: currentTime },
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
    console.log("pendingReminders", pendingReminders);

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
      // return;
    }
    const activeGoals = await LearningGoal.find({ status: "active" });
    for (const goal of activeGoals) {
      if (!goal.repeatDaily) {
        await LearningGoal.findByIdAndUpdate(goal._id, { status: "paused" });
        // console.log(`🔄 Mục tiêu ${goal._id} đã được đặt lại thành "active".`);
        // updatedCount++;
      }
    }
    // if (!activeGoals.length) {
    //   console.log("⏳ Không có LearningGoal nào đang active.");
    //   return;
    // }

    let updatedCount = 0;

    for (const goal of completedGoals) {
      if (goal.repeatDaily) {
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
      {
        status: "pending",
        sentCount: 0,
      }
    );

    console.log(
      `🔄 Đã cập nhật ${updatedReminders.modifiedCount} Reminder(s) thành "pending".`
    );
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật Reminder:", error);
  }
};
// const sendToEmail = async () => {
//   try {
//     console.log("📩 Bắt đầu gửi email nhắc nhở...");

//     const pendingReminders = await getPendingRemindersFromGenerated();
//     // console.log(pendingReminders);
//     if (!pendingReminders.length) {
//       console.log("🔕 Không có Reminder nào đang chờ xử lý.");
//       return;
//     }

//     for (const reminder of pendingReminders) {
//       if (!reminder.learningGoal || !reminder.user) {
//         console.warn(`⚠️ Reminder ${reminder._id} không có thông tin user.`);
//         continue;
//       }

//       const user = reminder.user;
//       const emailsToSend = [];

//       if (user.email) emailsToSend.push(user.email);
//       // if (user.parentEmail) emailsToSend.push(user.parentEmail);

//       if (emailsToSend.length === 0) {
//         console.warn(`⚠️ Không tìm thấy email cho user ${user._id}.`);
//         continue;
//       }

//       // Nội dung email
//       const emailOptions = {
//         to: emailsToSend,
//         subject: reminder.reminderTitle,
//         text: reminder.reminderContent,
//       };
//       // console.log("emailOption", emailOptions);

//       try {
//         await sendEmail(emailOptions);
//         console.log(`✅ Email gửi thành công đến: ${emailsToSend.join(", ")}`);

//         // Cập nhật trạng thái của Reminder sau khi gửi
//         await Reminder.findByIdAndUpdate(reminder._id, { status: "pending" });
//       } catch (emailError) {
//         console.error(`❌ Lỗi khi gửi email cho ${emailsToSend}:`, emailError);
//       }
//     }

//     console.log("📬 Hoàn tất gửi email nhắc nhở!");
//   } catch (error) {
//     console.error("❌ Lỗi khi xử lý gửi email:", error);
//   }
// };
const sendToEmail = async () => {
  try {
    // console.log("📩 Bắt đầu gửi email nhắc nhở...");

    const pendingReminders = await getPendingRemindersFromGenerated();
    if (!pendingReminders.length) {
      console.log("🔕 Không có Reminder nào đang chờ xử lý.");
      return;
    }

    const currentTime = new Date(); // Thời gian hiện tại
    const currentHour = currentTime.getHours();
    // console.log("currentHour", currentHour);
    const reminderHours = [8, 10, 22]; // Giờ gửi nhắc nhở targetWords
    console.log("pendingReminders", pendingReminders);
    for (const reminder of pendingReminders) {
      if (!reminder.learningGoal || !reminder.user) {
        console.warn(`⚠️ Reminder ${reminder._id} không có thông tin user.`);
        continue;
      }

      const user = reminder.user;
      const emailsToSend = [];

      if (user.email) emailsToSend.push({ email: user.email, type: "student" });
      if (user.parentEmail && user.parentEmail.trim() !== "") {
        emailsToSend.push({ email: user.parentEmail, type: "parent" });
      }
      if (emailsToSend.length === 0) {
        console.warn(`⚠️ Không tìm thấy email cho user ${user._id}.`);
        continue;
      }
      const lastSent = dayjs(reminder.lastSentAt).tz("Asia/Ho_Chi_Minh");
      const now = dayjs().tz("Asia/Ho_Chi_Minh");
      const isSameHourSlot = reminderHours.some(
        (hour) => now.hour() === hour && lastSent.hour() !== hour
      );

      let sentCount = 0;
      const { targetWords, targetTimes } = reminder.learningGoal;
      sentCount = reminder.sentCount || 0; // Số lần đã gửi email trước đó
      // console.log("sentCount", sentCount);
      // console.log("targetWords", targetWords);
      // Xử lý nhắc nhở từ vựng nếu targetWords tồn tại và lớn hơn 0
      if (targetWords && targetWords > 0 && isSameHourSlot) {
        // Gửi 3 lần/ngày nếu chưa hoàn thành
        // if (
        //   // !completed &&
        //   reminderHours.includes(currentHour) &&
        //   sentCount < 3
        // ) {
        //   console.log("vào đây");
        for (const recipient of emailsToSend) {
          const isParent = recipient.type === "parent";
          const recipientEmail = recipient.email;
          let emailSubject = "";
          let emailContent = "";

          emailSubject = `📌 Nhắc nhở học từ vựng của ${user.username}!`;
          emailContent = isParent
            ? `📢 **THÔNG BÁO NHẮC NHỞ HỌC TỪ VỰNG**

Kính gửi Quý phụ huynh,

Hiện tại, ${user.username} vẫn chưa hoàn thành mục tiêu học từ vựng hôm nay.

📚 **Số từ cần học hôm nay:** ${targetWords}

Việc duy trì thói quen học từ vựng sẽ giúp con phát triển khả năng ngôn ngữ và ghi nhớ tốt hơn. Quý phụ huynh có thể hỗ trợ con hoàn thành mục tiêu bằng cách nhắc nhở và cùng con ôn tập.

Cảm ơn Quý phụ huynh đã đồng hành cùng con trong hành trình học tập!

Trân trọng,
**Đội ngũ hỗ trợ học tập**`
            : `✨ **${user.username} ơi! Hôm nay bạn đã học từ vựng chưa?** 📖

Chúng tớ thấy rằng bạn vẫn chưa hoàn thành mục tiêu từ vựng hôm nay đó! 😲

📚 **Số từ cần học:** ${targetWords}

Hãy cố gắng hoàn thành mục tiêu nhé! Nhớ rằng mỗi từ mới bạn học hôm nay sẽ giúp bạn nói và hiểu tiếng Anh tốt hơn! 🚀

Bạn có thể:
✔️ Viết từ mới vào sổ tay.
✔️ Nhờ bố mẹ kiểm tra lại từ vựng.
✔️ Thực hành sử dụng từ mới vào câu văn.

Chúng tớ tin bạn làm được! 💪🔥

**Học vui nhé!** 🎉
**Đội ngũ hỗ trợ học tập**`;

          console.log(
            `📌 Đang gửi email nhắc nhở học từ vựng lần ${sentCount + 1} cho ${
              user.name
            }...`
          );
          sentCount++;

          // Tăng số lần đã gửi lên 1
          await Reminder.findByIdAndUpdate(reminder._id, {
            $inc: { sentCount: sentCount },
          });

          const emailOptions = {
            to: recipientEmail,
            subject: emailSubject,
            text: emailContent,
          };

          try {
            if (sentCount === 3) {
              await Reminder.findByIdAndUpdate(reminder._id, {
                status: "sent",
              });
            }
            await sendEmail(emailOptions);
            console.log(`✅ Email gửi thành công đến: ${recipientEmail}`);
          } catch (emailError) {
            console.error(
              `❌ Lỗi khi gửi email cho ${recipientEmail}:`,
              emailError
            );
          }
        }
        // }
      }

      // Xử lý nhắc nhở giờ học nếu targetTimes tồn tại
      //       if (targetTimes) {
      //         // const studyTime = new Date(targetTimes);
      //         console.log("targetTimes", targetTimes);
      //         // Lấy ngày hiện tại dưới định dạng "YYYY-MM-DD"
      //         const today = dayjs().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD");
      //         // Kết hợp ngày hiện tại với giờ phút từ targetTimes
      //         const combinedDateTime = `${today} ${targetTimes}`;
      //         // Chuyển đổi chuỗi kết hợp thành đối tượng dayjs
      //         const studyTime = dayjs(combinedDateTime, "YYYY-MM-DD HH:mm").tz(
      //           "Asia/Ho_Chi_Minh",
      //           true
      //         );
      //         // Tính thời gian 10 phút và 1 phút trước từ studyTime
      //         const tenMinutesBefore = studyTime.subtract(10, "minute"); // 10 phút trước
      //         const oneMinuteBefore = studyTime.subtract(1, "minute"); // 1 phút trước

      //         // // Tính thời gian 10 phút và 1 phút trước từ studyTime
      //         // const tenMinutesBefore = dayjs(studyTime.valueOf() - 10 * 60 * 1000)
      //         //   .tz("Asia/Ho_Chi_Minh", true)
      //         //   .format("YYYY-MM-DD HH:mm"); // 10 phút trước
      //         // const oneMinuteBefore = dayjs(studyTime.valueOf() - 1 * 60 * 1000)
      //         //   .tz("Asia/Ho_Chi_Minh", true)
      //         //   .format("YYYY-MM-DD HH:mm"); // 1 phút trước
      //         console.log("tenMinutesBefore", tenMinutesBefore);

      //         const currentTime = dayjs().tz("Asia/Ho_Chi_Minh", true);
      //         // .format("YYYY-MM-DD HH:mm"); // Thời gian hiện tại trong múi giờ đúng
      //         // if (
      //         //   currentTime.getTime() >= tenMinutesBefore.getTime() &&
      //         //   currentTime.getTime() < studyTime.getTime()
      //         // ) {
      //         console.log("now", currentTime);
      //         // console.log(currentTime); // Kiểm tra kiểu dữ liệu
      //         console.log(typeof currentTime); // Kiểm tra kiểu dữ liệu
      //         console.log(
      //           "KQ",
      //           currentTime.isBetween(oneMinuteBefore, tenMinutesBefore, null, "[]")
      //         );
      //         if (
      //           currentTime.isBetween(oneMinuteBefore, tenMinutesBefore, null, "[]")
      //         ) {
      //           console.log("vào đây 2");
      //           for (const recipient of emailsToSend) {
      //             const isParent = recipient.type === "parent";
      //             const recipientEmail = recipient.email;
      //             let emailSubject = `⏳ Sắp đến giờ học của ${user.username}!`;
      //             let emailContent = "";

      //             emailContent = isParent
      //               ? `📢 **NHẮC NHỞ GIỜ HỌC**

      // Kính gửi Quý phụ huynh,

      // Chỉ còn **10 phút nữa** là đến giờ học mà ${user.username} đã đặt ra.

      // ⏰ **Thời gian học hôm nay:** ${studyTime.toLocaleTimeString()}

      // Việc duy trì lịch học đều đặn sẽ giúp con hình thành thói quen tốt. Quý phụ huynh có thể nhắc nhở con chuẩn bị để bắt đầu học đúng giờ.

      // Cảm ơn Quý phụ huynh đã hỗ trợ con!

      // Trân trọng,
      // **Đội ngũ hỗ trợ học tập**`
      //               : `✨ **${user.username} ơi! Đã sắp đến giờ học rồi!** ⏳

      // Chỉ còn **10 phút nữa** là đến giờ học của bạn đó! 😍

      // 🕒 **Giờ học hôm nay:** ${studyTime.toLocaleTimeString()}

      // Hãy chuẩn bị sẵn sàng để học thật tốt nhé! Bạn có thể:
      // ✔️ Lấy sổ tay và bút viết ra.
      // ✔️ Chuẩn bị không gian yên tĩnh.
      // ✔️ Lên tinh thần thật tốt để học vui hơn!

      // Cùng nhau học tập nào! 🚀🔥

      // **Đội ngũ hỗ trợ học tập**`;

      //             console.log(
      //               `⏳ Đang gửi email nhắc nhở giờ học cho ${user.username}...`
      //             );

      //             const emailOptions = {
      //               to: recipientEmail,
      //               subject: emailSubject,
      //               text: emailContent,
      //             };

      //             try {
      //               await Reminder.findByIdAndUpdate(reminder._id, {
      //                 status: "sent",
      //               });
      //               await sendEmail(emailOptions);
      //               console.log(`✅ Email gửi thành công đến: ${recipientEmail}`);
      //             } catch (emailError) {
      //               console.error(
      //                 `❌ Lỗi khi gửi email cho ${recipientEmail}:`,
      //                 emailError
      //               );
      //             }
      //           }
      //         }
      //       }
    }

    console.log("📬 Hoàn tất gửi email nhắc nhở!");
  } catch (error) {
    console.error("❌ Lỗi khi xử lý gửi email:", error);
  }
};
const sendToEmailSchedule = async () => {
  try {
    const pendingReminders = await getPendingRemindersSchedule();
    if (!pendingReminders.length) {
      console.log("🔕 Không có Reminder nào đang chờ xử lý.");
      return;
    }

    for (const reminder of pendingReminders) {
      if (!reminder.learningGoal || !reminder.user) {
        console.warn(`⚠️ Reminder ${reminder._id} không có thông tin user.`);
        continue;
      }
      console.log("pendingReminders", pendingReminders);
      const user = reminder.user;
      const emailsToSend = [];

      if (user.email) emailsToSend.push({ email: user.email, type: "student" });
      if (user.parentEmail && user.parentEmail.trim() !== "") {
        emailsToSend.push({ email: user.parentEmail, type: "parent" });
      }
      if (emailsToSend.length === 0) {
        console.warn(`⚠️ Không tìm thấy email cho user ${user._id}.`);
        continue;
      }
      const { targetTimes } = reminder.learningGoal;
      if (targetTimes) {
        const today = dayjs().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD");
        const combinedDateTime = `${today} ${targetTimes}`;
        const studyTime = dayjs(combinedDateTime, "YYYY-MM-DD HH:mm").tz(
          "Asia/Ho_Chi_Minh",
          true
        );
        // Tính thời gian 10 phút và 1 phút trước từ studyTime
        const tenMinutesBefore = studyTime.subtract(10, "minute"); // 10 phút trước
        const oneMinuteBefore = studyTime.subtract(1, "minute"); // 1 phút trước

        const currentTime = dayjs().tz("Asia/Ho_Chi_Minh", true);

        console.log(typeof currentTime); // Kiểm tra kiểu dữ liệu
        console.log(
          "KQ",
          currentTime.isBetween(oneMinuteBefore, tenMinutesBefore, null, "[]")
        );
        if (
          currentTime.isBetween(oneMinuteBefore, tenMinutesBefore, null, "[]")
        ) {
          console.log("vào đây 2");
          for (const recipient of emailsToSend) {
            const isParent = recipient.type === "parent";
            const recipientEmail = recipient.email;
            let emailSubject = `⏳ Sắp đến giờ học của ${user.username}!`;
            let emailContent = "";

            emailContent = isParent
              ? `📢 **NHẮC NHỞ GIỜ HỌC**

Kính gửi Quý phụ huynh,

Chỉ còn **10 phút nữa** là đến giờ học mà ${user.username} đã đặt ra.

⏰ **Thời gian học hôm nay:** ${studyTime.toLocaleTimeString()}

Việc duy trì lịch học đều đặn sẽ giúp con hình thành thói quen tốt. Quý phụ huynh có thể nhắc nhở con chuẩn bị để bắt đầu học đúng giờ.

Cảm ơn Quý phụ huynh đã hỗ trợ con!

Trân trọng,
**Đội ngũ hỗ trợ học tập**`
              : `✨ **${user.username} ơi! Đã sắp đến giờ học rồi!** ⏳

Chỉ còn vài phút nữa là đến giờ học của bạn đó! 😍

🕒 **Giờ học hôm nay:** ${targetTimes}

Hãy chuẩn bị sẵn sàng để học thật tốt nhé! Bạn có thể:
✔️ Lấy sổ tay và bút viết ra.
✔️ Chuẩn bị không gian yên tĩnh.
✔️ Lên tinh thần thật tốt để học vui hơn!

Cùng nhau học tập nào! 🚀🔥

**Đội ngũ hỗ trợ học tập**`;

            console.log(
              `⏳ Đang gửi email nhắc nhở giờ học cho ${user.username}...`
            );

            const emailOptions = {
              to: recipientEmail,
              subject: emailSubject,
              text: emailContent,
            };

            try {
              await Reminder.findByIdAndUpdate(reminder._id, {
                status: "sent",
              });
              await sendEmail(emailOptions);
              console.log(`✅ Email gửi thành công đến: ${recipientEmail}`);
            } catch (emailError) {
              console.error(
                `❌ Lỗi khi gửi email cho ${recipientEmail}:`,
                emailError
              );
            }
          }
        }
      }
    }
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
cron.schedule("*/2 * * * *", async () => {
  console.log("🔄 Kiểm tra tiến độ học tập mỗi 2 phút...");
  await checkTargetWords();
});

cron.schedule("* * * * *", async () => {
  console.log("📧 Gửi email báo cáo mỗi phút...");
  await sendToEmail();
  await sendToEmailSchedule();
});

cron.schedule("0 0 * * *", async () => {
  console.log("🔄 Reset trạng thái học tập và lời nhắc vào đầu ngày...");
  await updateLearningProgressEndOfDay();
  await resetRemindersForActiveGoals();
});

// test
//chỉnh lại reset, chỉnh lại bổ sung countSent, chỉnh lại bổ sung trước 10p nhắc nhở time
//Phân quyền bên trang admin, người dùng có tài khoản, người dùng chưa có tài khoản
//fix lỗi nghe nhiều câu
