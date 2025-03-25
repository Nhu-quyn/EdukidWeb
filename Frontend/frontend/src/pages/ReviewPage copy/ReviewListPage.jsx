import React, { useState, useEffect } from "react";
import { List, Card, Tag, Button, Tooltip, Progress } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import styled from "styled-components";
import ImageBackground from "../../assets/backgroundgame2.jpg";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";

const difficultyColors = {
  easy: "green",
  medium: "orange",
  hard: "red",
};
const levelMapping = {
  easy: "Dễ",
  medium: "Trung bình",
  hard: "Khó",
};

const ReviewList = ({ topicId }) => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = [
        {
          id: 1,
          activityName: "Learn Colors",
          activityDescription: "Practice identifying and naming colors.",
          activityLevel: "easy",
          percentComplete: 75, // 75% hoàn thành
        },
        {
          id: 2,
          activityName: "Color Matching",
          activityDescription: "Match colors with their corresponding names.",
          activityLevel: "medium",
        },
        {
          id: 3,
          activityName: "Advanced Color Mixing",
          activityDescription: "Combine primary colors to create new colors.",
          activityLevel: "hard",
          percentComplete: 50, // 50% hoàn thành
        },
      ];

      setExercises(data);
    };

    fetchData();
  }, []);

  const handleQuiz = (id) => {
    navigate(`/review/1/${id}`);
  };

  return (
    <Container>
      <Header />
      <MainContent>
        <BackButton onClick={() => navigate("/review")}>
          <ArrowLeftOutlined />
          <span>Trở về</span>
        </BackButton>
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
              <StyledCard onClick={() => handleQuiz(exercise.id)}>
                <ExerciseTitle>{exercise.activityName}</ExerciseTitle>
                <Tooltip title={exercise.activityDescription}>
                  <Description>
                    {exercise.activityDescription.length > 30
                      ? `${exercise.activityDescription.substring(0, 30)}...`
                      : exercise.activityDescription}
                  </Description>
                </Tooltip>
                <Tag color={difficultyColors[exercise.activityLevel]}>
                  {levelMapping[exercise.activityLevel] ||
                    exercise.activityLevel}
                </Tag>

                {/* Hiển thị phần trăm hoàn thành nếu có */}
                {exercise.percentComplete !== undefined && (
                  <Progress percent={exercise.percentComplete} size="small" />
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
  font-size: 1.6rem;
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
