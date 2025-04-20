import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaCrown, FaHome, FaGamepad } from "react-icons/fa";
import styled from "styled-components";
// import {
//   FaGamepad,
//   FaBookOpen,
//   FaUsers,
//   FaBullhorn,
//   FaChalkboardTeacher,
//   FaPlayCircle,
//   FaMedal, // cho win
// } from "react-icons/fa";
import { message } from "antd";
import ImageBackground from "../../assets/backgroundgame2.jpg";
import * as UserService from "../../services/UserService";
// const players = [
//   {
//     rank: 1,
//     name: "Người chơi A",
//     points: 600,
//     avatar: "https://i.pravatar.cc/150?img=1",
//     category: "Trò chơi",
//   },
//   {
//     rank: 2,
//     name: "Người chơi B",
//     points: 500,
//     avatar: "https://i.pravatar.cc/150?img=2",
//     category: "Ôn tập",
//   },
//   {
//     rank: 3,
//     name: "Người chơi C",
//     points: 450,
//     avatar: "https://i.pravatar.cc/150?img=3",
//     category: "Kiểm tra",
//   },
//   {
//     rank: 4,
//     name: "Người chơi D",
//     points: 400,
//     avatar: "https://i.pravatar.cc/150?img=4",
//     category: "Trò chơi",
//   },
//   {
//     rank: 5,
//     name: "Người chơi E",
//     points: 350,
//     avatar: "https://i.pravatar.cc/150?img=5",
//     category: "Ôn tập",
//   },
// ];
const default_image =
  "https://toigingiuvedep.vn/wp-content/uploads/2021/06/hinh-anh-hoat-hinh-de-thuong-1.jpg";
const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=0"; // Ảnh mặc định
const RankingPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.user);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [gameData, setGameData] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [testData, setTestData] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  useEffect(() => {
    const fetchLeaderBoard = async () => {
      try {
        const response = await UserService.getAllLeaderBoard();
        console.log("API Response:", response);

        if (response.status === "OK" && Array.isArray(response.data.data)) {
          const leaderBoardData = response.data.data;

          const processData = (categoryName) => {
            return leaderBoardData
              .filter((item) => item?.categoryId?.categoryName === categoryName)
              .map((item) => ({
                userId: item?.userId?._id,
                rank: item.rank, // Dùng rank từ API
                username: item?.userId?.username || "Người chơi ẩn danh",
                avatar: item?.userId?.avatar || default_image,
                score: item?.score || 0,
              }))
              .sort((a, b) => b.score - a.score); // Sắp xếp theo điểm
          };

          setGameData(processData("game"));
          setTotalData(processData("total"));
          setReviewData(processData("review"));
          setTestData(processData("test"));
        } else {
          console.error(
            "Dữ liệu không phải là mảng hoặc response sai cấu trúc",
            response
          );
        }
      } catch (e) {
        message.error(e.message);
      }
    };

    fetchLeaderBoard();
  }, []);
  const myRank = filteredPlayers.find((player) => player.userId === user?._id);
  const otherPlayers = filteredPlayers.filter(
    (player) => player.userId !== user?._id
  );

  useEffect(() => {
    switch (selectedCategory) {
      case "game":
        setFilteredPlayers(gameData);
        break;
      case "review":
        setFilteredPlayers(reviewData);
        break;
      case "test":
        setFilteredPlayers(testData);
        break;
      default:
        setFilteredPlayers(totalData);
    }
  }, [selectedCategory, gameData, totalData, reviewData, testData]);
  return (
    <Container>
      <Title>🏆 Bảng Xếp Hạng 🏆</Title>
      <NavBar>
        <NavButton onClick={() => navigate("/")}>
          {" "}
          <FaHome /> Về Nhà{" "}
        </NavButton>
        <NavButton onClick={() => navigate("/game")}>
          {" "}
          <FaGamepad /> Vào Game{" "}
        </NavButton>
        <Dropdown onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="total">Tất cả</option>
          <option value="game">Trò chơi</option>
          <option value="review">Ôn tập</option>
          <option value="test">Kiểm tra</option>
        </Dropdown>
      </NavBar>
      {/* <Dropdown onChange={(e) => setSelectedCategory(e.target.value)}> */}

      <TriangleContainer>
        {/* {filteredPlayers.map((player) => (
          <RankingCard key={player.rank} rank={player.rank}>
            <Avatar src={player.avatar} alt={player.username} />
            <PlayerInfo>
              <Rank>{player.rank}</Rank>
              <PlayerName>{player.username}</PlayerName>
              <Points>⭐ {player.score} điểm</Points>
            </PlayerInfo>
            {player.rank === 1 && <CrownIcon />}
          </RankingCard>
        ))} */}
        {myRank && (
          <RankingCard rank={myRank.rank} isMe>
            {myRank.rank === 1 && <Rank>{myRank.rank}</Rank>}
            <Avatar src={myRank.avatar} alt={myRank.username} />
            <PlayerInfo>
              {myRank.rank !== 1 && <Rank>{myRank.rank}</Rank>}
              <PlayerName>{myRank.username} (Bạn)</PlayerName>
              <Points>⭐ {myRank.score} điểm</Points>
            </PlayerInfo>
            {myRank.rank === 1 && <CrownIcon />}
          </RankingCard>
        )}

        {otherPlayers.map((player) => (
          <RankingCard key={player.rank} rank={player.rank}>
            <Rank>{player.rank}</Rank>
            <Avatar src={player.avatar} alt={player.username} />
            <PlayerInfo>
              <PlayerName>{player.username}</PlayerName>
              <Points>⭐ {player.score} điểm</Points>
            </PlayerInfo>
            {player.rank === 1 && <CrownIcon />}
          </RankingCard>
        ))}
      </TriangleContainer>
    </Container>
  );
};

export default RankingPage;
const RankingCard = styled.div`
  display: flex;
  align-items: center;
  background: ${(props) =>
    props.isMe
      ? "#ffeaa7" // màu nổi bật
      : props.rank === 1
      ? "gold"
      : props.rank === 2
      ? "silver"
      : props.rank === 3
      ? "#cd7f32"
      : "white"};
  padding: 15px;
  border-radius: 20px;
  width: ${(props) => 800 - props.rank * 20}px;
  transition: 0.3s;
  box-shadow: ${(props) =>
    props.isMe ? "0 5px 15px rgba(0, 0, 0, 0.3)" : "none"};
  transform: ${(props) => (props.isMe ? "translateY(-7px)" : "none")};

  &:hover {
    transform: translateY(-7px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

const Container = styled.div`
  text-align: center;
  font-family: "Arial", sans-serif;
  padding: 20px;
  background: url(${ImageBackground}) no-repeat center center;
  min-height: 100vh;
  background-size: cover;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: bold;
  color: #ff4081;
  font-family: "Comic Sans MS", cursive, sans-serif;
`;

const NavBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const NavButton = styled.button`
  background: #8e44ad;
  color: white;
  border: 3px solid white;
  padding: 15px 35px;
  cursor: pointer;
  border-radius: 25px;
  font-family: "Comic Sans MS", cursive, sans-serif;
  font-size: 1.8rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
  &:hover {
    background: #a569bd;
    color: #ffeb3b;
    transform: scale(1.05);
  }
`;

const Dropdown = styled.select`
  font-family: "Comic Sans MS", cursive, sans-serif;
  font-size: 1.8rem;
  padding: 10px;
  border-radius: 10px;
  margin-top: 10px;
  margin-bottom: 20px;
  border: 2px solid #8e44ad;
`;

const TriangleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

// const RankingCard = styled.div`
//   display: flex;
//   align-items: center;
//   background: ${(props) =>
//     props.rank === 1
//       ? "gold"
//       : props.rank === 2
//       ? "silver"
//       : props.rank === 3
//       ? "#cd7f32"
//       : "white"};
//   padding: 15px;
//   border-radius: 20px;
//   width: ${(props) => 800 - props.rank * 20}px;
//   transition: 0.3s;
//   &:hover {
//     transform: translateY(-7px);
//   }
// `;

const Rank = styled.div`
  font-size: 3rem;
  font-weight: bold;
  width: 50px;
  text-align: center;
`;

const Avatar = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-right: 20px;
`;

const PlayerInfo = styled.div`
  flex-grow: 1;
  text-align: left;
`;

const PlayerName = styled.h2`
  font-size: 1.4rem;
  margin: 0;
  color: #333;
`;

const Points = styled.p`
  font-size: 1.1rem;
  margin: 0;
  color: #777;
`;

const CrownIcon = styled(FaCrown)`
  font-size: 2.5rem;
  color: #ffd700;
  margin-left: 10px;
`;
