import React from "react";
import { Button, Form, Input, Typography } from "antd";
import {
  GoogleOutlined,
  LockOutlined,
  UserOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import styled from "styled-components";
import logoEdukids from "../../assets/logoEdukid.jpg";
import ImageBackground from "../../assets/backgroundgame2.jpg";

const { Title } = Typography;
const Container = styled.div`
  background: url(${ImageBackground}) no-repeat center center;
  background-attachment: fixed;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-size: cover;
  backdrop-filter: brightness(1.1) contrast(1.2);

  @media (max-width: 768px) {
    background: none;
  }
`;
const LoginWrapper = styled.div`
  display: flex;
  align-items: stretch; /* Đảm bảo các phần tử con có cùng chiều cao */
  justify-content: center;
  width: 80%;
  max-width: 1000px;
  position: relative;
  border-radius: 16px;
  overflow: hidden;

  @media (max-width: 992px) {
    flex-direction: column;
    width: 100%;
  }
`;

const BannerContainer = styled.div`
  flex: 1;
  display: flex;
  min-width: 540px;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
  background: linear-gradient(135deg, #ff6699, #ff99cc);
  // padding: 40px;
  position: relative;
  // border-radius: 16px 0 0 16px;
  min-height: 100%; /* Đảm bảo chiều cao bằng login */

  @media (max-width: 992px) {
    border-radius: 16px 16px 0 0;
    padding: 30px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const LoginContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 2;
  background: white;
  // border-radius: 0 16px 16px 0;

  @media (max-width: 768px) {
    background: none;
    border: none;
    padding: 20px;
  }
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 360px;
  padding: 24px;
  background-color: white;
  // border-radius: 16px;
  // box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  // border: 2px solid #ff99cc;
  text-align: center;
  position: relative;

  @media (max-width: 768px) {
    border: none;
    box-shadow: none;
    padding: 20px;
  }
`;

const Logo = styled.img`
  width: 80px;
  max-width: 50%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
`;

const BackIcon = styled(Link)`
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #ff6699;
  text-decoration: none;

  &:hover {
    color: #ff3366; /* Màu khi hover */
  }

  svg {
    margin-right: 8px; /* Khoảng cách giữa icon và chữ */
  }
`;

const TitleStyled = styled.h3`
  color: #ff6699;
  margin-bottom: 24px;
  font-size: 24px;
`;

const StyledButton = styled(Button)`
  height: 40px;
  font-size: 16px;
  width: 100%;
`;

const PrimaryButton = styled(StyledButton)`
  background-color: #ff6699;
  border-color: #ff6699;
`;

const GoogleButton = styled(StyledButton)`
  background-color: #ffcccc;
  border-color: #ff99cc;
  margin-bottom: 8px;
`;

const Divider = styled.div`
  margin: 16px 0;
  color: #888;
  font-size: 14px;
`;

const RegisterLink = styled(Link)`
  color: #ff6699;
  text-decoration: underline;
  display: inline-block;
  margin-top: 16px;
  font-size: 14px;
`;

const LoginPage = () => {
  const handleLogin = (values) => {
    console.log("Login with:", values);
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <Container>
      <LoginWrapper>
        <BannerContainer>
          <p>Chào mừng bạn đến với EduKids! 🌟</p>
        </BannerContainer>
        <LoginContainer>
          <LoginCard>
            <BackIcon to="/">
              <ArrowLeftOutlined />
              Trở về
            </BackIcon>

            <Logo src={logoEdukids} alt="Logo" />

            <TitleStyled>ĐĂNG NHẬP</TitleStyled>

            <Form layout="vertical" onFinish={handleLogin}>
              <Form.Item
                name="username"
                label="Tên đăng nhập"
                rules={[
                  { required: true, message: "Vui lòng nhập tên đăng nhập!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: "#ff6699" }} />}
                  placeholder="Tên đăng nhập"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: "#ff6699" }} />}
                  placeholder="Mật khẩu"
                />
              </Form.Item>

              <Form.Item>
                <PrimaryButton type="primary" htmlType="submit" block>
                  Đăng nhập
                </PrimaryButton>
              </Form.Item>

              {/* <Form.Item>
              <Link
                to="/forgot-password"
                style={{
                  fontSize: "14px",
                  color: "#ff6699",
                  textAlign: "right",
                }}
              >
                Quên mật khẩu?
              </Link>
            </Form.Item> */}
            </Form>

            <Divider>Hoặc</Divider>

            <GoogleButton
              icon={<GoogleOutlined />}
              block
              onClick={() => handleSocialLogin("Google")}
            >
              Đăng nhập bằng Google
            </GoogleButton>

            <RegisterLink to="/register">
              Chưa có tài khoản? Đăng ký ngay!
            </RegisterLink>
          </LoginCard>
        </LoginContainer>
      </LoginWrapper>
    </Container>
  );
};

export default LoginPage;
