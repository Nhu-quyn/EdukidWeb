import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { SoundOutlined } from "@ant-design/icons";

const ListenAndTranslate = ({
  _id,
  questionContent,
  type,
  activityId,
  word,
  score,
  answer,
  questionLevel,
  isReview,
  isEnd,
  userAnswer = "",
  onUserSelect,
}) => {
  // const [inputValue, setInputValue] = useState(userAnswer);
  const localStorageKey = `inputValue-${_id}-${activityId}`;
  const [isCorrect, setIsCorrect] = useState(false);
  const [inputValue, setInputValue] = useState(() => {
    return localStorage.getItem(localStorageKey) || userAnswer;
  });

  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const savedInput = localStorage.getItem(localStorageKey);
    if (savedInput) {
      setInputValue(savedInput);
    }
  }, [_id]);
  const checkAnswer = (value) => {
    setIsCorrect(value.trim().toLowerCase() === answer.toLowerCase());

    // Truyền câu trả lời của người dùng lên parent component
    // setUserAnswer(questionId, selected === answer); // Truyền questionId và kết quả trả lời đúng/sai
  };
  useEffect(() => {
    if (isEnd && !isReview) {
      const correct = inputValue.trim().toLowerCase() === answer.toLowerCase();
      // setHasChecked(true);
      onUserSelect(_id, type, inputValue, correct, score);
      localStorage.removeItem(localStorageKey);
    }
  }, [isEnd]);
  useEffect(() => {
    if (userAnswer) {
      checkAnswer(userAnswer);
    }
  }, [userAnswer, isReview]);
  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(word);
    const voice = speechSynthesis
      .getVoices()
      .find((v) => v.name === "Google UK English Female");
    if (voice) utterance.voice = voice;
    speechSynthesis.speak(utterance);
  };

  const checkTranslation = (value) => {
    if (value.trim().toLowerCase() === answer.toLowerCase()) {
      setFeedback(`✅ Đúng! Đáp án: ${answer}`);
    } else {
      setFeedback(`❌ Sai! Đáp án: ${answer}`);
    }
  };
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    localStorage.setItem(localStorageKey, value); // Lưu giá trị
  };
  useEffect(() => {
    const savedInput = localStorage.getItem(localStorageKey);
    if (savedInput) {
      setInputValue(savedInput);
    }
  }, [_id]); // Chạy lại khi `_id` thay đổi

  useEffect(() => {
    if (isReview) {
      checkTranslation(userAnswer);
    }
  }, [isReview]);

  return (
    <Card>
      <Header>
        <QuestionText>{questionContent}</QuestionText>
        {questionLevel && <LevelBadge>Level: {questionLevel}</LevelBadge>}
      </Header>
      <Content>
        <ListenButton onClick={playAudio}>
          <SoundIcon />
          Nghe
        </ListenButton>
      </Content>
      {!isReview ? (
        <InputField
          type="text"
          placeholder="Nhập bản dịch..."
          value={inputValue}
          onChange={(e) => handleInputChange(e)}
        />
      ) : (
        <ReviewAnswer>{inputValue || "(Chưa trả lời)"}</ReviewAnswer>
      )}
      {/* {!isReview && (
        <ActionButton onClick={() => checkTranslation(inputValue)}>
          Kiểm tra
        </ActionButton>
      )} */}
      {feedback && <Feedback>{feedback}</Feedback>}
    </Card>
  );
};

export default ListenAndTranslate;

// ================= Styled Components =================

const Card = styled.div`
  background: #f4f4f4;
  border-radius: 12px;
  padding: 24px 32px;
  max-width: 500px;
  margin: 20px auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const QuestionText = styled.h3`
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const LevelBadge = styled.div`
  display: inline-block;
  padding: 5px 12px;
  margin-top: 8px;
  border-radius: 20px;
  background: linear-gradient(45deg, #6dd5ed, #2193b0);
  color: #fff;
  font-size: 0.9rem;
  font-weight: bold;
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

const ListenButton = styled.button`
  background: #ff8c00;
  color: #fff;
  padding: 10px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s;
  &:hover {
    background: #ffa726;
  }
`;

const SoundIcon = styled(SoundOutlined)`
  font-size: 1.5rem;
`;

const InputField = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-bottom: 16px;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
  }
`;

const ReviewAnswer = styled.p`
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-bottom: 16px;
`;

const ActionButton = styled.button`
  display: block;
  margin: 0 auto 16px;
  padding: 12px 16px;
  font-size: 16px;
  background: #6c757d;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
  &:hover {
    background: #5a6268;
  }
`;

const Feedback = styled.div`
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;
