const UserRouter = require("./UserRouter");
const TopicRouter = require("./TopicRouter");
const VocabularyRouter = require("./VocabularyRouter");
const QuestionRouter = require("./QuestionRouter");
const ActivityRouter = require("./ActivityRouter");
const LearningGoalRouter = require("./LearningGoalRouter");
const ReminderRouter = require("./ReminderRouter");

// const ProgressVocabRouter = require("./ProgressVocabRouter");
const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/topic", TopicRouter);
  app.use("/api/vocabulary", VocabularyRouter);
  app.use("/api/question", QuestionRouter);
  app.use("/api/activity", ActivityRouter);
  app.use("/api/learning-goal", LearningGoalRouter);
  // app.use("/api/reminder", ReminderRouter);
  // app.use("/api/progress-vocab", ProgressVocabRouter);
};

module.exports = routes;
