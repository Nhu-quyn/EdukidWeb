import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, Button, Image, Modal } from "antd";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import styled from "styled-components";
import ImageBackground from "../../assets/backgroundgame2.jpg";
import * as VocabularyService from "../../services/VocabularyService";

const getYoutubeVideoId = (url) => {
  const match = url.match(
    /(?:youtu\.be\/|v=|\/v\/|vi\/|\/embed\/|\/watch\?v=)([^#&?]*).*/
  );
  return match && match[1].length === 11 ? match[1] : null;
};

const VocabularyTopic = () => {
  const { topicId } = useParams();
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState(null);
  const [words, setWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const speak = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    window.speechSynthesis.speak(utterance);
  };
  useEffect(() => {
    const fetchVocabularies = async () => {
      try {
        const response = await VocabularyService.getVocabularyTopic(topicId);
        if (response) {
          setTopic(response.topic);
          setWords(response.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVocabularies();
  }, [topicId]);

  if (loading) {
    return <Typography.Title level={4}>Đang tải dữ liệu...</Typography.Title>;
  }

  if (!topic) {
    return <Typography.Title level={4}>Chủ đề không tồn tại!</Typography.Title>;
  }

  return (
    <Container>
      <Header />
      <MainContent>
        <TopicTitle>
          <Typography.Title
            level={2}
            style={{ textAlign: "center", color: "#ff4081" }}
          >
            {topic.topicName}
          </Typography.Title>
          <TopicSubtitle>({topic.topicVietnamese})</TopicSubtitle>
        </TopicTitle>

        <VideoContainer>
          <StyledIframe
            src={`https://www.youtube.com/embed/${getYoutubeVideoId(
              topic.topicVideo
            )}`}
            title={topic.topicName}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </VideoContainer>

        <WordGrid>
          {words.map((item, index) => (
            <WordCard key={index} onClick={() => setSelectedWord(item)}>
              <ImageWord
                src={item.vocabularyImage}
                alt={item.vocabulary}
                preview={false}
              />
              <SoundText>
                <Typography.Text strong>{item.vocabulary}</Typography.Text>
              </SoundText>
            </WordCard>
          ))}
        </WordGrid>
      </MainContent>

      {/* Modal hiển thị chi tiết từ vựng */}
      <Modal
        open={!!selectedWord}
        onCancel={() => setSelectedWord(null)}
        footer={null}
        centered
      >
        {selectedWord && (
          <div style={{ textAlign: "center" }}>
            <Typography.Title level={3}>
              {selectedWord.vocabulary}
            </Typography.Title>
            <Typography.Text italic>{selectedWord.ipa}</Typography.Text>
            <div>{selectedWord.meaning}</div>
            <div>
              <strong>Từ loại:</strong> {selectedWord.partOfSpeech}
            </div>
            <Button
              type="primary"
              onClick={() => speak(selectedWord.vocabulary)}
              style={{ marginTop: "10px" }}
            >
              Phát âm 🔊
            </Button>
          </div>
        )}
      </Modal>
      <Footer />
    </Container>
  );
};

export default VocabularyTopic;

// Styled Components
const Container = styled.div`
  background-image: url(${ImageBackground});
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  padding: 20px;
  // position: relative; // <== THÊM DÒNG NÀY
  width: 90%;
  max-width: 1200px;
  margin: auto;
  flex: 1;
`;
// const Container = styled.div`
//   background: url(${ImageBackground}) no-repeat center center;
//   background-attachment: fixed;

//   min-height: 100vh;
//   // padding: 20px;
//   display: flex;
//   flex-direction: column;
//   background-size: cover;
//   backdrop-filter: brightness(1.1) contrast(1.2);
// `;

// const MainContent = styled.main`
//   padding: 60px 40px;
//   position: relative; // <== THÊM DÒNG NÀY
//   text-align: center;
//   background-color: rgba(255, 255, 255, 0.85);
//   // background: #fffbec;
//   max-width: 1300px;
//   margin: auto;
//   border-radius: 12px;
//   box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
//   @media (max-width: 768px) {
//     padding: 40px 20px; /* Điều chỉnh padding cho màn hình nhỏ */
//   }
// `;
const VideoContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const StyledIframe = styled.iframe`
  width: 100%;
  max-width: 600px;
  height: 300px;
  border: none;
  border-radius: 12px;
`;

// const WordGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
//   gap: 12px;
//   justify-content: center;
// `;
const WordGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5 cột cho màn hình lớn */
  gap: 12px;
  justify-content: center;

  /* Điều chỉnh cho màn hình nhỏ */
  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr); /* 3 cột cho màn hình trung bình */
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr); /* 2 cột cho màn hình nhỏ */
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr; /* 1 cột cho màn hình rất nhỏ */
  }
`;

const WordCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  border-radius: 8px;
  background: rgb(235, 226, 226);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  min-width: 140px;
  max-width: 180px;
  margin: 10px;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    background: #f9f9f9;
  }
`;

const ImageWord = styled(Image)`
  border-radius: 8px;
  max-width: 100px;
  height: auto;
`;

const SoundText = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TopicSubtitle = styled.p`
  font-size: 14px;
  font-style: italic;
  color: #888;
  margin-top: 4px;
`;

const TopicTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;
