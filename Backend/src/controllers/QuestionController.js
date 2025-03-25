const QuestionService = require("../services/QuestionService");
const createQuestionType = async (req, res) => {
  try {
    const { questionTypeId, questionTypeName } = req.body;

    if (!questionTypeId || !questionTypeName) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    const result = await QuestionService.createQuestionType(req.body);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const createQuestion = async (req, res) => {
  try {
    const {
      questionContent,
      answer,
      options,
      word,
      image,
      score,
      questionLevel,
      questionTypeId,
      topicId,
      vocabularyId,
    } = req.body;

    const result = await QuestionService.createQuestion(req.body);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getAllQuestions = async (req, res) => {
  try {
    const result = await QuestionService.getAllQuestions();
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getAllQuestionTypes = async (req, res) => {
  try {
    const result = await QuestionService.getAllQuestionTypes();
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const result = await QuestionService.deleteQuestion(questionId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getQuestionsWithGame = async (req, res) => {
  try {
    const userId = req.params.userId;
    // const topicId = req.query.topicId;
    const result = await QuestionService.getQuestionsWithGame(userId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getPublicQuestions = async (req, res) => {
  try {
    // console.log("tới đây");
    // const topicId = req.query.topicId;
    const result = await QuestionService.getPublicQuestions();
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getPublicQuestionsByTopic = async (req, res) => {
  try {
    const topicId = req.params.topicId;
    const result = await QuestionService.getPublicQuestionsByTopic(topicId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getQuestionsWithGameByTopic = async (req, res) => {
  try {
    const userId = req.query.userId;
    const topicId = req.query.topicId;
    // console.log(topicId);
    const result = await QuestionService.getQuestionsWithGameByTopic(
      userId,
      topicId
    );

    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getQuestionByActivity = async (req, res) => {
  try {
    const activityId = req.params.activityId;
    // console.log(topicId);
    const result = await QuestionService.getQuestionByActivity(activityId);

    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const updateQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const data = req.body;
    // console.log(topicId);
    const result = await QuestionService.updateQuestion(questionId, data);

    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
module.exports = {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  createQuestionType,
  getAllQuestions,
  getAllQuestionTypes,
  getPublicQuestions,
  getPublicQuestionsByTopic,
  getQuestionsWithGame,
  getQuestionsWithGameByTopic,
  getQuestionByActivity,
};
