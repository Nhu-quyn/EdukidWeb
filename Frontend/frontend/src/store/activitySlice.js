import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activity: {
    isReview: false,
    isEnd: false,
    correct: 0, // Số đáp án đúng
    incorrect: 0, // Số đáp án sai
    score: 0, // Điểm số
    rank: 0,
  },
  answer_questions: [], // Mảng chứa các { questionId, typeId, selectedAnswer }
};

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    // ✅ Nếu người dùng đã đăng nhập, lưu cả câu trả lời
    addAnswerWithLogin: (state, action) => {
      const { questionId, type, selectedAnswer, isCorrect, score } =
        action.payload;

      // Thêm câu trả lời vào mảng answer_questions
      state.answer_questions.push({ questionId, type, selectedAnswer });

      // Cập nhật số câu đúng/sai và điểm số
      if (isCorrect) {
        state.activity.correct += 1;
        state.activity.score += score;
      } else {
        state.activity.incorrect += 1;
      }
    },

    // ✅ Cập nhật rank của người chơi
    setRank: (state, action) => {
      state.activity.rank = action.payload;
    },
    // ✅ Đánh dấu isReview là true
    setReviewIsTrue: (state) => {
      state.activity.isReview = true;
    },
    // ✅ Đánh dấu isReview là true
    setEndIsTrue: (state) => {
      state.activity.isEnd = true;
    },
    //, ✅ Reset lại khi bắt đầu bài kiểm tra mới
    resetActivity: (state) => {
      state.activity.isReview = false;
      state.activity.isEnd = false;
      state.activity.correct = 0;
      state.activity.incorrect = 0;
      state.activity.score = 0;
      state.answer_questions = [];
      state.rank = 0;
    },
  },
});

export const {
  addAnswerWithLogin,
  resetActivity,
  setRank,
  setReviewIsTrue,
  setEndIsTrue,
} = activitySlice.actions;
export default activitySlice.reducer;
