import React, { useState, useEffect } from "react";

import * as ActivityService from "../../services/ActivityService";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import backgroundImage from "../../assets/backgroundgame2.jpg";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import { useDispatch, useSelector } from "react-redux";
import {
  addAnswerWithLogin,
  resetActivity,
  setRank,
} from "../../store/activitySlice";

const Container = styled.div`
  background: url(${backgroundImage}) no-repeat center center;
  background-attachment: fixed;
  min-height: 100vh;
  // padding: 20px;
  display: flex;
  flex-direction: column;
  background-size: cover;
  backdrop-filter: brightness(1.1) contrast(1.2);
`;
// const Container = styled.div`
//   background-image: url(${ImageBackground});
//   background-size: cover;
//   background-position: center center;
//   background-repeat: no-repeat;
//   background-attachment: fixed;
//   min-height: 100vh;
//   display: flex;
//   flex-direction: column;
//   @media (max-width: 1300px) {
//     padding: 25px 10px;
//   }
//   @media (max-width: 920px) {
//     padding: 25px 10px;
//   }
//   @media (max-width: 767px) {
//     background-image: url(${ImageBackgroundPhone});

//     background-size: contain;
//   }
//   @media (max-width: 480px) {
//     padding: 25px 10px;
//   }
// `;

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

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex: 1; /* Lấp đầy không gian còn lại, giúp Footer luôn ở cuối */
  align-items: center;
  padding-top: 100px;
  width: 100%;
`;

const MainContainer = styled.div`
  width: 50%;
  max-width: 700px;
  min-width: 320px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f9f7fe;
  border-radius: 15px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  font-family: "Comic Sans MS", cursive, sans-serif;
  transition: all 0.3s ease-in-out;
  border: 3px solid #ffcc00;

  @media (max-width: 768px) {
    width: 80%;
    padding: 15px;
  }
  @media (max-width: 480px) {
    width: 95%;
    padding: 10px;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  color: #ff4500;
  margin-bottom: 10px;
  text-align: center;
`;

const Description = styled.p`
  font-size: 18px;
  color: #444;
  margin-bottom: 15px;
  line-height: 1.6;
  text-align: center;
`;

const InfoText = styled.p`
  font-size: 1.6rem;
  color: #333;
  margin-bottom: 10px;
  font-weight: bold;
`;

const Button = styled.button`
  margin: 10px;
  padding: 12px 25px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  background-color: ${(props) => (props.primary ? "#ff9900" : "#6c757d")};
  color: white;
  transition: transform 0.2s ease-in-out;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.1);
    background-color: ${(props) => (props.primary ? "#e68a00" : "#5a6268")};
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const NavButtons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const TestListPage = () => {
  const navigate = useNavigate();
  const [testActivities, setTestActivities] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);
  const userId = user?._id;
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(userId);
        const response = await ActivityService.testByUser(userId);
        if (response.status !== "OK") {
          console.error("Đã có lỗi khi lấy danh sách");
        }
        // console.log(response.data);
        setTestActivities(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  if (testActivities.length === 0) {
    return (
      <Wrapper>
        <MainContainer>
          <p>Hiện tại không có bài kiểm tra nào</p>
          <Button onClick={() => navigate("/")}>Quay về</Button>
        </MainContainer>
      </Wrapper>
    );
  }

  const handleNext = () => {
    if (currentIndex < testActivities.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleStart = () => {
    dispatch(resetActivity());
    navigate(`/test/${testActivities[currentIndex]._id}`);
  };

  const { activityName, activityDescription, testTime, activityLevel } =
    testActivities[currentIndex];
  const getLevelLabel = (level) => {
    switch (level) {
      case "easy":
        return "Dễ";
      case "normal":
      case "medium":
        return "Trung bình";
      case "hard":
        return "Khó";
      default:
        return "Không rõ";
    }
  };

  return (
    <Container>
      <Header />
      <Wrapper>
        <MainContainer>
          <Title>{activityName}</Title>
          <Description>{activityDescription}</Description>
          <InfoText>
            <strong>⏳ Thời gian:</strong> {testTime} phút
          </InfoText>
          <InfoText>
            <strong>⭐ Mức độ:</strong>
            {getLevelLabel(activityLevel)}
          </InfoText>
          <Button primary onClick={handleStart}>
            Bắt đầu
          </Button>
          <NavButtons>
            <Button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              style={{ color: "#ff9900" }}
            >
              {"<<"}
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentIndex === testActivities.length - 1}
              style={{ color: "#ff9900" }}
            >
              {">>"}
            </Button>
          </NavButtons>
        </MainContainer>
      </Wrapper>
      <Footer />
    </Container>
  );
};

export default TestListPage;
