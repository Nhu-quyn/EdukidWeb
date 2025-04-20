import axios from "axios";

const api_learningGoal = `${process.env.REACT_APP_API}/learning-goal`;

export const createLearningGoal = async (data) => {
  console.log("API URL:", `$${api_learningGoal}/create`);
  try {
    const response = await axios.post(`${api_learningGoal}/create`, data);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const getAllLearningGoal = async (userId) => {
  console.log("API URL:", `${api_learningGoal}/get-all/${userId}`);
  try {
    const response = await axios.get(`${api_learningGoal}/get-all/${userId}`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const updateStatus = async (id, status) => {
  console.log("API URL:", `${api_learningGoal}/update-status`);
  try {
    const response = await axios.put(`${api_learningGoal}/update-status`, {
      id,
      status,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const updateLearningGoal = async (id, data) => {
  console.log("API URL:", `${api_learningGoal}/update/${id}`);
  try {
    const response = await axios.put(`${api_learningGoal}/update/${id}`, data);
    // console.log(response);
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const deleteLearningGoal = async (id) => {
  console.log("API URL:", `${api_learningGoal}/delete/${id}`);
  try {
    const response = await axios.delete(`${api_learningGoal}/delete/${id}`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
// router.delete("/delete/:id", LearningController.deleteLearningGoal);
// router.put("/update/:id", LearningController.updateLearningGoal);

// router.get("/get-all/:userId", LearningController.getAllLearningGoal);
// export const deleteLearningGoal = async (id) => {
//   try {
//     const response = await axios.delete(
//       `${api_learningGoal}/delete-learning-goal/${id}`
//     );
//     console.log("toi day " + response.data);
//     return response.data;
//   } catch (error) {
//     // console.error("Lỗi từ API:", error.response?.data || error.message);
//     console.log("Lỗi từ API:", error);

//     throw error;
//   }
// };

// updateLearningGoal
//updateStatusLearningGoal

// router.post("/create", LearningController.createLearningGoal);

// router.put("/update-activity/:id", ActivityController.updateActivity); //chua test
