// import React, { useState } from "react";
// import styled, { keyframes } from "styled-components";
// import ImageBackgroundGame from "../../assets/backgroundgame2.jpg";
// import { FaHome, FaTrophy, FaList } from "react-icons/fa";

// const colors = [
//   "#FF5733",
//   "#FFC300",
//   "#36D1DC",
//   "#B620E0",
//   "#28B463",
//   "#FF1493",
// ];

// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   height: 100vh;
//   width: 100vw;
//   background-image: url(${ImageBackgroundGame});
//   background-size: cover;
//   background-position: center;
//   text-align: center;
// `;

// // const bounceAnimation = keyframes`
// //   0%, 100% { transform: translateY(0); }
// //   50% { transform: translateY(-8px); }
// // `;

// const Title = styled.div`
//   font-size: 5rem;
//   font-weight: bold;
//   font-family: "Comic Sans MS", cursive;
//   display: flex;
//   gap: 10px;
//   margin-bottom: 30px;
// `;

// const colorAnimation = keyframes`
//   0% { color: #FF5733; transform: scale(1) rotate(0deg); }
//   25% { color: #FFC300; transform: scale(1.1) rotate(3deg); }
//   50% { color: #36D1DC; transform: scale(1) rotate(0deg); }
//   75% { color: #B620E0; transform: scale(1.1) rotate(-3deg); }
//   100% { color: #FF5733; transform: scale(1) rotate(0deg); }
// `;

// const bounceAnimation = keyframes`
//   0%, 100% { transform: translateY(0); }
//   50% { transform: translateY(-8px) scale(1.2); }
// `;

// const waveAnimation = keyframes`
//   0% { transform: translateY(0); opacity: 1; text-shadow: 0 0 5px #ffffff; }
//   25% { transform: translateY(-10px) rotate(5deg); opacity: 0.8; text-shadow: 0 0 15px #ff1493; }
//   50% { transform: translateY(0); opacity: 1; text-shadow: 0 0 10px #ff8800; }
//   75% { transform: translateY(-10px) rotate(-5deg); opacity: 0.9; text-shadow: 0 0 15px #36D1DC; }
//   100% { transform: translateY(0); opacity: 1; text-shadow: 0 0 5px #ffffff; }
// `;

// const Letter = styled.span`
//   display: inline-block;
//   font-size: 5rem;
//   font-weight: bold;
//   font-family: "Comic Sans MS", cursive;
//   color: ${({ color }) => color};
//   animation: ${waveAnimation} 1.5s infinite ease-in-out;
//   animation-delay: ${({ index }) => `${index * 0.12}s`};
// `;

// const ButtonContainer = styled.div`
//   margin-top: 30px;
//   display: flex;
//   justify-content: center;
//   gap: 20px;
// `;

// const StartButton = styled.button`
//   background: linear-gradient(45deg, #ff8800, #ff1a75);
//   color: white;
//   border: none;
//   padding: 20px 50px;
//   font-size: 2rem;
//   border-radius: 30px;
//   font-weight: bold;
//   cursor: pointer;
//   transition: all 0.3s ease-in-out;
//   box-shadow: 0 8px 20px rgba(255, 0, 85, 0.4);
//   text-transform: uppercase;

//   &:hover {
//     transform: scale(1.15);
//     box-shadow: 0 12px 30px rgba(255, 0, 85, 0.6);
//   }

//   &:active {
//     transform: scale(0.95);
//   }
// `;

// const NavButton = styled.button`
//   background: rgba(0, 0, 0, 0.7);
//   color: white;
//   border: 2px solid white;
//   padding: 15px 35px;
//   cursor: pointer;
//   border-radius: 25px;
//   font-size: 1.4rem;
//   font-weight: bold;
//   transition: all 0.3s ease;
//   display: flex;
//   align-items: center;
//   gap: 10px;

//   &:hover {
//     background: rgba(255, 255, 255, 0.2);
//     color: #ff8800;
//     transform: scale(1.1);
//   }

//   &:active {
//     transform: scale(0.95);
//   }
// `;

// const GameStartPage = () => {
//   const [showTopics, setShowTopics] = useState(false);

//   const startGame = () => {
//     window.location.href = "/play-game";
//   };

//   const toggleTopics = () => {
//     setShowTopics(!showTopics);
//   };

//   return (
//     <Container>
//       <Title>
//         {"BẮT ĐẦU CHƠI!".split(" ").map((word, wordIndex) => (
//           <span key={wordIndex}>
//             {word.split(" ").map((letter, index) => (
//               <Letter
//                 key={index}
//                 color={colors[index % colors.length]}
//                 index={index}
//               >
//                 {letter}
//               </Letter>
//             ))}
//           </span>
//         ))}
//       </Title>

//       <ButtonContainer>
//         <StartButton onClick={startGame}>Bắt đầu</StartButton>
//       </ButtonContainer>

//       <ButtonContainer>
//         <NavButton onClick={() => (window.location.href = "/")}>
//           {" "}
//           <FaHome size={20} /> Trang chủ{" "}
//         </NavButton>
//         <NavButton onClick={() => (window.location.href = "/achievements")}>
//           <FaTrophy size={20} /> Thành tích
//         </NavButton>
//         <NavButton onClick={toggleTopics}>
//           {" "}
//           <FaList size={20} /> Chủ đề{" "}
//         </NavButton>
//       </ButtonContainer>
//     </Container>
//   );
// };

// export default GameStartPage;
import React, { useState } from "react";
import { useDispatch } from "react-redux"; // Import useDispatch
import styled, { keyframes } from "styled-components";
import ImageBackgroundGame from "../../assets/backgroundgame2.jpg";
import { FaHome, FaTrophy, FaList } from "react-icons/fa";
import { resetGame } from "../../store/gameSlice";
const colors = [
  "#FF5733",
  "#FFC300",
  "#36D1DC",
  "#B620E0",
  "#28B463",
  "#FF1493",
];

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-image: url(${ImageBackgroundGame});
  background-size: cover;
  background-position: center;
  text-align: center;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
`;

const waveAnimation = keyframes`
  0% { transform: translateY(0); opacity: 1; text-shadow: 0 0 5px #ffffff; }
  25% { transform: translateY(-10px) rotate(5deg); opacity: 0.8; text-shadow: 0 0 15px #ff1493; }
  50% { transform: translateY(0); opacity: 1; text-shadow: 0 0 10px #ff8800; }
  75% { transform: translateY(-10px) rotate(-5deg); opacity: 0.9; text-shadow: 0 0 15px #36D1DC; }
  100% { transform: translateY(0); opacity: 1; text-shadow: 0 0 5px #ffffff; }
`;

const Text = styled.span`
  font-size: 5rem;
  font-weight: bold;
  font-family: "Comic Sans MS", cursive;
  color: ${({ index }) => colors[index % colors.length]};
  animation: ${waveAnimation} 1.5s infinite ease-in-out;
  animation-delay: ${({ index }) => `${index * 0.12}s`};
`;

const ButtonContainer = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const StartButton = styled.button`
  background: linear-gradient(
    135deg,
    #2e7d32,
    /* Xanh lá đậm hơn */ #81c784 /* Xanh mint nhạt hơn */
  );
  color: #fff;
  font-size: 40px;
  font-weight: bold;
  padding: 15px 40px;
  border: 5px solid white; /* Viền trắng */
  font-family: "Comic Sans MS", cursive, sans-serif;
  border-radius: 50px;
  cursor: pointer;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out;
  position: relative;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);

  &:before {
    content: "";
    position: absolute;
    top: -6px;
    left: -6px;
    right: -6px;
    bottom: -6px;
    border-radius: 60px;
    border: 4px solid white;
    opacity: 0.8;
  }

  &:hover {
    transform: scale(1.05);
    background: linear-gradient(
      135deg,
      #1b5e20,
      #66bb6a
    ); /* Đậm hơn khi hover */
  }

  &:active {
    transform: scale(0.95);
  }
`;

const NavButton = styled.button`
  background: #8e44ad; /* Màu tím huyền bí */
  color: white;
  border: 3px solid white;
  padding: 15px 35px;
  cursor: pointer;
  font-family: "Comic Sans MS", cursive, sans-serif;
  border-radius: 25px;
  font-size: 2rem;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background: #a569bd; /* Màu tím sáng hơn khi hover */
    color: #ffeb3b; /* Màu vàng neon nổi bật */
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const GameStartPage = () => {
  // const [showTopics, setShowTopics] = useState(false);
  const dispatch = useDispatch(); // Khởi tạo dispatch
  const startGame = () => {
    dispatch(resetGame());
    window.location.href = "/play-game";
  };

  const toggleTopics = () => {
    // setShowTopics(!showTopics);
    // Gọi resetActivity trước khi bắt đầu
    window.location.href = "/game/list-topic";
  };

  return (
    <Container>
      <TitleContainer>
        {"BẮT ĐẦU CHƠI!".split("").map((letter, index) => (
          <Text key={index} index={index}>
            {letter}
          </Text>
        ))}
      </TitleContainer>

      <ButtonContainer>
        <StartButton onClick={startGame}>Bắt đầu</StartButton>
      </ButtonContainer>

      <ButtonContainer>
        <NavButton onClick={() => (window.location.href = "/")}>
          <FaHome size={20} /> Trang chủ
        </NavButton>
        <NavButton onClick={() => (window.location.href = "/ranking")}>
          <FaTrophy size={20} /> Thành tích
        </NavButton>
        <NavButton onClick={toggleTopics}>
          <FaList size={20} /> Chủ đề
        </NavButton>
      </ButtonContainer>
    </Container>
  );
};

export default GameStartPage;
