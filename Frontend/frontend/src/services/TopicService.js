import axios from "axios";

const api_topic = `${process.env.REACT_APP_API}/topic`;

export const createTopic = async (data) => {
  try {
    const response = await axios.post(`${api_topic}/create`, data);
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const deleteTopic = async (id) => {
  try {
    const response = await axios.delete(`${api_topic}/delete-topic/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const getTopic = async (id) => {
  try {
    const response = await axios.get(`${api_topic}/get-topic/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const updateTopic = async (id, data) => {
  try {
    const response = await axios.put(`${api_topic}/update-topic/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
export const getAllTopic = async () => {
  try {
    const response = await axios.get(`${api_topic}/get-all`);
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};
