const Category = require("../models/CategoryModel");
const Activity = require("../models/ActivityModel");
const ActivityQuestion = require("../models/ActivityQuestion");
const LearningProgress = require("../models/LearningProgress");
const Question = require("../models/QuestionModel");
const Topic = require("../models/TopicModel");
const mongoose = require("mongoose");
const User = require("../models/UserModel");
const createCategory = (newCategory) => {
  return new Promise(async (resolve, reject) => {
    const { categoryName } = newCategory;
    try {
      const checkCategory = await Category.findOne({
        categoryName,
      });
      if (!checkCategory) {
        const createCategory = await Category.create({
          categoryName,
        });

        resolve({
          status: "OK",
          message: "Success",
          data: createCategory,
        });
      } else {
        resolve({
          status: "ERR",
          message: "The category is already ",
          data: checkCategory,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const createActivity = (newActivity) => {
  return new Promise(async (resolve, reject) => {
    const {
      activityId,
      activityDescription,
      activityName,
      activityLevel,
      testTime,
      categoryId,
      questionIds,
    } = newActivity;
    try {
      const checkActivity = await Activity.findOne({
        activityName,
        categoryId,
      });
      if (activityId) {
        const checkActivity = await Activity.findOne({ activityId });
        if (checkActivity) {
          return resolve({
            status: "ERR",
            message: "ActivityId is available",
          });
        }
      }
      const checkCategory = await Category.findById(categoryId);
      if (!checkCategory) {
        return resolve({
          status: "ERR",
          message: "Category undefined ",
        });
      }

      if (!checkActivity) {
        const createActivity = await Activity.create({
          activityId,
          activityDescription,
          activityName,
          activityLevel,
          testTime,
          categoryId: checkCategory._id,
        });

        resolve({
          status: "OK",
          message: "Success",
          data: createActivity,
        });
        // Kiểm tra và thêm questionIds vào ActivityQuestion
        if (Array.isArray(questionIds) && questionIds.length > 0) {
          const activityQuestions = questionIds.map((questionId) => ({
            activityId: checkActivity._id,
            questionId,
          }));

          try {
            await ActivityQuestion.insertMany(activityQuestions);
          } catch (error) {
            return resolve({
              status: "ERR",
              message: "Failed to insert some questions",
              error: error.message,
            });
          }
        }
      } else {
        resolve({
          status: "ERR",
          message: "The activity is already ",
          data: checkActivity,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const updateActivity = (activityId, updatedData) => {
  return new Promise(async (resolve, reject) => {
    // const { activityName, testTime, categoryId, questionIds } = updatedData;
    try {
      console.log(updatedData);
      let activity;
      activity = await Activity.findById(activityId);
      if (!activity) {
        return resolve({
          status: "ERR",
          message: "Activity not found",
        });
      }
      if (updatedData.activityId) {
        const checkActivity = await Activity.findOne({
          activityId: updatedData.activityId,
        });
        // console.log(updatedData.activityId);
        if (
          checkActivity &&
          checkActivity._id.toString() !== activity._id.toString()
        ) {
          return resolve({
            status: "ERR",
            message: "ActivityId is available",
          });
        }
        activity.activityId = updatedData.activityId;
      }

      // Cập nhật thông tin Activity
      if (updatedData.activityName)
        activity.activityName = updatedData.activityName;
      if (updatedData.testTime) activity.testTime = updatedData.testTime;

      if (updatedData.activityDescription)
        activity.activityDescription = updatedData.activityDescription;
      if (updatedData.activityLevel)
        activity.activityLevel = updatedData.activityLevel;
      if (updatedData.mode) {
        const checkCategory = await Category.findOne({
          categoryName: updatedData.mode,
        });

        if (!checkCategory) {
          return resolve({
            status: "ERR",
            message: "Category not found",
          });
        }

        activity.categoryId = checkCategory._id;
      }

      // console.log(activity);
      await activity.save();

      // Cập nhật danh sách câu hỏi (nếu có)
      if (Array.isArray(updatedData.questions)) {
        try {
          console.log("tới đay");
          await ActivityQuestion.deleteMany({ activityId }); // Xóa câu hỏi cũ
          const newActivityQuestions = updatedData.questions.map(
            (questionId) => ({
              activityId,
              questionId,
            })
          );
          await ActivityQuestion.insertMany(newActivityQuestions); // Thêm câu hỏi mới
        } catch (error) {
          return resolve({
            status: "ERR",
            message: "Failed to update questions",
            error: error.message,
          });
        }
      }

      resolve({
        status: "OK",
        message: "Activity updated successfully",
        data: activity,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const deleteActivity = (activityId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const activity = await Activity.findById(activityId);
      if (!activity) {
        return resolve({
          status: "ERR",
          message: "Activity not found",
        });
      }

      await ActivityQuestion.deleteMany({ activityId }); // Xóa câu hỏi liên kết
      await Activity.findByIdAndDelete(activityId); // Xóa Activity

      resolve({
        status: "OK",
        message: "Activity deleted successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getAllQuizByCategory = (categoryId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCategory = await Category.findById(categoryId);
      if (!checkCategory) {
        return resolve({
          status: "ERROR",
          message: "category undefined",
        });
      }
      // // console.log(checkCategory.categoryName);
      // console.log("tới đây nè");
      const quizData = await Activity.find({ categoryId });

      // if (checkCategory.categoryName !== "game") {
      //   const result = quizData.map((quiz) => {
      //     // Lấy tất cả câu hỏi của quiz hiện tại
      //     const allQuestions = quiz.ActivityQuestion.map((q) => ({
      //       questionId: q.questionId,
      //       level: q.questionLevel,
      //     }));

      //     const totalQuestions = allQuestions.length;
      //     if (totalQuestions === 0) {
      //       return { quizId: quiz._id, difficulty: "N/A" };
      //     }

      //     // Đếm số câu hỏi theo từng mức độ
      //     const hardCount = allQuestions.filter((q) => q.level >= 70).length;
      //     const easyCount = allQuestions.filter((q) => q.level < 30).length;

      //     // Tính tỷ lệ %
      //     const hardPercentage = (hardCount / totalQuestions) * 100;
      //     const easyPercentage = (easyCount / totalQuestions) * 100;

      //     // Xác định mức độ bài kiểm tra
      //     let quizDifficulty = "medium";
      //     if (hardPercentage >= 70) {
      //       quizDifficulty = "hard";
      //     } else if (easyPercentage >= 70) {
      //       quizDifficulty = "easy";
      //     }

      //     return { quizId: quiz._id, difficulty: quizDifficulty };
      //   });

      //   console.log(result);
      // }

      resolve({
        status: "OK",
        data: quizData,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message,
      });
    }
  });
};
// const getQuizByCategory
const getAllQuizByTopic = (topicId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const quizData = await ActivityQuestion.aggregate([
        {
          $lookup: {
            from: "activities", // Bảng Activity
            localField: "activityId",
            foreignField: "_id",
            as: "activityInfo",
          },
        },
        {
          $unwind: "$activityInfo",
        },
        {
          $lookup: {
            from: "questions", // Bảng Question
            localField: "questionId",
            foreignField: "_id",
            as: "questionInfo",
          },
        },
        {
          $unwind: "$questionInfo",
        },
        {
          $lookup: {
            from: "vocabularies", // Bảng Vocabulary
            localField: "questionInfo.vocabularyId",
            foreignField: "_id",
            as: "vocabularyInfo",
          },
        },
        {
          $unwind: {
            path: "$vocabularyInfo",
            preserveNullAndEmptyArrays: true, // Nếu không có vocabularyId thì không bị lỗi
          },
        },
        {
          $group: {
            _id: "$activityId",
            activity: { $first: "$activityInfo" },
            questions: {
              $push: {
                question: "$questionInfo",
                topicId: {
                  $cond: {
                    if: { $ne: ["$vocabularyInfo.topicId", null] },
                    then: "$vocabularyInfo.topicId",
                    else: "$questionInfo.topicId",
                  },
                },
              },
            },
          },
        },
        {
          $match: { "questions.topicId": topicId }, // Chỉ lấy dữ liệu có topicId tương ứng
        },
      ]);

      resolve({
        status: "OK",
        data: quizData,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message,
      });
    }
  });
};

const addQuestionsToActivity = (activityId, questionIds) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem activityId có hợp lệ không
      const activity = await Activity.findById(activityId);
      if (!activity) {
        return resolve({
          status: "ERR",
          message: "Activity not found",
        });
      }

      // Kiểm tra xem tất cả questionIds có hợp lệ không
      const validQuestions = await Question.find({ _id: { $in: questionIds } });
      const validQuestionIds = validQuestions.map((q) => q._id.toString());

      if (validQuestionIds.length !== questionIds.length) {
        return resolve({
          status: "ERR",
          message: "Some questions not found",
        });
      }

      // Lấy danh sách câu hỏi đã tồn tại trong activity
      const existingQuestions = await ActivityQuestion.find({
        activityId,
        questionId: { $in: questionIds },
      });

      const existingQuestionIds = existingQuestions.map((q) =>
        q.questionId.toString()
      );

      // Lọc ra các câu hỏi chưa tồn tại
      const newQuestionIds = questionIds.filter(
        (id) => !existingQuestionIds.includes(id)
      );

      if (newQuestionIds.length === 0) {
        return resolve({
          status: "ERR",
          message: "All questions already exist in this activity",
        });
      }

      // Thêm các câu hỏi mới vào activity
      const newActivityQuestions = newQuestionIds.map((questionId) => ({
        activityId,
        questionId,
      }));

      await ActivityQuestion.insertMany(newActivityQuestions);

      resolve({
        status: "OK",
        message: "Questions added to activity successfully",
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message,
      });
    }
  });
};
const getAllCategory = async () => {
  try {
    const categories = await Category.find(); // Lấy tất cả danh mục
    return {
      status: "OK",
      data: categories,
    };
  } catch (error) {
    return {
      status: "ERR",
      message: error.message,
    };
  }
};
const getCategoryByName = async (categoryName) => {
  try {
    const category = await Category.findOne({ categoryName }); // Lấy tất cả danh mục
    return {
      status: "OK",
      data: category,
    };
  } catch (error) {
    return {
      status: "ERR",
      message: error.message,
    };
  }
};
const getTestAndReview = async () => {
  try {
    const testAndReview = await Activity.find().populate("categoryId"); // Lấy tất cả danh mục
    const filteredData = await Activity.find().populate("categoryId"); // Lấy tất cả danh mục
    // console.log("toi day ne");
    // Lọc bỏ các mục có categoryName là "game"
    // if (checkCategory.categoryName !== "game") {
    // const result = await Promise.all(
    //   testAndReview.map(async (quiz) => {
    //     // Lấy tất cả câu hỏi của quiz hiện tại
    //     const allQuestions = await ActivityQuestion.find({
    //       activityId: quiz._id,
    //     });

    //     if (allQuestions.length === 0) {
    //       return { ...quiz.toObject(), difficulty: "N/A" };
    //     }

    //     // Đếm số câu hỏi theo từng mức độ
    //     const hardCount = allQuestions.filter(
    //       (q) => q.questionLevel >= 70
    //     ).length;
    //     const easyCount = allQuestions.filter(
    //       (q) => q.questionLevel < 30
    //     ).length;

    //     const totalQuestions = allQuestions.length;
    //     const hardPercentage = (hardCount / totalQuestions) * 100;
    //     const easyPercentage = (easyCount / totalQuestions) * 100;

    //     // Xác định mức độ bài kiểm tra
    //     let quizDifficulty = "medium";
    //     if (hardPercentage >= 70) {
    //       quizDifficulty = "hard";
    //     } else if (easyPercentage >= 70) {
    //       quizDifficulty = "easy";
    //     }

    //     return { ...quiz.toObject(), activityLevel: quizDifficulty };
    //   })
    // );
    // const activityQuestions = await ActivityQuestion.find().populate(
    //   "questionId"
    // );
    // const filteredData = testAndReview.filter(
    //   (item) => item.categoryId?.categoryName !== "game"
    // );
    // console.log(filteredData);
    // B1: Lọc activity không phải game
    // const filteredData = testAndReview.filter(
    //   (item) => item.categoryId?.categoryName !== "game"
    // );

    // B2: Lấy danh sách activityId từ filteredData
    const filteredActivityIds = filteredData.map((item) => item._id.toString());
    // console.log(filteredActivityIds);
    // B3: Lấy toàn bộ ActivityQuestion có activityId nằm trong danh sách lọc
    const activityQuestions = await ActivityQuestion.find({
      activityId: { $in: filteredActivityIds },
    });
    // console.log(activityQuestions);

    // B4: Gộp questionId vào từng activity trong filteredData
    const activityMap = {}; // tạm để gom các question theo activity

    activityQuestions.forEach((aq) => {
      if (!aq.activityId) return; // bỏ qua nếu không có activityId

      const key = aq.activityId.toString(); // nếu là ObjectId hoặc đã populate thì vẫn toString được

      if (!activityMap[key]) {
        activityMap[key] = [];
      }

      activityMap[key].push(aq.questionId); // questionId đã populate
    });

    // B5: Gán mảng questionId vào từng activity
    const result = filteredData.map((activity) => ({
      ...activity.toObject(), // <-- thêm cái này
      questionId: activityMap[activity._id.toString()] || [],
    }));
    console.log(result);
    return {
      status: "OK",
      data: result,
    };
  } catch (error) {
    return {
      status: "ERR",
      message: error.message,
    };
  }
};

const filterActivityReviewByTopic = async (topicId, activities, userId) => {
  try {
    const checkTopic = await Topic.findById(topicId);
    const user = await User.findById(userId);

    if (!checkTopic) {
      return { status: "ERROR", message: "Topic not found" };
    }
    if (!user) {
      return { status: "ERROR", message: "User not found" };
    }

    // Lấy tiến trình học của user (nếu có)
    // const learningProgress = await LearningProgress.find({ userId });
    // const highScoreQuestions = []; // Đảm bảo biến tồn tại
    // Duyệt qua từng activity
    const filteredData = await Promise.all(
      activities.map(async (activity) => {
        // Lấy tất cả câu hỏi của activity hiện tại + populate questionId để lấy thông tin chi tiết câu hỏi
        const activityQuestions = await ActivityQuestion.find({
          activityId: activity._id,
        }).populate("questionId"); // Populate để lấy toàn bộ thông tin của questionId

        ///duyệt qua câu hỏi có topicId giống với topicId của mình cho trước
        //tính tổng câu >80% thì chủ đề đó 80/tổng activity question(độ dài)
        // Lọc các câu hỏi có topicId trùng với topicId được truyền vào
        const matchedQuestions = activityQuestions.filter(
          (question) =>
            question.questionId.topicId.toString() === topicId.toString()
        );

        // console.log(matchedQuestions);
        // Tìm tiến trình học tương ứng (nếu có)
        const progress = await LearningProgress.findOne({
          activityId: activity._id,
          userId,
        });

        // Tính phần trăm hoàn thành của chủ đề
        const percentTopic =
          matchedQuestions.length > 0
            ? (matchedQuestions.length / activityQuestions.length) * 100
            : 0;

        return {
          ...activity, // Giữ lại toàn bộ thông tin của activity
          percentComplete: progress?.percentComplete || 0, // Mặc định là 0 nếu không có progress
          lastUpdate: progress?.lastUpdate || null,
          percentTopic,
        };
      })
    );
    console.log(filteredData);
    // **Lọc danh sách chỉ lấy những activity có percentTopic >= 80**
    const result = filteredData.filter((item) => item.percentTopic >= 70);
    // console.log(result);
    return { status: "OK", data: result };
  } catch (error) {
    return { status: "ERR", message: error.message };
  }
};
const getTestByUserNoDone = async (userId) => {
  try {
    const categoryName = "test";
    const categoryObj = await getCategoryByName(categoryName);
    if (categoryObj.status === "ERR") {
      return { status: "ERR", message: categoryObj.message };
    }
    const categoryId = categoryObj.data._id; // Lấy ID của danh mục "test"
    const activities = await Activity.find({ categoryId });
    if (!activities || activities.length === 0) {
      return {
        status: "ERR",
        message: "No activities found for this category",
      };
    }
    const learningProgress = await LearningProgress.find({ userId }); // co chua activityId
    //loai bo activity co trong learningProgress
    const filteredActivities = activities.filter(
      (activity) =>
        !learningProgress.some(
          (progress) =>
            progress.activityId?.toString() === activity._id?.toString()
        )
    );

    // const activityIds = learningProgress.map((progress) => progress.activityId);
    // const activities = await Activity.find({ _id: { $in: activityIds } });
    return { status: "OK", data: filteredActivities };
  } catch (error) {
    return { status: "ERR", message: error.message };
  }
};
const getCountTestNotDone = async (userId) => {
  try {
    // Gọi hàm getTestByUser để lấy ra các bài test chưa làm
    const result = await getTestByUser(userId);

    if (result.status === "ERR") {
      return { status: "ERR", message: result.message };
    }

    // Lấy danh sách bài test chưa làm
    const filteredActivities = result.data;

    // Trả về số lượng bài test chưa làm
    return { status: "OK", data: filteredActivities.length };
  } catch (error) {
    return { status: "ERR", message: error.message };
  }
};

module.exports = {
  createCategory,
  createActivity,
  updateActivity,
  deleteActivity,
  getAllQuizByTopic,
  getAllQuizByCategory,
  addQuestionsToActivity,
  getAllCategory,
  getCategoryByName,
  getTestAndReview,
  filterActivityReviewByTopic,
  getTestByUserNoDone,
  getCountTestNotDone,
};
