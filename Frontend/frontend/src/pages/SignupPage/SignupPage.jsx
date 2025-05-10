import React from "react";
import { Button, Form, Input, Typography, Select, message } from "antd";
import {
  GoogleOutlined,
  LockOutlined,
  UserOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import logoEdukids from "../../assets/logoEdukid.jpg";
import ImageBackground from "../../assets/backgroundgame2.jpg";
import * as UserService from "../../services/UserService";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
// import { signInWithGoogle } from "../../services/UserService";
const { Title } = Typography;
const { Option } = Select;

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

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 40px 20px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const RegisterCard = styled.div`
  width: 100%;
  max-width: 480px; /* Chiều rộng form đăng ký lớn hơn */
  padding: 24px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid #ff99cc;
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
    color: #ff3366;
  }

  svg {
    margin-right: 8px;
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

const LoginLink = styled(Link)`
  color: #ff6699;
  text-decoration: underline;
  display: inline-block;
  margin-top: 16px;
  font-size: 14px;
`;

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleRegister = async (values) => {
    console.log("Register with:", values);
    try {
      const response = await UserService.registerUser(values);
      console.log(response);
      if (response?.status === "OK") {
        // localStorage.setItem("token", response.token);

        //Chua xu ly token
        message.success("Đăng ký thành công!"); // Hiển thị thông báo thành công
        // console.log(response.data);
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      // console.error("Đăng nhập thất bại:", error);
      message.error("Đăng ký thất bại, vui lòng thử lại!"); // Hiển thị lỗi
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await UserService.signInWithGoogle();
      // console.log("Đăng nhập thành công:", response);

      if (response?.status === "OK") {
        // localStorage.setItem("token", response.token);

        //Chua xu ly token
        message.success("Đăng ký bằng google thành công!"); // Hiển thị thông báo thành công
        dispatch(setUser(response.data));
        // console.log(response.data);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      // console.error("Đăng nhập thất bại:", error);
      message.error("Đăng ký thất bại, vui lòng thử lại!"); // Hiển thị lỗi
    }
  };

  // Tạo danh sách option cho ngày
  const dayOptions = [];
  for (let i = 1; i <= 31; i++) {
    dayOptions.push(
      <Option key={i} value={i}>
        {i}
      </Option>
    );
  }

  // Tạo danh sách option cho tháng
  const monthOptions = [];
  for (let i = 1; i <= 12; i++) {
    monthOptions.push(
      <Option key={i} value={i}>
        {i}
      </Option>
    );
  }

  // Tạo danh sách option cho năm (ví dụ từ năm hiện tại về 1900)
  const yearOptions = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= 1900; i--) {
    yearOptions.push(
      <Option key={i} value={i}>
        {i}
      </Option>
    );
  }

  return (
    <Container>
      <RegisterContainer>
        <RegisterCard>
          <BackIcon to="/">
            <ArrowLeftOutlined />
            Trở về
          </BackIcon>

          <Logo src={logoEdukids} alt="Logo" />

          <TitleStyled>ĐĂNG KÝ</TitleStyled>

          <Form layout="vertical" onFinish={handleRegister}>
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
              name="email"
              label="Email"
              rules={[{ required: true, message: "Vui lòng nhập email!" }]}
            >
              <Input
                type="email"
                prefix={<UserOutlined style={{ color: "#ff6699" }} />}
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                {
                  min: 8,
                  message: "Mật khẩu phải có ít nhất 8 ký tự!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#ff6699" }} />}
                placeholder="Mật khẩu"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                {
                  min: 8,
                  message: "Mật khẩu phải có ít nhất 8 ký tự!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mật khẩu không khớp!"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#ff6699" }} />}
                placeholder="Xác nhận mật khẩu"
              />
            </Form.Item>

            {/* Chọn ngày, tháng, năm sinh */}
            {/* <Form.Item label="Ngày sinh" style={{ marginBottom: 0 }}>
              <Form.Item
                name="birthDay"
                // rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
                style={{
                  display: "inline-block",
                  width: "32%",
                  marginRight: "2%",
                }}
              >
                <Select placeholder="Ngày">{dayOptions}</Select>
              </Form.Item>
              <Form.Item
                name="birthMonth"
                // rules={[{ required: true, message: "Vui lòng chọn tháng" }]}
                style={{
                  display: "inline-block",
                  width: "32%",
                  marginRight: "2%",
                }}
              >
                <Select placeholder="Tháng">{monthOptions}</Select>
              </Form.Item>
              <Form.Item
                name="birthYear"
                // rules={[{ required: true, message: "Vui lòng chọn năm" }]}
                style={{ display: "inline-block", width: "32%" }}
              >
                <Select placeholder="Năm">{yearOptions}</Select>
              </Form.Item>
            </Form.Item> */}

            <Form.Item>
              <PrimaryButton type="primary" htmlType="submit" block>
                Đăng ký
              </PrimaryButton>
            </Form.Item>
          </Form>

          <Divider>Hoặc</Divider>

          <GoogleButton
            icon={<GoogleOutlined />}
            block
            onClick={() => handleGoogleLogin()}
          >
            Đăng ký bằng Google
          </GoogleButton>

          <LoginLink to="/login">Đã có tài khoản? Đăng nhập ngay!</LoginLink>
        </RegisterCard>
      </RegisterContainer>
    </Container>
  );
};

export default RegisterPage;
