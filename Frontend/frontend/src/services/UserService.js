import axios from "axios";
import { signInWithPopup } from "firebase/auth"; // Đảm bảo import đúng
import { auth, provider } from "./firebaseConfig";
const api_user = `${process.env.REACT_APP_API}/user`;

export const loginUser = async (data) => {
  try {
    console.log("Đang gửi request đến:", `${api_user}/sign-in`);
    const response = await axios.post(`${api_user}/sign-in`, data);
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const registerUser = async (data) => {
  try {
    console.log("Đang gửi request đến:", `${api_user}/sign-up`);
    const response = await axios.post(`${api_user}/sign-up`, data);
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const getUser = async (id) => {
  try {
    // console.log("Đang gửi request đến:", `${api_user}/sign-up`);
    const response = await axios.get(`${api_user}/get-user/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};

export const updateUser = async (id, data) => {
  try {
    // console.log("Đang gửi request đến:", `${api_user}/sign-up`);
    const response = await axios.put(`${api_user}/update-user/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
// router.get("/get-user/:id", authMiddleWare, userController.getUserById);
// Hàm đăng nhập Google và gửi token lên backend
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken(); // Lấy token từ Firebase

    // Gửi token lên backend để xác thực
    const response = await axios.post(
      `${api_user}/google-sign-in`, // API xử lý đăng nhập Google
      {},
      {
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${idToken}`, // Truyền token vào headers
        },
      }
    );

    return response.data; // Trả về dữ liệu từ backend
  } catch (error) {
    console.error("Đăng nhập thất bại:", error);
  }
};
export const getCategory = async (name) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API}/activity/category`,
      {
        categoryName: name,
      }
    );

    return response.data;
  } catch (error) {
    console.log("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const getActivityByCategory = async (id) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/activity/get-all/${id}`
    );

    return response.data;
  } catch (error) {
    console.log("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const updateLearningProgressGame = async (userId, answer_questions) => {
  try {
    const dataCategory = await getCategory("game");
    const dataGame = await getActivityByCategory(dataCategory.data._id);

    if (!dataGame.data || dataGame.data.length === 0) {
      throw new Error("Không tìm thấy game nào trong danh mục này.");
    }

    // Không sử dụng biến `data` trước khi khai báo
    const gameId = dataGame.data[0]._id;
    const requestData = {
      activityId: gameId,
      userId: userId,
      answer_questions,
    };
    console.log(requestData);
    console.log(
      "Đang gửi request đến:",
      `${api_user}/update-learning-progress`
    );
    const response = await axios.post(
      `${api_user}/update-learning-progress`,
      requestData
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const updateLearningProgressActivity = async (
  activityId,
  userId,
  answerQuestions
) => {
  try {
    const requestData = {
      activityId: activityId,
      userId: userId,
      answer_questions: answerQuestions,
    };
    console.log(requestData);
    console.log(
      "Đang gửi request đến:",
      `${api_user}/update-learning-progress`
    );
    const response = await axios.post(
      `${api_user}/update-learning-progress`,
      requestData
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const getAllLeaderBoard = async () => {
  try {
    const response = await axios.get(`${api_user}/leader-board/get-all`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
// router.put("/leader-board/get-all", userController.getAllLeaderBoard);
// router.put("/update-learning-progress", userController.updateLearningProgress);
// router.put("/leader-board/get-all", userController.getAllLeaderBoard);
