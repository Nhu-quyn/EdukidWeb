const express = require("express");
const router = express.Router();
const TopicController = require("../controllers/TopicController");

router.post("/create", TopicController.createTopic);
router.put("/update-topic/:id", TopicController.updateTopic);
router.delete("/delete-topic/:id", TopicController.deleteTopic);
router.get("/get-all", TopicController.getAllTopic);
module.exports = router;
