import React from "react";
import styled from "styled-components";

const Footer = () => {
  return (
    <FooterContainer>
      <p>&copy; 2025 EduKids. Học vui, học sáng tạo.</p>
    </FooterContainer>
  );
};

// Styled Components
const FooterContainer = styled.footer`
  background-color: #ffb3b3; /* Nền hài hòa với header */
  color: #333; /* Màu chữ tối, dễ đọc */
  padding: 20px;
  text-align: center;
  font-size: 14px;
  opacity: 0.9;
  // position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #f8d7da;
  padding: 10px 0;
  @media (max-width: 768px) {
    padding: 15px;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 12px;
  }
`;

export default Footer;
