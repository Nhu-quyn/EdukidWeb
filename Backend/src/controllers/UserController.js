const UserService = require("../services/UserService");

const createUser = async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, password, confirmPassword, isOAuth, isAdmin } =
      req.body;
    const re =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const isCheckEmail = re.test(email);
    if (!email || !password || !confirmPassword) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is email",
      });
    } else if (password !== confirmPassword) {
      return res.status(200).json({
        status: "ERR",
        message: "The password is equal confirmPassword",
      });
    }
    console.log("isCheckEmail", isCheckEmail);
    const result = await UserService.createUser(req.body);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const re =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const isCheckEmail = re.test(email);
    if (!email || !password) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is email",
      });
    }
    const result = await UserService.loginUser(req.body);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const loginWithGoogle = async (req, res) => {
  try {
    const token = req.headers.token?.split(" ")[1];
    // console.log("token", token);
    if (!token) {
      return res.status(400).json({
        status: "ERR",
        message: "Token is require!",
      });
    }

    const result = await UserService.loginWithGoogle(token);
    return res.status(200).json(result);
    // Kiểm tra xem user đã tồn tại trong database chưa (tuỳ bạn muốn lưu hay không)
    // let user = {
    //   uid,
    //   email,
    //   name,
    //   picture,
    // };

    // return res.status(200).json({
    //   status: "OK",
    //   message: "Đăng nhập thành công!",
    //   user,
    // });
  } catch (error) {
    return res.status(401).json({
      status: "ERR",
      message: "Invalid token!",
      details: error.message,
    });
  }
};
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    result = await UserService.updateUser(userId, data);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
// const updateAvatarUser = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const avatar = req.body.avatar;
//     if (!userId) {
//       return res.status(200).json({
//         status: "ERR",
//         message: "The userId is required",
//       });
//     }
//     result = await UserService.updateAvatarUser(userId, avatar);
//     return res.status(200).json(result);
//   } catch (e) {
//     return res.status(404).json({
//       message: e,
//     });
//   }
// };
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    // const token = req.headers.token;
    // console.log("token", token);
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    result = await UserService.deleteUser(userId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    // const token = req.headers.token;
    // console.log("token", token);
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    result = await UserService.getUserById(userId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const refreshToken = async (req, res) => {
  try {
    const token = req.headers.token.split(" ")[1];
    console.log(token);
    if (!token) {
      return res.status(200).json({
        status: "ERR",
        message: "The token is required",
      });
    }
    result = await UserService.refreshToken(token);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refreshToken");
    return res.status(200).json({
      status: "OK",
      message: "Logout successfully",
    });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const updateLearningProgress = async (req, res) => {
  try {
    const { activityId, userId, answer_questions } = req.body;

    if (!activityId || !userId || !answer_questions) {
      return res.status(400).json({
        status: "ERR",
        message:
          "Missing required fields: activityId, userId, or answer_questions",
      });
    }

    const result = await UserService.updateLearningProgress(
      activityId,
      userId,
      answer_questions
    );

    return res.status(200).json(result);
  } catch (e) {
    console.error("Error updating learning progress:", e);

    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal server error",
    });
  }
};

// const updateLeaderBoard = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const data = req.body;
//     if (!userId) {
//       return res.status(200).json({
//         status: "ERR",
//         message: "The userId is required",
//       });
//     }
//     result = await UserService.updateUser(userId, data);
//     return res.status(200).json(result);
//   } catch (e) {
//     return res.status(404).json({
//       message: e,
//     });
//   }
// };
const getAllLeaderBoard = async (req, res) => {
  try {
    const result = await UserService.getAllLeaderBoard();

    return res.status(200).json({
      status: "OK",
      data: result,
    });
  } catch (e) {
    console.error("Error fetching leaderboard:", e);

    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal server error",
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getUserById,
  refreshToken,
  logoutUser,
  loginWithGoogle,
  updateLearningProgress,
  // updateLeaderBoard,
  getAllLeaderBoard,
  // updateAvatarUser,
};
