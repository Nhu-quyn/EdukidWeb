import React from "react";
import { Link } from "react-router-dom";
import {
  FaGamepad,
  FaBookOpen,
  FaUsers,
  FaBullhorn,
  FaChalkboardTeacher,
  FaPlayCircle,
} from "react-icons/fa";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import styled from "styled-components";
import ImageBackground from "../../assets/backgroundgame2.jpg";
import WelcomeImage from "../../assets/welcome.jpg";

const HomePage = () => {
  return (
    <Container>
      <Header />
      <MainContent>
        <WelcomeSection>
          <WelcomeImageStyled
            src={WelcomeImage}
            alt="Chào mừng đến với EduKids!"
          />
          <Title>🎉 Chào mừng đến với EduKids!</Title>
          <Description>
            Học vui, học sáng tạo – Khám phá tiếng Anh qua trò chơi & bài học
            thú vị!
          </Description>
        </WelcomeSection>

        {/* Giới thiệu về EduKids */}
        <IntroSection>
          <IntroTitle>🌈 Tại sao chọn EduKids?</IntroTitle>
          <IntroText>
            EduKids mang đến phương pháp học tiếng Anh sáng tạo, kết hợp giữa
            học lý thuyết và thực hành qua các trò chơi sinh động, giúp trẻ em
            học một cách tự nhiên và vui vẻ.
          </IntroText>
        </IntroSection>

        {/* Sứ mệnh của website */}
        <MissionSection>
          <MissionTitle>
            <StyledBullhornIcon /> Sứ mệnh của EduKids
          </MissionTitle>
          <MissionText>
            Mang đến trải nghiệm học tập thú vị, giúp trẻ em tiếp cận tiếng Anh
            một cách tự nhiên và hiệu quả thông qua trò chơi và bài học tương
            tác.
          </MissionText>
        </MissionSection>

        {/* Tính năng nổi bật */}
        <MissionSection>
          <SectionTitle>🌟 Những tính năng nổi bật</SectionTitle>
          <FeatureSection>
            <FeatureCard href="/vocabulary">
              <FaBookOpen size={50} color="#ff4081" />
              <FeatureTitle>📖 Học từ vựng siêu vui</FeatureTitle>
              <FeatureText>
                Học từ mới với hình ảnh, âm thanh sinh động.
              </FeatureText>
            </FeatureCard>
            <FeatureCard href="/game">
              <FaGamepad size={50} color="#ffca28" />
              <FeatureTitle>🎮 Chơi game – Học tiếng Anh</FeatureTitle>
              <FeatureText>
                Rèn luyện kỹ năng qua những trò chơi hấp dẫn.
              </FeatureText>
            </FeatureCard>
          </FeatureSection>
        </MissionSection>
        {/* Lượt đăng ký*/}
        <DownloadSection>
          <DownloadTitle>
            <FaUsersIcon />
            Đã có hơn 1290+ người dùng đăng ký
          </DownloadTitle>
          <RegisterLink>
            Đăng ký tại <StyledLink to="/register">đây</StyledLink> để nhận thêm
            nhiều trải nghiệm thú vị!
          </RegisterLink>
        </DownloadSection>
      </MainContent>
      <Footer />
    </Container>
  );
};

// Styled Components
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

const MainContent = styled.main`
  padding: 60px 40px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.85);
  // background: #fffbec;
  max-width: 1300px;
  margin: auto;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) {
    padding: 40px 20px; /* Điều chỉnh padding cho màn hình nhỏ */
  }
`;

const WelcomeSection = styled.div`
  margin-bottom: 30px;
`;

const WelcomeImageStyled = styled.img`
  width: 100%;
  border-radius: 12px;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 34px;
  color: #ff4081;
  font-weight: bold;
  margin-bottom: 15px;
  @media (max-width: 768px) {
    font-size: 28px; /* Điều chỉnh font-size cho màn hình nhỏ */
  }
`;

const Description = styled.p`
  font-size: 18px;
  color: #444;
  @media (max-width: 768px) {
    font-size: 16px; /* Điều chỉnh font-size cho màn hình nhỏ */
  }
`;

const IntroSection = styled.div`
  margin-top: 30px;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 12px;
`;

const IntroTitle = styled.h2`
  font-size: 28px;
  color: #ff4081;
  margin-bottom: 10px;
  @media (max-width: 768px) {
    font-size: 24px; /* Điều chỉnh font-size cho màn hình nhỏ */
  }
`;

const IntroText = styled.p`
  font-size: 18px;
  color: #444;
  @media (max-width: 768px) {
    font-size: 16px; /* Điều chỉnh font-size cho màn hình nhỏ */
  }
`;

const SectionTitle = styled.h3`
  font-size: 28px;
  color: #ff4081;
  margin-bottom: 20px;
  font-weight: bold;
  text-align: center;
  @media (max-width: 768px) {
    font-size: 24px; /* Điều chỉnh font-size cho màn hình nhỏ */
  }
`;

const FeatureSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  padding-bottom: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
  }
`;

const FeatureCard = styled.a`
  width: 280px;
  background: white;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  text-decoration: none;
  color: #333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s, background 0.3s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
    background: #f8f8f8;
  }

  @media (max-width: 768px) {
    width: 70%;
    margin: 10px 0;
  }
`;

const FeatureTitle = styled.h3`
  margin-top: 15px;
  font-size: 22px;
  color: #ff4081;
  font-weight: bold;
  @media (max-width: 768px) {
    font-size: 20px; /* Điều chỉnh font-size cho màn hình nhỏ */
  }
`;

const FeatureText = styled.p`
  font-size: 16px;
  color: #555;
  line-height: 1.5;
  @media (max-width: 768px) {
    font-size: 14px; /* Điều chỉnh font-size cho màn hình nhỏ */
  }
`;

const MissionSection = styled.div`
  margin-top: 40px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
`;

const MissionTitle = styled.h2`
  font-size: 26px;
  color: #ff4081;
  margin-bottom: 10px;
  @media (max-width: 768px) {
    font-size: 24px; /* Điều chỉnh font-size cho màn hình nhỏ */
  }
`;

const MissionText = styled.p`
  font-size: 18px;
  color: #444;
  @media (max-width: 768px) {
    font-size: 16px; /* Điều chỉnh font-size cho màn hình nhỏ */
  }
`;

const DownloadSection = styled.div`
  margin-top: 30px;
`;

const DownloadTitle = styled.h2`
  font-size: 26px;
  color: #ffca28;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  @media (max-width: 888px) {
    font-size: 16px; /* Điều chỉnh font-size cho màn hình nhỏ */
  }
`;

const RegisterLink = styled.p`
  font-size: 16px;
  color: #444;
  margin-top: 10px;

  a {
    color: #007bff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 768px) {
    font-size: 14px; /* Điều chỉnh font-size cho màn hình nhỏ */
  }
`;

const StyledLink = styled(Link)`
  color: #ff4081;
  font-weight: bold;
  text-decoration: none;
  transition: color 0.3s ease, transform 0.2s;

  &:hover {
    color: #e91e63;
    text-decoration: underline;
    transform: scale(1.05);
  }
`;

const StyledBullhornIcon = styled(FaBullhorn)`
  font-size: 30px;
  color: #ff4081;
`;
const FaUsersIcon = styled(FaUsers)`
  size: 40px;
  color: #ff4081;
  @media (max-width: 768px) {
    size: 30px;
  }
`;

export default HomePage;
