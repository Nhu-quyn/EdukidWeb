import React, { useState } from "react";
import styled from "styled-components";

const MultipleChoice = ({ questionContent, options, answer }) => {
  const [selected, setSelected] = useState(null);
  const [hasChecked, setHasChecked] = useState(false);

  // Xác định trạng thái màu cho mỗi lựa chọn
  const getOptionStyle = (option) => {
    if (!hasChecked) {
      // Chưa bấm "Kiểm tra"
      return selected === option ? "selected" : "default";
    }
    // Đã bấm "Kiểm tra"
    if (option === answer) return "correct";
    if (selected === option && selected !== answer) return "incorrect";
    return "default";
  };

  const checkAnswer = () => {
    // Bấm "Kiểm tra" => hiển thị đúng/sai
    setHasChecked(true);
  };

  return (
    <Wrapper>
      {/* Khối chính (bên trái) */}
      <LeftSide>
        <Question>{questionContent}</Question>
        <OptionsContainer>
          {options.map((option, index) => {
            const optionStyle = getOptionStyle(option);
            return (
              <OptionBox
                key={index}
                onClick={() => {
                  if (!hasChecked) setSelected(option);
                }}
                optionStyle={optionStyle}
              >
                {option}
              </OptionBox>
            );
          })}
        </OptionsContainer>
        <CheckButton onClick={checkAnswer}>Kiểm tra</CheckButton>
      </LeftSide>

      {/* Khung hướng dẫn (bên phải) */}
      <RightSide>
        <GuideTitle>Hướng dẫn</GuideTitle>
        <GuideItem>
          <ColorBox color="#d4edda" />
          <GuideText>Đáp án đúng</GuideText>
        </GuideItem>
        <GuideItem>
          <ColorBox color="#f8d7da" />
          <GuideText>Đáp án sai</GuideText>
        </GuideItem>
      </RightSide>
    </Wrapper>
  );
};

export default MultipleChoice;

// ==================== Styled Components ====================
const Wrapper = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
  /* Card nền tổng quát, có thể tùy chỉnh thêm */
  background: #f4f4f4;
  border-radius: 12px;
  padding: 24px;
  max-width: 700px;
  margin: 0 auto; /* Căn giữa */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

// Phần khối chính bên trái (chứa câu hỏi và các lựa chọn)
const LeftSide = styled.div`
  flex: 1;
`;

// Phần khung hướng dẫn bên phải
const RightSide = styled.div`
  width: 180px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.1);
`;

// Tiêu đề hướng dẫn
const GuideTitle = styled.h4`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  text-align: center;
  color: #333;
`;

// Mỗi dòng hướng dẫn (đúng/sai)
const GuideItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const ColorBox = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: ${(props) => props.color || "#fff"};
`;

const GuideText = styled.span`
  font-size: 14px;
  color: #333;
`;

const Question = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px; /* khoảng cách giữa các lựa chọn */
`;

const OptionBox = styled.div`
  background: ${(props) => {
    switch (props.optionStyle) {
      case "correct":
        return "#d4edda"; // xanh nhạt
      case "incorrect":
        return "#f8d7da"; // đỏ nhạt
      case "selected":
        return "#e2e6ea"; // xám nhạt khi chọn nhưng chưa check
      default:
        return "#fff"; // mặc định trắng
    }
  }};
  border: 2px solid
    ${(props) => {
      switch (props.optionStyle) {
        case "correct":
          return "#28a745"; // viền xanh
        case "incorrect":
          return "#dc3545"; // viền đỏ
        case "selected":
          return "#007bff"; // viền xanh dương
        default:
          return "#ccc"; // mặc định xám
      }
    }};
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: background 0.3s, border-color 0.3s;
  text-align: center;
  font-size: 16px;

  &:hover {
    /* Hover nếu chưa check, thì chuyển sang xám nhạt */
    background: ${(props) =>
      props.optionStyle === "default" ? "#f8f9fa" : ""};
  }
`;

const CheckButton = styled.button`
  display: block;
  margin: 20px auto 0;
  padding: 12px 16px;
  font-size: 16px;
  background-color: #6c757d; /* màu nút trung tính */
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: #5a6268;
  }
`;
