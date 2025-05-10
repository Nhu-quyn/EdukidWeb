const Topic = require("../models/TopicModel");
const createTopic = (newTopic) => {
  return new Promise(async (resolve, reject) => {
    const {
      topicName,
      topicVietnamese,
      topicDescription,
      topicImage,
      topicVideo,
    } = newTopic;
    try {
      const checkTopic = await Topic.findOne({
        topicName: { $regex: new RegExp(`^${topicName}$`, "i") },
      });

      if (!checkTopic) {
        const createTopic = await Topic.create({
          topicName,
          topicVietnamese,
          topicDescription,
          topicImage,
          topicVideo,
        });

        resolve({
          status: "OK",
          message: "Success",
          data: createTopic,
        });
      } else {
        resolve({
          status: "ERR",
          message: "The topic is already ",
          data: checkTopic,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const updateTopic = (topicId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkTopic = await Topic.findById(topicId);
      if (!checkTopic) {
        return {
          status: "ERROR",
          message: "Topic undefined",
        };
      }

      // Loại bỏ các trường có giá trị null
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== null)
      );

      // Cập nhật dữ liệu mới nếu có trường hợp lệ
      if (Object.keys(filteredData).length === 0) {
        return resolve({
          status: "ERROR",
          message: "No valid data to update",
        });
      }

      const updatedTopic = await Topic.findByIdAndUpdate(
        topicId,
        filteredData,
        {
          new: true,
        }
      );

      resolve({
        status: "OK",
        message: "Successful update!",
        updatedTopic,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const deleteTopic = async (topicId) => {
  try {
    const checkTopic = await Topic.findById(topicId);
    if (!checkTopic) {
      return {
        status: "ERROR",
        message: "Topic undefined",
      };
    }
    await Topic.findByIdAndDelete(topicId);
    return {
      status: "OK",
      message: "Successful deleted!",
    };
  } catch (e) {}
};
const getAllTopic = async () => {
  try {
    const data = await Topic.find(); // Lấy tất cả topic từ database
    return {
      status: "OK",
      message: "Lấy danh sách chủ đề thành công!",
      data,
    };
  } catch (error) {
    return {
      status: "ERROR",
      message: "Lỗi khi lấy danh sách chủ đề!",
      error: error.message,
    };
  }
};

const getTopic = async (topicId) => {
  try {
    const checkTopic = await Topic.findById(topicId);
    if (!checkTopic) {
      return {
        status: "ERROR",
        message: "Topic undefined",
      };
    }
    const topic = await Topic.findById(topicId);
    return {
      status: "OK",
      message: "Successful",
      data: topic,
    };
  } catch (e) {}
};
module.exports = {
  createTopic,
  updateTopic,
  deleteTopic,
  getAllTopic,
  getTopic,
};

//delete update chưa test
