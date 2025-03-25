import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ImageWriteWord = ({
  _id,
  questionContent,
  image,
  activityId, // Thêm activityId để theo dõi sự thay đổi
  score,
  type,
  answer,
  isEnd,
  isReview,
  userAnswer,
  onUserSelect,
}) => {
  const localStorageKey = `inputValue-${_id}-${activityId}`; // Tạo key duy nhất theo `_id` & `activityId`
  const [inputValue, setInputValue] = useState(() => {
    return localStorage.getItem(localStorageKey) || "";
  });

  const [feedback, setFeedback] = useState("");

  // Khi `_id` hoặc `activityId` thay đổi, reset lại giá trị
  // useEffect(() => {
  //   setInputValue("");
  //   setFeedback("");
  //   localStorage.removeItem(localStorageKey);
  // }, [activityId]);
  // useEffect(() => {
  //   setInputValue("");
  //   setFeedback("");
  // }, [_id]);
  // Load dữ liệu từ `localStorage`
  useEffect(() => {
    const savedInput = localStorage.getItem(localStorageKey);
    if (savedInput) {
      setInputValue(savedInput);
    }
  }, [_id, activityId]);

  // Khi `isReview`, hiển thị lại đáp án cũ
  useEffect(() => {
    if (isReview && userAnswer) {
      setInputValue(userAnswer);
      checkAnswer(userAnswer);
    }
  }, [isReview]);

  // Khi `isEnd`, kiểm tra đáp án & gọi `onUserSelect`
  useEffect(() => {
    if (isEnd) {
      const isCorrect =
        inputValue.trim().toLowerCase() === String(answer).toLowerCase();
      setFeedback(
        isCorrect ? `✅ Đúng! Đáp án: ${answer}` : `❌ Sai! Đáp án: ${answer}`
      );
      onUserSelect(_id, type, inputValue, isCorrect, score);
      localStorage.removeItem(localStorageKey);
    }
  }, [isEnd]);

  const checkAnswer = (value) => {
    if (!value) return;
    const isCorrect =
      value.trim().toLowerCase() === String(answer).toLowerCase();
    setFeedback(
      isCorrect ? `✅ Đúng! Đáp án: ${answer}` : `❌ Sai! Đáp án: ${answer}`
    );
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    localStorage.setItem(localStorageKey, value);
  };

  return (
    <Card>
      <Header>{questionContent}</Header>
      <Content>
        <ImageContainer>
          <img src={image} alt="Question" />
        </ImageContainer>
        <RightContent>
          <Input
            type="text"
            placeholder="Nhập câu trả lời..."
            value={inputValue}
            onChange={(e) => handleInputChange(e)}
            disabled={isReview} // Vô hiệu hóa khi đang review
          />
          {/* {!isReview && (
            <CheckButton onClick={() => checkAnswer(inputValue)}>
              Kiểm tra
            </CheckButton>
          )} */}
          {feedback && <Feedback>{feedback}</Feedback>}
        </RightContent>
      </Content>
    </Card>
  );
};

export default ImageWriteWord;

// ========== Styled Components ==========

const Card = styled.div`
  background: #f4f4f4;
  border-radius: 12px;
  padding: 24px;
  max-width: 600px;
  margin: 20px auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h3`
  font-size: 22px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const Content = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-start;
`;

const ImageContainer = styled.div`
  flex: 1;
  max-width: 300px;
  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    object-fit: cover;
  }
`;

const RightContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Input = styled.input`
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
  &:disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
  }
`;

const CheckButton = styled.button`
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
  font-size: 16px;
  font-weight: 600;
  color: #333;
  text-align: center;
`;
