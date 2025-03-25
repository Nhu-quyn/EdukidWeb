import React, { useState } from "react";
import styled from "styled-components";

const Translation = ({ word, answer }) => {
  const [userTranslation, setUserTranslation] = useState("");
  const [feedback, setFeedback] = useState("");

  const checkTranslation = () => {
    if (userTranslation.trim().toLowerCase() === answer.toLowerCase()) {
      setFeedback(`✅ Đúng! Đáp án: ${answer}`);
    } else {
      setFeedback(`❌ Sai! Đáp án: ${answer}`);
    }
  };

  return (
    <Container>
      <Title>Dịch câu sau:</Title>
      <Sentence>{word}</Sentence>
      <Input
        type="text"
        value={userTranslation}
        onChange={(e) => setUserTranslation(e.target.value)}
        placeholder="Nhập bản dịch..."
      />
      <CheckButton onClick={checkTranslation}>Kiểm tra</CheckButton>
      {feedback && <Feedback>{feedback}</Feedback>}
    </Container>
  );
};

export default Translation;

// ===================== Styled Components =====================

const Container = styled.div`
  background: #f4f4f4;
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
