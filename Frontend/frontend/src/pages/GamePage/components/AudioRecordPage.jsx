import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Card, Button, Typography, message } from "antd";
import {
  RightOutlined,
  AudioOutlined,
  SoundOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  StyledCard,
  QuestionWrapper,
  QuestionText,
  IconWrapper,
} from "../gameCss";

const { Text } = Typography;

const ButtonContainer = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: flex-end;
`;

const Waveform = styled.div`
  width: 100%;
  height: 5px;
  background: ${(props) => (props.active ? "#ff8c00" : "#ccc")};
  transition: background 0.2s ease;
  margin-top: 20px;
`;

const AudioButton = styled(Button)`
  width: 100%;
  height: 40%;
`;

const IconAudio = styled(AudioOutlined)`
  font-size: 60px;
`;

const IconSound = styled(SoundOutlined)`
  font-size: 4rem;
`;

const CorrectIcon = styled(CheckCircleOutlined)`
  font-size: 80px;
  color: #52c41a;
  margin-top: 20px;
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
const AudioRecordPage = ({
  _id,
  score,
  questionLevel,
  answer,
  onNext,
  onFinish,
  isLast,
  onSelectAnswer,
}) => {
  const [hasSpoken, setHasSpoken] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false); // Kiểm tra nếu đã trả lời đúng

  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      message.error("Trình duyệt không hỗ trợ ghi âm giọng nói.");
    }

    if (!listening && transcript && attempts < 5 && !isCorrect) {
      checkAnswer();
      // setAttempts((prev) => prev + 1);
    }
  }, [listening]);

  const handleSpeakWord = () => {
    const utterance = new SpeechSynthesisUtterance(answer);
    console.log("answer" + answer);
    utterance.voice = speechSynthesis
      .getVoices()
      .find((voice) => voice.name === "Google UK English Female");
    speechSynthesis.speak(utterance);
    setHasSpoken(true);
  };

  const cleanText = (text) =>
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .trim();

  const checkAnswer = () => {
    const cleanedTranscript = cleanText(transcript);
    const cleanedAnswer = cleanText(answer);

    // console.log(cleanedTranscript);
    // console.log(cleanedAnswer);

    if (cleanedTranscript === cleanedAnswer) {
      console.log(transcript);
      message.success("🎉 Đúng rồi!");
      setIsCorrect(true);
      onSelectAnswer(_id, true, true, score); // Lưu kết quả đúng (+10 điểm)
      // onNext();
    } else {
      setAttempts((prev) => {
        const newAttempts = prev + 1;
        if (newAttempts >= 5) {
          onSelectAnswer(_id, false, false, score); // Lưu kết quả đúng (+10 điểm)
          message.error("Bạn hãy thử lại sau nhé!");
        } else {
          message.error("❌ Sai! Hãy thử lại.");
        }
        return newAttempts;
      });
    }
  };
  const handleStartRecording = () => {
    if (attempts >= 5 || isCorrect) return; // Không cho ghi âm nếu đã đúng hoặc hết lượt thử
    resetTranscript();
    SpeechRecognition.startListening();
  };

  const handleStopRecording = () => {
    SpeechRecognition.stopListening();
    // checkAnswer();
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Trình duyệt không hỗ trợ ghi âm giọng nói.</span>;
  }

  return (
    <StyledCard
      title={
        <QuestionWrapper>
          <QuestionText>{answer}</QuestionText>
          <IconWrapper
            style={{ position: "absolute", top: "10px", right: "10px" }}
            onClick={handleSpeakWord}
          >
            <IconSound />
          </IconWrapper>
        </QuestionWrapper>
      }
    >
      <div>
        <Text style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          Lượt thử: {attempts}/5
        </Text>
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            fontSize: "1.2rem",
            color: "#ff8c00",
          }}
        >
          <Text>Giọng nói của bạn: </Text>
          <Text strong>{transcript}</Text>
        </div>
      </div>

      {/* Hiển thị hiệu ứng khi đang ghi âm */}
      {listening && <Waveform active={listening ? "true" : "false"} />}

      {/* Nếu đã trả lời đúng, hiển thị icon tick xanh */}
      {isCorrect ? (
        <CorrectIcon />
      ) : attempts >= 5 ? (
        <Text style={{ color: "red", fontSize: "1.5rem", fontWeight: "bold" }}>
          Bạn hãy thử lại sau nhé!
        </Text>
      ) : !listening ? (
        <AudioButton type="primary" onClick={handleStartRecording}>
          <IconAudio />
          Bắt đầu ghi âm
        </AudioButton>
      ) : (
        <AudioButton type="danger" onClick={handleStopRecording}>
          <IconAudio />
          Dừng ghi âm
        </AudioButton>
      )}

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

export default AudioRecordPage;
