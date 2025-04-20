import React, { useState, useEffect } from "react";
import styled, { css, keyframes } from "styled-components";
import { Typography } from "antd";
import { RightOutlined, SoundOutlined } from "@ant-design/icons";
import {
  StyledCard,
  QuestionWrapper,
  QuestionText,
  IconWrapper,
  LevelBadge,
  levelDetails,
} from "../gameCss";
import { Howl } from "howler";
const { Text } = Typography;

// Define bounce animation using keyframes
const bounce = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

// Button container for Next icon
const ButtonContainer = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: flex-end;
`;

// Styled sound icon wrapper with hover effects
const IconWrapperSound = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: #ff8c00;
  padding: 15px;
  border-radius: 8px;
  color: white;
  font-size: 4rem;
  transition: background-color 0.3s ease;
  width: 60px;
  height: 60px;
  text-align: center;
  margin: 20px auto;

  &:hover {
    background-color: #ffa726;
  }
`;

// Container for answer options
const OptionsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 40px;
`;

// Each option styling with bounce animation if selected
const OptionWrapper = styled.div`
  padding: 15px;
  border-radius: 12px;
  background-color: ${(props) => {
    if (props.selected) {
      return props.correct ? "#d4edda" : "#f8d7da"; // Correct: light green, Incorrect: light red
    } else if (props.showAnswer && props.correct) {
      return "#d4edda";
      // return "#a3cfbb"; // Correct answer shown (lighter green)
    }
    return "#fff"; // Default: white
  }};
  transition: all 0.3s ease;
  cursor: pointer;
  font-size: 30px;
  width: 250px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
  transform: ${(props) => (props.selected ? "scale(1.05)" : "scale(1)")};

  &:hover {
    transform: scale(1.05);
    box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.2);
  }

  ${(props) =>
    props.selected &&
    css`
      animation: ${bounce} 0.5s;
    `}
`;

// Option text styling
const TextOption = styled(Text)`
  display: block;
  font-size: 3rem;
  font-weight: bold;
  margin-top: 10px;
`;

// Instructions container for concrete color guidance
const Instructions = styled.div`
  margin-top: 20px;
  background-color: #e9ecef;
  padding: 10px 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 0.9rem;
  color: #495057;
`;

// Each instruction item with a small color box
const InstructionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

// Small color box
const ColorBox = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: inline-block;
  border: 1px solid #ccc;
`;

const ListenChooseWord = ({
  _id,
  questionContent,
  options,
  answer,
  score,
  onNext,
  onFinish,
  isLast,
  questionLevel,
  onSelectAnswer,
}) => {
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleSpeakWord = () => {
    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(answer);
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(
        (voice) => voice.name === "Google UK English Female"
      );
      if (selectedVoice) utterance.voice = selectedVoice;
      window.speechSynthesis.speak(utterance);
    };
    console.log(speechSynthesis.getVoices());

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener("voiceschanged", speak);
    } else {
      speak();
    }
  };

  const correctSound = new Howl({
    src: ["/Sound/correct.wav"], // Âm thanh đúng
  });

  const incorrectSound = new Howl({
    src: ["/Sound/incorrect.wav"], // Âm thanh sai
  });
  // const handleSelect = (option) => {

  // const handleSelect = (option) => {
  //   if (selected) return; // Prevent re-selection
  //   setSelected(option);
  //   setFeedback(option === answer ? "🎉 Đúng!" : "❌ Sai!");
  // };
  const handleSelect = (selectedAnswer) => {
    if (selected) return;
    const isCorrect = selectedAnswer === answer; // So sánh với đáp án đúng
    // Nếu đã chọn thì không làm gì
    // const isCorrect = selected === answer;
    if (isCorrect) {
      correctSound.play(); // Phát âm thanh đúng
    } else {
      incorrectSound.play(); // Phát âm thanh sai
    }
    onSelectAnswer(_id, selectedAnswer, isCorrect, score); // Giả sử đúng được +10 điểm
    setFeedback(selectedAnswer === answer ? "🎉 Đúng!" : "❌ Sai!");
    setSelected(selectedAnswer);
    if (selected) return;
  };
  const handleNext = () => {
    // Nếu người dùng đã chọn đáp án
    if (!selected) {
      onSelectAnswer(_id, "", false, score);
    }

    // Chờ Redux cập nhật xong rồi mới next câu tiếp theo
    setTimeout(() => {
      onNext(); // Chuyển câu mới
    }, 50); // Tránh next quá nhanh trước khi Redux cập nhật
  };
  const handleFinish = () => {
    // Nếu người dùng đã chọn đáp án
    // if (!selected) {
    //   onSelectAnswer(_id, "", false, score);
    // }

    // Chờ Redux cập nhật xong rồi mới next câu tiếp theo
    setTimeout(() => {
      onFinish(); // Chuyển câu mới
    }, 50); // Tránh next quá nhanh trước khi Redux cập nhật
  };
  return (
    <div>
      <div style={{ marginTop: 20 }}>
        <LevelBadge level={questionLevel}>
          {levelDetails[questionLevel].label} - {score} điểm
        </LevelBadge>
      </div>
      <StyledCard
        title={
          <QuestionWrapper>
            <QuestionText>{questionContent}</QuestionText>
          </QuestionWrapper>
        }
      >
        <IconWrapperSound onClick={handleSpeakWord}>
          <SoundOutlined />
        </IconWrapperSound>

        {/* Level badge */}
        {/* <LevelBadge>Level: {questionLevel}</LevelBadge> */}

        <OptionsContainer>
          {options.map((option, index) => (
            <OptionWrapper
              key={index}
              onClick={() => handleSelect(option)}
              selected={selected === option}
              correct={option === answer}
              showAnswer={selected !== null}
            >
              <TextOption>{option}</TextOption>
              {selected === option && (
                <Text
                  style={{
                    display: "block",
                    fontSize: "1.4rem",
                    fontWeight: "bold",
                    color: option === answer ? "#155724" : "#721c24",
                    marginTop: 10,
                  }}
                >
                  {feedback}
                </Text>
              )}
            </OptionWrapper>
          ))}
        </OptionsContainer>

        {/* Instruction area showing concrete colors */}
        <Instructions>
          <InstructionItem>
            <ColorBox style={{ backgroundColor: "#d4edda" }} />
            <Text>Đáp án đúng</Text>
          </InstructionItem>
          <InstructionItem>
            <ColorBox style={{ backgroundColor: "#f8d7da" }} />
            <Text>Đáp án sai</Text>
          </InstructionItem>
        </Instructions>

        <ButtonContainer>
          <IconWrapper
            onClick={isLast ? handleFinish : handleNext}
            style={{ marginLeft: "20px", cursor: "pointer" }}
          >
            <RightOutlined />
          </IconWrapper>
        </ButtonContainer>
      </StyledCard>
    </div>
  );
};

export default ListenChooseWord;
