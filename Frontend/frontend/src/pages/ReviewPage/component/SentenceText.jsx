import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ReloadOutlined } from "@ant-design/icons";
import { LevelBadge, getLevelText, Question } from "../activityCss";
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
  const [selectedIndexes, setSelectedIndexes] = useState([]);

  const [isCorrect, setIsCorrect] = useState(false);
  const addWord = (word, index) => {
    if (!isReview && !selectedIndexes.includes(index)) {
      setSelectedWords([...selectedWords, word]);
      setSelectedIndexes([...selectedIndexes, index]);
    }
  };

  useEffect(() => {
    if (isReview) {
      setSelectedWords(userAnswer.split(" "));
      checkAnswer();
    }
  }, [isReview]);
  useEffect(() => {
    if (isEnd && !isReview) {
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
    console.log(finalAnswer);
    if (finalAnswer.trim().toLowerCase() === answer.trim().toLowerCase()) {
      setFeedback("✅ Đúng!");
    } else {
      setFeedback(`❌ Sai! Đáp án đúng: "${answer}"`);
    }
    setHasChecked(true);
  };

  const resetWords = () => {
    setSelectedWords([]);
    setFeedback("");
  };
  // const removeWordAtIndex = (index) => {
  //   const newWords = [...selectedWords];
  //   newWords.splice(index, 1);
  //   setSelectedWords(newWords);
  // };
  const removeWordAtIndex = (i) => {
    const newWords = [...selectedWords];
    const newIndexes = [...selectedIndexes];
    newWords.splice(i, 1);
    newIndexes.splice(i, 1); // đảm bảo xóa đúng index tương ứng
    setSelectedWords(newWords);
    setSelectedIndexes(newIndexes);
  };

  return (
    <Container>
      <LevelBadge level={getLevelText(questionLevel)}>
        {getLevelText(questionLevel)} - {score} điểm
      </LevelBadge>
      <Question>Sắp xếp thành câu đúng:</Question>
      {/* <WordsContainer>
        {words.map((word, index) => (
          <WordButton key={index} onClick={() => addWord(word)}>
            {word}
          </WordButton>
        ))}
      </WordsContainer> */}
      <WordsContainer>
        {words.map((word, index) => (
          <WordButton
            key={index}
            onClick={() => addWord(word, index)}
            disabled={selectedIndexes.includes(index)}
          >
            {word}
          </WordButton>
        ))}
      </WordsContainer>

      {/* 
      <Sentence>{selectedWords.join(" ")}</Sentence> */}
      <Sentence>
        {selectedWords.map((word, index) => (
          <SelectedWord key={index} onClick={() => removeWordAtIndex(index)}>
            {word}
            <CloseIcon className="close-icon">&times;</CloseIcon>
          </SelectedWord>
        ))}
      </Sentence>

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
const SelectedWord = styled.span`
  position: relative;
  display: inline-block;
  margin: 0 6px;
  padding: 6px 10px;
  // background-color: #007bff;
  // color: #fff;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #0056b3;
    color: #fff;
    .close-icon {
      display: inline;
    }
  }
`;

const CloseIcon = styled.span`
  display: none;
  margin-left: 8px;
  font-weight: bold;
  color: #fff;
`;

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
