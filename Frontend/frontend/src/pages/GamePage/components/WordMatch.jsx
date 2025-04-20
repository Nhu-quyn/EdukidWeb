import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Card, Typography, Image } from "antd";
import { RightOutlined } from "@ant-design/icons"; // Thêm biểu tượng âm thanh
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

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
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
      return props.correct ? "#d4edda" : "#f8d7da"; // Chọn đúng: xanh đậm, chọn sai: đỏ
    } else if (props.showAnswer && props.correct) {
      return "#a3cfbb"; // Đáp án đúng nhưng không được chọn: xanh nhạt
    }
    return "#fff"; // Mặc định: trắng
  }};
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
  text-align: center;
  transform: ${(props) => (props.selected ? "scale(1.1)" : "scale(1)")};
  font-size: 1.6rem;

  font-weight: bold;
  color: #333;
  padding: 20px;
  // border: 2px solid ${(props) =>
    props.selected ? "#ff8c00" : "transparent"};

  &:hover {
    transform: scale(1.1);
    box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.4);
  }
`;

const ButtonContainer = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
`;
const TextOption = styled(Text)`
  display: "block";
  font-size: 3rem;
  font-weight: bold;
  color: option === answer ? "#155724" : "#721c24";
  marginTop: 10;
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

const WordMatch = ({
  _id,
  questionContent,
  image,
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
  useEffect(() => {
    setSelected(null); // Reset lựa chọn khi câu hỏi thay đổi
  }, [_id]);
  const correctSound = new Howl({
    src: ["/Sound/correct.wav"], // Âm thanh đúng
  });

  const incorrectSound = new Howl({
    src: ["/Sound/incorrect.wav"], // Âm thanh sai
  });
  const handleSelect = (option) => {
    if (selected) return; // Nếu đã chọn thì không làm gì
    const isCorrect = option === answer;
    if (isCorrect) {
      correctSound.play(); // Phát âm thanh đúng
    } else {
      incorrectSound.play(); // Phát âm thanh sai
    }
    const utterance = new SpeechSynthesisUtterance(option);
    utterance.voice = speechSynthesis
      .getVoices()
      .find((voice) => voice.name === "Google UK English Female"); // Chọn giọng Google
    speechSynthesis.speak(utterance);
    // if (selected) return;
    setSelected(option);
    setFeedback(option === answer ? "🎉 Đúng!" : "❌ Sai!");
    setTimeout(() => setFeedback(null), 1500);
    // const isCorrect = option === answer; // So sánh với đáp án đúng
    onSelectAnswer(_id, option, isCorrect, score); // Giả sử đúng được +10 điểm
    if (selected) return;
    // setSelected();
  };
  // const handleSelect = (selectedAnswer) => {
  //   if (selected) return; // Nếu đã chọn thì không làm gì
  //   const isCorrect = selectedAnswer === answer;
  //   if (isCorrect) {
  //     correctSound.play(); // Phát âm thanh đúng
  //   } else {
  //     incorrectSound.play(); // Phát âm thanh sai
  //   }
  //   onSelectAnswer(_id, selectedAnswer, isCorrect, score);
  //   setSelected(selectedAnswer); // Lưu đáp án đã chọn
  // };

  // const handleSelect = (selectedAnswer) => {
  //   const isCorrect = selectedAnswer === answer; // So sánh với đáp án đúng
  //   onSelectAnswer(_id, selectedAnswer, isCorrect, 10); // Giả sử đúng được +10 điểm
  //   setFeedback(selectedAnswer === answer ? "🎉 Đúng!" : "❌ Sai!");
  //   onNext(); // Chuyển sang câu tiếp theo
  // };
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
        {/* <LevelBadge>Level: {questionLevel}</LevelBadge> */}

        {image && (
          <ImageContainer>
            <Image src={image} width={280} height={280} preview={false} />
          </ImageContainer>
        )}
        <OptionsContainer>
          {options.map((option, index) => (
            <OptionWrapper
              key={index}
              selected={selected === option} // Xác định nếu đã chọn
              correct={option === answer} // Kiểm tra nếu đúng
              showAnswer={selected && option === answer} // Hiển thị đáp án đúng khi đã chọn
              onClick={() => handleSelect(option)}
            >
              <TextOption strong>{option}</TextOption>
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
            <IconWrapper onClick={handleFinish}>
              <RightOutlined />
            </IconWrapper>
          )}
        </ButtonContainer>
      </StyledCard>
    </div>
  );
};

export default WordMatch;
