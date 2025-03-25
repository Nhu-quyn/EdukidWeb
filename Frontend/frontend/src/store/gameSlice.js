import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  game: {
    correct: 0, // Số đáp án đúng
    incorrect: 0, // Số đáp án sai
    score: 0, // Điểm số
    rank: 0,
  },
  answer_questions: [], // Mảng chứa các { questionId, selectedAnswer }
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    // ✅ Nếu người dùng đã đăng nhập, lưu cả câu trả lời
    addAnswerWithLogin: (state, action) => {
      const { questionId, selectedAnswer, isCorrect, score } = action.payload;

      // Thêm câu trả lời vào mảng answer_questions
      state.answer_questions.push({ questionId, selectedAnswer });

      // Cập nhật số câu đúng/sai và điểm số
      if (isCorrect) {
        state.game.correct += 1;
        state.game.score += score;
      } else {
        state.game.incorrect += 1;
      }
    },

    // ✅ Nếu người dùng chưa đăng nhập, chỉ cập nhật đúng/sai và điểm số
    addAnswerWithoutLogin: (state, action) => {
      const { isCorrect, score } = action.payload;

      if (isCorrect) {
        state.game.correct += 1;
        state.game.score += score;
      } else {
        state.game.incorrect += 1;
      }
    },

    // ✅ Cập nhật rank của người chơi
    setRank: (state, action) => {
      state.game.rank = action.payload;
    },

    // ✅ Reset lại khi bắt đầu bài kiểm tra mới
    resetGame: (state) => {
      state.game.correct = 0;
      state.game.incorrect = 0;
      state.game.score = 0;
      state.answer_questions = [];
      state.rank = 0;
    },
  },
});

export const { addAnswerWithLogin, addAnswerWithoutLogin, resetGame, setRank } =
  gameSlice.actions;
export default gameSlice.reducer;
