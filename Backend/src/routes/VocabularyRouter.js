const express = require("express");
const router = express.Router();
const VocabularyController = require("../controllers/VocabularyController");

router.post("/create", VocabularyController.createVocabulary);
router.put("/update-vocabulary/:id", VocabularyController.updateVocabulary);
router.delete("/delete-vocabulary/:id", VocabularyController.deleteVocabulary);
router.get("/get-all", VocabularyController.getAllVocabulary);
router.get("/get-vocab/:topicId", VocabularyController.getVocabularyTopic);
module.exports = router;
