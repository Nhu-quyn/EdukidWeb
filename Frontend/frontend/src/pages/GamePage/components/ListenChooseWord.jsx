// import React, { useState, useEffect } from "react";
// import styled from "styled-components";
// import { Card, Button, Typography, message } from "antd";
// import { RightOutlined, SoundOutlined } from "@ant-design/icons";
// import {
//   StyledCard,
//   QuestionWrapper,
//   QuestionText,
//   IconWrapper,
// } from "../gameCss";
// const { Text } = Typography;

// const ButtonContainer = styled.div`
//   margin-top: 40px;
//   display: flex;
//   justify-content: flex-end;
// `;

// const IconWrapperSound = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   cursor: pointer;
//   background-color: #ff8c00;
//   padding: 10px;
//   border-radius: 50%;
//   color: white;
//   font-size: 24px;
//   transition: background-color 0.3s ease;

//   &:hover {
//     background-color: #ffa726;
//   }
// `;
// const OptionsContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   gap: 20px; /* Tăng khoảng cách ngang và dọc */
//   flex-wrap: wrap;
//   margin-top: 40px; /* Tăng khoảng cách với tiêu đề */
// `;

// const OptionWrapper = styled.div`
//   padding: 15px;
//   border-radius: 12px;
//   background-color: ${(props) =>
//     props.isSelected ? (props.correct ? "#d4edda" : "#f8d7da") : "#fff"};
//   transition: all 0.3s ease;
//   cursor: pointer;
//   font-size: 30px;
//   width: 250px;
//   box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
//   text-align: center;
//   transform: ${(props) => (props.isSelected ? "scale(1.05)" : "scale(1)")};

//   &:hover {
//     transform: scale(1.05);
//     box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.2);
//   }
// `;

// const TextOption = styled(Text)`
//   display: "block";
//   font-size: 3rem;
//   font-weight: bold;
//   color: option === answer ? "#155724" : "#721c24";
//   marginTop: 10;
// `;
// const ListenChooseWord = ({ options, answer, onNext, onFinish, isLast }) => {
//   const [selected, setSelected] = useState(null);
//   const handleSpeakWord = () => {
//     const utterance = new SpeechSynthesisUtterance(answer);
//     utterance.voice = speechSynthesis
//       .getVoices()
//       .find((voice) => voice.name === "Google UK English Female");
//     speechSynthesis.speak(utterance);
//   };
//   const handleSelect = (option) => {
//     setSelected(option); // Cập nhật state khi chọn một option
//     // if (option.toLowerCase().trim() === answer.toLowerCase()) {
//     //   message.success("🎉 Đúng rồi!");
//     // } else {
//     //   message.error(" Sai rồi! Bạn hãy cố gắng ở câu tiếp nhé.");
//     // }
//   };
//   return (
//     <StyledCard
//       title={
//         <QuestionWrapper>
//           <QuestionText>Nghe và chọn từ đúng</QuestionText>
//           <IconWrapperSound
//             // style={{ position: "absolute", top: "10px", right: "10px" }}
//             onClick={handleSpeakWord}
//             style={{ position: "absolute", top: "10px", right: "0px" }}
//           >
//             <SoundOutlined />
//           </IconWrapperSound>
//         </QuestionWrapper>
//       }
//     >
//       {/* Options for multiple choice */}
//       <OptionsContainer>
//         {options.map((option, index) => (
//           <OptionWrapper
//             key={index}
//             onClick={() => handleSelect(option)}
//             isSelected={selected === option} // Đổi tên prop
//             correct={option === answer}
//           >
//             <TextOption>{option}</TextOption>
//           </OptionWrapper>
//         ))}
//       </OptionsContainer>

//       <ButtonContainer>
//         <IconWrapper
//           onClick={isLast ? onFinish : onNext}
//           style={{ marginLeft: "20px", cursor: "pointer" }}
//         >
//           <RightOutlined />
//         </IconWrapper>
//       </ButtonContainer>
//     </StyledCard>
//   );
// };

// export default ListenChooseWord;
import React, { useState, useEffect } from "react";
import styled, { css, keyframes } from "styled-components";
import { Typography } from "antd";
import { RightOutlined, SoundOutlined } from "@ant-design/icons";
import {
  StyledCard,
  QuestionWrapper,
  QuestionText,
  IconWrapper,
} from "../gameCss";
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
    const utterance = new SpeechSynthesisUtterance(answer);
    utterance.voice = speechSynthesis
      .getVoices()
      .find((voice) => voice.name === "Google UK English Female");
    speechSynthesis.speak(utterance);
  };
  useEffect(() => {
    setSelected(null); // Reset lựa chọn khi câu hỏi thay đổi
  }, [_id]);
  // const handleSelect = (option) => {
  //   if (selected) return; // Prevent re-selection
  //   setSelected(option);
  //   setFeedback(option === answer ? "🎉 Đúng!" : "❌ Sai!");
  // };
  const handleSelect = (selectedAnswer) => {
    const isCorrect = selectedAnswer === answer; // So sánh với đáp án đúng
    onSelectAnswer(_id, selectedAnswer, isCorrect, score); // Giả sử đúng được +10 điểm
    setFeedback(selectedAnswer === answer ? "🎉 Đúng!" : "❌ Sai!");
    if (selected) return;
    setSelected(selectedAnswer);
  };

  return (
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
          onClick={isLast ? onFinish : onNext}
          style={{ marginLeft: "20px", cursor: "pointer" }}
        >
          <RightOutlined />
        </IconWrapper>
      </ButtonContainer>
    </StyledCard>
  );
};

export default ListenChooseWord;
