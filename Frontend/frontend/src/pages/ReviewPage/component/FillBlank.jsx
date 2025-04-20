import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { LevelBadge, getLevelText, Question } from "../activityCss";
const FillBlank = ({
  questionContent,
  answer,
  type,
  score,
  activityId,
  questionLevel,
  // isReset,
  // setIsReset,
  isEnd,
  isReview,
  _id, // Nhận thêm questionId từ parent component
  userAnswer, // Nhận câu trả lời từ parent component
  onUserSelect,
  // onSelectAnswer,
  // setUserAnswer, // Hàm để cập nhật câu trả lời trong parent component
}) => {
  const [userInput, setUserInput] = useState(userAnswer || ""); // Sử dụng câu trả lời mặc định từ parent component
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  // Kiểm tra đáp án tự động nếu isReview = true
  useEffect(() => {
    console.log("ID kiểm tra:", _id, activityId);
    if (!_id || !activityId) return;
    const savedInput = localStorage.getItem(`userInput-${_id}-${activityId}`);
    console.log("Giá trị lấy từ localStorage:", savedInput);
    if (savedInput) {
      setUserInput(savedInput);
    }
  }, [_id, activityId]);

  useEffect(() => {
    if (isReview) {
      checkAnswer();
    }
  }, [_id, isReview]);
  useEffect(() => {
    if (isEnd && !isReview) {
      check();
      console.log("userInput", userInput);
      console.log("answer", answer);
      onUserSelect(
        _id,
        type,
        userInput,
        userInput.trim().toLowerCase() === answer.trim().toLowerCase(),
        score
      );
    } // Xóa giá trị chỉ khi isEnd thực sự kết thúc
    if (isEnd) {
      setTimeout(() => {
        localStorage.removeItem(`userInput-${_id}-${activityId}`);
      }, 500); // Delay để đảm bảo dữ liệu được xử lý
    }
    localStorage.removeItem(`userInput-${_id}-${activityId}`);
  }, [isEnd]);

  const checkAnswer = () => {
    if (userInput.trim().toLowerCase() === answer.toLowerCase()) {
      setFeedback(`✅ Đúng! Đáp án: ${answer}`);
      // setIsCorrect(true)
    } else {
      setFeedback(`❌ Sai! Đáp án: ${answer}`);
      // setIsCorrect(true)
    }
  };
  const check = () => {
    if (userInput.trim().toLowerCase() === answer.toLowerCase()) {
      // setFeedback(`✅ Đúng! Đáp án: ${answer}`);
      setIsCorrect(true);
    } else {
      // setFeedback(`❌ Sai! Đáp án: ${answer}`);
      setIsCorrect(false);
    }
  };
  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserInput(value);
    localStorage.setItem(`userInput-${_id}-${activityId}`, value);
    console.log("Lưu vào localStorage:", value); // Kiểm tra giá trị lưu trữ
  };

  return (
    <Card>
      {/* {questionLevel} */}
      <LevelBadge level={getLevelText(questionLevel)}>
        {getLevelText(questionLevel)} - {score} điểm
      </LevelBadge>
      <Question>{questionContent}</Question>
      <Row>
        <AnswerInput
          type="text"
          value={userInput}
          onChange={handleInputChange}
          disabled={isReview}
          placeholder="Nhập đáp án..."
        />
      </Row>
      {feedback && <Feedback>{feedback}</Feedback>}
    </Card>
  );
};

// ===== Styled Components =====
const Card = styled.div`
  background: #f4f4f4;
  border-radius: 12px;
  padding: 24px 32px;
  max-width: 500px;
  margin: 0 auto; /* Căn giữa khối */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

// const Question = styled.h3`
//   font-size: 20px;
//   font-weight: 600;
//   color: #333;
//   text-align: center;
//   margin-bottom: 20px;
// `;

const Row = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
`;

const AnswerInput = styled.input`
  flex: 1;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
  }
`;

const Feedback = styled.div`
  margin-top: 16px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: #333;
`;

export default FillBlank;
