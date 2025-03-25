import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Typography, Image } from "antd";
import { SoundOutlined, RightOutlined } from "@ant-design/icons";
import {
  StyledCard,
  QuestionWrapper,
  QuestionText,
  IconWrapper,
} from "../gameCss";
const { Text } = Typography;

const Container = styled.div`
  text-align: center;
`;

const OptionsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 20px;
`;

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
  cursor: ${(props) => (props.selected ? "not-allowed" : "pointer")};
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
  transform: ${(props) => (props.selected ? "scale(1.05)" : "scale(1)")};

  &:hover {
    transform: scale(1.05);
    box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.2);
  }
`;

const ButtonContainer = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: flex-end;
`;

const IconSound = styled(SoundOutlined)`
  font-size: 4rem;
`;

const LevelBadge = styled.div`
  display: inline-block;
  // display: flex inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  // background: linear-gradient(45deg, #6dd5ed, #2193b0);
  color: #444;
  font-weight: bold;
  font-size: 2rem;
  // text-transform: uppercase;
  margin-left: 10px; /* Giữ khoảng cách với chữ */
  // box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: scale(1.1);
    // box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
`;

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

const InstructionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ColorBox = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: inline-block;
  border: 1px solid #ccc;
`;

const ListenChooseImage = ({
  _id,
  onSelectAnswer,
  score,
  word,
  options,
  answer,
  onNext,
  questionLevel,
}) => {
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(word);
    window.speechSynthesis.speak(utterance);
  };
  useEffect(() => {
    setSelected(null); // Reset lựa chọn khi câu hỏi thay đổi
  }, [_id]);
  // const handleSelect = (option) => {
  //   // if (selected) return;
  //   // setSelected(option);

  //   const isCorrect = selectedAnswer === answer; // So sánh với đáp án đúng
  //   onSelectAnswer(_id, selectedAnswer, isCorrect, 10); // Giả sử đúng được +10 điểm

  //   onNext(); // Chuyển sang câu tiếp theo
  // };
  const handleSelect = (selectedAnswer) => {
    const isCorrect = selectedAnswer === answer; // So sánh với đáp án đúng
    onSelectAnswer(_id, selectedAnswer, isCorrect, score); // Giả sử đúng được +10 điểm
    setFeedback(selectedAnswer === answer ? "🎉 Đúng!" : "❌ Sai!");
    if (selected) return;
    setSelected(selectedAnswer);
  };

  return (
    <StyledCard>
      <Container>
        <QuestionWrapper>
          <IconWrapper onClick={speak}>
            <IconSound />
          </IconWrapper>
          <QuestionText>Nghe</QuestionText>
        </QuestionWrapper>

        {/* Level badge */}
        <LevelBadge>Level: {questionLevel}</LevelBadge>

        <OptionsContainer>
          {options.map((option, index) => (
            <OptionWrapper
              key={index}
              onClick={() => handleSelect(option)}
              selected={selected === option}
              correct={option === answer}
              showAnswer={selected !== null}
            >
              <Image
                src={option}
                alt={`Option ${index + 1}`}
                width={280}
                height={280}
                preview={false}
                style={{ borderRadius: "12px" }}
              />
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
                  {option === answer ? "🎉 Đúng!" : "❌ Sai!"}
                </Text>
              )}
            </OptionWrapper>
          ))}
        </OptionsContainer>

        {/* Instructions with color boxes */}
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
          <IconWrapper onClick={onNext}>
            <RightOutlined />
          </IconWrapper>
        </ButtonContainer>
      </Container>
    </StyledCard>
  );
};

export default ListenChooseImage;
