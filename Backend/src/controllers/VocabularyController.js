const VocabularyService = require("../services/VocabularyService");

const createVocabulary = async (req, res) => {
  try {
    const {
      // VocabularyName,
      topicId,
      vocabulary,
      meaning,
      partOfSpeech,
      vocabularyImage,
      vocabularyIpa,
    } = req.body;

    if (
      !topicId ||
      !vocabulary ||
      !meaning ||
      !partOfSpeech ||
      !vocabularyImage ||
      !vocabularyIpa
    ) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    const result = await VocabularyService.createVocabulary(req.body);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const updateVocabulary = async (req, res) => {
  try {
    const data = req.body;
    const vocabularyId = req.params.id;

    if (!vocabularyId) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    const result = await VocabularyService.updateVocabulary(vocabularyId, data);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const deleteVocabulary = async (req, res) => {
  try {
    const vocabularyId = req.params.id;

    if (!vocabularyId) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    const result = await VocabularyService.deleteVocabulary(vocabularyId);
    console.log(result);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getAllVocabulary = async (req, res) => {
  try {
    const result = await VocabularyService.getAllVocabulary();
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getVocabularyTopic = async (req, res) => {
  try {
    const topicId = req.params.topicId;
    if (!topicId) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const result = await VocabularyService.getVocabularyTopic(topicId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
module.exports = {
  createVocabulary,
  updateVocabulary,
  deleteVocabulary,
  getAllVocabulary,
  getVocabularyTopic,
};
