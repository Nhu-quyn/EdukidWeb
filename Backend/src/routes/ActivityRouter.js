const express = require("express");
const router = express.Router();
const ActivityController = require("../controllers/ActivityController");

router.post("/create-category", ActivityController.createCategory);
router.post("/create", ActivityController.createActivity); //chua test
router.put("/update-activity/:id", ActivityController.updateActivity); //chua test
router.delete("/delete-activity/:id", ActivityController.deleteActivity); //chua test
router.get("/category/get-all", ActivityController.getAllCategory);
router.get("/get-all/:categoryId", ActivityController.getAllQuizByCategory);
router.post("/category", ActivityController.getCategoryByName);
router.post(
  "/add-questions/:activityId",
  ActivityController.addQuestionsToActivity
);
router.get("/get-test-and-review", ActivityController.getTestAndReview);
router.post(
  "/filter-by-topic/:topicId",
  ActivityController.filterActivityReviewByTopic
);
router.get("/test/:userId", ActivityController.getTestByUserNoDone);
router.get("/count-test/:userId", ActivityController.getCountTestNotDone);
module.exports = router;
