import axios from "axios";

const api_vocabulary = `${process.env.REACT_APP_API}/vocabulary`;

export const createVocabulary = async (data) => {
  try {
    const response = await axios.post(`${api_vocabulary}/create`, data);
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteVocabulary = async (id) => {
  try {
    console.log(id);
    const response = await axios.delete(
      `${api_vocabulary}/delete-vocabulary/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const updateVocabulary = async (id, data) => {
  try {
    const response = await axios.put(
      `${api_vocabulary}/update-vocabulary/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const getAllVocabulary = async () => {
  try {
    const response = await axios.get(`${api_vocabulary}/get-all`);
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};

export const getVocabularyTopic = async (topicId) => {
  try {
    const response = await axios.get(`${api_vocabulary}/get-vocab/${topicId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
