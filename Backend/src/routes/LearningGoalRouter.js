const express = require("express");
const router = express.Router();
const LearningController = require("../controllers/LearningGoalController");

router.get("/get-all/:userId", LearningController.getAllLearningGoal);
router.post("/create", LearningController.createLearningGoal);
router.put("/update-status", LearningController.updateStatus);
// router.put("/update-topic/:id", TopicController.updateTopic);
// router.delete("/delete-topic/:id", TopicController.deleteTopic);
// router.get("/get-all", TopicController.getAllTopic);
module.exports = router;
