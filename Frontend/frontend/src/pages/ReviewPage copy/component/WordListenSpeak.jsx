import React, { useState } from "react";
import styled from "styled-components";
import { SoundOutlined, AudioOutlined } from "@ant-design/icons";

const WordListenSpeak = ({ word, level }) => {
  const [feedback, setFeedback] = useState("");

  const playWord = () => {
    const utterance = new SpeechSynthesisUtterance(word);
    const voice = speechSynthesis
      .getVoices()
      .find((v) => v.name === "Google UK English Female");
    if (voice) utterance.voice = voice;
    speechSynthesis.speak(utterance);
  };

  const recordWord = () => {
    // Simulate recording functionality. Replace with actual speech recognition if needed.
    setFeedback("🎤 Đã ghi âm!");
    setTimeout(() => setFeedback(""), 2000);
  };

  return (
    <Card>
      <Header>
        <QuestionText>Từ:</QuestionText>
        {level && <LevelBadge>Level: {level}</LevelBadge>}
      </Header>
      <WordDisplay>{word}</WordDisplay>
      <ButtonRow>
        <ActionButton onClick={playWord}>
          <SoundIcon />
          Nghe
        </ActionButton>
        <ActionButton onClick={recordWord}>
          <AudioIcon />
          Nói
        </ActionButton>
      </ButtonRow>
      {feedback && <Feedback>{feedback}</Feedback>}
    </Card>
  );
};

export default WordListenSpeak;

// ================= Styled Components =================

const Card = styled.div`
  background: #f4f4f4;
  border-radius: 12px;
  padding: 24px 32px;
  max-width: 500px;
  margin: 20px auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Header = styled.div`
  margin-bottom: 16px;
`;

const QuestionText = styled.h3`
  font-size: 22px;
  font-weight: 600;
  color: #333;
`;

const LevelBadge = styled.div`
  display: inline-block;
  margin-top: 8px;
  padding: 5px 12px;
  border-radius: 20px;
  background: linear-gradient(45deg, #6dd5ed, #2193b0);
  color: #fff;
  font-size: 0.9rem;
  font-weight: bold;
`;

const WordDisplay = styled.h2`
  font-size: 36px;
  font-weight: bold;
  color: #007bff;
  margin: 20px 0;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
`;

const ActionButton = styled.button`
  padding: 10px 14px;
  font-size: 16px;
  background: #6c757d;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  &:hover {
    background: #5a6268;
  }
`;

const SoundIcon = styled(SoundOutlined)`
  font-size: 1.5rem;
`;

const AudioIcon = styled(AudioOutlined)`
  font-size: 1.5rem;
`;

const Feedback = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-top: 8px;
`;
