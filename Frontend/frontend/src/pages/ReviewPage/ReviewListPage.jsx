import React, { useState, useEffect } from "react";
import { List, Card, Tag, Button, Tooltip, Progress, message } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { ArrowLeftOutlined } from "@ant-design/icons";
import styled from "styled-components";
import ImageBackground from "../../assets/backgroundgame2.jpg";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import { useDispatch, useSelector } from "react-redux";
import {
  addAnswerWithLogin,
  resetActivity,
  setRank,
} from "../../store/activitySlice";
import { useParams } from "react-router-dom";
import * as ActivityService from "../../services/ActivityService";
// import

const difficultyColors = {
  easy: "green",
  normal: "orange",
  hard: "red",
};
const levelMapping = {
  easy: "Dễ",
  normal: "Trung bình",
  hard: "Khó",
};

const ReviewList = () => {
  const navigate = useNavigate();
  const { topicId } = useParams();
  const [exercises, setExercises] = useState([]);
  const user = useSelector((state) => state.user?.user);
  const userId = user?._id;
  const dispatch = useDispatch();
  const fetchActivities = async () => {
    try {
      const response = await ActivityService.filterActivityReviewByTopic(
        topicId,
        userId
      );
      if (response.status === "OK") {
        setExercises(response.data);
      } else {
        message.error("Đã có lỗi khi lấy danh bài tập");
      }

      console.log(response.data);
    } catch (e) {
      message.error(e);
    }
  };
  useEffect(() => {
    fetchActivities();
  }, []);

  const handleQuiz = (id) => {
    navigate(`/review/${topicId}/${id}`);
    dispatch(resetActivity());
  };

  return (
    <Container>
      <Header />
      <MainContent>
        {/* <BackButton onClick={() => navigate("/review")}>
          <ArrowLeftOutlined />
          <span>Trở về</span>
        </BackButton> */}
        <Title>Danh sách bài tập ôn tập - Chủ đề: Color</Title>
        <List
          grid={{
            gutter: 24,
            xs: 1,
            sm: 2,
            lg: 3,
          }}
          dataSource={exercises}
          renderItem={(exercise) => (
            <List.Item>
              <StyledCard onClick={() => handleQuiz(exercise._id)}>
                <ExerciseTitle>{exercise.activityName}</ExerciseTitle>
                <Tooltip title={exercise.activityDescription}>
                  <Description>
                    {exercise.activityDescription
                      ? exercise.activityDescription.length > 30
                        ? `${exercise.activityDescription.substring(0, 30)}...`
                        : exercise.activityDescription
                      : "Không có mô tả"}
                  </Description>
                </Tooltip>
                <Tag color={difficultyColors[exercise.activityLevel]}>
                  {levelMapping[exercise.activityLevel] ||
                    exercise.activityLevel}
                </Tag>

                {/* Hiển thị phần trăm hoàn thành nếu có */}
                {exercise.percentComplete !== undefined && (
                  <Progress
                    percent={parseFloat(exercise.percentComplete.toFixed(2))}
                    size="small"
                  />
                )}
                {exercise.lastUpdate !== null && (
                  <LastUpdateText>
                    Ngày cập nhật:{" "}
                    {dayjs(exercise.lastUpdate).format("DD/MM/YYYY")}
                  </LastUpdateText>
                )}
              </StyledCard>
            </List.Item>
          )}
        />
      </MainContent>
      <Footer />
    </Container>
  );
};

export default ReviewList;
// =========== Styled Components ===========

const Container = styled.div`
  background: url(${ImageBackground}) no-repeat center center;
  background-size: cover;

  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  padding: 60px 50px;
  background-color: rgba(255, 255, 255, 0.9);
  max-width: 1200px;
  width: 90%;
  margin: 50px auto;
  flex: 1;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 768px) {
    padding: 40px 20px;
    width: 95%;
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #ff4081;
  font-size: 3rem;
  font-family: "Comic Sans MS", cursive, sans-serif;
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const BackButton = styled(Button)`
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  background: #ff4081;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.3s, transform 0.2s;

  &:hover {
    background: #e91e63;
    transform: scale(1.05);
  }
`;

const StyledCard = styled(Card)`
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;
  font-size: 1.2rem;
  font-weight: bold;
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  }
`;

const ExerciseTitle = styled.h3`
  margin-bottom: 10px;
  font-family: "Comic Sans MS", cursive, sans-serif;

  font-size: 1.8rem;
  color: #333;
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;
const LastUpdateText = styled.p`
  font-size: 12px;
  color: #888;
  position: absolute;
  bottom: 8px;
  right: 12px;
`;
