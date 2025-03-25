const Vocabulary = require("../models/VocabularyModel");
const Topic = require("../models/TopicModel");
const createVocabulary = (newVocabulary) => {
  return new Promise(async (resolve, reject) => {
    const {
      topicId,
      vocabulary,
      meaning,
      partOfSpeech,
      vocabularyImage,
      vocabularyIpa,
    } = newVocabulary;
    try {
      const checkVocabulary = await Vocabulary.findOne({
        vocabulary: vocabulary,
      });
      const checkTopic = await Topic.findById(topicId);
      if (!checkTopic)
        return {
          status: "ERROR",
          message: "No topic found",
        };
      if (!checkVocabulary) {
        const createVocabulary = await Vocabulary.create({
          topicId: checkTopic._id,
          vocabulary,
          meaning,
          partOfSpeech,
          vocabularyImage,
          vocabularyIpa,
        });

        resolve({
          status: "OK",
          message: "Success",
          data: createVocabulary,
        });
      } else {
        resolve({
          status: "ERR",
          message: "The vocabulary is already ",
          data: checkVocabulary,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const updateVocabulary = async (vocabularyId, data) => {
  try {
    const checkVocabulary = await Vocabulary.findById(vocabularyId);
    if (!checkVocabulary) {
      return {
        status: "ERROR",
        message: "Vocabulary undefined",
      };
    }

    if (data.vocabulary) {
      const checkVocab = await Vocabulary.findOne({
        vocabulary: data.vocabulary,
      });
      if (checkVocab && checkVocab._id.toString() !== vocabularyId) {
        return {
          status: "ERROR",
          message: "Duplicate vocabulary",
        };
      }
    }

    if (data.topicId) {
      const checkTopic = await Topic.findById(data.topicId);
      if (!checkTopic) {
        return {
          status: "ERROR",
          message: "No topic found",
        };
      }
    }

    // Loại bỏ các trường có giá trị null
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== null)
    );

    if (Object.keys(filteredData).length === 0) {
      return {
        status: "ERROR",
        message: "No valid data to update",
      };
    }

    const updatedVocabulary = await Vocabulary.findByIdAndUpdate(
      vocabularyId,
      filteredData,
      { new: true }
    );

    if (!updatedVocabulary) {
      return {
        status: "ERROR",
        message: "Update failed",
      };
    }

    return {
      status: "OK",
      message: "Successful update!",
      updatedVocabulary,
    };
  } catch (e) {
    return {
      status: "ERROR",
      message: e.message || "Something went wrong",
    };
  }
};

const deleteVocabulary = async (vocabularyId) => {
  try {
    const checkVocabulary = await Vocabulary.findById(vocabularyId);
    // console.log("toi day");
    if (!checkVocabulary) {
      return {
        status: "ERROR",
        message: "Vocabulary undefined",
      };
    }
    await Vocabulary.findByIdAndDelete(vocabularyId);
    return {
      status: "OK",
      message: "Successful deleted!",
    };
  } catch (e) {
    return {
      status: "ERROR",
      message: e.message || "Something went wrong",
    };
  }
};
const getAllVocabulary = async () => {
  try {
    const vocabularies = await Vocabulary.find().populate("topicId");

    return {
      status: "OK",
      message: "Success!",
      data: vocabularies,
    };
  } catch (e) {
    return {
      status: "ERROR",
      message: e.message || "Something went wrong",
    };
  }
};
const getVocabularyTopic = async (topicId) => {
  try {
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return {
        status: "ERR",
        message: "Topic undefined",
      };
    }
    const vocabularies = await Vocabulary.find({ topicId });
    return {
      status: "OK",
      message: "Success!",
      data: vocabularies,
      topic,
    };
  } catch (e) {
    return {
      status: "ERROR",
      message: e.message || "Something went wrong",
    };
  }
};

module.exports = {
  createVocabulary,
  updateVocabulary,
  deleteVocabulary,
  getAllVocabulary,
  getVocabularyTopic,
};

//delete update chưa test
