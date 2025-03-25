const express = require("express");
const router = express.Router();
const QuestionController = require("../controllers/QuestionController");

router.post("/create-question-type", QuestionController.createQuestionType);
router.post("/create", QuestionController.createQuestion);
router.get("/question-types", QuestionController.getAllQuestionTypes);
router.get("/questions", QuestionController.getAllQuestions);
router.put("/update-question/:id", QuestionController.updateQuestion);
router.delete(
  "/delete-question/:questionId",
  QuestionController.deleteQuestion
);
// router.put("/update-question/:id", )

//game
router.get(
  "/get-question-game",
  QuestionController.getQuestionsWithGameByTopic
);

router.get(
  "/get-question-game-public/:topicId",
  QuestionController.getPublicQuestionsByTopic
);
router.get("/get-question-game-public", QuestionController.getPublicQuestions);

router.get(
  "/get-question-game/:userId",
  QuestionController.getQuestionsWithGame
);
router.get(
  "/get-by-activity/:activityId",
  QuestionController.getQuestionByActivity
);

module.exports = router;
