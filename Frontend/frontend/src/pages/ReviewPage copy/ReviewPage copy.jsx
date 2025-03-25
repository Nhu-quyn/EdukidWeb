import React, { useState } from "react";
import styled from "styled-components";
import FillBlank from "./component/FillBlank";
import MultipleChoice from "./component/MultipleChoice";
import SentenceText from "./component/SentenceText";
import Translation from "./component/Translation";
import TranslationMatch from "./component/TranslationMatch";
import ImageChooseWord from "./component/ImageChooseWord";
import ImageWriteWord from "./component/ImageWriteWord";
import ImageChooseSound from "./component/ImageChooseSound";
import ListenAndTranslate from "./component/ListenAndWrite"; // New component
import WordListenSpeak from "./component/WordListenSpeak"; // New component
import ImageBackgroundGame from "../../assets/backgroundgame2.jpg";
import { LeftOutlined, RightOutlined, StopOutlined } from "@ant-design/icons";
// import ListTopic from "./ListTopic";
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  justify-content: flex-start; /* Đảm bảo Header không bị căn giữa theo chiều dọc */
  // width: 100vw;
  background-image: url(${ImageBackgroundGame});
  background-size: cover;
  background-position: center;
  // padding-top: 20px; /* Tạo khoảng cách trên cùng */
  background-position: center;
`;
const Header = styled.header`
  font-size: clamp(2rem, 5vw, 5rem); /* Co giãn theo màn hình */
  color: #ff4081;
  // background: rgba(255, 255, 255, 0.9);

  font-family: "Comic Sans MS", cursive, sans-serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  text-align: center;
  margin-bottom: 20px;
  position: relative;
  z-index: 10;
  max-width: 90%; /* Giới hạn chiều rộng */
  overflow-wrap: break-word; /* Tự động xuống dòng khi cần */
  word-break: break-word;
`;
const Footer = styled.footer`
  position: absolute; /* Cố định ở cuối Container */
  bottom: 20px; /* Tạo khoảng cách nhỏ với đáy */
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  width: 100%;
`;
const ContentWrapper = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 15px;
  // box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  width: 70%; /* Mặc định lớn hơn */
  text-align: center;
  max-height: 100%;
  overflow-y: auto;
  /* Ẩn thanh cuộn trên các trình duyệt khác nhau */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE và Edge */

  /* Ẩn scrollbar trên Chrome và Safari */
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 1024px) {
    width: 80%; /* Nhỏ hơn trên màn hình nhỏ hơn */
  }

  @media (max-width: 768px) {
    width: 90%; /* Gần full màn hình cho điện thoại */
  }
`;

const Title = styled.h2`
  font-family: "Comic Sans MS", cursive, sans-serif;
  font-size: 3rem;
  color: #ff4081;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
`;

const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
`;

const Card = styled.div`
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

const NavButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 2rem;
  color: #ff7f50;
  transition: color 0.3s ease;
  &:hover {
    color: #ff6347;
  }
  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 400px;
`;

const ModalTitle = styled.h3`
  font-size: 2rem;
  margin-bottom: 20px;
  color: #ff4081;
`;

const ModalButton = styled.button`
  background-color: #ff7f50;
  color: white;
  font-size: 1.8rem;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s ease;
  &:hover {
    background-color: #ff6347;
  }
`;

const ReviewPage = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  const nextExercises = () => {
    setStartIndex((prev) => (prev + 3 < exercises.length ? prev + 3 : prev));
  };

  const prevExercises = () => {
    setStartIndex((prev) => (prev - 3 >= 0 ? prev - 3 : 0));
  };

  const endExercises = () => {
    setFinished(true);
  };

  // Reset to first exercise and close modal
  const handleRestart = () => {
    setStartIndex(0);
    setFinished(false);
  };

  // Updated exercises array with a `question` property in every object, including two new types:
  const exercises = [
    {
      type: "fill_blank",
      question: "The sky is ___.",
      answer: "blue",
    },
    {
      type: "multiple_choice",
      question: "Which color is an apple?",
      options: ["Red", "Black", "Gray"],
      correctAnswer: "Red",
    },
    {
      type: "sentence_text",
      question: "Arrange the words to form the correct sentence:",
      // words: ["The", "is", "sun", "yellow"],
      correctSentence: "The sun is yellow",
    },
    {
      type: "translation_match",
      question: "Chọn ngữ nghĩa của Chuối",
      options: ["Apple", "Banana", "Orange"],
      answer: "Banana",
      level: 1,
    },
    {
      type: "image_choose_word",
      question: "Chọn từ đúng với hình ảnh:",
      imageSrc:
        "https://img.lovepik.com/free-png/20210918/lovepik-apple-png-image_400207618_wh1200.png",
      options: ["Apple", "Banana", "Orange"],
      correctAnswer: "Apple",
      level: 1,
    },
    {
      type: "image_write_word",
      question: "Viết từ cho hình ảnh:",
      imageSrc:
        "https://i.pinimg.com/originals/46/99/cb/4699cb29c2fa28c96d10858c1695888d.png",
      answer: "Dog",
      level: 1,
    },
    {
      type: "translation",
      question: "Translate the following sentence:",
      sentence: "Màu xanh dương",
      correctTranslation: "Blue",
    },
    {
      type: "image_choose_sound",
      question: "Chọn âm thanh phù hợp với hình ảnh:",
      imageSrc: "https://mtv.vn/uploads/2023/02/25/meo-gg.jpg",
      audioSrc: "https://example.com/meow.mp3",
      options: ["Dog", "Cat", "duck"],
      correctAnswer: "Cat",
      level: 1,
    },
    // New exercise cards:
    {
      type: "listen_and_translate",
      question: "Nghe và dịch câu sau:",
      textToTranslate: "Good morning",
      correctTranslation: "Good morning",
      level: 1,
    },
    {
      type: "word_listen_speak",
      question: "Nghe và nói từ sau:",
      word: "Welcome",
      level: 1,
    },
  ];

  const renderExercise = (exercise) => {
    switch (exercise.type) {
      case "fill_blank":
        return (
          <FillBlank
            questionContent={exercise.question}
            answer={exercise.answer}
          />
        );
      case "multiple_choice":
        return (
          <MultipleChoice
            questionContent={exercise.question}
            options={exercise.options}
            answer={exercise.correctAnswer}
          />
        );
      case "sentence_text":
        return (
          <SentenceText
            questionContent={exercise.question}
            // words={exercise.words}
            answer={exercise.correctSentence}
          />
        );
      case "translation":
        return (
          <Translation
            questionContent={exercise.question}
            word={exercise.sentence}
            answer={exercise.correctTranslation}
          />
        );
      case "translation_match":
        return (
          <TranslationMatch
            questionContent={exercise.question}
            options={exercise.options}
            answer={exercise.answer}
            questionLevel={exercise.level}
          />
        );
      case "image_choose_word":
        return (
          <ImageChooseWord
            questionContent={exercise.question}
            image={exercise.imageSrc}
            options={exercise.options}
            answer={exercise.correctAnswer}
            questionLevel={exercise.level}
          />
        );
      case "image_write_word":
        return (
          <ImageWriteWord
            questionContent={exercise.question}
            image={exercise.imageSrc}
            answer={exercise.answer}
            questionLevel={exercise.level}
          />
        );
      case "image_choose_sound":
        return (
          <ImageChooseSound
            questionContent={exercise.question}
            image={exercise.imageSrc}
            word={exercise.audioSrc}
            options={exercise.options}
            answer={exercise.correctAnswer}
            questionLevel={exercise.level}
          />
        );
      case "listen_and_translate":
        return (
          <ListenAndTranslate
            questionContent={exercise.question}
            word={exercise.textToTranslate}
            answer={exercise.correctTranslation}
            questionLevel={exercise.level}
          />
        );
      case "word_listen_speak":
        return (
          <WordListenSpeak
            questionContent={exercise.question}
            word={exercise.word}
            questionLevel={exercise.level}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      {/* <Header>Ôn tập từ vựng</Header>; */}
      <ContentWrapper>
        <Header>Ôn tập từ vựng</Header>;{/* <Title>Ôn tập từ vựng</Title> */}
        <QuestionContainer>
          {exercises
            .slice(startIndex, startIndex + 10)
            .map((exercise, index) => (
              <Card key={index}>{renderExercise(exercise)}</Card>
            ))}
        </QuestionContainer>
        {/* <Footer> */}
        <NavContainer>
          <NavButton onClick={prevExercises} disabled={startIndex === 0}>
            <LeftOutlined />
          </NavButton>
          <NavButton onClick={endExercises}>
            <StopOutlined />
          </NavButton>
          <NavButton
            onClick={nextExercises}
            disabled={startIndex + 10 >= exercises.length}
          >
            <RightOutlined />
          </NavButton>
        </NavContainer>
        {/* </Footer> */}
      </ContentWrapper>
      {finished && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Bạn đã hoàn thành ôn tập!</ModalTitle>
            <ModalButton onClick={handleRestart}>Quay lại bài đầu</ModalButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default ReviewPage;
