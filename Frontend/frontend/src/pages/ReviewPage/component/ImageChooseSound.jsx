import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { SoundOutlined } from "@ant-design/icons";
import { Howl } from "howler";
import { LevelBadge, getLevelText, Question } from "../activityCss";
const ImageChooseSound = ({
  _id,
  activityId, // Nhận thêm activityId để kiểm tra sự thay đổi
  questionContent,
  isEnd,
  type,
  image,
  options,
  score,
  answer,
  isReview,
  questionLevel,
  userAnswer = "",
  onUserSelect,
}) => {
  const [selected, setSelected] = useState("");
  const [hasChecked, setHasChecked] = useState(false);

  // useEffect(() => {
  //   const savedSelected = localStorage.getItem(`selected-${_id}-${activityId}`);
  //   if (savedSelected) {
  //     setSelected(savedSelected);
  //   }
  // }, [_id, activityId]);

  const checkAnswer = (option) => {
    setSelected(option);
    // localStorage.setItem(`selected-${_id}-${activityId}`, option);
  };

  useEffect(() => {
    if (isEnd && !isReview) {
      // setIsCorrect(selected === answer);
      onUserSelect(_id, type, selected, selected === answer, score);
      // localStorage.removeItem(`selected-${_id}-${activityId}`);
    }
  }, [isEnd]);
  // click mound
  const clickMound = new Howl({
    src: ["/Sound/click mound.wav"], // Âm thanh sai
  });
  useEffect(() => {
    if (isReview) {
      setSelected(userAnswer);
      setHasChecked(true);
    }
  }, [isReview]);

  // Đọc âm thanh của tùy chọn
  const playOptionSound = (option) => {
    // const utterance = new SpeechSynthesisUtterance(option);
    // const voice = speechSynthesis
    //   .getVoices()
    //   .find((v) => v.name === "Google UK English Female");
    // if (voice) {
    //   utterance.voice = voice;
    // }
    // speechSynthesis.speak(utterance);
    const utterance = new SpeechSynthesisUtterance(option);
    window.speechSynthesis.speak(utterance);
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
      <LevelBadge level={getLevelText(questionLevel)}>
        {getLevelText(questionLevel)} - {score} điểm
      </LevelBadge>
      <Header>
        <Question>{questionContent}</Question>
        {/* {questionLevel && <LevelBadge>Level: {questionLevel}</LevelBadge>} */}
      </Header>
      <Content>
        <ImageContainer>
          <img src={image} alt="Question" />
        </ImageContainer>
        <OptionsContainer>
          {options.map((option, index) => {
            const styleType = getOptionStyle(option);
            return (
              <OptionButton
                key={index}
                onClick={() => {
                  if (!hasChecked) {
                    // clickMound.play();
                    playOptionSound(option);
                    setSelected(option);
                    checkAnswer(option); // Gọi kiểm tra đáp án ngay sau khi chọn
                  } else {
                    playOptionSound(option);
                  }
                }}
                optionStyle={styleType}
              >
                <SoundIcon />
                {/* <OptionLabel>{option}</OptionLabel> */}
              </OptionButton>
            );
          })}
        </OptionsContainer>
      </Content>
      {isReview && (
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
      )}

      {hasChecked &&
        (selected !== null && selected !== "" ? (
          <Feedback>
            {selected === answer
              ? `✅ Đúng! Đáp án: ${answer}`
              : `❌ Sai! Đáp án: ${answer}`}
          </Feedback>
        ) : (
          <Feedback>
            {`❌ Bạn không có câu trả lời. Đáp án: ${answer}`}
          </Feedback>
        ))}
    </Card>
  );
};

export default ImageChooseSound;

// =================== Styled Components ===================

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

const OptionsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
`;

const OptionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  border-radius: 50%;
  width: 80px;
  height: 80px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    border-color 0.3s;
  &:hover {
    background-color: ${(props) =>
      props.optionStyle === "default" ? "#f8f9fa" : ""};
  }
`;

const SoundIcon = styled(SoundOutlined)`
  font-size: 2rem;
  color: #333;
`;

const OptionLabel = styled.span`
  margin-top: 4px;
  font-size: 14px;
  color: #333;
`;

const ButtonRow = styled.div`
  margin-top: 16px;
`;

const CheckButton = styled.button`
  padding: 10px 14px;
  font-size: 16px;
  background-color: #6c757d;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
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
  gap: 5px;
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
