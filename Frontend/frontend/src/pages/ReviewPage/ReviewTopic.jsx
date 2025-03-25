import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Card, Row, Col, Tooltip } from "antd";
import { useDispatch } from "react-redux";
import { resetGame } from "../../store/gameSlice";
import Header from "../../components/header/header";
import styled from "styled-components";
import ImageBackground from "../../assets/backgroundgame2.jpg";
import ImageBackgroundPhone from "../../assets/dt.jpg";
import Footer from "../../components/footer/footer";
// import { topicData } from "./data";
import * as TopicService from "../../services/TopicService";
import { Typography } from "antd";

const { Text } = Typography;

const TopicCard = styled(Card)`
  width: 180px;
  height: 180px;
  border-radius: 16px; /* Bo tròn góc thay vì hình tròn */
  background: white;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
  margin: 10px 15px; /* Khoảng cách giữa các card */

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 1200px) {
    width: 160px;
    height: 160px;
  }

  @media (max-width: 988px) {
    width: 140px;
    height: 140px;
  }
`;

const CardImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px; /* Bo tròn nhẹ ảnh bên trong */
  margin-bottom: 10px;
`;
const TopicTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #444;
  transition: color 0.2s ease;

  ${TopicCard}:hover & {
    color: #ff4081;
  }

  @media (max-width: 992px) {
    font-size: 16px;
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Title = styled(Text)`
  color: #ff4081;
  font-size: 3.8rem;
  font-family: "Comic Sans MS", cursive, sans-serif;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 992px) {
    font-size: 3.2rem;
  }

  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
`;

const ListTopic = () => {
  // const { activity } = useParams(); // Lấy giá trị activity từ URL
  const location = useLocation();
  // Xác định activity từ URL
  const dispatch = useDispatch(); // Khởi tạo dispatch
  const activity = location.pathname.startsWith("/game") ? "game" : "review";
  console.log(activity);
  const navigate = useNavigate();
  const [topicData, setTopicData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await TopicService.getAllTopic();
        console.log(response);
        setTopicData(response.data); // Giả sử API trả về `data` chứa danh sách chủ đề
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  // activity = "review";
  // const handleTopicClick = (topicId) => {
  const handleTopicClick = (topicId) => {
    console.log(topicId);
    if (activity === "game") {
      navigate(`/play-game/${topicId}`);
      dispatch(resetGame());
    } else {
      navigate(`/review/${topicId}`);
    }
  };
  // };

  return (
    <Container>
      <Header
        title={
          activity === "game" ? "Chọn Chủ Đề Trò Chơi" : "Chọn Chủ Đề Ôn Tập"
        }
      />
      <MainContent>
        <Title>
          {activity === "game" ? "Chọn chủ đề trò chơi" : "Chọn chủ đề ôn tập"}
        </Title>
        <CardContainer>
          <Row gutter={[32, 32]} justify="center">
            {Object.keys(topicData).map((topicId) => {
              const topic = topicData[topicId];
              return (
                <Col key={topicId} xs={8} sm={8} md={6} lg={4}>
                  <TopicCard onClick={() => handleTopicClick(topic._id)}>
                    <CardImage alt={topic.topicName} src={topic.topicImage} />
                    <TopicTitle>{topic.topicName}</TopicTitle>
                  </TopicCard>
                </Col>
              );
            })}
          </Row>
        </CardContainer>
      </MainContent>
      <Footer />
    </Container>
  );
};

export default ListTopic;
const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 30px; /* Tăng khoảng cách giữa các card */
  padding: 20px;

  @media (max-width: 992px) {
    gap: 25px;
  }

  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const Container = styled.div`
  background: url(${ImageBackground}) no-repeat center center;
  background-attachment: fixed;
  min-height: 100vh;
  // padding: 20px;
  display: flex;
  flex-direction: column;
  background-size: cover;
  backdrop-filter: brightness(1.1) contrast(1.2);
`;

// const MainContent = styled.main`
//   padding: 60px 40px;
//   text-align: center;
//   background-color: rgba(255, 255, 255, 0.85);
//   max-width: 1300px;
//   margin: auto;
//   border-radius: 12px;
//   box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
//   @media (max-width: 768px) {
//     padding: 40px 20px; /* Điều chỉnh padding cho màn hình nhỏ */
//   }
// `;
const MainContent = styled.main`
  padding: 50px 30px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.9);
  max-width: 1200px;
  margin: 30px auto;
  border-radius: 16px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);

  @media (max-width: 768px) {
    padding: 40px 20px;
  }
`;
