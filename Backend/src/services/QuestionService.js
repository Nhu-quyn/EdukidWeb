const QuestionType = require("../models/QuestionTypeModel");
const User = require("../models/UserModel");
const Topic = require("../models/TopicModel");
const ProgressVocab = require("../models/ProgressVocabModel");
const ActivityQuestion = require("../models/ActivityQuestion");
const Activity = require("../models/ActivityModel");
const Question = require("../models/QuestionModel");
const createQuestionType = (newQuestionType) => {
  return new Promise(async (resolve, reject) => {
    const { questionTypeId, questionTypeName } = newQuestionType;
    try {
      const checkQuestionType = await QuestionType.findOne({
        questionTypeId: questionTypeId,
      });
      if (!checkQuestionType) {
        const createQuestionType = await QuestionType.create({
          questionTypeId,
          questionTypeName,
        });

        resolve({
          status: "OK",
          message: "Success",
          data: createQuestionType,
        });
      } else {
        resolve({
          status: "ERR",
          message: "The QuestionType is already ",
          data: checkQuestionType,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
// const createQuestion = (newQuestion) => {
//   return new Promise(async (resolve, reject) => {
//     const {
//       questionContent,
//       answer,
//       options,
//       words,
//       image,
//       score,
//       questionLevel,
//       questionTypeId,
//       topicId,
//       vocabularyId,
//     } = newQuestion;
//     try {
//       const checkQuestionType = await QuestionType.findById(questionTypeId);
//       if (!checkQuestionType) {
//         return resolve({
//           status: "ERROR",
//           message: "Question type not found",
//         });
//       }
//       //Game
//       if (
//         checkQuestionType.questionTypeId.replace(/\s/g, "").toLowerCase() ===
//         "image_match"
//       ) {
//         if (!questionContent || !answer || !options) {
//           return resolve({
//             status: "ERROR",
//             message: "Input is required",
//           });
//         }
//       } else if (
//         checkQuestionType.questionTypeId.replace(/\s/g, "").toLowerCase() ===
//         "word_match"
//       ) {
//         if (!questionContent || !answer || !options || !image) {
//           return resolve({
//             status: "ERROR",
//             message: "Input is required",
//           });
//         }
//       } else if (
//         checkQuestionType.questionTypeId.replace(/\s/g, "").toLowerCase() ===
//         "audio_record"
//       ) {
//         if (!answer || !questionContent) {
//           return resolve({
//             status: "ERROR",
//             message: "Input is required",
//           });
//         }
//       } else if (
//         checkQuestionType.questionTypeId.replace(/\s/g, "").toLowerCase() ===
//         "listen_choose_word"
//       ) {
//         if (!answer || !questionContent || !options) {
//           return resolve({
//             status: "ERROR",
//             message: "Input is required",
//           });
//         }
//       } else if (
//         checkQuestionType.questionTypeId.replace(/\s/g, "").toLowerCase() ===
//         "listen_choose_image"
//       ) {
//         if (!answer || !questionContent || !options) {
//           return resolve({
//             status: "ERROR",
//             message: "Input is required",
//           });
//         }
//       } else if (
//         checkQuestionType.questionTypeId.replace(/\s/g, "").toLowerCase() ===
//         "listen_choose_image"
//       ) {
//         if (!answer || !questionContent || !options || !image) {
//           return resolve({
//             status: "ERROR",
//             message: "Input is required",
//           });
//         }
//       } else if (
//         checkQuestionType.questionTypeId.replace(/\s/g, "").toLowerCase() ===
//         "word_select_sound"
//       ) {
//         if (!answer || !questionContent || !options) {
//           return resolve({
//             status: "ERROR",
//             message: "Input is required",
//           });
//         }
//       }
//       //Quiz
//       //Test
//     } catch (e) {
//       reject(e);
//     }
//   });
// };
const createQuestion = (newQuestion) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        questionContent,
        answer,
        options,
        word,
        image,
        score,
        questionLevel,
        questionTypeId,
        topicId,
        vocabularyId,
      } = newQuestion;

      // Remove null, undefined, or empty fields
      const filteredData = Object.fromEntries(
        Object.entries({
          questionContent,
          answer,
          options,
          word,
          image,
          score,
          questionLevel,
          questionTypeId,
          topicId,
          vocabularyId,
        }).filter(
          ([_, value]) => value !== null && value !== undefined && value !== ""
        )
      );
      const check = await Question.findOne({
        questionTypeId: questionTypeId,
        questionContent: questionContent,
        vocabularyId: vocabularyId,
      });
      if (check) {
        return resolve({
          status: "ERR",
          message: "question available",
        });
      }
      // // Check if the question already exists (same questionTypeId and questionContent)
      // const existingQuestion = await Question.findOne({
      //   questionTypeId,
      //   questionContent,
      // });
      // console.log("tới đây", existingQuestion);

      // if (existingQuestion) {
      //   return resolve({
      //     status: "ERROR",
      //     message: "The question already exists!",
      //   });
      // }

      const checkQuestionType = await QuestionType.findById(questionTypeId);
      if (!checkQuestionType) {
        return resolve({
          status: "ERROR",
          message: "Question type not found",
        });
      }

      // Normalize question type (remove spaces and convert to lowercase)
      const questionType = checkQuestionType.questionTypeId
        .replace(/\s/g, "")
        .toLowerCase();

      // Validate required fields based on question type
      const requiredFields = {
        image_match: ["questionContent", "answer", "options"],
        word_match: ["questionContent", "answer", "options", "image"],
        audio_record: ["questionContent", "answer"],
        listen_choose_word: ["questionContent", "answer", "options"],
        listen_choose_image: ["questionContent", "answer", "options", "words"],
        word_select_sound: ["questionContent", "answer", "options"],

        fill_blank: ["questionContent", "answer"],
        sentence_text: ["answer"],
        translation: ["questionContent", "answer", "word"],
        translation_match: ["questionContent", "options", "answer"],
        image_write_word: ["image", "answer"],
        multiple_choice: ["questionContent", "options", "answer"],
        image_select_sound: ["questionContent", "image", "options", "answer"],
        listen_and_translate: ["questionContent", "word", "answer"],
      };

      if (requiredFields[questionType]) {
        const missingFields = requiredFields[questionType].filter(
          (field) => !filteredData[field]
        );
        if (missingFields.length > 0) {
          return resolve({
            status: "ERROR",
            message: `Missing required fields: ${missingFields.join(", ")}`,
          });
        }
      }

      // Create the question after validation
      const newQuestionEntry = await Question.create(filteredData);

      return resolve({
        status: "OK",
        message: "Question created successfully!",
        data: newQuestionEntry,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getAllQuestions = async () => {
  try {
    const questions = await Question.find()
      .populate("questionTypeId", "_id questionTypeId questionTypeName")
      .populate("topicId", "_id topicName"); // Thêm populate cho topicId

    return {
      status: "OK",
      message: "Success",
      data: questions,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message,
    };
  }
};

const getAllQuestionTypes = async () => {
  try {
    const questionTypes = await QuestionType.find();
    return {
      status: "OK",
      message: "Success",
      data: questionTypes,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message,
    };
  }
};
// const addQuestionActivity = async (activityId, questionIds) => {
//   try {
//     // const questions = await Question.find().populate(
//     //   "questionTypeId",
//     //   "questionTypeId questionTypeName"
//     // );
//     return {
//       status: "OK",
//       message: "Success",
//       // data: questions,
//     };
//   } catch (e) {
//     return {
//       status: "ERR",
//       message: e.message,
//     };
//   }
// };

// const getQuestionGame = async (activityId, userId) => {
//   try {
//const activityQuestions = await ActivityQuestion.find({activityId})
//     const questions = await Question.find().populate(
//       "questionTypeId",
//       "questionTypeId questionTypeName"
//     );
//     return {
//       status: "OK",
//       message: "Success",
//       data: questions,
//     };
//   } catch (e) {
//     return {
//       status: "ERR",
//       message: e.message,
//     };
//   }
// }; // chưa viết
const deleteQuestion = async (questionId) => {
  try {
    // Kiểm tra xem questionId có tồn tại không trước khi truy vấn chi tiết

    // const questionExists = await Question.exists({ _id: questionId });
    const questionExists = await Question.findOne({ _id: questionId });
    if (!questionExists) {
      return {
        status: "ERR",
        message: "Question not found",
      };
    }

    // Xóa tất cả các liên kết đến questionId trong ActivityQuestion
    await ActivityQuestion.deleteMany({ questionId });
    // await Question.deleteMany({ questionId });

    // Xóa câu hỏi
    await Question.findByIdAndDelete(questionId);
    console.log("toiday");
    return {
      status: "OK",
      message: "Deleted question successfully",
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message,
    };
  }
};
const shuffleArray = (array) => {
  let newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// const getQuestionsWithGame = async (userId, topicId) => {
//   try {
//     const activity = await Activity.findOne({ activityName: "Trò chơi" });
//     const activityId = activity._id;
//     // 🔹 Kiểm tra userId có hợp lệ không
//     const userObj = await User.findById(userId);
//     if (!userObj) {
//       return {
//         status: "ERR",
//         message: "User không tồn tại",
//       };
//     }

//     // 🔹 Lấy danh sách câu hỏi từ ActivityQuestion (bắt buộc có activityId)
//     const activityQuestions = await ActivityQuestion.find({
//       activityId,
//     }).populate("questionId");
//     let questionList = activityQuestions.map((aq) => aq.questionId);

//     if (questionList.length === 0) {
//       return {
//         status: "OK",
//         message: "Không có câu hỏi nào trong game này",
//         data: [],
//       };
//     }

//     // 🔹 Nếu có topicId, lọc danh sách câu hỏi theo topicId
//     if (topicId) {
//       questionList = questionList.filter(
//         (q) => q.vocabularyId?.topicId?.toString() === topicId
//       );
//     } else {
//       // 🔹 Nếu không có topicId, lấy danh sách từ ProgressVocab
//       const progress = await ProgressVocab.find({ userId }).populate(
//         "vocabularyId"
//       );

//       // Lọc các từ vựng có `hasBoolean === true`
//       const restrictedVocabIds = progress
//         .filter((p) => p.hasBoolean)
//         .map((p) => p.vocabularyId._id.toString());

//       // Hạn chế xuất hiện câu hỏi có vocabularyId trong danh sách hạn chế
//       questionList = questionList.filter(
//         (q) => !restrictedVocabIds.includes(q.vocabularyId.toString())
//       );
//     }

//     // 🔹 Trộn ngẫu nhiên danh sách câu hỏi trước khi trả về
//     questionList = shuffleArray(questionList);

//     return {
//       status: "OK",
//       data: questionList,
//     };
//   } catch (e) {
//     return {
//       status: "ERR",
//       message: e.message,
//     };
//   }
// };
const getQuestionsWithGameByTopic = async (userId, topicId) => {
  try {
    console.log(userId);
    console.log(topicId);
    const activity = await Activity.findOne({ activityName: "Trò chơi" });
    const activityId = activity._id;

    // Kiểm tra userId có hợp lệ không
    const userObj = await User.findById(userId);
    if (!userObj) {
      return {
        status: "ERR",
        message: "User không tồn tại",
      };
    }
    const topicObj = await Topic.findById(topicId);

    // Lấy danh sách câu hỏi từ ActivityQuestion
    const activityQuestions = await ActivityQuestion.find({
      activityId,
    }).populate({
      path: "questionId",
      populate: [
        { path: "questionTypeId" }, // Lấy thông tin loại câu hỏi
      ],
    });
    let questionList = activityQuestions.map((aq) => aq.questionId);
    // console.log(questionList);
    if (questionList.length === 0) {
      return {
        status: "OK",
        message: "Không có câu hỏi nào trong game này",
        data: [],
      };
    }

    // Lọc danh sách câu hỏi theo topicId
    questionList = questionList.filter(
      (q) => String(q?.topicId) === String(topicObj._id)
    );

    console.log(questionList);

    // Trộn ngẫu nhiên danh sách câu hỏi trước khi trả về
    questionList = shuffleArray(questionList);

    return {
      status: "OK",
      data: questionList,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message,
    };
  }
};
const getQuestionsWithGame = async (userId) => {
  try {
    // Lấy activityId
    const activity = await Activity.findOne({ activityName: "Trò chơi" });
    if (!activity) {
      return {
        status: "ERR",
        message: "Hoạt động không tồn tại",
      };
    }
    // console.log("tpows đay");
    const activityId = activity._id;

    // Kiểm tra userId có hợp lệ không
    const userObj = await User.findById(userId);
    if (!userObj) {
      return {
        status: "ERR",
        message: "User không tồn tại",
      };
    }

    // Lấy danh sách câu hỏi từ ActivityQuestion
    const activityQuestions = await ActivityQuestion.find({
      activityId,
    }).populate({
      path: "questionId",
      populate: [{ path: "questionTypeId" }],
    });

    let questionList = activityQuestions
      .map((aq) => aq.questionId)
      .filter((q) => q); // Lọc bỏ phần tử null

    if (questionList.length === 0) {
      return {
        status: "OK",
        message: "Không có câu hỏi nào trong game này",
        data: [],
      };
    }

    // Lấy danh sách từ ProgressVocab của user
    const progress = await ProgressVocab.find({ userId: userId }).populate(
      "vocabularyId"
    );

    // Lọc bỏ các phần tử có `vocabularyId === null`
    const validProgress = progress.filter((p) => p?.vocabularyId);
    // console.log("validProgress:", validProgress);
    // Lọc các từ vựng có `hasLearned === true`
    const restrictedVocabIds = validProgress
      .filter((p) => p.hasLearned)
      .map((p) => p.vocabularyId._id.toString());
    console.log(restrictedVocabIds);

    // Hạn chế xuất hiện câu hỏi có vocabularyId trong danh sách hạn chế
    questionList = questionList.filter(
      (q) =>
        q.vocabularyId &&
        !restrictedVocabIds.includes(q.vocabularyId.toString())
    );

    // Trộn ngẫu nhiên danh sách câu hỏi trước khi trả về
    questionList = shuffleArray(questionList);

    return {
      status: "OK",
      data: questionList,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message,
    };
  }
};

const getPublicQuestions = async () => {
  try {
    const activity = await Activity.findOne({ activityName: "Trò chơi" });
    if (!activity) {
      return {
        status: "ERR",
        message: "Không tìm thấy hoạt động 'Trò chơi'",
      };
    }
    const activityId = activity._id;
    // console.log("tới đây");
    // Lấcocoy danh sách câu hỏi có `questionLevel: "easy"`
    const activityQuestions = await ActivityQuestion.find({
      activityId,
    }).populate({
      path: "questionId",
      match: { questionLevel: "easy" }, // Chỉ lấy câu hỏi có level dễ
      populate: {
        path: "questionTypeId", // Lấy thông tin loại câu hỏi
      },
    });

    console.log(activityQuestions);

    // Lọc bỏ những câu hỏi null (nếu không khớp `match`)
    let questionList = activityQuestions
      .map((aq) => aq.questionId)
      .filter((q) => q !== null);

    if (questionList.length === 0) {
      return {
        status: "OK",
        message: "Không có câu hỏi dễ nào trong game này",
        data: [],
      };
    }

    // Trộn ngẫu nhiên danh sách câu hỏi
    questionList = shuffleArray(questionList);

    return {
      status: "OK",
      data: questionList,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message,
    };
  }
};
const getPublicQuestionsByTopic = async (topicId) => {
  try {
    const activity = await Activity.findOne({ activityName: "Trò chơi" });
    if (!activity) {
      return {
        status: "ERR",
        message: "Không tìm thấy hoạt động 'Trò chơi'",
      };
    }
    const activityId = activity._id;

    // Lấy danh sách câu hỏi có `questionLevel: "easy"`

    // Lấy danh sách câu hỏi có `questionLevel: "easy"` và populate `questionTypeId`
    const activityQuestions = await ActivityQuestion.find({
      activityId,
    }).populate({
      path: "questionId",
      match: { questionLevel: "easy" }, // Chỉ lấy câu hỏi có level dễ
      populate: [
        { path: "vocabularyId", select: "topicId" }, // Lấy topicId
        { path: "questionTypeId" }, // Lấy questionTypeId
      ],
    });

    // Lọc bỏ những câu hỏi null (không khớp `match`)
    let questionList = activityQuestions
      .map((aq) => aq.questionId)
      .filter((q) => q !== null);

    // Lọc danh sách câu hỏi theo `topicId`
    if (topicId) {
      questionList = questionList.filter(
        (q) => q.vocabularyId?.topicId?.toString() === topicId
      );
    }

    if (questionList.length === 0) {
      return {
        status: "OK",
        message: "Không có câu hỏi dễ nào cho chủ đề này",
        data: [],
      };
    }

    // Trộn ngẫu nhiên danh sách câu hỏi
    questionList = shuffleArray(questionList);

    return {
      status: "OK",
      data: questionList,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message,
    };
  }
};
const getQuestionByActivity = async (activityId) => {
  try {
    const activity = await Activity.findById(activityId);
    const questions = await ActivityQuestion.find({ activityId })
      .populate({
        path: "questionId",
        populate: { path: "questionTypeId" }, // Populate để lấy luôn questionTypeId
      })
      .lean(); // Chuyển đổi sang object thuần

    return {
      status: "OK",
      testTime: activity.testTime || 0,
      data: questions.map((q) => q.questionId), // Chỉ lấy questionId
    };
  } catch (error) {
    console.error("Lỗi khi lấy câu hỏi:", error);
    return {
      status: "ERR",
      message: "Lỗi khi lấy câu hỏi",
    };
  }
};
const updateQuestion = async (questionId, data) => {
  try {
    const questionObj = await Question.findById(questionId);
    if (!questionObj) {
      return {
        status: "ERR",
        message: "questionId not found",
      };
    }

    const check = await Question.findOne({
      questionTypeId: data.questionTypeId,
      questionContent: data.questionContent,
      vocabularyId: data.vocabularyId,
    });

    if (check && check._id.toString() !== questionObj._id.toString()) {
      return {
        status: "ERR",
        message: "question available",
      };
    }

    const update = await Question.findByIdAndUpdate(questionId, data, {
      new: true,
    });

    return {
      status: "OK",
      data: update,
    };
  } catch (error) {
    console.error("Lỗi trong try:", error); // Log lỗi để kiểm tra
    return {
      status: "ERR",
      message: "Lỗi khi cập nhật câu hỏi",
    };
  }
};

module.exports = {
  createQuestionType,
  getAllQuestionTypes,
  createQuestion,
  updateQuestion,
  getAllQuestions,
  deleteQuestion,
  getQuestionsWithGame,
  getQuestionsWithGameByTopic,
  getPublicQuestionsByTopic,
  getPublicQuestions,
  getQuestionByActivity,
};
