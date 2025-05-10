const TopicService = require("../services/TopicService");

const createTopic = async (req, res) => {
  try {
    const {
      topicName,
      topicVietnamese,
      topicDescription,
      topicImage,
      topicVideo,
    } = req.body;

    if (!topicName || !topicVietnamese || !topicImage || !topicVideo) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    const result = await TopicService.createTopic(req.body);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const updateTopic = async (req, res) => {
  try {
    const data = req.body;
    const topicId = req.params.id;

    if (!topicId) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    const result = await TopicService.updateTopic(topicId, data);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const deleteTopic = async (req, res) => {
  try {
    const topicId = req.params.id;

    if (!topicId) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    const result = await TopicService.deleteTopic(topicId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getAllTopic = async (req, res) => {
  try {
    const result = await TopicService.getAllTopic();
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getTopic = async (req, res) => {
  try {
    const topicId = req.params.id;

    if (!topicId) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    const result = await TopicService.getTopic(topicId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
module.exports = {
  createTopic,
  updateTopic,
  deleteTopic,
  getAllTopic,
  getTopic,
};
