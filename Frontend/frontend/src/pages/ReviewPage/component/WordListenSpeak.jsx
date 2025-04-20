import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Typography, message, Alert } from "antd";
import { LevelBadge, getLevelText, Question } from "../activityCss";
import {
  CheckCircleOutlined,
  AudioOutlined,
  SoundOutlined,
} from "@ant-design/icons";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const { Text } = Typography;
const Feedback = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-top: 12px;
`;

const WordListenSpeak = ({
  _id,
  score,
  answer,
  questionLevel,
  // setCurrentId,
  // currentId,
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
  // const [answer, setAnswer] = useState(initialAnswer);
  const [currentId, setCurrentId] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [icon, setIcon] = useState(<AudioOutlined />);
  const [recordedAnswer, setRecordedAnswer] = useState(userAnswer || "");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  // useEffect(() => {
  //   setFeedback("");
  //   setIsRecording(false);
  //   setRecordedAnswer("");
  //   localStorage.removeItem(localStorageKey);
  // }, [activityId]);
  // useEffect(() => {
  //   setFeedback("");
  //   setIsRecording(false);
  //   setRecordedAnswer("");
  // }, [_id]);

  useEffect(() => {
    if (isReview) {
      const savedAnswer = localStorage.removeItem(localStorageKey);
      if (savedAnswer) setRecordedAnswer(savedAnswer);
    }
    setHasSubmitted(false);
    setAttempts(0);
  }, [_id, activityId]);
  useEffect(() => {
    if (isReview) {
      if (userAnswer === true) {
        // setRecordedAnswer(userAnswer);
        setIsCorrect(true);
        setFeedback("🎉 Đúng rồi!");
      } else {
        setIsCorrect(false);
        setFeedback(`Sai rồi! Đáp án đúng: ${answer}`);
      }
    }
  }, [isReview]);
  // useEffect(() => {
  //   if (isEnd && !isReview) {
  //     const finalAnswer =
  //       recordedAnswer && recordedAnswer.trim() !== "" ? recordedAnswer : false;
  //     const finalCorrect =
  //       recordedAnswer && recordedAnswer.trim() !== "" ? isCorrect : false;

  //     setFeedback(
  //       finalAnswer
  //         ? finalCorrect
  //           ? "🎉 Đúng rồi!"
  //           : `❌ Sai! Đáp án: ${answer}`
  //         : "⚠️ Bạn chưa trả lời!"
  //     );

  //     onUserSelect(_id, type, finalAnswer, finalCorrect, score);
  //     localStorage.removeItem(localStorageKey);
  //   }
  // }, [isEnd]);
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
          : "⚠️ Bạn chưa trả lời!"
      );

      onUserSelect(_id, type, finalAnswer, finalCorrect, score);
      localStorage.removeItem(localStorageKey);
      setHasSubmitted(true);
    }
  }, [isEnd]);
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
  }, [listening, transcript, currentId]);

  const playWord = () => {
    const utterance = new SpeechSynthesisUtterance(answer);
    speechSynthesis.speak(utterance);
  };

  const cleanText = (text) =>
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .trim();

  // const checkAnswer = () => {
  //   if (!transcript || transcript.trim() === "") {
  //     setFeedback("⚠️ Bạn chưa nói đáp án!");
  //     return;
  //   }
  //   const cleanedTranscript = cleanText(transcript);
  //   const cleanedWord = cleanText(answer);
  //   if (cleanedTranscript === cleanedWord) {
  //     setFeedback("🎉 Đúng rồi!");
  //     setIsCorrect(true);
  //     setRecordedAnswer(transcript);
  //     onUserSelect(_id, type, true, true, score);
  //     // const handleSelectAnswer = (
  //     //   questionId,
  //     //   type,
  //     //   selectedAnswer,
  //     //   isCorrect,
  //     //   score
  //     // ) => {
  //   } else {
  //     setAttempts((prev) => {
  //       const newAttempts = prev + 1;
  //       if (newAttempts >= 5) {
  //         onUserSelect(_id, type, false, false, score);
  //         setFeedback("Bạn hãy thử lại sau nhé!");
  //         message.error("Bạn hãy thử lại sau nhé!");
  //       } else {
  //         setFeedback("❌ Sai! Hãy thử lại.");
  //         message.error("❌ Sai! Hãy thử lại.");
  //       }
  //       return newAttempts;
  //     });
  //     setRecordedAnswer(transcript);
  //   }
  // };
  const checkAnswer = () => {
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
  };

  // const handleToggleRecording = () => {
  //   if (attempts >= 5 || isCorrect || isReview) return;

  //   if (!isRecording) {
  //     resetTranscript();
  //     SpeechRecognition.startListening();
  //     setFeedback("Đang ghi âm...");
  //     setIcon(<SoundOutlined />);
  //   } else {
  //     SpeechRecognition.stopListening();
  //     setIcon(isCorrect ? <CheckCircleOutlined /> : <AudioOutlined />);
  //   }

  //   setIsRecording(!isRecording);
  // };
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

      {/* Lượt thử */}
      {/* {!isReview && <AttemptText>Lượt thử: {attempts}/5</AttemptText>} */}

      {/* Khi xem lại, hiển thị câu đã nói */}
      {/* {isReview && recordedAnswer && (
        <ReviewAnswer>Đáp án bạn đã nói: "{recordedAnswer}"</ReviewAnswer>
      )} */}
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

const QuestionText = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #444;
`;

// const LevelBadge = styled.div`
//   padding: 6px 14px;
//   border-radius: 20px;
//   // background: linear-gradient(45deg, #ff9a9e, #fad0c4);
//   color: #444;
//   font-size: 1.2rem;
//   font-weight: bold;
// `;

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

const AudioIcon = styled(AudioOutlined)`
  font-size: 3rem;
`;

const CheckIcon = styled(CheckCircleOutlined)`
  font-size: 1.8rem;
  color: #28a745;
`;
const InfoBox = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const Score = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  color: #444;
`;

const FeedbackSection = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-top: 12px;
  color: ${({ isCorrect, attempts }) =>
    isCorrect ? "#28a745" : attempts >= 5 ? "#dc3545" : "#ff9800"};
`;

const AttemptText = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: #555;
`;

const ReviewAnswer = styled.div`
  margin-top: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #6c757d;
`;
