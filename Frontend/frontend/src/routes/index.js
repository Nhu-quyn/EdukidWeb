import React from "react";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import VocabularyList from "../pages/VocabularyPage/Topic";
import VocabularyTopic from "../pages/VocabularyPage/VocabularyTopic";
import GameStart from "../pages/GamePage/GameStart";
import RankingPage from "../pages/RankingPage/RankingPage";
import SignupPage from "../pages/SignupPage/SignupPage";
import GamePage from "../pages/GamePage/GamePage";
import EndGamePage from "../pages/GamePage/EndGame";
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
    isLogged: true,
  },
  {
    path: "/end-test/:activityId",
    page: EndGamePage,
    isLogged: true,
  },
  {
    path: "/ranking",
    page: RankingPage,
    isLogged: true, // Chỉ cho phép người dùng đã đăng nhập truy cập
  },
  {
    path: "/review",
    page: ListTopic,
    isLogged: true, // Chỉ cho phép người dùng đã đăng nhập truy cập
  },
  {
    path: "/review/:topicId",
    page: ReviewList,
    isLogged: true, // Chỉ cho phép người dùng đã đăng nhập truy cập
  },
  {
    path: "/review/:topicId/:activityId",
    page: ReviewPage,
    isLogged: true, // Chỉ cho phép người dùng đã đăng nhập truy cập
  },
  {
    path: "/test/:activityId",
    page: ReviewPage,
    isLogged: true, // Chỉ cho phép người dùng đã đăng nhập truy cập
  },
  {
    path: "/profile",
    page: ProfilePage,
    isLogged: true, // Chỉ cho phép người dùng đã đăng nhập truy cập
  },
  {
    path: "/profile/study-schedule",
    page: StudySchedule,
    isLogged: true, // Chỉ cho phép người dùng đã đăng nhập truy cập
  },
  {
    path: "/test",
    page: TestListPage,
    isLogged: true, // Chỉ cho phép người dùng đã đăng nhập truy cập
  },

  // Routes dành cho Admin
  {
    path: "/admin",
    page: VocabularyManagementPage,
    isAdmin: true, // Chỉ cho phép người dùng có quyền admin truy cập
  },
  {
    path: "/admin/vocabulary-management",
    page: VocabularyManagementPage,
    isAdmin: true, // Chỉ cho phép người dùng có quyền admin truy cập
  },
  {
    path: "/admin/topics-management",
    page: TopicManagementPage,
    isAdmin: true, // Chỉ cho phép người dùng có quyền admin truy cập
  },
  {
    path: "/admin/questions-management",
    page: QuestionsManagementPage,
    isAdmin: true, // Chỉ cho phép người dùng có quyền admin truy cập
  },
  {
    path: "/admin/review-and-test-management",
    page: ReviewsAndTestsManagementPage,
    isAdmin: true, // Chỉ cho phép người dùng có quyền admin truy cập
  },
  {
    path: "/add",
    page: AddDataPage,
    isAdmin: true, // Chỉ cho phép người dùng có quyền admin truy cập
  },
];
