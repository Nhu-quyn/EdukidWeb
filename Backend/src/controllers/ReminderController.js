const ReminderService = require("../services/ReminderService");
const resetReminder = async (req, res) => {
  try {
    const result = await ReminderService.resetReminders();
    return res.status(200).json({
      message: "Reminders reset successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error resetting reminders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const checkTargetWords = async (req, res) => {
  try {
    const result = await ReminderService.checkTargetWords();
    return res.status(200).json({
      message: "Reminders reset successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error resetting reminders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const sendToEmail = async (req, res) => {
  try {
    const result = await ReminderService.sendToEmail();
    return res.status(200).json({
      message: "Reminders reset successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error resetting reminders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  resetReminder,
  checkTargetWords,
  sendToEmail,
};
