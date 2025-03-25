import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import VocabularyList from "../pages/VocabularyPage/Topic";
import VocabularyTopic from "../pages/VocabularyPage/VocabularyTopic";
import GameStart from "../pages/GamePage/GameStart";
import RankingPage from "../pages/RankingPage/RankingPage";
import SignupPage from "../pages/SignupPage/SignupPage";
import GamePage from "../pages/GamePage/GamePage";
import EndGamePage from "../pages/GamePage/EndGame";
// import TestVocabulary from "../pages/TestPage/test";
import ListTopic from "../pages/ReviewPage/ReviewTopic";
import ReviewList from "../pages/ReviewPage/ReviewListPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import ReviewPage from "../pages/ReviewPage/ReviewPage";
import StudySchedule from "../pages/ProfilePage/StudySchedule";
import VocabularyManagementPage from "../pages/Admin/VocabManagementPage";
import TopicManagementPage from "../pages/Admin/TopicManagementPage";
import QuestionsManagementPage from "../pages/Admin/QuestionManagementPage";
import ReviewsAndTestsManagementPage from "../pages/Admin/ReviewsAndTestsPage";
import AddDataPage from "../components/forms/AddDataPage";
import TestListPage from "../pages/TestPage/TestListPage";
export const routes = [
  {
    path: "/",
    page: HomePage,
  },
  {
    path: "/login",
    page: LoginPage,
  },
  {
    path: "/register",
    page: SignupPage,
  },
  {
    path: "/vocabulary",
    page: VocabularyList,
  },
  {
    path: "/topic/:topicId",
    page: VocabularyTopic,
  },
  {
    path: "/game",
    page: GameStart,
  },
  {
    path: "/play-game",
    page: GamePage,
  },
  {
    path: "/game/list-topic",
    page: ListTopic,
  },
  {
    path: "/play-game/:topicId",
    page: GamePage,
  },
  {
    path: "/end-game",
    page: EndGamePage,
  },
  {
    path: "/end-review/:topicId/:activityId",
    page: EndGamePage,
  },
  {
    path: "/end-test/:activityId",
    page: EndGamePage,
  },
  {
    path: "/ranking",
    page: RankingPage,
  },

  {
    path: "/review",
    page: ListTopic,
  },

  // thay bằng game ////
  {
    path: "/review/:topicId",
    page: ReviewList,
  },
  {
    path: "/review/:topicId/:activityId",
    page: ReviewPage,
  },
  {
    path: "/test/:activityId",
    page: ReviewPage,
  },
  {
    path: "/profile",
    page: ProfilePage,
  },

  {
    path: "/profile/study-schedule",
    page: StudySchedule,
  },
  {
    path: "/test",
    page: TestListPage,
  },

  //admin
  {
    path: "/admin",
    page: VocabularyManagementPage,
  },
  {
    path: "/",
    page: VocabularyManagementPage,
  },
  {
    path: "/admin/vocabulary-management",
    page: VocabularyManagementPage,
  },
  {
    path: "/admin/topics-management",
    page: TopicManagementPage,
  },
  {
    path: "/admin/questions-management",
    page: QuestionsManagementPage,
  },
  {
    path: "/admin/review-and-test-management",
    page: ReviewsAndTestsManagementPage,
  },
  {
    path: "/add",
    page: AddDataPage,
  },
];
