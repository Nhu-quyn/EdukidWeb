import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { message } from "antd";
import { LevelBadge, getLevelText, Question } from "../activityCss";
import {
  CheckCircleOutlined,
  AudioOutlined,
  SoundOutlined,
} from "@ant-design/icons";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const WordListenSpeak = ({
  _id,
  score,
  answer,
  questionLevel,
  userAnswer,
  isReview,
  isEnd,
  type,
  activityId,
  onUserSelect,
}) => {
  const localStorageKey = `answer-${_id}-${activityId}`;
  const [feedback, setFeedback] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const icon = <AudioOutlined />;
  const [recordedAnswer, setRecordedAnswer] = useState(userAnswer || "");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (isReview) {
      const savedAnswer = localStorage.getItem(localStorageKey);
      if (savedAnswer) {
        setRecordedAnswer(savedAnswer);
      }
    }

    setHasSubmitted(false);
    setAttempts(0);
  }, [_id, activityId, isReview, localStorageKey]);
  useEffect(() => {
    if (!isReview) return;

    if (userAnswer) {
      setIsCorrect(true);
      setFeedback("🎉 Đúng rồi!");
    } else {
      setIsCorrect(false);
      setFeedback(`Sai rồi! Đáp án đúng: ${answer}`);
    }
  }, [isReview, userAnswer, answer]);

  useEffect(() => {
    if (isEnd && !isReview && !hasSubmitted) {
      const finalAnswer =
        recordedAnswer && recordedAnswer.trim() !== "" ? recordedAnswer : false;
      const finalCorrect =
        recordedAnswer && recordedAnswer.trim() !== "" ? isCorrect : false;

      setFeedback(
        finalAnswer
          ? finalCorrect
            ? "🎉 Đúng rồi!"
            : `❌ Sai! Đáp án: ${answer}`
          : "⚠️ Bạn chưa trả lời!",
      );

      onUserSelect(_id, type, finalAnswer, finalCorrect, score);
      localStorage.removeItem(localStorageKey);
      setHasSubmitted(true);
    }
  }, [
    isEnd,
    isReview,
    hasSubmitted,
    recordedAnswer,
    isCorrect,
    answer,
    onUserSelect,
    localStorageKey,
    _id,
    type,
    score,
  ]);
  const playWord = () => {
    const utterance = new SpeechSynthesisUtterance(answer);
    speechSynthesis.speak(utterance);
  };

  const cleanText = (text) =>
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .trim();

  const checkAnswer = useCallback(() => {
    if (hasSubmitted) return; // tránh gọi lại nhiều lần

    if (!transcript || transcript.trim() === "") {
      setFeedback("⚠️ Bạn chưa nói đáp án!");
      return;
    }

    const cleanedTranscript = cleanText(transcript);
    const cleanedWord = cleanText(answer);

    if (cleanedTranscript === cleanedWord) {
      setFeedback("🎉 Đúng rồi!");
      setIsCorrect(true);
      setRecordedAnswer(transcript);
      onUserSelect(_id, type, true, true, score);
      setHasSubmitted(true); // ✅ đánh dấu đã gửi
    } else {
      setAttempts((prev) => {
        const newAttempts = prev + 1;
        if (newAttempts >= 5) {
          onUserSelect(_id, type, false, false, score);
          setFeedback("Bạn hãy thử lại sau nhé!");
          message.error("Bạn hãy thử lại sau nhé!");
          setHasSubmitted(true); // ✅ đánh dấu đã gửi
        } else {
          setFeedback("❌ Sai! Hãy thử lại.");
          message.error("❌ Sai! Hãy thử lại.");
        }
        return newAttempts;
      });
      setRecordedAnswer(transcript);
    }
  }, [answer, hasSubmitted, onUserSelect, _id, type, score, transcript]);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setFeedback("Trình duyệt không hỗ trợ ghi âm giọng nói.");
      return;
    }
    if (!listening && transcript) {
      // checkAnswer();
      console.log(currentId);
      if (_id !== currentId) return;
      if (transcript) {
        checkAnswer();
      }
    }
  }, [
    listening,
    transcript,
    currentId,
    _id,
    browserSupportsSpeechRecognition,
    checkAnswer,
  ]);

  const handleStartRecording = () => {
    setIsRecording(true);
    if (attempts >= 5 || isCorrect || isReview) return;
    resetTranscript();
    // 👉 Gán _id của câu hiện tại vào currentId
    if (setCurrentId) {
      setCurrentId(_id);
    }

    SpeechRecognition.startListening();
    setFeedback("Đang ghi âm...");
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setFeedback("");
    SpeechRecognition.stopListening();
    if (attempts >= 5 || isCorrect || isReview) return;
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Trình duyệt không hỗ trợ ghi âm giọng nói.</span>;
  }

  return (
    <Card>
      {/* Tiêu đề + Mức độ + Điểm số */}
      <LevelBadge level={getLevelText(questionLevel)}>
        {getLevelText(questionLevel)} - {score} điểm
      </LevelBadge>
      {/* <LevelBadge>Level: {questionLevel}</LevelBadge> */}
      <Header>
        <Question>Nghe và nói lại: </Question>

        {/* <InfoBox>
          <Score>Điểm: {score}</Score>
        </InfoBox> */}
      </Header>
      {/* <Text> {transcript}</Text> */}
      {/* Hiển thị từ cần nói */}
      <WordDisplay>
        {answer} {isCorrect && <CheckIcon />}{" "}
        <ActionButton onClick={playWord}>
          <SoundOutlined />
        </ActionButton>
      </WordDisplay>

      {/* Nút Nghe & Ghi âm */}
      <ButtonRow>
        {!isReview && (
          <ActionButtonCircle
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            // disabled={isCorrect}
          >
            {icon}
          </ActionButtonCircle>
        )}
      </ButtonRow>
      {_id === currentId && <p>{transcript}</p>}

      {/* Feedback */}
      <FeedbackSection isCorrect={isCorrect} attempts={attempts}>
        {feedback}
      </FeedbackSection>
    </Card>
  );
};

export default WordListenSpeak;

const Card = styled.div`
  background: #f4f4f4;
  border-radius: 16px;
  padding: 28px 36px;
  max-width: 520px;
  margin: 20px auto;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
`;

const Header = styled.div`
  margin-bottom: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WordDisplay = styled.h2`
  font-size: 40px;
  font-weight: bold;
  color: #ff7f50;
  margin: 24px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 18px;
`;

const ActionButton = styled.button`
  padding: 12px 16px;
  font-size: 30px;
  // background: rgb(249, 114, 11);
  color: rgb(249, 114, 11);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  &:hover {
    background: #0056b3;
  }
`;

const ActionButtonCircle = styled(ActionButton)`
  border-radius: 50%;
  width: 80px;
  font-size: 30px;
  background: rgb(249, 114, 11);
  color: #fff;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CheckIcon = styled(CheckCircleOutlined)`
  font-size: 1.8rem;
  color: #28a745;
`;

const FeedbackSection = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-top: 12px;
  color: ${({ isCorrect, attempts }) =>
    isCorrect ? "#28a745" : attempts >= 5 ? "#dc3545" : "#ff9800"};
`;
