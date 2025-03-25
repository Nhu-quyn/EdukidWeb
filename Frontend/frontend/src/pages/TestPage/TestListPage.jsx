import React, { useState, useEffect } from "react"; // Sửa lỗi useFfect
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
  background-size: cover;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;

  display: flex;
  justify-content: center;
  align-items: center;

  padding-top: 200px; /* Điều chỉnh khoảng cách từ trên xuống */
`;

const MainContainer = styled.div`
  min-width: 700px;
  width: 45%; /* Đảm bảo không chiếm toàn bộ màn hình trên thiết bị nhỏ */
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center; /* Căn giữa theo chiều dọc */
  align-items: center; /* Căn giữa theo chiều ngang */
  // background: #fffbec;
  background-color: #f6f9fc;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  font-family: "Comic Sans MS", cursive, sans-serif;
  transition: all 0.3s ease-in-out;
  /* Responsive */
  @media (max-width: 968px) {
    max-width: 700px;
    // max-width: 400px;
    // max-width: 0%; /* Giảm kích thước khi màn hình nhỏ hơn */
    padding: 15px;
  }
  /* Responsive */
  @media (max-width: 768px) {
    max-width: 500px;
    // max-width: 0%; /* Giảm kích thước khi màn hình nhỏ hơn */
    padding: 15px;
  }

  @media (max-width: 480px) {
    max-width: 400px;
    // max-width: 95%;
    padding: 10px;
    border-radius: 5px; /* Bo góc nhỏ hơn trên màn hình nhỏ */
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

const Title = styled.h2`
  font-size: 3rem;
  font-weight: bold;
  color: #ff6600;
  margin-bottom: 10px;
`;
const Time = styled.p`
  font-size: 1.8rem;
`;
const Level = styled.p`
  font-size: 1.8rem;
`;

const Description = styled.p`
  font-size: 16px;
  color: #555;
  margin-bottom: 15px;
  line-height: 1.6;
`;

const Button = styled.button`
  margin: 10px;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  background-color: ${(props) => (props.primary ? "#66bb6a" : "#6c757d")};
  color: white;
  transition: background 0.3s;
  &:hover {
    background-color: ${(props) => (props.primary ? "#2e7d32" : "#5a6268")};
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const TestListPage = () => {
  const navigate = useNavigate();
  const [testActivities, setTestActivities] = useState([]);
  const dispatch = useDispatch();
  // const testActivities = [
  //   {
  //     id: 1,
  //     activityName: "Bài kiểm tra từ vựng 1",
  //     activityDescription:
  //       "Trong bài kiểm tra này, bé sẽ được ôn tập các từ vựng cơ bản về màu sắc, con vật và đồ vật quen thuộc trong cuộc sống hàng ngày.",
  //     testTime: 15,
  //     activityLevel: "Dễ",
  //   },
  //   {
  //     id: 2,
  //     activityName: "Bài kiểm tra từ vựng 2",
  //     activityDescription:
  //       "Bài kiểm tra này tập trung vào các từ vựng về nghề nghiệp, phương tiện giao thông và các hoạt động hàng ngày.",
  //     testTime: 20,
  //     activityLevel: "Trung bình",
  //   },
  // ];
  // useEffect được đặt ở cuối sau khi giao diện đã được khai báo
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ActivityService.getActivityByTest();
        if (response.status !== "OK") {
          console.lò("Đã có lỗi khi lấy danh sách");
        }
        setTestActivities(response.data);
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

  return (
    <Container>
      <Header />
      <Wrapper>
        <MainContainer>
          <Title>{activityName}</Title>
          <Description>{activityDescription}</Description>
          <Time>
            <strong>Thời gian:</strong> {testTime} phút
          </Time>
          <Level>
            <strong>Mức độ:</strong> {activityLevel}
          </Level>
          <Button primary onClick={handleStart}>
            Bắt đầu
          </Button>
          <div>
            <Button onClick={handlePrev} disabled={currentIndex === 0}>
              {"<<"}
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentIndex === testActivities.length - 1}
            >
              {">>"}
            </Button>
          </div>
        </MainContainer>
      </Wrapper>
      <Footer />
    </Container>
  );
};

export default TestListPage;
