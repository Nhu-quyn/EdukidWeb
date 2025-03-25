import React, { useState } from "react";
import styled from "styled-components";

const FillBlank = ({ questionContent, answer }) => {
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");

  const checkAnswer = () => {
    if (userInput.trim().toLowerCase() === answer.toLowerCase()) {
      setFeedback(`✅ Đúng! Đáp án: ${answer}`);
    } else {
      setFeedback(`❌ Sai! Đáp án: ${answer}`);
    }
  };

  return (
    <Card>
      <Question>{questionContent}</Question>
      <Row>
        <AnswerInput
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Nhập đáp án..."
        />
        <CheckButton onClick={checkAnswer}>Kiểm tra</CheckButton>
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

const Question = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

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

const CheckButton = styled.button`
  padding: 12px 16px;
  font-size: 16px;
  color: #fff;
  background-color: #6c757d;
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

export default FillBlank;
