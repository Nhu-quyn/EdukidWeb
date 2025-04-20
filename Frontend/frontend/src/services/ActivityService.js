import axios from "axios";

const api_activity = `${process.env.REACT_APP_API}/activity`;

// export const createActivity = async (data) => {
//   console.log("API URL:", `$${api_activity}/create`);
//   try {
//     const response = await axios.post(`${api_activity}/create`, data);
//     console.log(response);
//     return response.data;
//   } catch (error) {
//     console.error("Lỗi từ API:", error.response?.data || error.message);
//     throw error;
//   }
// };
export const deleteActivity = async (id) => {
  try {
    const response = await axios.delete(
      `${api_activity}/delete-activity/${id}`
    );
    console.log("toi day " + response.data);
    return response.data;
  } catch (error) {
    // console.error("Lỗi từ API:", error.response?.data || error.message);
    console.log("Lỗi từ API:", error);

    throw error;
  }
};
export const updateActivity = async (id, data) => {
  try {
    console.log("tới đây");
    const response = await axios.put(
      `${api_activity}/update-activity/${id}`,
      data
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    // console.error("Lỗi từ API:", error.response?.data || error.message);
    console.log("Lỗi từ API:", error);

    throw error;
  }
};
export const getCategory = async (name) => {
  try {
    const response = await axios.post(`${api_activity}/category`, {
      categoryName: name,
    });

    return response.data;
  } catch (error) {
    console.log("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const getActivityByCategory = async (id) => {
  try {
    const response = await axios.get(`${api_activity}/get-all/${id}`);

    return response.data;
  } catch (error) {
    console.log("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const addQuestionToGame = async (questionIds) => {
  try {
    const dataCategory = await getCategory("game");
    const dataGame = await getActivityByCategory(dataCategory.data._id);
    console.log(dataGame);
    if (!dataGame.data || dataGame.data.length === 0) {
      throw new Error("Không tìm thấy game nào trong danh mục này.");
    }

    const gameId = dataGame.data[0]._id; // Lấy game đầu tiên trong danh sách
    const response = await axios.post(
      `${api_activity}/add-questions/${gameId}`,
      { questionIds }
    );

    // console.log("toi day ", response.data);
    return response.data;
  } catch (error) {
    console.log("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const addTestAndReview = async (data) => {
  try {
    // Chuyển mode thành string đúng định dạng
    // const modeString = typeof mode === "string" ? mode : mode?.type || "review";
    // console.log("Chế độ đã chuyển:", modeString); // Debug
    // console.log(modeString);
    const dataCategory = await getCategory(data.mode);

    // const dataActivity = await getActivityByCategory(dataCategory.data._id);
    console.log(dataCategory);
    const categoryId = dataCategory.data._id;
    data.categoryId = categoryId;
    console.log(data);
    const response = await axios.post(`${api_activity}/create`, data);
    console.log(response);
    return response.data;
    // console.log("toi day ", response.data);
    // return response.data;
  } catch (error) {
    console.log("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const getTestAndReview = async () => {
  try {
    const response = await axios.get(`${api_activity}/get-test-and-review`);

    return response.data;
  } catch (error) {
    console.log("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const addQuestionToActivity = async (questionIds, activityId) => {
  try {
    const response = await axios.post(
      `${api_activity}/add-questions/${activityId}`,
      { questionIds }
    );

    // console.log("toi day ", response.data);
    return response.data;
  } catch (error) {
    console.log("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const getActivityByReview = async () => {
  try {
    const dataReview = await getCategory("review");

    const reviewId = dataReview.data._id;
    const reviewResponse = await getActivityByCategory(reviewId);
    // console.log(reviewId);
    // const response = await axios.get(`${api_activity}/get-all/${reviewId}`);
    // console.log(reviewResponse);
    return reviewResponse;
  } catch (error) {
    console.log("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const getActivityByTest = async (userId) => {
  try {
    const dataTest = await getCategory("test");
    const testId = dataTest.data._id;
    const testResponse = await getActivityByCategory(testId);

    // const response = await axios.get(`${api_activity}/get-all/${reviewId}`);
    return testResponse;
  } catch (error) {
    console.log("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const filterActivityReviewByTopic = async (topicId, userId) => {
  try {
    const activitiesResponse = await getActivityByReview();
    // console.log(activitiesResponse);
    const activities = activitiesResponse?.data; // Tránh lỗi nếu data undefined
    // console.log("activities:", activities); // Kiểm tra dữ liệu trước khi gửi
    const response = await axios.post(
      `${api_activity}/filter-by-topic/${topicId}`,
      { activities, userId } // Truyền activities vào body
    );
    // console.log(response);
    return response.data;
  } catch (error) {
    console.log("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const testByUser = async (userId) => {
  try {
    // const activitiesResponse = await getActivityByReview();

    // const activities = activitiesResponse?.data; // Tránh lỗi nếu data undefined

    const response = await axios.get(
      `${api_activity}/test/${userId}`
      // Truyền activities vào body
    );
    return response.data;
  } catch (error) {
    console.log("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const countTest = async (userId) => {
  try {
    const response = await axios.get(
      `${api_activity}/count-test/${userId}`
      // Truyền activities vào body
    );
    return response.data;
  } catch (error) {
    console.log("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
// router.put("/update-activity/:id", ActivityController.updateActivity); //chua test
