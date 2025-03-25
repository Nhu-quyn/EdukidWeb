import axios from "axios";

const api_question = `${process.env.REACT_APP_API}/question`;

export const createQuestion = async (data) => {
  console.log("API URL:", `$${api_question}/create`);
  try {
    const response = await axios.post(`${api_question}/create`, data);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const deleteQuestion = async (id) => {
  try {
    const response = await axios.delete(
      `${api_question}/delete-question/${id}`
    );
    console.log("toi day " + response.data);
    return response.data;
  } catch (error) {
    // console.error("Lỗi từ API:", error.response?.data || error.message);
    console.log("Lỗi từ API:", error);

    throw error;
  }
};
export const updateQuestion = async (id, data) => {
  try {
    const response = await axios.put(
      `${api_question}/update-question/${id}`,
      data
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const getAllQuestions = async () => {
  try {
    const response = await axios.get(`${api_question}/questions`);
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const getAllQuestionTypes = async () => {
  try {
    const response = await axios.get(`${api_question}/question-types`);
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const getQuestionsWithGameByTopic = async (userId, topicId) => {
  try {
    const response = await axios.get(
      `${api_question}/get-question-game?userId=${userId}&topicId=${topicId}`
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const getQuestionsWithGame = async (userId) => {
  try {
    const response = await axios.get(
      `${api_question}/get-question-game/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const getPublicQuestionsByTopic = async (topicId) => {
  try {
    const response = await axios.get(
      `${api_question}/get-question-game-public/${topicId}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const getPublicQuestions = async () => {
  try {
    const response = await axios.get(
      `${api_question}/get-question-game-public`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const getQuestionByActivity = async (activityId) => {
  try {
    const response = await axios.get(
      `${api_question}/get-by-activity/${activityId}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
// router.get(
//   "/get-by-activity/:activityId",
//   QuestionController.getQuestionByActivity
// );
// router.get("/get-question", QuestionController.getQuestionsWithGame);
// router.get(
//   "/get-question-game",
//   QuestionController.getQuestionsWithGameByTopic
// );

// router.get(
//   "/get-question-game-public/:topicId",
//   QuestionController.getPublicQuestionsByTopic
// );
// router.get("/get-question-game-public", QuestionController.getPublicQuestions);

// router.get(
//   "/get-question-game/:userId",
//   QuestionController.getQuestionsWithGame
// );
