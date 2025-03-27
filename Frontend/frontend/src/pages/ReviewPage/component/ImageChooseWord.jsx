import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ImageChooseWord = ({
  _id,
  questionContent,
  type,
  score,
  image,
  activityId, // Thêm activityId để theo dõi sự thay đổi
  options,
  answer,
  isEnd,
  isReview,
  userAnswer,
  onUserSelect,
}) => {
  const localStorageKey = `selected-${_id}-${activityId}`; // Tạo key duy nhất dựa trên `_id` & `activityId`
  const [selected, setSelected] = useState(() => {
    return localStorage.getItem(localStorageKey) || "";
  });

  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (isReview) {
      setSelected(userAnswer);
      setHasChecked(true);
    }
  }, [isReview]);

  // Kiểm tra đáp án và lưu vào localStorage
  const checkAnswer = (option) => {
    if (selected) return;
    setSelected(option);
    localStorage.setItem(localStorageKey, option); // Lưu dữ liệu dựa trên activityId
  };

  // Khi `isEnd`, kiểm tra kết quả & gọi `onUserSelect`
  useEffect(() => {
    if (isEnd && !isReview) {
      const isCorrectAnswer = selected === answer;
      setIsCorrect(isCorrectAnswer);
      onUserSelect(_id, type, selected, selected === answer, score);
      localStorage.removeItem(localStorageKey); // Xóa dữ liệu sau khi kiểm tra
    }
  }, [isEnd]);

  return (
    <Card>
      <Header>{questionContent}</Header>
      <Content>
        <ImageWrapper>
          <img src={image} alt="Question" />
        </ImageWrapper>
        <OptionsWrapper>
          {options.map((option, index) => {
            let bgColor = "#fff";
            let borderColor = "#ccc";
            if (hasChecked) {
              if (option === answer) {
                bgColor = "#d4edda";
                borderColor = "#28a745";
              } else if (selected === option && option !== answer) {
                bgColor = "#f8d7da";
                borderColor = "#dc3545";
              }
            } else if (selected === option) {
              bgColor = "#e2e6ea";
              borderColor = "#007bff";
            }

            return (
              <OptionBox
                key={index}
                onClick={() => {
                  if (!hasChecked) setSelected(option);
                  checkAnswer(option);
                }}
                style={{ backgroundColor: bgColor, borderColor: borderColor }}
              >
                {option}
              </OptionBox>
            );
          })}
          {/* <CheckButton
            onClick={checkAnswer}
            disabled={selected === null || hasChecked}
          >
            Kiểm tra
          </CheckButton> */}
        </OptionsWrapper>
      </Content>
      {isReview && (
        <Instructions>
          <InstructionItem>
            <ColorBox style={{ backgroundColor: "#d4edda" }} />
            <InstructionText>Đáp án đúng</InstructionText>
          </InstructionItem>
          <InstructionItem>
            <ColorBox style={{ backgroundColor: "#f8d7da" }} />
            <InstructionText>Đáp án sai</InstructionText>
          </InstructionItem>
        </Instructions>
      )}
    </Card>
  );
};

export default ImageChooseWord;

// =================== Styled Components ===================

const Card = styled.div`
  background: #f4f4f4;
  border-radius: 12px;
  padding: 24px;
  max-width: 700px;
  margin: 20px auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h3`
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  text-align: center;
`;

const Content = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-start;
`;

const ImageWrapper = styled.div`
  flex: 1;
  max-width: 300px;
  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    object-fit: contain;
  }
`;

const OptionsWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OptionBox = styled.div`
  padding: 12px;
  border: 2px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
  transition: background-color 0.3s, border-color 0.3s;
  &:hover {
    background-color: #f8f9fa;
  }
`;

const CheckButton = styled.button`
  margin-top: 16px;
  padding: 12px 16px;
  font-size: 16px;
  background-color: #6c757d;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
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
  background-color: #e9ecef;
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
