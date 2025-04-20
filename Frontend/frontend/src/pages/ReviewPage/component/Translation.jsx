import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { LevelBadge, getLevelText, Question } from "../activityCss";
const Translation = ({
  word,
  answer,
  activityId,
  isEnd,
  _id,
  type,
  questionContent,
  onUserSelect,
  questionLevel,
  score,
  isReview,
  userAnswer,
}) => {
  const localStorageKey = `translation-${_id}-${activityId}`;
  const [userTranslation, setUserTranslation] = useState("");
  const [feedback, setFeedback] = useState("");

  const checkTranslation = () => {
    // console.log(userTranslation);
    if (userAnswer === "") {
      setFeedback(`❌ Bạn không có câu trả lời! Đáp án: ${answer}`);
    } else {
      if (userAnswer.trim().toLowerCase() === answer.toLowerCase()) {
        setFeedback(`✅ Đúng! Đáp án: ${answer}`);
      } else {
        setFeedback(`❌ Sai! Đáp án: ${answer}`);
      }
    }
  };
  useEffect(() => {
    // 🔄 Khi `_id` hoặc `activityId` thay đổi → Reset trạng thái và xóa localStorage
    setUserTranslation("");
    localStorage.removeItem(localStorageKey);
  }, [activityId]);
  useEffect(() => {
    // 🔄 Khi `_id` hoặc `activityId` thay đổi → Reset trạng thái và xóa localStorage
    setUserTranslation("");
  }, [_id]);
  useEffect(() => {
    // console.log(userAnswer);
    if (isReview) {
      setUserTranslation(userAnswer);
      // checkTranslation();
      // if (userTranslation) {
      checkTranslation("" || userAnswer);
      // }
    }
  }, [isReview, userAnswer]);
  useEffect(() => {
    console.log("answer", answer);
    if (isEnd && !isReview) {
      onUserSelect(
        _id,
        type,
        userTranslation,
        userTranslation.trim().toLowerCase() === answer.toLowerCase(),
        score
      );
      localStorage.removeItem(localStorageKey);
    }
  }, [isEnd]);
  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserTranslation(value);
    localStorage.setItem(localStorageKey, value);
  };
  return (
    <Container>
      <LevelBadge level={getLevelText(questionLevel)}>
        {getLevelText(questionLevel)} - {score} điểm
      </LevelBadge>
      <Question>{questionContent}</Question>
      <Sentence>{word}</Sentence>
      <Input
        type="text"
        value={userTranslation}
        onChange={handleInputChange}
        disabled={isReview}
        // readOnly={isReview} // Giữ khung nhưng không cho nhập
        placeholder="Nhập bản dịch..."
      />
      {/* <CheckButton onClick={checkTranslation}>Kiểm tra</CheckButton> */}
      {feedback && <Feedback>{feedback}</Feedback>}
    </Container>
  );
};

export default Translation;

// ===================== Styled Components =====================

const Container = styled.div`
  background: #f4f4f4;
  // position: relative
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  margin: 20px auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const Sentence = styled.p`
  font-size: 18px;
  color: #555;
  text-align: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
  }
`;

const CheckButton = styled.button`
  display: block;
  margin: 20px auto 0;
  padding: 12px 16px;
  font-size: 16px;
  background-color: #6c757d;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: #5a6268;
  }
`;

const Feedback = styled.div`
  margin-top: 16px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: #333;
`;
