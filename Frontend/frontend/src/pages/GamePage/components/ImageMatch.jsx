import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { Typography } from "antd";
import {
  RightOutlined,
  SoundOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  StyledCard,
  QuestionWrapper,
  QuestionText,
  IconWrapper,
} from "../gameCss";
const { Text } = Typography;

// Hiệu ứng bounce khi chọn đáp án
const bounce = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

// OptionWrapper with updated interpolation using css helper
const OptionWrapper = styled.div`
  padding: 15px;
  border-radius: 12px;
  background-color: ${(props) => {
    if (props.selected) {
      return props.correct ? "#d4edda" : "#f8d7da";
    } else if (props.showAnswer && props.correct) {
      return "#d4edda";
      // return "#a3cfbb";
    }
    return "#fff";
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

  ${(props) =>
    props.selected &&
    css`
      animation: ${bounce} 0.5s;
    `}
`;
// Badge hiển thị level với hiệu ứng gradient và bóng đổ
// const LevelBadge = styled.div`
//   display: inline-block;
//   padding: 5px 12px;
//   border-radius: 20px;
//   background: linear-gradient(45deg, #6dd5ed, #2193b0);
//   color: #fff;
//   font-weight: bold;
//   font-size: 0.9rem;
//   margin-bottom: 15px;
//   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
// `;
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

// Container cho hướng dẫn đáp án
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

// Box màu nhỏ dùng để hiển thị màu đáp án cụ thể
const ColorBox = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: inline-block;
  border: 1px solid #ccc;
`;

// Container chứa từng mục hướng dẫn
const InstructionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

// Container chứa các đáp án
const OptionsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 20px;
`;

// Container chứa nút Next
const ButtonContainer = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: flex-end;
`;

// Image với kiểu dáng đã chỉnh sửa
const ImageContainer = styled.img`
  border-radius: 12px;
  width: 280px;
  height: 280px;
  object-fit: contain;
`;
const getLevelText = (level) => {
  switch (level) {
    case "easy":
      return "Dễ";
    case "medium":
      return "Bình thường";
    case "hard":
      return "Khó";
    default:
      return "Không xác định";
  }
};

const ImageMatch = ({
  _id,
  questionContent,
  options,
  score,
  answer,
  onNext,
  selectedAnswer,
  onFinish,
  isLast,
  questionLevel,
  onSelectAnswer, // thêm prop level
}) => {
  const [selected, setSelected] = useState(null);

  // const handleSelect = (option) => {
  //   if (selected) return;
  //   setSelected(option);
  // };
  useEffect(() => {
    setSelected(null); // Reset lựa chọn khi câu hỏi thay đổi
  }, [_id]);
  const handleNext = () => {
    // Nếu người dùng đã chọn đáp án
    if (selectedAnswer == null) {
      onSelectAnswer(_id, "", false, 0);
    }

    // Chờ Redux cập nhật xong rồi mới next câu tiếp theo
    setTimeout(() => {
      onNext(); // Chuyển câu mới
    }, 50); // Tránh next quá nhanh trước khi Redux cập nhật
  };

  const handleSelect = (selectedAnswer) => {
    const isCorrect = selectedAnswer === answer; // So sánh với đáp án đúng
    onSelectAnswer(_id, selectedAnswer, isCorrect, score); // Giả sử đúng được +10 điểm
    if (selected) return;
    setSelected(selectedAnswer);
    // onNext(); // Chuyển sang câu tiếp theo
  };

  const handleSpeakAgain = () => {
    const utterance = new SpeechSynthesisUtterance(questionContent);
    const voice = speechSynthesis
      .getVoices()
      .find((voice) => voice.name === "Google UK English Female");
    if (voice) utterance.voice = voice;
    speechSynthesis.speak(utterance);
  };

  return (
    <StyledCard
      title={
        <QuestionWrapper>
          <QuestionText>{questionContent}</QuestionText>
          {/* <IconWrapper
            style={{ position: "absolute", top: "10px", right: "10px" }}
            onClick={handleSpeakAgain}
          >
            <SoundOutlined style={{ fontSize: "1.5rem", color: "#1890ff" }} />
          </IconWrapper> */}
        </QuestionWrapper>
      }
    >
      {" "}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* <LevelBadge>Mức độ: {getLevelText(questionLevel)}</LevelBadge> */}
      </div>
      {/* Hiển thị badge Level */}
      <OptionsContainer>
        {options.map((option, index) => (
          <OptionWrapper
            key={index}
            onClick={() => handleSelect(option)}
            selected={selected === option}
            correct={option === answer}
            showAnswer={selected !== null}
          >
            <ImageContainer src={option} alt={`Option ${index + 1}`} />
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
                {option === answer ? (
                  <>
                    <CheckCircleOutlined style={{ marginRight: 5 }} /> Đúng!
                  </>
                ) : (
                  <>
                    <CloseCircleOutlined style={{ marginRight: 5 }} /> Sai!
                  </>
                )}
              </Text>
            )}
          </OptionWrapper>
        ))}
      </OptionsContainer>
      {/* Hướng dẫn đáp án với khung màu cụ thể */}
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
        {!isLast ? (
          <IconWrapper onClick={handleNext}>
            <RightOutlined />
          </IconWrapper>
        ) : (
          <IconWrapper onClick={onFinish}>
            <RightOutlined />
          </IconWrapper>
        )}
      </ButtonContainer>
    </StyledCard>
  );
};
export default ImageMatch;
