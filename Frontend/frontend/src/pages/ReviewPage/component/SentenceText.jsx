import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ReloadOutlined } from "@ant-design/icons";

const SentenceText = ({
  _id,
  onUserSelect,
  activityId, // Nhận thêm activityId để theo dõi sự thay đổi
  questionLevel,
  isEnd,
  type,
  score,
  answer,
  isReview,
  userAnswer,
}) => {
  const [selectedWords, setSelectedWords] = useState([]);
  const [hasChecked, setHasChecked] = useState(false);
  const words = answer.split(" ");
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const addWord = (word) => {
    if (!isReview) {
      const newSelection = [...selectedWords, word];
      setSelectedWords(newSelection);
    }
  };
  // useEffect(() => {
  //   // Khi activityId thay đổi, reset lại trạng thái
  //   setSelectedWords([]);
  //   setHasChecked(false);
  //   setFeedback("");
  //   localStorage.removeItem(`selectedWords-${_id}-${activityId}`);
  // }, [activityId]); // Lắng nghe cả _id và activityId
  // useEffect(() => {
  //   // Khi activityId thay đổi, reset lại trạng thái
  //   setSelectedWords([]);
  //   setHasChecked(false);
  //   setFeedback("");
  // }, [_id]); // Lắng nghe cả _id và activityId
  useEffect(() => {
    if (isReview && userAnswer) {
      setSelectedWords(userAnswer.split(" "));
      checkAnswer();
    }
  }, [isReview, userAnswer]);
  useEffect(() => {
    if (isEnd) {
      onUserSelect(
        _id,
        type,
        selectedWords.join(" "),
        selectedWords.join(" ") === answer,
        score
      );
      localStorage.removeItem(`selectedWords-${_id}-${activityId}`);
    }
  }, [isEnd]);

  // const addWord = (word) => {
  //   if (!hasChecked) {
  //     setSelectedWords([...selectedWords, word]);
  //   }
  // };

  const checkAnswer = (customAnswer = null) => {
    const finalAnswer = customAnswer || selectedWords.join(" ");
    setHasChecked(true);
    if (finalAnswer === answer) {
      setFeedback("✅ Đúng!");
    } else {
      setFeedback(`❌ Sai! Đáp án đúng: "${answer}"`);
    }
  };
  // const checkAnswer = () => {
  //   setHasChecked(true);
  //   alert(
  //     selectedWords.join(" ") === answer
  //       ? "✅ Đúng!"
  //       : `❌ Sai! \nĐáp án: ${answer}`
  //   );
  // };

  const resetWords = () => {
    setSelectedWords([]);
    setFeedback("");
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

      {!isReview && (
        <ButtonRow>
          {!hasChecked && (
            <ResetButton onClick={resetWords}>
              <ReloadOutlined />
              &nbsp;Xóa
            </ResetButton>
          )}
          {/* <CheckButton onClick={checkAnswer}>Kiểm tra</CheckButton> */}
        </ButtonRow>
      )}
      {feedback && <Feedback>{feedback}</Feedback>}
    </Container>
  );
};

export default SentenceText;

// ======== Styled Components ========
const Feedback = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => (props.children.includes("✅") ? "green" : "red")};
  margin-top: 10px;
`;
const Container = styled.div`
  background: #f4f4f4;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  margin: 0 auto;
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
  min-height: 24px;
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
