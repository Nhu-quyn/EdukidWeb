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

const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
};

const VocabularyTopic = () => {
  const { topicId } = useParams();
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState(null);
  const [words, setWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);

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
      <Footer />

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
  width: 90%;
  max-width: 1200px;
  margin: auto;
  flex: 1;
`;

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

const WordGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  justify-content: center;
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
