import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  addAnswerWithLogin,
  resetActivity,
  setEndIsTrue,
  setRank,
} from "../../store/activitySlice";
import * as UserService from "../../services/UserService";
import { message } from "antd";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Modal } from "antd";
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
import CountdownTimer from "./CountdownTimer";
import * as QuestionService from "../../services/QuestionService";
import {
  LeftOutlined,
  RightOutlined,
  StopOutlined,
  // AiOutlineHome,
} from "@ant-design/icons";
import EndGame from "../GamePage/EndGame";
import { AiOutlineHome } from "react-icons/ai"; // ✅ Đúng
// import ListTopic from "./ListTopic";
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-image: url(${ImageBackgroundGame});
  background-size: cover;
  background-position: center;
`;

const ContentWrapper = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  width: 50%;
  // background: #fffbec;
  text-align: center;
  max-height: 80vh;
  overflow-y: auto;
  @media (max-width: 1288px) {
    width: 100%;
    height: 100vh;
    max-height: none;
    border-radius: 0;
    padding: 20px;
  }
  @media (max-width: 888px) {
    width: 100%;
    height: 100vh;
    max-height: none;
    border-radius: 0;
    padding: 20px;
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

// Floating button hiển thị ở góc dưới bên phải cho mobile
const FloatingButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  z-index: 1000;
`;

// Container xếp nút theo hàng ngang
const HorizontalAnswerBoardContainer = styled.div`
  display: flex;
  flex-wrap: wrap; /* Tự xuống hàng nếu quá dài */
  gap: 15px; /* Khoảng cách giữa các nút */
  justify-content: center; /* Canh giữa */
  margin-bottom: 20px;
  background-color: #ffe5d1; /* Màu nền pastel nhẹ (tùy chỉnh theo trang) */
  padding: 20px;
  border-radius: 15px;
`;

// Mỗi nút tròn đại diện cho một câu hỏi
const AnswerCircle = styled(motion.button)`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  font-size: 1.5rem; /* Tăng kích cỡ chữ */
  font-family: "Comic Sans MS", cursive; /* Font chữ vui nhộn */
  color: #fff;
  border: 3px solid #fff; /* Viền trắng nổi bật */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* Đổ bóng */
  cursor: pointer;
  background-color: ${(props) => (props.$selected ? "#66bb6a" : "#29b6f6")};
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.$selected ? "#43a047" : "#0288d1")};
  }
`;

// Nút kết thúc bài làm
const EndButton = styled(motion.button)`
  font-family: "Comic Sans MS", cursive;
  font-size: 1.3rem;
  color: #fff;
  background: linear-gradient(45deg, #ff9800, #ffb74d);
  border: none;
  border-radius: 15px;
  padding: 12px 24px;
  cursor: pointer;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background: linear-gradient(45deg, #fb8c00, #ffa726);
  }
`;
const HomeButton = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.8); /* Nền trong suốt */
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Hiệu ứng nổi */
  color: #2196f3;
  transition: all 0.3s ease-in-out;
  border: none;
  cursor: pointer;

  &:hover {
    color: #1565c0;
    background-color: rgba(255, 255, 255, 1);
  }
`;

const QuestionNumber = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #ff5722; /* Màu nổi bật */
  margin-bottom: 8px;
  text-align: left;
  align-self: flex;
`;

// Tạo motion component từ FloatingButton để hỗ trợ drag
const DraggableFloatingButton = motion(FloatingButton);
// Component bảng đáp án
const AnswerBoard = ({ answers, onSelectQuestion, onFinish }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const handleSelect = (index) => {
    setSelectedQuestion(index);
    onSelectQuestion(index);
  };

  return (
    <div>
      {/* Container hàng ngang cho các nút */}
      <HorizontalAnswerBoardContainer>
        {answers.map((_, index) => (
          <AnswerCircle
            key={index}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSelect(index)}
            style={{
              // width: "50px",
              // height: "50px",
              // borderRadius: "50%",
              backgroundColor:
                selectedQuestion === index ? "#4caf50" : "#2196f3",
              // color: "white",
              // border: "none",
              // fontSize: "1rem",
              // cursor: "pointer",
            }}
          >
            {index + 1}
          </AnswerCircle>
        ))}
      </HorizontalAnswerBoardContainer>

      {/* Nút kết thúc bài làm */}
      <div style={{ textAlign: "center" }}>
        <EndButton
          onClick={onFinish}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ff9800",
            border: "none",
            borderRadius: "10px",
            color: "white",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          Kết thúc bài làm
        </EndButton>
      </div>
    </div>
  );
};
const ExerciseComponents = {
  fill_blank: FillBlank,
  multiple_choice: MultipleChoice,
  sentence_text: SentenceText,
  translation: Translation,
  translation_match: TranslationMatch,
  word_match: ImageChooseWord,
  image_write_word: ImageWriteWord,
  image_select_sound: ImageChooseSound,
  listen_and_translate: ListenAndTranslate,
  audio_record: WordListenSpeak,
};
// const renderExercise = (exercise) => {
//   switch (exercise.questionTypeId.questionTypeId) {
//     case "fill_blank":
//       return (
//         <FillBlank
//           questionId={exercise._id}
//           score={exercise.score}
//           questionLevel={exercise.questionLevel}
//           questionContent={exercise.questionContent}
//           answer={exercise.answer}
//         />
//       );
//     case "multiple_choice":
//       return (
//         <MultipleChoice
//           questionId={exercise._id}
//           questionContent={exercise.questionContent}
//           options={exercise.options}
//           answer={exercise.answer}
//         />
//       );
//     case "sentence_text":
//       return (
//         <SentenceText
//           questionId={exercise._id}
//           questionContent={exercise.questionContent}
//           answer={exercise.answer}
//           score={exercise.score}
//           questionLevel={exercise.questionLevel}
//         />
//       );
//     case "translation":
//       return (
//         <Translation
//           questionId={exercise._id}
//           score={exercise.score}
//           questionLevel={exercise.questionLevel}
//           questionContent={exercise.questionContent}
//           word={exercise.word}
//           answer={exercise.answer}
//         />
//       );
//     case "multiple_choice":
//       return (
//         <TranslationMatch
//           questionId={exercise._id}
//           score={exercise.score}
//           questionLevel={exercise.questionLevel}
//           questionContent={exercise.questionContent}
//           options={exercise.options}
//           answer={exercise.answer}
//         />
//       );
//     case "image_choose_word":
//       return (
//         <ImageChooseWord
//           questionId={exercise._id}
//           score={exercise.score}
//           questionLevel={exercise.questionLevel}
//           questionContent={exercise.questionContent}
//           image={exercise.image}
//           options={exercise.options}
//           answer={exercise.answer}
//         />
//       );
//     case "image_write_word":
//       return (
//         <ImageWriteWord
//           questionId={exercise._id}
//           score={exercise.score}
//           questionLevel={exercise.questionLevel}
//           questionContent={exercise.questionContent}
//           image={exercise.image}
//           answer={exercise.answer}
//         />
//       );
//     case "image_choose_sound":
//       return (
//         <ImageChooseSound
//           questionId={exercise._id}
//           score={exercise.score}
//           questionLevel={exercise.questionLevel}
//           questionContent={exercise.questionContent}
//           image={exercise.image}
//           // word={exercise.audioSrc}
//           options={exercise.options}
//           answer={exercise.answer}
//         />
//       );
//     case "listen_and_translate":
//       return (
//         <ListenAndTranslate
//           questionId={exercise._id}
//           score={exercise.score}
//           questionLevel={exercise.questionLevel}
//           questionContent={exercise.questionContent}
//           word={exercise.word}
//           answer={exercise.answer}
//         />
//       );
//     case "word_listen_speak":
//       return (
//         <WordListenSpeak
//           questionId={exercise._id}
//           score={exercise.score}
//           questionLevel={exercise.questionLevel}
//           questionContent={exercise.questionContent}
//           answer={exercise.word}
//         />
//       );
//     default:
//       return null;
//   }
// };
const ReviewPage = () => {
  const [exercises, setExercises] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [showAnswerBoard, setShowAnswerBoard] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { activityId, topicId } = useParams(); // Lấy activityId từ URL
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);
  const dragConstraintsRef = useRef(null);
  const activity = useSelector((state) => state.activity?.activity);
  console.log(activity);
  const userId = useSelector((state) => state.user?.user?._id);
  const answerQuestions = useSelector(
    (state) => state.activity?.answer_questions || []
  );
  const [testTimes, setTestTimes] = useState(0);
  const location = useLocation();
  // Kiểm tra nếu là trang `/test/:activityId` thì lấy test, nếu là `/review/:topicId/:activityId` thì lấy review
  const isTestPage = location.pathname.includes("/test/");
  const isReviewPage = location.pathname.includes("/review/");

  // console.log("Current Path:", location.pathname);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("Activity updated:", activity);
  }, [activity]); // Khi `activity` thay đổi, effect này sẽ chạy lại

  useEffect(() => {
    console.log("User ID updated:", answerQuestions);
  }, [answerQuestions]); // Khi `userId` thay đổi, effect này sẽ chạy lại
  const nextExercises = () => {
    setStartIndex((prev) => (prev + 3 < exercises.length ? prev + 3 : prev));
  };
  // const handleSelectQuestion = (index) => {
  //   setCurrentQuestionIndex(index); // Cập nhật index của câu hỏi hiện tại
  // };
  // thêm tất cả các câu hỏi => nối rồi mới gắn
  const prevExercises = () => {
    setStartIndex((prev) => (prev - 3 >= 0 ? prev - 3 : 0));
  };

  // const endExercises = () => {
  //   setFinished(true);
  //   // setEndIsTru
  //   dispatch(setEndIsTrue());
  //   console.log(activity.isEnd);
  // };
  // addAnswerWithLogin, resetActivity, setRank;
  // useEffect để lấy danh sách bài tập từ questionService
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const response = await QuestionService.getQuestionByActivity(
          activityId
        );
        setExercises(response.data);
        if (isTestPage) setTestTimes(response.testTimes);
        console.log(response);
      } catch (error) {
        message.error("Lỗi khi lấy danh sách bài tập:", error);
      }
    };

    fetchExercises();
  }, []); // Chạy 1 lần khi component mount
  // Reset to first exercise and close modal
  const handleSelectAnswer = (
    questionId,
    type,
    selectedAnswer,
    isCorrect,
    score
  ) => {
    console.log("Dữ liệu gửi đi:", {
      questionId,
      type,
      selectedAnswer,
      isCorrect,
      score,
    });
    // if (!activity.isReview) {
    // Kiểm tra xem câu hỏi đã có trong danh sách answerQuestions chưa
    // const existingAnswer = answerQuestions.find(
    //   (ans) => ans.questionId === questionId
    // );

    // if (existingAnswer) {
    //   // Nếu đã có, chỉ cập nhật answer
    //   // dispatch(updateAnswer({ questionId, selectedAnswer }));
    //   //chưa được viết
    // } else {
    // Nếu chưa có, thêm mới
    dispatch(
      addAnswerWithLogin({
        questionId,
        type,
        selectedAnswer,
        isCorrect,
        score,
      })
    );
    // }
    // }
  };

  const handleRestart = () => {
    setStartIndex(0);
    setFinished(false);
  };
  // Kiểm tra kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1288);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Khi chọn một câu hỏi từ bảng, ta tính lại startIndex sao cho câu đó nằm trong trang hiện tại (mỗi trang có 3 câu)
  const handleSelectQuestion = (index) => {
    const newStartIndex = index - (index % 3);
    setStartIndex(newStartIndex);
    setCurrentQuestionIndex(index);
  };
  const updateLearningProgress = async (
    activityId,
    userId,
    answerQuestions
  ) => {
    if (!userId) return;
    try {
      // console.log(answerQuestions);
      const response = await UserService.updateLearningProgressGame(
        activityId,
        userId,
        answerQuestions
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

  const endExercise = () => {
    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn có chắc chắn muốn kết thúc bài luyện tập không?",
      okText: "OK",
      cancelText: "Hủy",
      onOk: async () => {
        // setFinished(true);
        // setEndIsTru
        dispatch(setEndIsTrue());
        // console.log(activity.isEnd);
        // if (exercises.length === answerQuestions.length) {
        setTimeout(async () => {
          await updateLearningProgress(activityId, userId, answerQuestions);
        }, 2000); // Chờ 2.5s trước khi gọi hàm

        message.success("Bài tập đã kết thúc! Cảm ơn bạn đã tham gia 🎉", 2);
        // }
        setTimeout(() => {
          if (isReviewPage) {
            navigate(`/end-review/${topicId}/${activityId}`);
          } else {
            navigate(`/end-test/${activityId}`);
          }
        }, 3500);
      },
    });
  };
  const endTest = async () => {
    dispatch(setEndIsTrue());
    setTimeout(async () => {
      await updateLearningProgress(activityId, userId, answerQuestions);
    }, 3000); // Chờ 2.5s trước khi gọi hàm

    message.success("Bài tập đã kết thúc! Cảm ơn bạn đã tham gia 🎉", 2);
    // }
    setTimeout(() => {
      navigate(`/end-test/${activityId}`);
    }, 3500);
  };

  return (
    <Container>
      {/* Icon Home */}
      {/* <HeaderWrapper> */}
      <HomeButton
        onClick={() => {
          navigate("/");
        }}
        // className="absolute top-2 left-2 flex items-center space-x-2 p-2 text-blue-600 hover:text-blue-800 transition-all"
      >
        <AiOutlineHome size={28} />
      </HomeButton>
      {/* Hiển thị bảng đáp án inline nếu không phải mobile */}
      {!isMobile && (
        <AnswerBoard
          answers={exercises}
          onSelectQuestion={handleSelectQuestion}
          onFinish={endExercise}
        />
      )}
      {isTestPage && (
        <TimerWrapper>
          {" "}
          <CountdownTimer testime={5} onEnd={endTest} />
        </TimerWrapper>
      )}
      {/* Bộ đếm */}
      {/* </HeaderWrapper> */}
      <ContentWrapper>
        <QuestionContainer>
          {/* {(activity.isReview
            ? answerQuestions
            : exercises.slice(startIndex, startIndex + 3)
          ) */}
          {activity.isReview
            ? exercises.map((exercise, index) => {
                const questionNumber = startIndex + index + 1;
                const questionTypeId =
                  exercise?.questionTypeId?.questionTypeId || "defaultType";
                const ExerciseComponent = ExerciseComponents[questionTypeId];

                // Tìm câu trả lời của người dùng dựa trên questionId và type
                const userAnswer = answerQuestions.find(
                  (ans) =>
                    ans.questionId === exercise._id &&
                    ans.type === questionTypeId
                )?.selectedAnswer; // Chỉ lấy giá trị `selectedAnswer`

                return (
                  <Card key={exercise._id || index}>
                    <QuestionNumber>Câu {questionNumber}:</QuestionNumber>
                    {ExerciseComponent && (
                      <ExerciseComponent
                        {...exercise}
                        onUserSelect={handleSelectAnswer}
                        isReview={activity.isReview}
                        activityId={activityId}
                        isEnd={activity.isEnd}
                        userAnswer={userAnswer} // Chỉ truyền `selectedAnswer`
                        type={questionTypeId}
                      />
                    )}
                  </Card>
                );
              })
            : exercises.map((exercise, index) => {
                const questionNumber = startIndex + index + 1;
                const questionTypeId =
                  exercise?.questionTypeId?.questionTypeId || "defaultType";
                const ExerciseComponent = ExerciseComponents[questionTypeId];

                return (
                  <Card key={exercise._id || index}>
                    <QuestionNumber>Câu {questionNumber}:</QuestionNumber>
                    {ExerciseComponent && (
                      <ExerciseComponent
                        {...exercise}
                        onUserSelect={handleSelectAnswer}
                        isReview={activity.isReview}
                        activityId={activityId}
                        isEnd={activity.isEnd}
                        type={questionTypeId}
                      />
                    )}
                  </Card>
                );
              })}
        </QuestionContainer>

        {/* <NavContainer>
          <NavButton onClick={prevExercises} disabled={startIndex === 0}>
            <LeftOutlined />
            <LeftOutlined />
          </NavButton>
          <NavButton onClick={endExercise}>
            <StopOutlined />
          </NavButton>
          <NavButton
            onClick={nextExercises}
            disabled={startIndex + 3 >= exercises.length}
          >
            <RightOutlined />
            <RightOutlined />
          </NavButton>
        </NavContainer> */}
      </ContentWrapper>
      {finished && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Bạn đã hoàn thành ôn tập!</ModalTitle>
            <ModalButton onClick={handleRestart}>Quay lại bài đầu</ModalButton>
          </ModalContent>
        </ModalOverlay>
      )}
      {/* Nếu mobile, hiển thị nút floating draggable bên trong container giới hạn (viewport) */}
      {isMobile && (
        <div
          ref={dragConstraintsRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none", // đảm bảo container không chặn tương tác, chỉ nút mới nhận events
            zIndex: 1000,
          }}
        >
          <DraggableFloatingButton
            drag
            dragMomentum={false}
            dragConstraints={dragConstraintsRef}
            onTap={() => setShowAnswerBoard(true)}
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              pointerEvents: "auto", // kích hoạt events cho nút
            }}
          >
            📋
          </DraggableFloatingButton>
        </div>
      )}
      {/* Modal cho bảng đáp án trên mobile */}
      {/* Modal cho bảng đáp án trên mobile */}
      {showAnswerBoard && (
        <ModalOverlay onClick={() => setShowAnswerBoard(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <AnswerBoard
              answers={exercises}
              onSelectQuestion={(index) => {
                handleSelectQuestion(index);
                setShowAnswerBoard(false);
              }}
              onFinish={endExercise}
            />
            {/* translation ch fix component */}
            <ModalButton onClick={() => setShowAnswerBoard(false)}>
              Đóng
            </ModalButton>
          </ModalContent>
        </ModalOverlay>
      )}
      {/* <CountdownTimer testime={5} /> */}
    </Container>
  );
};

export default ReviewPage;
export const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: #ffe6cc;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

export const TimerWrapper = styled.div`
  position: absolute;
  background: #ff4d4f;
  color: white;
  font-weight: bold;
  top: 40px;
  right: 20px;
  // display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  font-size: 3rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 2rem;
    padding: 0.5rem 1rem;
    top: 10px;
    right: 20px;
  }
`;
