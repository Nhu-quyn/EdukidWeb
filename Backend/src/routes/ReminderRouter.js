const express = require("express");
const router = express.Router();
const ReminderController = require("../controllers/ReminderController");
router.post("/reset", ReminderController.resetReminder);
router.post("/send-to-email", ReminderController.sendToEmail);
router.post("/check", ReminderController.checkTargetWords);

module.exports = router;
