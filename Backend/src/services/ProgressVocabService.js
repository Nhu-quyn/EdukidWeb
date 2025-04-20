const ProgressVocab = require("../models/ProgressVocabModel");
const Vocabulary = require("../models/VocabularyModel");
const User = require("../models/UserModel");
const Question = require("../models/QuestionModel");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

// Lấy ngày giờ hiện tại theo múi giờ Việt Nam

// const createProgressVocab = (newProgressVocab) => {
//   return new Promise(async (resolve, reject) => {
//     const {
//       userId,
//       vocabularyId,
//       hasLearned,
//       priorityLevel,
//       studyDate = Date.now(),
//     } = newProgressVocab;

//     try {
//       const checkUser = await User.findById(userId);
//       if (!checkUser) {
//         return resolve({
//           status: "ERR",
//           message: "User not found",
//         });
//       }

//       const checkVocab = await Vocabulary.findById(vocabularyId);
//       if (!checkVocab) {
//         return resolve({
//           status: "ERR",
//           message: "Vocabulary not found",
//         });
//       }

//       const checkProgressVocab = await ProgressVocab.findOne({
//         userId,
//         vocabularyId,
//       });
//       if (checkProgressVocab) {
//         return resolve({
//           status: "ERR",
//           message: "The ProgressVocab already exists",
//           data: checkProgressVocab,
//         });
//       }

//       const newProgress = await ProgressVocab.create({
//         userId,
//         vocabularyId,
//         hasLearned,
//         priorityLevel,
//         studyDate,
//       });

//       resolve({
//         status: "OK",
//         message: "Success",
//         data: newProgress,
//       });
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

const updateProgressVocab = (progressVocabId, updatedData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const progressVocab = await ProgressVocab.findById(progressVocabId);
      if (!progressVocab) {
        return resolve({
          status: "ERR",
          message: "ProgressVocab not found",
        });
      }

      // Cập nhật thông tin
      Object.assign(progressVocab, updatedData);

      await progressVocab.save();

      resolve({
        status: "OK",
        message: "ProgressVocab updated successfully",
        data: progressVocab,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteProgressVocab = (progressVocabId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const progressVocab = await ProgressVocab.findById(progressVocabId);
      if (!progressVocab) {
        return resolve({
          status: "ERR",
          message: "ProgressVocab not found",
        });
      }

      await ProgressVocab.findByIdAndDelete(progressVocabId);

      resolve({
        status: "OK",
        message: "ProgressVocab deleted successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateProgressVocabFromQuestion = (userId, questionIds) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra userId có tồn tại không
      // console.log("userId", userId);
      // console.log(questionIds);
      const checkUser = await User.findById(userId);
      if (!checkUser) {
        return resolve({
          status: "ERR",
          message: "User not found",
        });
      }
      const nowInVietnam = dayjs().tz("Asia/Ho_Chi_Minh").format("DD-MM-YYYY");
      console.log("Giờ hiện tại ở Việt Nam:", nowInVietnam);
      // Lọc danh sách questionIds có vocabularyId
      const questionsWithVocab = await Question.find({
        _id: { $in: questionIds },
      }).select("vocabularyId");
      const vocabularyIds = questionsWithVocab
        .map((q) => q.vocabularyId)
        .filter((id) => id); // Lọc bỏ giá trị null hoặc undefined

      // console.log("vocaularyIds", vocabularyIds);
      if (vocabularyIds.length === 0) {
        return resolve({
          status: "ERR",
          message: "Không có vocabularyId hợp lệ",
        });
      }
      // console.log("tới đâyyy");
      // Kiểm tra từng vocabularyId có tồn tại không
      const validVocabularies = await Vocabulary.find({
        _id: { $in: vocabularyIds },
      });

      if (validVocabularies.length !== vocabularyIds.length) {
        return resolve({
          status: "ERR",
          message: "Một số vocabularyId không tồn tại",
        });
      }

      // Duyệt qua từng vocabularyId để kiểm tra và cập nhật/truy xuất dữ liệu
      for (const vocabularyId of vocabularyIds) {
        let progressVocab = await ProgressVocab.findOne({
          userId,
          vocabularyId,
        });

        if (progressVocab) {
          // Nếu đã tồn tại, cập nhật studyDate thành Date.now()
          progressVocab.studyDate = dayjs()
            .tz("Asia/Ho_Chi_Minh")
            .startOf("day")
            .toDate();

          await progressVocab.save();
        } else {
          // Nếu chưa tồn tại, tạo mới
          progressVocab = new ProgressVocab({
            userId,
            vocabularyId,
            hasLearned: true,
            studyDate: dayjs().tz("Asia/Ho_Chi_Minh").startOf("day").toDate(),
          });
          await progressVocab.save();
        }
      }

      resolve({
        status: "OK",
        message: "ProgressVocab updated successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteProgressVocabWithUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const progressVocab = await ProgressVocab.findById(userId);
      if (!progressVocab) {
        return resolve({
          status: "ERR",
          message: "ProgressVocab not found",
        });
      }

      await ProgressVocab.findAndDelete(userId);

      resolve({
        status: "OK",
        message: "ProgressVocab deleted successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  // createProgressVocab,
  updateProgressVocab,
  deleteProgressVocab,
  deleteProgressVocabWithUser,
  updateProgressVocabFromQuestion,
};
