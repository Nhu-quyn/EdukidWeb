import React from "react";
import styled, { keyframes } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { resetGame } from "../../store/gameSlice";
import { resetActivity, setReviewIsTrue } from "../../store/activitySlice";
import { useLocation } from "react-router-dom";
import { FaHome, FaTrophy, FaList } from "react-icons/fa";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  TrophyOutlined,
  RedoOutlined,
  EyeOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ImageBackgroundGame from "../../assets/backgroundgame2.jpg";
import { useParams } from "react-router-dom";
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const EndGameContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-image: url(${ImageBackgroundGame});
  background-size: cover;
  background-position: center;
  text-align: center;
`;

const Title = styled.h1`
  color: #ff4081;
  font-size: 4rem;
  font-family: "Comic Sans MS", cursive, sans-serif;
  @media (max-width: 992px) {
    font-size: 3.5rem;
  }

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: #ffffff;
  padding: 35px;
  border-radius: 15px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 520px;
  animation: ${fadeIn} 0.8s ease-in-out;
`;

const StatItem = styled.div`
  font-size: 2rem;
  margin: 10px 0;
  display: flex;
  align-items: center;
  font-weight: 600;
`;

const PercentageBar = styled.div`
  width: 100%;
  background-color: #ff6666;
  border-radius: 10px;
  margin: 18px 0;
  overflow: hidden;
`;

const PercentageFill = styled.div`
  height: 24px;
  background: linear-gradient(to right, #4caf50, #8bc34a);
  width: 70%;
  transition: width 1s ease-in-out;
`;

const RankContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 35px;
  padding: 25px;
  background: #fff3cd;
  border-radius: 15px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 520px;
  animation: ${fadeIn} 1s ease-in-out;
`;

const RankText = styled.div`
  font-size: 3rem;
  font-weight: bold;
  font-family: "Comic Sans MS", cursive, sans-serif;
  color: #ff9800;
  margin-bottom: 12px;
`;

const Trophy = styled(TrophyOutlined)`
  font-size: 4rem;
  color: #ff9800;
  margin-bottom: 12px;
`;

const Button = styled.button`
  background: #8e44ad; /* Màu tím huyền bí */
  color: white;
  border: 3px solid white;
  padding: 15px 35px;
  cursor: pointer;
  font-family: "Comic Sans MS", cursive, sans-serif;
  border-radius: 25px;
  font-size: 2rem;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background: #a569bd; /* Màu tím sáng hơn khi hover */
    color: #ffeb3b; /* Màu vàng neon nổi bật */
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 25px;
  margin-top: 40px;
`;

const IconWrapper = styled.span`
  font-size: 3rem;
`;
const StartText = styled.span`
  font-size: 2.5rem;
  margin-left: 10px;
  // color: #555;
  font-family: "Comic Sans MS", cursive, sans-serif;
  font-weight: 400;
`;

const EndGamePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  console.log("Current Path:", location.pathname);
  // Lấy userId từ Redux
  const user = useSelector((state) => state.user?.user);
  const userId = user?._id;
  const { activityId, topicId } = useParams();
  // Lấy dữ liệu game từ Redux
  const { game } = useSelector((state) => state.game);
  const activity = useSelector((state) => state.activity?.activity);
  // Kiểm tra nếu đang ở /end-game thì lấy game, ngược lại lấy activity
  const data = location.pathname === "/end-game" ? game : activity;
  // Tính phần trăm đúng
  console.log(activity);
  const isReview = location.pathname.includes("/end-review");
  const isTest = location.pathname.includes("/end-test");
  const totalQuestions = data?.correct + data?.incorrect || 0;
  const correctPercentage =
    totalQuestions > 0 ? (data?.correct / totalQuestions) * 100 : 0;

  // const gameData = {
  //   userId,
  //   correct: game.correct,
  //   incorrect: game.incorrect,
  //   score: game.score,
  //   rank: game.rank,
  // };
  // console.log(game);
  const handleReview = () => {
    dispatch(setReviewIsTrue());
    setTimeout(() => {
      if (isReview) {
        navigate(`/review/${topicId}/${activityId}`);
      } else {
        navigate(`/test/${activityId}`);
      }
    }, 2000);
  };

  return (
    <EndGameContainer>
      <Title>
        🎉{" "}
        {location.pathname.includes("end-review")
          ? "Kết Thúc Ôn Tập"
          : location.pathname.includes("end-test")
          ? "Kết Thúc Bài Kiểm Tra"
          : "Kết Thúc Trò Chơi"}{" "}
        🎉
      </Title>
      <StatsContainer>
        <StatItem>
          <IconWrapper>
            <CheckCircleOutlined
              style={{ color: "#4caf50", fontSize: "3rem" }}
            />
          </IconWrapper>
          <StartText>
            <strong>Câu đúng:</strong> {data.correct}
          </StartText>
        </StatItem>
        <StatItem>
          <IconWrapper>
            <CloseCircleOutlined
              style={{ color: "#f44336", fontSize: "3rem" }}
            />
          </IconWrapper>
          <StartText>
            <strong>Câu sai:</strong> {data.incorrect}
          </StartText>
        </StatItem>
        <StatItem>
          <StartText>
            <strong>Điểm Số:</strong> {data.score}
          </StartText>
        </StatItem>
        <StatItem>
          <StartText>
            <strong>Phần Trăm Đúng:</strong> {correctPercentage.toFixed(2)}%
          </StartText>
        </StatItem>
        <PercentageBar>
          <PercentageFill style={{ width: `${correctPercentage}%` }} />
        </PercentageBar>
      </StatsContainer>

      {/* Hiển thị hạng nếu có userId */}
      {userId && (
        <RankContainer>
          <Trophy />
          <RankText>{data.scoreTotal}</RankText>
          <RankText>Hạng Của Bạn: {data.rank}</RankText>
        </RankContainer>
      )}

      <ButtonContainer>
        {isReview || isTest ? (
          <Button onClick={handleReview}>
            <EyeOutlined /> Xem Lại
          </Button>
        ) : (
          <Button onClick={() => navigate("/game")}>
            <RedoOutlined /> Chơi Lại
          </Button>
        )}
        {user && (
          <Button onClick={() => navigate("/ranking")}>
            <FaTrophy size={20} /> Xếp Hạng
          </Button>
        )}

        <Button onClick={() => navigate("/")}>
          <HomeOutlined /> Về Nhà
        </Button>
      </ButtonContainer>
    </EndGameContainer>
  );
};

export default EndGamePage;
