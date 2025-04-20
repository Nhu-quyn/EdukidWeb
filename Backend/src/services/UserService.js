const User = require("../models/UserModel");
const Category = require("../models/CategoryModel");
const LeaderBoard = require("../models/LeaderBoardModel");
const Question = require("../models/QuestionModel");
const ActivityQuestion = require("../models/ActivityQuestion");
const Activity = require("../models/ActivityModel");
const LearningProgress = require("../models/LearningProgress");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const admin = require("firebase-admin");
dotenv.config();
const bcrypt = require("bcrypt");
const { generalAccessToken, generalRefreshToken } = require("./jwtService");
const { updateProgressVocabFromQuestion } = require("./ProgressVocabService");
const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { username, email, password, isOAuth, isAdmin } = newUser;
    try {
      const checkUser = await User.findOne({ email: email });
      if (!checkUser) {
        const hashPassword = bcrypt.hashSync(password, 10);
        const createUser = await User.create({
          username,
          email,
          password: hashPassword,
          isOAuth,
          isAdmin,
        });

        resolve({
          status: "OK",
          message: "Success",
          data: createUser,
        });
      } else {
        resolve({
          status: "ERR",
          message: "The email is already ",
          data: checkUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;
    try {
      const checkUser = await User.findOne({ email: email });
      if (!checkUser) {
        return {
          status: "ERR",
          message: "The user is not defined",
        };
      }
      const comparePassword = bcrypt.compareSync(password, checkUser.password);
      if (comparePassword) {
        const accessToken = await generalAccessToken({
          id: checkUser._id,
          isAdmin: checkUser.isAdmin,
        });
        const refreshToken = await generalRefreshToken({
          id: checkUser._id,
          isAdmin: checkUser.isAdmin,
        });
        console.log(accessToken);
        resolve({
          status: "OK",
          message: "success ",
          accessToken: accessToken,
          refreshToken: refreshToken,
          data: checkUser,
        });
      } else {
        resolve({
          status: "ERR",
          message: "The password is incorrect",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const updateUser = async (userId, data) => {
  try {
    const checkUser = await User.findById(userId);
    if (!checkUser) {
      return {
        status: "ERR",
        message: "The user is not defined",
      };
    }

    // Loại bỏ các trường có giá trị null, undefined hoặc ""
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(
        ([key, value]) => value !== null && value !== "" && value !== undefined
      )
    );

    // Kiểm tra nếu có mật khẩu thì băm nó
    if (filteredData.password) {
      filteredData.password = bcrypt.hashSync(filteredData.password, 10);
    }

    // Kiểm tra nếu có email thì phải đảm bảo email không trùng
    if (filteredData.email) {
      const checkUserByEmail = await User.findOne({
        email: filteredData.email,
      });
      if (
        checkUserByEmail &&
        checkUserByEmail._id.toString() !== checkUser._id.toString()
      ) {
        return {
          status: "ERR",
          message: "The email is already in use",
        };
      }
    }

    // Cập nhật user
    const updatedUser = await User.findByIdAndUpdate(userId, filteredData, {
      new: true,
    });

    return {
      status: "OK",
      message: "Update successful",
      data: updatedUser,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message,
    };
  }
};
// const updateAvatarUser = async (userId, avatar) => {
//   try {
//     const checkUser = await User.findById(userId);
//     if (!checkUser) {
//       return {
//         status: "ERR",
//         message: "The user is not defined",
//       };
//     }

//     // Loại bỏ các trường có giá trị null, undefined hoặc ""
//     const filteredData = Object.fromEntries(
//       Object.entries(data).filter(
//         ([key, value]) => value !== null && value !== "" && value !== undefined
//       )
//     );

//     // Kiểm tra nếu có mật khẩu thì băm nó
//     if (filteredData.password) {
//       filteredData.password = bcrypt.hashSync(filteredData.password, 10);
//     }

//     // Kiểm tra nếu có email thì phải đảm bảo email không trùng
//     if (filteredData.email) {
//       const checkUserByEmail = await User.findOne({
//         email: filteredData.email,
//       });
//       if (
//         checkUserByEmail &&
//         checkUserByEmail._id.toString() !== checkUser._id.toString()
//       ) {
//         return {
//           status: "ERR",
//           message: "The email is already in use",
//         };
//       }
//     }

//     // Cập nhật user
//     const updatedUser = await User.findByIdAndUpdate(userId, filteredData, {
//       new: true,
//     });

//     return {
//       status: "OK",
//       message: "Update successful",
//       data: updatedUser,
//     };
//   } catch (e) {
//     return {
//       status: "ERR",
//       message: e.message,
//     };
//   }
// };

const deleteUser = async (userId) => {
  try {
    const checkUser = await User.findById(userId);
    if (!checkUser) {
      return {
        status: "ERR",
        message: "The user is not defined",
      };
    }
    // console.log(checkUser);
    // await User.findByIdAndDelete(userId);
    return {
      status: "OK",
      message: "Success",
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message,
    };
  }
};
const getUserById = async (userId) => {
  try {
    const checkUser = await User.findById(userId);
    if (!checkUser) {
      return {
        status: "ERR",
        message: "The user is not defined",
      };
    }
    return {
      status: "OK",
      message: "Success",
      data: checkUser,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message,
    };
  }
};
const refreshToken = async (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
        if (err) {
          resolve({
            status: "ERROR",
            message: "The authentication",
          });
        }
        console.log(user);
        const { payload } = user;
        const accessToken = await generalAccessToken({
          id: payload?.id,
          isAdmin: payload?.isAdmin,
        });
        resolve({
          status: "OK",
          message: "Success",
          accessToken,
        });
      });
    } catch (e) {
      reject(e);
    }
  });
};
const loginWithGoogle = async (token) => {
  try {
    // Xác thực token với Firebase
    console.log(token);
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;

    // Kiểm tra xem user đã tồn tại hay chưa
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        avatar: picture,
        username: name,
        isOAuth: true,
      });
      return {
        status: "OK",
        message: "Login and account created successfully",
        data: user,
      };
    }
    const accessToken = await generalAccessToken({
      id: user._id,
      isAdmin: user.isAdmin,
    });
    const refreshToken = await generalRefreshToken({
      id: user._id,
      isAdmin: user.isAdmin,
    });
    return {
      status: "OK",
      message: "Login with Google successful",
      data: user,
      accessToken,
      refreshToken,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: "Invalid token or authentication failed",
      error: e.message,
    };
  }
};

// update hạng
// const updateLeaderBoard = async (userId, categoryId, newScore, oldScore) => {
//   try {
//     const checkUser = await User.findById(userId);
//     const checkCategory = await Category.findById(categoryId);
//     if (!checkUser || !checkCategory) {
//       return {
//         status: "ERR",
//         message: "Không tìm thấy người dùng hoặc danh mục.",
//       };
//     }

//     // --- Cập nhật bảng xếp hạng theo danh mục ---
//     let leaderBoardEntry = await LeaderBoard.findOne({ userId, categoryId });

//     if (!leaderBoardEntry) {
//       // await calculateLeaderBoard(); // Hàm này tạo lại bảng xếp hạng theo danh mục nếu cần
//       leaderBoardEntry = await LeaderBoard.create({
//         userId,
//         categoryId,
//         score: 0,
//         rank: 0,
//       });
//     }
//     // console.log("tới đây xếp hạng");
//     // console.log(leaderBoardEntry);
//     // if (!leaderBoardEntry) {
//     //   return {
//     //     status: "ERR",
//     //     message:
//     //       "Không thể tìm thấy bảng xếp hạng theo danh mục sau khi cập nhật.",
//     //   };
//     // }

//     // Cập nhật điểm cho bảng theo danh mục
//     leaderBoardEntry.score += newScore - oldScore;
//     console.log("leaderBoardEntry.score", leaderBoardEntry.score);
//     await leaderBoardEntry.save();
//     // console.log(newScore + " " + oldScore);
//     // console.log(leaderBoardEntry);
//     // --- Cập nhật bảng tổng (Overall LeaderBoard) ---
//     // Lấy danh mục tổng từ bảng Category (categoryName: "total")

//     const overallCategory = await Category.findOne({ categoryName: "total" });
//     if (!overallCategory) {
//       return {
//         status: "ERR",
//         message: "Không tìm thấy danh mục tổng (total) trong bảng Category.",
//       };
//     }

//     let overallEntry = await LeaderBoard.findOne({
//       userId,
//       categoryId: overallCategory._id,
//     });
//     console.log("overallEntry", overallEntry);
//     if (!overallEntry) {
//       overallEntry = new LeaderBoard({
//         userId,
//         categoryId: overallCategory._id,
//         core: 0,
//         rank: 0,
//       });
//     }
//     overallEntry.totalScore += newScore - oldScore;
//     await overallEntry.save();

//     // --- Kiểm tra nếu bạn là người đầu tiên ---
//     let categoryLeaderBoard = await LeaderBoard.find({ categoryId })
//       .sort({ score: -1 })
//       .exec();

//     let newCategoryRank = 1; // Mặc định là hạng 1 nếu không có ai
//     if (categoryLeaderBoard.length > 0) {
//       for (let i = 0; i < categoryLeaderBoard.length; i++) {
//         categoryLeaderBoard[i].rank = i + 1;
//         await categoryLeaderBoard[i].save();
//       }
//       newCategoryRank =
//         categoryLeaderBoard.findIndex((entry) => entry.userId.equals(userId)) +
//         1;
//     }

//     // --- Kiểm tra nếu bạn là người đầu tiên trong bảng tổng ---
//     let overallLeaderBoard = await LeaderBoard.find({
//       categoryId: overallCategory._id,
//     })
//       .sort({ totalScore: -1 })
//       .exec();

//     let newOverallRank = 1; // Mặc định hạng 1 nếu chỉ có mình bạn
//     if (overallLeaderBoard.length > 0) {
//       for (let i = 0; i < overallLeaderBoard.length; i++) {
//         overallLeaderBoard[i].rank = i + 1;
//         await overallLeaderBoard[i].save();
//       }
//       newOverallRank =
//         overallLeaderBoard.findIndex((entry) => entry.userId.equals(userId)) +
//         1;
//     }

//     // --- Kiểm tra khi lấy người trên và dưới ---
//     let aboveOverall =
//       newOverallRank > 1 ? overallLeaderBoard[newOverallRank - 2] : null;
//     let belowOverall =
//       newOverallRank < overallLeaderBoard.length
//         ? overallLeaderBoard[newOverallRank]
//         : null;

//     let aboveUser = aboveOverall
//       ? await User.findById(aboveOverall.userId).select("username")
//       : null;
//     let belowUser = belowOverall
//       ? await User.findById(belowOverall.userId).select("username")
//       : null;

//     // --- Xử lý thông báo ---
//     let message = `🎉 Điểm số đã cập nhật! Hạng trong danh mục: #${newCategoryRank}, Hạng tổng: #${newOverallRank}.`;

//     if (aboveUser && overallLeaderBoard.length > 1) {
//       message += ` 🚀 Bạn đã vượt qua ${aboveUser.username} trong bảng tổng! Tiếp tục nhé!`;
//     } else if (belowUser && overallLeaderBoard.length > 1) {
//       message += ` 📉 Cẩn thận! ${belowUser.username} đang đuổi sát bạn trong bảng tổng!`;
//     } else {
//       message += " 🔥 Hãy cố gắng để giữ vững vị trí!";
//     }

//     return {
//       status: "OK",
//       message,
//       data: {
//         categoryRank: newCategoryRank,
//         overallRank: newOverallRank,
//         categoryScore: leaderBoardEntry.score,
//         totalScore: overallEntry.score,
//       },
//     };
//   } catch (e) {
//     return {
//       status: "ERR",
//       message: e.message,
//     };
//   }
// };

//Cham diem

// Activity_test-quiz-game luôn
// const updateLearningProgress = async (activityId, userId, answer_questions) => {
//   try {
//     let learningProgress = await LearningProgress.findOne({
//       activityId,
//       userId,
//     });
//     // console.log("tới đấy");
//     const checkActivity = await Activity.findById(activityId).populate(
//       "categoryId"
//     );
//     const checkUser = await User.findById(userId);
//     if (!checkUser || !checkActivity) {
//       return {
//         status: "ERROR",
//         message: "Không tìm thấy người dùng hoặc hoạt động.",
//       };
//     }

//     if (!learningProgress) {
//       learningProgress = await LearningProgress.create({
//         score: 0,
//         percentComplete: 0,
//         lastUpdate: Date.now(),
//         activityId: checkActivity._id,
//         userId: checkUser._id,
//       });
//     }

//     // Lấy danh sách câu hỏi từ ActivityQuestion
//     const activityQuestions = await ActivityQuestion.find({ activityId });
//     const questionIds = activityQuestions.map((aq) => aq.questionId);

//     // Lấy danh sách câu hỏi từ Question và điền `questionTypeId`
//     const questions = await Question.find({
//       _id: { $in: questionIds },
//     }).populate("questionTypeId");

//     // Tạo object để truy cập nhanh dữ liệu câu hỏi
//     const questionMap = {};
//     questions.forEach((q) => {
//       questionMap[q._id] = {
//         correctAnswer: q.answer,
//         score: q.score,
//         type: q.questionTypeId?.questionTypeId || "", // Đảm bảo không bị undefined
//       };
//     });

//     // console.log("questionMap:", questionMap);
//     // console.log("answer_questions:", answer_questions);

//     // Tính điểm mới và số câu đúng/sai
//     let newScore = 0;
//     let correctCount = 0;
//     let incorrectCount = 0;
//     let correctQuestionIds = []; // Mảng lưu các ID câu hỏi đúng
//     answer_questions.forEach(({ questionId, selectedAnswer }) => {
//       const question = questionMap[questionId];

//       if (!question) {
//         console.warn(`Không tìm thấy câu hỏi với ID: ${questionId}`);
//         return; // Bỏ qua câu hỏi không có trong danh sách
//       }

//       if (String(question.type).trim() === "audio_record") {
//         if (selectedAnswer === true) {
//           newScore += question.score;
//           correctCount++;
//           correctQuestionIds.push(questionId); // Lưu ID của câu trả lời đúng
//           console.log(questionId);
//         } else {
//           incorrectCount++;
//         }
//       } else {
//         // console.log("Comparing:", question.correctAnswer, "vs", selectedAnswer);

//         if (
//           String(question.correctAnswer).trim() ===
//           String(selectedAnswer).trim()
//         ) {
//           newScore += question.score;
//           correctQuestionIds.push(questionId); // Lưu ID của câu trả lời đúng
//           console.log(questionId);
//           // console.log("newScore:", newScore);
//           correctCount++;
//         } else {
//           incorrectCount++;
//         }
//       }
//     });
//     try {
//       await updateProgressVocabFromQuestion(userId, correctQuestionIds);
//       console.log("Cập nhật tiến trình từ vựng thành công!");
//     } catch (error) {
//       console.error("Lỗi khi gọi updateProgressVocabFromQuestion:", error);
//     }

//     // //đúng tới đây
//     // console.log("Final Score:", newScore);
//     // console.log("Correct:", correctCount, "Incorrect:", incorrectCount);

//     // Nếu là ôn tập, trừ điểm cũ trước khi cập nhật
//     let updatedScore;
//     if (
//       checkActivity.categoryId &&
//       checkActivity.categoryId.categoryName !== "game"
//     ) {
//       updatedScore = newScore - learningProgress.score;
//     } else {
//       updatedScore = newScore;
//     }
//     // console.log("updatedScore", updatedScore);
//     // Phần trăm đúng trên tổng số câu hỏi
//     // if (
//     //   checkActivity.categoryId &&
//     //   checkActivity.categoryId.categoryName !== "game"
//     // ){

//     // }
//     const percentComplete =
//       questions.length > 0 ? (correctCount / questions.length) * 100 : 0;

//     let message;
//     // if (newScore > learningProgress.score) {
//     //   learningProgress.score += updatedScore;
//     //   learningProgress.percentComplete = percentComplete;
//     //   if (percentComplete === 100) {
//     //     message =
//     //       "🎉 Xuất sắc! Bạn đã hoàn thành tất cả câu hỏi một cách hoàn hảo! Tiếp tục phát huy nhé!";
//     //   } else if (percentComplete >= 80) {
//     message =
//       "🔥 Rất tốt! Bạn đã hoàn thành phần lớn các câu hỏi chính xác. Hãy thử sức với thử thách khó hơn nào!";
//     //   } else if (percentComplete >= 50) {
//     //     message =
//     //       "👍 Khá ổn! Bạn đã có tiến bộ, hãy ôn tập thêm để cải thiện kết quả nhé!";
//     //   } else {
//     //     message =
//     //       "💪 Bạn đang đi đúng hướng! Hãy cố gắng luyện tập thêm để đạt kết quả tốt hơn!";
//     //   }
//     // } else {
//     //   if (percentComplete === 0) {
//     //     message =
//     //       "😢 Có vẻ bạn chưa trả lời đúng câu nào. Hãy thử lại và đừng bỏ cuộc!";
//     //   } else {
//     //     message =
//     //       "📉 Kết quả chưa như mong đợi! Bạn có thể làm tốt hơn. Hãy thử lại nào!";
//     //   }
//     // }

//     learningProgress.lastUpdate = Date.now();
//     await learningProgress.save();
//     let rankData = 0;
//     let updateLearningProgress;
//     try {
//       if (
//         checkActivity.categoryId &&
//         checkActivity.categoryId.categoryName.trim().toLowerCase() !== "game"
//       ) {
//         // console.log("Vào nhánh if");
//         if (newScore > learningProgress.score) {
//           const rankDataObj = await updateLeaderBoard(
//             userId,
//             checkActivity.categoryId,
//             newScore,
//             learningProgress.score
//           );
//           updateLearningProgress = await LearningProgress.findOneAndUpdate(
//             { userId: userId, activityId: activityId }, // Điều kiện tìm kiếm
//             {
//               $set: {
//                 score: newScore,
//                 lastUpdate: Date.now(),
//               },
//             },
//             { new: true } // Trả về bản ghi đã cập nhật
//           );
//           rankData = rankDataObj.data.categoryRank;
//         } else {
//           const rankDataObj = await LeaderBoard.findOne({
//             userId,
//             categoryId: checkActivity.categoryId,
//           });
//           rankData = rankDataObj.rank;
//         }
//       } else if (
//         checkActivity.categoryId &&
//         checkActivity.categoryId.categoryName.trim().toLowerCase() === "game"
//       ) {
//         // console.log("Vào nhánh else if");
//         const rankDataObj = await updateLeaderBoard(
//           userId,
//           checkActivity.categoryId,
//           newScore,
//           0
//         );
//         rankData = rankDataObj.data.categoryRank;
//         const updateScore = learningProgress.score + newScore;
//         updateLearningProgress = await LearningProgress.findOneAndUpdate(
//           { userId: userId, activityId: activityId }, // Điều kiện tìm kiếm
//           {
//             $set: {
//               score: updateScore,
//               lastUpdate: Date.now(),
//             },
//           },
//           { new: true } // Trả về bản ghi đã cập nhật
//         );
//       } else {
//         console.log("Không vào cả if lẫn else if");
//       }
//     } catch (error) {
//       console.error("Lỗi khi kiểm tra category:", error);
//     }
//     // console.log(rankData);

//     return {
//       status: "OK",
//       message,
//       data: {
//         rank: rankData,
//         score: learningProgress.score,
//         percentComplete,
//         correctCount,
//         incorrectCount,
//       },
//     };
//   } catch (e) {
//     return {
//       status: "ERR",
//       message: e.message,
//     };
//   }
// };
const updateLeaderBoard = async (userId, categoryId) => {
  try {
    // Kiểm tra user và category có tồn tại không
    const checkUser = await User.findById(userId);
    const checkCategory = await Category.findById(categoryId);
    if (!checkUser || !checkCategory) {
      return {
        status: "ERR",
        message: "Không tìm thấy người dùng hoặc danh mục.",
      };
    }
    // console.log("hehe");
    // Tìm hoặc tạo mới LeaderBoard cho user theo category
    let leaderBoardEntry = await LeaderBoard.findOne({ userId, categoryId });
    if (!leaderBoardEntry) {
      leaderBoardEntry = await LeaderBoard.create({
        userId,
        categoryId,
        score: 0, // Khởi tạo tổng điểm
        rank: 0,
      });
    }

    // Lấy tất cả LearningProgress của user theo categoryId
    // const learningProgress = await LearningProgress.find({ userId }).populate({
    //   path: "activityId",
    //   populate: {
    //     path: "categoryId", // Nếu categoryId cũng là ObjectId và bạn muốn lấy luôn
    //   },
    // });

    const learningProgress = await LearningProgress.find({ userId }).populate(
      "activityId"
    );

    console.log("Kiểu dữ liệu của categoryId bên ngoài:", typeof categoryId);

    const categoryProgress = learningProgress.filter((progress) => {
      if (!progress.activityId) return false; // Tránh lỗi nếu activityId không tồn tại

      // console.log("Kiểu của progress.activityId.categoryId:", typeof progress.activityId.categoryId);
      // console.log("Kiểu của categoryId:", typeof categoryId);

      return progress.activityId.categoryId.equals(categoryId);
    });

    console.log("categoryProgress", categoryProgress);
    // Tính tổng điểm của user trong category
    const totalCategoryScore = categoryProgress.reduce(
      (sum, progress) => sum + progress.score,
      0
    );

    // Cập nhật điểm trong LeaderBoard
    leaderBoardEntry.score = totalCategoryScore;
    await leaderBoardEntry.save();

    // Xếp hạng trong bảng category
    const categoryLeaderBoard = await LeaderBoard.find({ categoryId }).sort({
      score: -1,
    });

    categoryLeaderBoard.forEach(async (entry, index) => {
      entry.rank = index + 1;
      await entry.save();
    });

    // --- Xử lý tổng (total) ---
    const overallCategory = await Category.findOne({ categoryName: "total" });
    if (!overallCategory) {
      return {
        status: "ERR",
        message: "Không tìm thấy danh mục tổng (total).",
      };
    }

    let overallEntry = await LeaderBoard.findOne({
      userId,
      categoryId: overallCategory._id,
    });

    if (!overallEntry) {
      overallEntry = await LeaderBoard.create({
        userId,
        categoryId: overallCategory._id,
        score: 0,
        rank: 0,
      });
    }

    // Tính tổng điểm của user trong tất cả các danh mục
    const totalScore = Array.isArray(learningProgress)
      ? learningProgress.reduce(
          (sum, progress) => sum + (progress.score || 0),
          0
        )
      : 0;

    overallEntry.score = totalScore;
    await overallEntry.save();

    // Xếp hạng tổng
    const overallLeaderBoard = await LeaderBoard.find({
      categoryId: overallCategory._id,
    }).sort({ score: -1 });

    overallLeaderBoard.forEach(async (entry, index) => {
      entry.rank = index + 1;
      await entry.save();
    });

    overallEntry = await LeaderBoard.findOne({
      userId,
      categoryId: overallCategory._id,
    });
    return {
      status: "OK",
      message: `🎉 Điểm số đã cập nhật! Hạng trong danh mục: #${leaderBoardEntry.rank}, Hạng tổng: #${overallEntry.rank}.`,
      data: {
        categoryRank: leaderBoardEntry.rank,
        overallRank: overallEntry.rank,
        categoryScore: leaderBoardEntry.score,
        totalScore: overallEntry.score,
      },
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message,
    };
  }
};

const updateLearningProgress = async (activityId, userId, answer_questions) => {
  try {
    let learningProgress = await LearningProgress.findOne({
      activityId,
      userId,
    });

    const checkActivity = await Activity.findById(activityId).populate(
      "categoryId"
    );
    const checkUser = await User.findById(userId);

    if (!checkUser || !checkActivity) {
      return {
        status: "ERROR",
        message: "Không tìm thấy người dùng hoặc hoạt động.",
      };
    }

    if (!learningProgress) {
      learningProgress = await LearningProgress.create({
        score: 0,
        percentComplete: 0,
        lastUpdate: Date.now(),
        activityId: checkActivity._id,
        userId: checkUser._id,
      });
    }

    const activityQuestions = await ActivityQuestion.find({ activityId });
    const questionIds = activityQuestions.map((aq) => aq.questionId);

    const questions = await Question.find({
      _id: { $in: questionIds },
    }).populate("questionTypeId");

    const questionMap = {};
    questions.forEach((q) => {
      questionMap[q._id] = {
        correctAnswer: q.answer,
        score: q.score,
        type: q.questionTypeId?.questionTypeId || "",
      };
    });

    let newScore = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let correctQuestionIds = [];

    answer_questions.forEach(({ questionId, selectedAnswer }) => {
      const question = questionMap[questionId];

      if (!question) {
        console.warn(`Không tìm thấy câu hỏi với ID: ${questionId}`);
        return;
      }

      if (String(question.type).trim() === "audio_record") {
        if (selectedAnswer === true) {
          newScore += question.score;
          correctCount++;
          correctQuestionIds.push(questionId);
        } else {
          incorrectCount++;
        }
      } else {
        if (
          String(question.correctAnswer).trim().toLowerCase() ===
          String(selectedAnswer).trim().toLowerCase()
        ) {
          newScore += question.score;
          correctCount++;
          correctQuestionIds.push(questionId);
        } else {
          incorrectCount++;
        }
      }
    });

    try {
      await updateProgressVocabFromQuestion(userId, correctQuestionIds);
    } catch (error) {
      console.error("Lỗi khi cập nhật tiến trình từ vựng:", error);
    }

    const percentComplete =
      questions.length > 0 ? (correctCount / questions.length) * 100 : 0;

    let message =
      "🔥 Rất tốt! Bạn đã hoàn thành phần lớn các câu hỏi chính xác. Hãy thử sức với thử thách khó hơn nào!";

    let updateLearningProgress;

    if (
      checkActivity.categoryId &&
      checkActivity.categoryId.categoryName.trim().toLowerCase() === "game"
    ) {
      const updateScore = learningProgress.score + newScore;
      updateLearningProgress = await LearningProgress.findOneAndUpdate(
        { userId, activityId },
        {
          $set: {
            score: updateScore,
            lastUpdate: Date.now(),
          },
        },
        { new: true }
      );
    } else if (
      checkActivity.categoryId &&
      checkActivity.categoryId.categoryName.trim().toLowerCase() !== "game"
    ) {
      console.log("newScore", newScore);
      if (newScore > learningProgress.score) {
        updateLearningProgress = await LearningProgress.findOneAndUpdate(
          { userId, activityId },
          {
            $set: {
              score: newScore,
              percentComplete: percentComplete,
              lastUpdate: Date.now(),
            },
          },
          { new: true }
        );
      } else {
        updateLearningProgress = learningProgress;
      }
    }
    const updateLeaderBoardObj = await updateLeaderBoard(
      userId,
      checkActivity.categoryId._id
    );
    console.log(updateLeaderBoardObj);
    return {
      status: "OK",
      message,
      data: {
        newScore,
        score: updateLearningProgress.score,
        percentComplete,
        correctCount,
        incorrectCount,
        rank: updateLeaderBoardObj.data.overallRank,
        // categoryRank: leaderBoardEntry.rank,
        // overallRank: overallEntry.rank,
        scoreTotal: updateLeaderBoardObj.data.totalScore,
        // score: totalScore: overallEntry.score,
      },
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message,
    };
  }
};

//Kiem tra lại (lỗi  Object
// message
// :
// "Cannot read properties of undefined (reading 'categoryRank')"
// status
// :
// "ERR")

const getAllLeaderBoard = async () => {
  try {
    const leaderBoards = await LeaderBoard.find()
      .populate("userId", "_id username avatar")
      .populate("categoryId", "categoryName");
    return {
      status: "OK",
      message: "Success",
      data: leaderBoards,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message,
    };
  }
};
const updateAvatar = async (userId, avatar) => {
  try {
    const checkUser = await User.findById(userId);
    if (!checkUser) {
      return {
        status: "ERR",
        message: "The user is not defined",
      };
    }
    console.log(avatar);
    const updateAvatarUser = await User.findByIdAndUpdate(userId, {
      avatar: avatar,
    });
    return {
      status: "OK",
      message: "Success",
      data: updateAvatarUser,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message,
    };
  }
};
const updatePassword = async (userId, currentPassword, newPassword) => {
  try {
    const checkUser = await User.findById(userId);
    if (!checkUser) {
      return {
        status: "ERR",
        message: "The user is not defined",
      };
    }
    const comparePassword = bcrypt.compareSync(
      currentPassword,
      checkUser.password
    );
    if (!comparePassword) {
      return {
        status: "ERR",
        message: "Nhập mật khẩu hiện tại không đúng!",
      };
    }
    const hashPassword = bcrypt.hashSync(newPassword, 10);
    const updatePasswordUser = await User.findByIdAndUpdate(userId, {
      password: hashPassword,
    });

    return {
      status: "OK",
      message: "Success",
      data: updatePasswordUser,
      // data: updateAvatarUser,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message,
    };
  }
};
//chua test

module.exports = {
  createUser,
  loginUser,
  loginWithGoogle,
  updateUser,
  deleteUser,
  getUserById,
  refreshToken,
  updateLearningProgress,
  updateLeaderBoard,
  getAllLeaderBoard,
  updateAvatar,
  updatePassword,
};
//xoa chua dc mở
// const mau = async (token) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       resolve({
//         status: "OK",
//         message: "Success",
//       });
//     } catch (e) {
//       reject(e);
//     }
//   });
// };
