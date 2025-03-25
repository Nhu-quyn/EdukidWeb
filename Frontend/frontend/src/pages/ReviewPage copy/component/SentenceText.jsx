import React, { useState } from "react";
import styled from "styled-components";
import { ReloadOutlined } from "@ant-design/icons";

const SentenceText = ({ answer }) => {
  const [selectedWords, setSelectedWords] = useState([]);
  const [hasChecked, setHasChecked] = useState(false);
  const words = answer.split(" ");

  const addWord = (word) => {
    // Chỉ cho phép chọn từ nếu chưa bấm Kiểm tra
    if (!hasChecked) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const checkAnswer = () => {
    setHasChecked(true);
    alert(
      selectedWords.join(" ") === answer
        ? "✅ Đúng!"
        : `❌ Sai! \nĐáp án: ${answer}`
    );
  };

  const resetWords = () => {
    // Xóa toàn bộ từ đã chọn
    setSelectedWords([]);
  };

  return (
    <Container>
      <Title>Sắp xếp thành câu đúng:</Title>
      <WordsContainer>
        {words.map((word, index) => (
          <WordButton key={index} onClick={() => addWord(word)}>
            {word}
          </WordButton>
        ))}
      </WordsContainer>

      <Sentence>{selectedWords.join(" ")}</Sentence>

      <ButtonRow>
        {!hasChecked && (
          <ResetButton onClick={resetWords}>
            <ReloadOutlined />
            &nbsp;Xóa
          </ResetButton>
        )}
        <CheckButton onClick={checkAnswer}>Kiểm tra</CheckButton>
      </ButtonRow>
    </Container>
  );
};

export default SentenceText;

// ======== Styled Components ========

const Container = styled.div`
  background: #f4f4f4;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  margin: 0 auto; /* Căn giữa khối */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const WordsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 16px;
`;

const WordButton = styled.button`
  padding: 10px 14px;
  font-size: 16px;
  background-color: #fff;
  color: #333;
  border: 2px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s, border-color 0.3s;

  &:hover {
    background-color: #e2e6ea;
    border-color: #007bff;
  }
`;

const Sentence = styled.h4`
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  color: #555;
  min-height: 24px; /* Đảm bảo có không gian hiển thị khi chưa có từ */
  margin-bottom: 20px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
`;

const ResetButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: #6c757d;
  color: #fff;
  font-size: 16px;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: #5a6268;
  }
`;

const CheckButton = styled.button`
  background-color: #6c757d;
  color: #fff;
  font-size: 16px;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: #5a6268;
  }
`;
