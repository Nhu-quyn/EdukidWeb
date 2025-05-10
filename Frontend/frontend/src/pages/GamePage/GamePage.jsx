import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import ImageMatch from "./components/ImageMatch";
import WordMatch from "./components/WordMatch";
import ListenChooseWord from "./components/ListenChooseWord";
import ListenChooseImage from "./components/ListenChooseImage";
import AudioRecordPage from "./components/AudioRecordPage";
// import ImageSelectSound from "./components/ImageSelectSound";
// import { gameQuestions } from "./data";
// import { useSelector } from "react-redux";
import { Modal, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import * as QuestionService from "../../services/QuestionService"; // Import service
import * as UserService from "../../services/UserService";
import ImageBackgroundGame from "../../assets/backgroundgame2.jpg";
import { setRank, addAnswerWithLogin } from "../../store/gameSlice";
import music from "../../mp3/kids-happy-music-320636.mp3";

// Hiệu ứng rung lắc mềm mại
const shakeAnimation = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;

// Các màu sắc khác nhau cho từng chữ
const colors = [
  "#ff66b2",
  "#ffcc00",
  "#00b3b3",
  "#ff3399",
  "#66ff66",
  "#00b300",
  "#ff6600",
  "#9999ff",
];
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  text-align: center;
  height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;
  overflow: hidden; /* Ngăn trượt nội dung */
  background-image: url(${ImageBackgroundGame});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const Header = styled.div`
  font-size: 4rem;
  font-weight: bold;
  color: white;
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
  font-family: "Poppins", sans-serif;
  animation: ${shakeAnimation} 2s ease-in-out infinite;
`;

const rotateShakeAnimation = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(5deg); }
  50% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
  100% { transform: rotate(0deg); }
`;

const HeaderLetter = styled.span`
  display: inline-block;
  animation: ${rotateShakeAnimation} 1s infinite ease-in-out;
  color: ${({ color }) => color};
  animation-delay: ${({ index }) => `${index * 0.1}s`};
  font-size: 5rem;
`;

const ButtonContainer = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;
  gap: 25px;
`;

const FinishButton = styled.button`
  background-color: #ffa07a; /* Cam nhạt */
  color: white;
  font-size: 20px;
  font-family: "Comic Sans MS", cursive, sans-serif;
  font-weight: bold;
  padding: 12px 24px;
  border: none;
  border-radius: 20px; /* Bo góc mềm hơn */
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #ff7f50; /* Đổi màu cam đậm hơn khi hover */
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const GamePage = () => {
  const audioRef = useRef(null);
  const [isInteracted, setIsInteracted] = useState(false);

  const { topicId } = useParams(); // Lấy topicId từ URL
  const [gameQuestions, setGameQuestions] = useState([]);
  const dispatch = useDispatch();
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentGame, setCurrentGame] = useState(null);
  // Lấy userId từ Redux
  const { game, answer_questions } = useSelector((state) => state.game);
  const user = useSelector((state) => state.user?.user);
  const userId = user?._id;
  const navigate = useNavigate();

  // Hàm lấy danh sách câu hỏi
  const fetchQuestions = async () => {
    try {
      let response;

      if (userId) {
        if (topicId) {
          console.log("Gọi API với topicId:", { userId, topicId });
          response = await QuestionService.getQuestionsWithGameByTopic(
            userId,
            topicId
          );
        } else {
          console.log("Gọi API không có topicId:", { userId });
          response = await QuestionService.getQuestionsWithGame(userId);
        }
      } else {
        if (topicId) {
          console.log("Gọi API công khai với topicId:", { topicId });
          response = await QuestionService.getPublicQuestionsByTopic(topicId);
        } else {
          console.log("Gọi API công khai không có topicId");
          response = await QuestionService.getPublicQuestions();
        }
      }

      console.log(response);
      setGameQuestions(response.data || []); // Đảm bảo không bị undefined
    } catch (error) {
      console.error("Lỗi khi lấy danh sách câu hỏi:", error);
    }
  };
  // const handleUserInteraction = () => {
  //   if (!isInteracted) {
  //     const audio = audioRef.current;
  //     if (audio) {
  //       audio.muted = false;
  //       audio.volume = 0.25; // Set âm lượng 30%
  //       audio
  //         .play()
  //         .then(() => setIsInteracted(true))
  //         .catch((err) => {
  //           console.log("Không thể phát nhạc nền:", err);
  //         });
  //     }
  //   }
  // };

  useEffect(() => {
    const getQuestions = async () => {
      await fetchQuestions();
    };
    getQuestions();
  }, [userId, topicId]);

  useEffect(() => {
    if (gameQuestions.length > 0) {
      setCurrentIndex(0);
      setCurrentGame(gameQuestions[0]); // Cập nhật ngay câu hỏi đầu tiên
    }
  }, [gameQuestions]); // Chạy lại khi gameQuestions thay đổi

  const nextGame = async () => {
    if (!gameQuestions.length) return;
    setSelectedAnswer(null); // Reset selectedAnswer
    const newIndex = currentIndex + 1;
    if (newIndex < gameQuestions.length) {
      setCurrentIndex(newIndex);
      setCurrentGame(gameQuestions[newIndex]);
    } else {
      await updateLearningProgress(userId, answer_questions);
      message.success("Trò chơi đã kết thúc! Cảm ơn bạn đã tham gia 🎉", 2);
      navigate("/end-game");
    }
  };

  const updateLearningProgress = async (userId, answer_questions) => {
    if (!userId) return;
    try {
      console.log(answer_questions);
      const response = await UserService.updateLearningProgressGame(
        userId,
        answer_questions
      );
      if (response.status !== "OK") {
        message.error("Đã có lỗi xảy ra khi cập nhật tiến trình");
      } else {
        console.log(response.data);
        dispatch(setRank(response.data.rank));
      }
    } catch (error) {
      message.error("Lỗi kết nối khi cập nhật tiến trình!");
    }
  };

  const handleFinishGame = () => {
    Modal.confirm({
      title: "Xác nhận kết thúc",
      content: "Bạn có chắc chắn muốn kết thúc trò chơi?",
      okText: "Có",
      cancelText: "Không",
      onOk: async () => {
        await updateLearningProgress(userId, answer_questions);
        // message.success("Trò chơi đã kết thúc! Cảm ơn bạn đã tham gia 🎉", 2);
        setTimeout(() => {
          navigate("/end-game");
        }, 2000);
      },
    });
  };
  const handleSelectAnswer = (questionId, selectedAnswer, isCorrect, score) => {
    setSelectedAnswer(selectedAnswer);
    dispatch(
      addAnswerWithLogin({ questionId, selectedAnswer, isCorrect, score })
    );
  };

  const gameComponents = {
    image_match: ImageMatch,
    word_match: WordMatch,
    listen_choose_word: ListenChooseWord,
    listen_choose_image: ListenChooseImage,
    audio_record: AudioRecordPage,
  };
  const handleUserInteraction = () => {
    if (!isInteracted) {
      const audio = audioRef.current;
      if (audio) {
        // Nhẹ nhàng khởi động nhạc nền
        audio.muted = false;
        audio.volume = 0.1; // 25-30% volume là đủ nghe mà không lấn tiếng
        audio
          .play()
          .then(() => {
            setIsInteracted(true);

            // Delay 500ms trước khi cho phép speech hoạt động (tránh đụng nhau)
            setTimeout(() => {
              window.speechSynthesis.cancel(); // Đảm bảo không bị treo voice
            }, 500);
          })
          .catch((err) => {
            console.log("Không thể phát nhạc nền:", err);
          });
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      // Lặp lại trước khi hết 5s
      if (audio?.duration && audio.currentTime >= audio.duration - 5) {
        audio.currentTime = 0;
        audio.play();
      }
    };

    audio?.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  useEffect(() => {
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {
        console.log("Voices đã sẵn sàng");
      };
    }
  }, []);

  return (
    <div onClick={handleUserInteraction} style={{ cursor: "pointer" }}>
      <Container>
        <audio ref={audioRef} src={music} loop muted />
        <div>
          <Header>
            {["P", "L", "A", "Y", "G", "A", "M", "E"].map((letter, index) => (
              <HeaderLetter key={index} color={colors[index]} index={index}>
                {letter}
              </HeaderLetter>
            ))}
          </Header>

          {!currentGame ? (
            <p style={{ color: "black", fontSize: "24px" }}>
              Không có câu hỏi nào để hiển thị
            </p>
          ) : (
            (() => {
              const GameComponent =
                gameComponents[currentGame.questionTypeId.questionTypeId];
              return GameComponent ? (
                <GameComponent
                  {...currentGame}
                  onNext={nextGame}
                  onSelectAnswer={handleSelectAnswer}
                  selectedAnswer={selectedAnswer} // Truyền vào component game để xử lý hiển thị
                />
              ) : null;
            })()
          )}
          {/* Nút kết thúc */}
          <ButtonContainer>
            <FinishButton onClick={handleFinishGame}>Kết thúc</FinishButton>
          </ButtonContainer>
        </div>
      </Container>
    </div>
  );
};

export default GamePage;
