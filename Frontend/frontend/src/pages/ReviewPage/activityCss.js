import styled from "styled-components";
import { Card, Typography } from "antd";

const { Text } = Typography;

export const getLevelText = (level) => {
  // console.log(level);
  switch (level) {
    case "easy":
      return "Dễ";
    case "medium":
      return "Trung bình";
    case "hard":
      return "Khó";
    default:
      return "Không xác định";
  }
};

export const LevelBadge = styled.div`
  // position: absolute;
  top: 10px;
  left: 10px;

  color: #000000;
  font-size: 2rem;
  font-weight: bold;
  font-family: "Comic Sans MS", "Chalkboard", sans-serif;
  padding: 4px 10px; /* Giảm padding cho gọn */
  border-radius: 8px;
  // box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  display: inline-block; /* Giữ độ dài vừa phải */
  white-space: nowrap; /* Tránh bị xuống dòng */
  max-width: fit-content;
  justify-content: space-between;
  color: ${(props) =>
    props.level === "Dễ"
      ? "#4CAF50"
      : props.level === "Khó"
      ? "#F44336"
      : "#FFC107"};
`;
export const Question = styled.h3`
  // display: flex;
  font-size: 2.5rem; /* Larger font size for kids */
  font-weight: 600;
  color: #333;
  // color: rgb(255, 111, 0);
  text-align: center;
  margin-bottom: 1.5rem;
  font-family: "Comic Sans MS", "Chalkboard", sans-serif;
`;
// export const Feedback = styled.div`
//   margin-top: 1rem;
//   font-size: 2rem; /* Larger font size for kids */
//   font-weight: 600;
//   text-align: center;
//   font-family: "Comic Sans MS", "Chalkboard", sans-serif;
//   padding: 0.75rem;
//   border-radius: 0.75rem;
//   background: ${(props) => (props.isCorrect ? "#d4edda" : "#f8d7da")};
//   color: ${(props) => (props.isCorrect ? "#155724" : "#721c24")};
//   animation: ${pulse} 1.8s ease-in-out infinite;
// `;
//     ? "#52c41a"
//     : props.level === "Trung bình"
//     ? "#faad14"
//     : "#ff4d4f"};
