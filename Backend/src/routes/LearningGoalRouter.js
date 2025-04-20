const express = require("express");
const router = express.Router();
const LearningController = require("../controllers/LearningGoalController");

router.get("/get-all/:userId", LearningController.getAllLearningGoal);
router.post("/create", LearningController.createLearningGoal);
router.put("/update-status", LearningController.updateStatus);
// router.put("/update-status-repeat", LearningController.updateStatusRepeat);

router.delete("/delete/:id", LearningController.deleteLearningGoal);
router.put("/update/:id", LearningController.updateLearningGoal);

// router.put("/update-topic/:id", TopicController.updateTopic);
// router.delete("/delete-topic/:id", TopicController.deleteTopic);
// router.get("/get-all", TopicController.getAllTopic);
module.exports = router;
