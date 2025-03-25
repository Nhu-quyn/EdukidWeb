import React, { useState } from "react";
import styled from "styled-components";

const TranslationMatch = ({
  questionContent,
  options,
  answer,
  questionLevel,
}) => {
  const [selected, setSelected] = useState(null);
  const [hasChecked, setHasChecked] = useState(false);

  const checkAnswer = () => {
    setHasChecked(true);
  };

  const getOptionStyle = (option) => {
    if (!hasChecked) {
      return selected === option ? "selected" : "default";
    } else {
      if (option === answer) return "correct";
      if (selected === option && option !== answer) return "incorrect";
      return "default";
    }
  };

  return (
    <Card>
      <Header>
        <QuestionText>{questionContent}</QuestionText>
        {questionLevel && <LevelBadge>Level: {questionLevel}</LevelBadge>}
      </Header>
      <Content>
        <OptionsContainer>
          {options.map((option, index) => {
            const styleType = getOptionStyle(option);
            return (
              <OptionBox
                key={index}
                onClick={() => {
                  if (!hasChecked) setSelected(option);
                }}
                optionStyle={styleType}
              >
                {option}
              </OptionBox>
            );
          })}
          <CheckButton onClick={checkAnswer} disabled={!selected || hasChecked}>
            Kiểm tra
          </CheckButton>
        </OptionsContainer>
      </Content>
      <Instructions>
        <InstructionItem>
          <ColorBox
            style={{ backgroundColor: "#d4edda", borderColor: "#28a745" }}
          />
          <InstructionText>Đáp án đúng</InstructionText>
        </InstructionItem>
        <InstructionItem>
          <ColorBox
            style={{ backgroundColor: "#f8d7da", borderColor: "#dc3545" }}
          />
          <InstructionText>Đáp án sai</InstructionText>
        </InstructionItem>
      </Instructions>
      {hasChecked && (
        <Feedback>
          {selected === answer
            ? `✅ Đúng! Đáp án: ${answer}`
            : `❌ Sai! Đáp án: ${answer}`}
        </Feedback>
      )}
    </Card>
  );
};

export default TranslationMatch;

// =========== Styled Components ===========

const Card = styled.div`
  background: #f4f4f4;
  border-radius: 12px;
  padding: 24px;
  max-width: 600px;
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
  border-radius: 20px;
  background: linear-gradient(45deg, #6dd5ed, #2193b0);
  color: #fff;
  font-size: 0.9rem;
  font-weight: bold;
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const OptionBox = styled.div`
  padding: 12px;
  border: 2px solid
    ${(props) => {
      switch (props.optionStyle) {
        case "correct":
          return "#28a745";
        case "incorrect":
          return "#dc3545";
        case "selected":
          return "#007bff";
        default:
          return "#ccc";
      }
    }};
  background-color: ${(props) => {
    switch (props.optionStyle) {
      case "correct":
        return "#d4edda";
      case "incorrect":
        return "#f8d7da";
      case "selected":
        return "#e2e6ea";
      default:
        return "#fff";
    }
  }};
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  font-size: 16px;
  transition: background-color 0.3s, border-color 0.3s;
  &:hover {
    background-color: ${(props) =>
      props.optionStyle === "default" ? "#f8f9fa" : ""};
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
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Instructions = styled.div`
  margin-top: 24px;
  background: #e9ecef;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  justify-content: center;
  gap: 24px;
`;

const InstructionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ColorBox = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const InstructionText = styled.span`
  font-size: 14px;
  color: #333;
`;

const Feedback = styled.div`
  margin-top: 16px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: #333;
`;
