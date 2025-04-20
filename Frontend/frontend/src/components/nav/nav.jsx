import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppstoreOutlined,
  BookOutlined,
  FileTextOutlined,
  FormOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { clearUser } from "../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Button, Menu, Layout } from "antd";
import styled from "styled-components";
import logo from "../../assets/logoEdukid.jpg"; // Thay đường dẫn logo phù hợp

const { Sider } = Layout;

const SidebarContainer = styled(Sider)`
  height: 100vh;
  background: #f6f7fb;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 2px solid #ddd;
  align-items: center;
  padding-top: 20px;
`;

// const Logo = styled.img`
//   width: ${({ collapsed }) => (collapsed ? "50px" : "120px")};
//   height: ${({ collapsed }) => (collapsed ? "50px" : "120px")};
//   transition: all 0.3s;
//   margin: 0 auto 20px;
//   display: block;
//   border-radius: 50%;
//   object-fit: cover;
// `;
const Logo = styled.img`
  width: ${(props) => (props.collapsed ? "40px" : "120px")};
  height: ${(props) => (props.collapsed ? "40px" : "120px")};
  transition: all 0.3s;
  margin: 0 auto 20px;
  display: block;
  border-radius: 50%;
  object-fit: cover;
`;

const ToggleButton = styled(Button)`
  margin: 20px auto;
  display: block;
  width: 90%;
  background-color: rgb(120, 175, 226);
  border: none;
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  padding: 10px 0;
  &:hover {
    background-color: #40a9ff;
  }
`;

const StyledMenu = styled(Menu)`
  flex: 1;
  background: #f6f7fb;
  border-right: none;
  .ant-menu-item {
    color: #333 !important;
    font-weight: 500;
    font-size: 16px;
    padding: 12px 24px;
    &:hover {
      background: #e6f7ff !important;
      color: #1890ff !important;
    }
  }
  .logout-item {
    background: #f0f0f0 !important;
    color: #333 !important;
    font-weight: bold;
    font-size: 16px;
    &:hover {
      background: #d9d9d9 !important;
    }
  }
`;

const items = [
  {
    key: "vocabulary-management",
    icon: <BookOutlined />,
    label: "Quản lý từ vựng",
  },
  {
    key: "topics-management",
    icon: <AppstoreOutlined />,
    label: "Quản lý chủ đề",
  },
  {
    key: "review-and-test-management",
    icon: <FileTextOutlined />,
    label: "Quản lý hoạt động",
  },
  // {
  //   key: "tests-management",
  //   icon: <FormOutlined />,
  //   label: "Quản lý bài kiểm tra",
  // },
  {
    key: "questions-management",
    icon: <QuestionCircleOutlined />,
    label: "Quản lý câu hỏi",
  },
  {
    key: "logout",
    icon: <LogoutOutlined />,
    label: "Đăng xuất",
    className: "logout-item",
  },
];

const NavComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => setCollapsed(!collapsed);
  const handleMenuClick = (e) => {
    if (e.key === "logout") {
      console.log("Đăng xuất...");
      dispatch(clearUser());
    } else {
      navigate(`/admin/${e.key}`);
    }
  };

  return (
    <SidebarContainer collapsed={collapsed} width={280}>
      <Logo src={logo} alt="Logo" collapsed={collapsed} />
      <StyledMenu
        theme="light"
        mode="inline"
        defaultSelectedKeys={["vocabulary-management"]}
        items={items}
        inlineCollapsed={collapsed}
        onClick={handleMenuClick}
        // collapsed={collapsed}
        // width={280}
      />
      <ToggleButton onClick={toggleCollapsed}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </ToggleButton>
    </SidebarContainer>
  );
};

export default NavComponent;
