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
            <List.Item style={{ display: "flex", justifyContent: "center" }}>
              <StyledCard
                onClick={() => handleQuiz(exercise.id)}
                style={{ width: "250px" }}
              >
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
                {exercise.percentComplete !== undefined && (
                  <Progress percent={exercise.percentComplete} size="small" />
                )}
              </StyledCard>
            </List.Item>
          )}
          style={{ maxWidth: "800px", margin: "0 auto" }} // Giới hạn chiều rộng
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
  align-items: center;
  padding: 20px;
`;

const MainContent = styled.main`
  padding: 50px;
  background: rgba(255, 255, 255, 0.95);
  max-width: 1100px;
  width: 90%;
  margin: 50px auto;
  border-radius: 20px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  @media (max-width: 768px) {
    padding: 40px 20px;
    width: 95%;
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #ff4081;
  font-size: 3rem;
  font-family: "Comic Sans MS", cursive, sans-serif;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);

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
  padding: 12px 22px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s;

  &:hover {
    background: #e91e63;
    transform: scale(1.1);
  }

  @media (max-width: 480px) {
    font-size: 16px;
    padding: 10px 18px;
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const StyledCard = styled(Card)`
  width: 280px; /* Cố định chiều ngang */
  height: 220px; /* Cố định chiều cao */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Tránh nội dung dồn về một chỗ */
  align-items: center;
  text-align: center;
  padding: 20px;
  border-radius: 15px;
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    width: 250px;
    height: 200px; /* Điều chỉnh nhỏ hơn trên màn hình nhỏ */
  }

  @media (max-width: 480px) {
    width: 220px;
    height: 180px;
  }
`;

const ExerciseTitle = styled.h3`
  margin-bottom: 10px;
  font-size: 1.8rem;
  color: #fff;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: #fff;
  margin-bottom: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;
