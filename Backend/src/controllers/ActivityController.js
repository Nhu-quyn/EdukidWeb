const ActivityService = require("../services/ActivityService");
const createCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    const result = await ActivityService.createCategory(req.body);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const createActivity = async (req, res) => {
  try {
    const {
      activityId,
      activityDescription,
      activityName,
      activityLevel,
      testTime,
      categoryId,
      questionIds,
    } = req.body;

    if (!categoryId || !activityName || !activityId) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const result = await ActivityService.createActivity(req.body);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const updateActivity = async (req, res) => {
  try {
    const data = req.body;
    const activityId = req.params.id;
    console.log("controll", data);
    if (!activityId) {
      return res.status(200).json({
        status: "ERR",
        message: "The activityId is required",
      });
    }
    // // Kiểm tra dữ liệu đầu vào
    // if (!Object.keys(data).length) {
    //   return res.status(400).json({
    //     status: "ERR",
    //     message: "No data provided for update",
    //   });
    // }
    // console.log("tới đây");
    // ActivityService.updateActivity
    const result = await ActivityService.updateActivity(activityId, data);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const deleteActivity = async (req, res) => {
  try {
    const activityId = req.params.id;

    if (!activityId) {
      return res.status(200).json({
        status: "ERR",
        message: "The activityId is required",
      });
    }
    const result = await ActivityService.deleteActivity(activityId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getTestAndReview = async (req, res) => {
  try {
    // const activityId = req.params.id;
    // const {} = req.body;

    // if (!activityId) {
    //   return res.status(200).json({
    //     status: "ERR",
    //     message: "The activityId is required",
    //   });
    // }
    const result = await ActivityService.getTestAndReview();
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getAllQuizByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    if (!categoryId) {
      return res.status(200).json({
        status: "ERR",
        message: "The categoryId is required",
      });
    }
    const result = await ActivityService.getAllQuizByCategory(categoryId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getCategoryByName = async (req, res) => {
  try {
    const categoryName = req.body.categoryName;
    if (!categoryName) {
      return res.status(200).json({
        status: "ERR",
        message: "The categoryName is required",
      });
    }
    const result = await ActivityService.getCategoryByName(categoryName);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getAllQuizByTopic = async (req, res) => {
  try {
    const topicId = req.params.id;

    if (!topicId) {
      return res.status(200).json({
        status: "ERR",
        message: "The topicId  is required",
      });
    }
    const result = await ActivityService.getAllQuizByTopic(topicId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const addQuestionsToActivity = async (req, res) => {
  try {
    const activityId = req.params.activityId;
    const questionIds = req.body.questionIds;

    if (!activityId) {
      return res.status(200).json({
        status: "ERR",
        message: "The activityId is required",
      });
    }
    const result = await ActivityService.addQuestionsToActivity(
      activityId,
      questionIds
    );
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const result = await ActivityService.getAllCategory();
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const filterActivityReviewByTopic = async (req, res) => {
  try {
    const topicId = req.params.topicId;
    const { activities, userId } = req.body;
    // console.log(req.body);
    const result = await ActivityService.filterActivityReviewByTopic(
      topicId,
      activities,
      userId
    );
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getTestByUserNoDone = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await ActivityService.getTestByUserNoDone(userId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getCountTestNotDone = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await ActivityService.getCountTestNoDone(userId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
module.exports = {
  createCategory,
  createActivity,
  updateActivity,
  deleteActivity,
  getAllQuizByTopic,
  addQuestionsToActivity,
  getAllQuizByCategory,
  getAllCategory,
  getCategoryByName,
  getTestAndReview,
  filterActivityReviewByTopic,
  getTestByUserNoDone,
  getCountTestNotDone,
};
