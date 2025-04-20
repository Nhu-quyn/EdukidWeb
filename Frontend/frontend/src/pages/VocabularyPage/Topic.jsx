import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Tooltip } from "antd";
import Header from "../../components/header/header";
import styled from "styled-components";
import ImageBackground from "../../assets/backgroundgame2.jpg";
import ImageBackgroundPhone from "../../assets/dt.jpg";
import Footer from "../../components/footer/footer";
// import { topicData } from "./data";
import * as TopicService from "../../services/TopicService";

const TopicTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  font-family: "Comic Sans MS", cursive, sans-serif;
  // color: #ff6b6b;
  color: #ff4081;
  margin-top: 8px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const TopicCard = styled(Card)`
  border-radius: 25px;
  background: #ffffff;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 12px;
  height: 250px; /* Đảm bảo kích thước đồng đều */
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
  }
  @media (max-width: 1300px) {
    height: 200px; /* Giảm kích thước trên màn hình nhỏ */
  }
  @media (max-width: 768px) {
    height: 180px; /* Giảm kích thước trên màn hình nhỏ */
    padding: 0px;
  }

  @media (max-width: 768px) {
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 150px; /* Đặt chiều cao cố định */
  object-fit: cover;
  transition: transform 0.3s ease;
  border-radius: 10px;
  &:hover {
    transform: scale(1.05);
  }
  @media (max-width: 1300px) {
    height: 100px; /* Giảm kích thước trên màn hình nhỏ */
    width: 180px;
    padding: 0px;
  }

  @media (max-width: 920px) {
    height: 90px; /* Giảm kích thước trên màn hình nhỏ */
    width: 150px;
    padding: 0px;
  }

  @media (max-width: 768px) {
    height: 80px; /* Giảm kích thước trên màn hình nhỏ */
    width: 140px;
    padding: 0px;
  }
`;

const VocabularyList = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await TopicService.getAllTopic();
        setTopics(response.data); // Giả sử API trả về `data` chứa danh sách chủ đề
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);
  const handleTopicClick = (topicId) => {
    navigate(`/topic/${topicId}`);
  };

  return (
    <>
      <Container>
        <Header title="Vocabulary List" />
        <MainContent>
          <Row gutter={[24, 24]} justify="center" style={{ marginTop: "20px" }}>
            {topics.map((topic) => (
              <Col key={topic._id} xs={12} sm={12} md={8} lg={6}>
                <TopicCard
                  hoverable
                  onClick={() => handleTopicClick(topic._id)}
                >
                  <Tooltip
                    title={topic.topicDescription || "Không có mô tả"}
                    placement="top"
                    mouseEnterDelay={0.2}
                  >
                    <CardImage alt={topic.topicName} src={topic.topicImage} />
                    <CardContent>
                      <TopicTitle>{topic.topicName}</TopicTitle>
                    </CardContent>
                  </Tooltip>
                </TopicCard>
              </Col>
            ))}
          </Row>
        </MainContent>
      </Container>
      <Footer />
    </>
  );
};

export default VocabularyList;

const Container = styled.div`
  background-image: url(${ImageBackground});
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  @media (max-width: 1300px) {
    padding: 25px 10px;
  }
  @media (max-width: 920px) {
    padding: 25px 10px;
  }
  @media (max-width: 767px) {
    background-image: url(${ImageBackgroundPhone});

    background-size: contain;
  }
  @media (max-width: 480px) {
    padding: 25px 10px;
  }
`;

const MainContent = styled.main`
  padding: 30px 40px;
  text-align: center;
  background-color: rgba(241, 241, 241, 0.9);
  max-width: 1200px;
  margin: auto;
  // flex: 1;
  border-radius: 12px;
  @media (max-width: 1300px) {
    padding: 25px 10px;
  }
  @media (max-width: 920px) {
    background-color: transparent;
  }
  @media (max-width: 768px) {
  }
  @media (max-width: 480px) {
    padding: 25px 10px;
  }
`;

const CardContent = styled.div`
  text-align: center;
  padding: 0px;
  flex-grow: 1; /* Giúp căn giữa nội dung trong card */
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
