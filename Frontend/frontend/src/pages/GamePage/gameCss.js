import styled from "styled-components";
import { Card, Typography } from "antd";

const { Text } = Typography;
// Styled Components
export const StyledCard = styled(Card)`
  text-align: center;
  // justify-content: center;
  // align-items: center;
  font-family: "Comic Sans MS", cursive, sans-serif;
  border-radius: 20px;
  background-color: #f6f9fc;
  padding: 40px;
  max-width: 1200px;
  margin: auto;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

export const QuestionWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #ff8c00;
  color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  text-align: center;
  position: relative;
`;

export const QuestionText = styled(Text)`
  font-size: 4rem;
  padding-right: 30px; /* Đảm bảo có khoảng cách cho biểu tượng âm thanh */
  color: #fff;
  font-weight: bold;
  font-family: "Comic Sans MS", cursive, sans-serif;
`;
export const IconWrapper = styled.div`
  display: flex;

  cursor: pointer;
  background-color: #ff8c00;
  padding: 10px;
  border-radius: 50%;
  color: white;
  font-size: 24px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ffa726;
  }
`;
