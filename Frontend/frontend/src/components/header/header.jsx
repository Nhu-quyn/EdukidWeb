import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Button, message, Typography, Image } from "antd";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../../store/userSlice";
import logoEdukids from "../../assets/logoEdukid.jpg";
import {
  FaHome,
  FaBook,
  FaGamepad,
  FaClipboardCheck,
  FaRedoAlt,
  FaBars,
  FaTimes,
  FaUser,
  FaSignInAlt,
  FaSignOutAlt,
  FaCog,
  FaBell, // Import icon thông báo
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
const { Text } = Typography;
// background: linear-gradient(135deg, #ff69b4, #32cd32, #1e90ff);
const HeaderContainer = styled.header`
  background-color: #ffcccc;
  padding: 15px 20px;
  display: flex;
  position: fixed; /* Giữ cố định */
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  // font-family: "Luckiest Guy", cursive;
  position: relative;
  border-radius: 15px;
  flex-wrap: wrap;
  transition: all 0.3s ease;
`;

const Username = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-left: auto;
  padding: 0 15px;
`;
const LogoContainer = styled.div`
  position: absolute;
  left: 20px; /* Cố định logo bên trái */
  display: flex;
  align-items: center;
`;
const Logo = styled.img`
  width: 100px;
  max-width: 50%;
  height: auto;
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    transform: rotate(10deg);
  }

  @media (max-width: 1024px) {
    width: 80px;
  }

  @media (max-width: 768px) {
    width: 70px;
  }

  @media (max-width: 480px) {
    width: 60px;
  }
`;

const MenuIcon = styled.div`
  display: none;
  font-size: 30px;
  cursor: pointer;
  color: #333;

  @media (max-width: 1360px) {
    display: block;
    order: 1; /* Đảm bảo icon menu sẽ xuất hiện đầu tiên trên màn hình nhỏ */
  }

  &:hover {
    color: #ff5722;
    transform: rotate(45deg);
  }
`;
const NavContainer = styled.div`
  flex-grow: 1; /* Cho phép menu mở rộng để căn giữa */
  display: flex;
  justify-content: center; /* Căn giữa menu */
`;

const NavList = styled.ul`
  display: flex;
  list-style-type: none;
  margin: 0;
  padding: 0;
  font-size: 18px;
  transition: all 0.3s ease;

  align-items: center; /* Căn chỉnh các phần tử ngang hàng */
  @media (min-width: 1300px) {
  }
  @media (max-width: 1360px) {
    flex-direction: column;
    align-items: flex-start;
    background: #fff;
    position: absolute;
    top: 80px;
    right: 10px;
    width: 30%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    z-index: 10;
    padding: 10px 15px;
    opacity: ${(props) => (props.showMenu ? "1" : "0")};
    visibility: ${(props) => (props.showMenu ? "visible" : "hidden")};
    transform: ${(props) =>
      props.showMenu ? "translateY(0)" : "translateY(-10px)"};
    transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease;
  }

  @media (max-width: 480px) {
    justify-content: space-between;
  }
`;

const NavItem = styled.li`
  margin-left: 20px;
  position: relative;
  &:hover {
    background-color: transparent;
    border-radius: 5px;
  }

  @media (max-width: 920px) {
    margin: 10px 0;
    margin-left: 0;
  }
`;

const NavLink = styled.a`
  color: #333;
  font-weight: bold;
  text-decoration: none;
  display: flex;
  font-size: 1.6rem;
  color: rgb(40, 63, 86); /* Xanh đậm sang trọng */
  font-weight: bold;
  text-transform: uppercase; /* Chuyển chữ thành in hoa */
  letter-spacing: 2px; /* Giãn khoảng cách giữa các chữ */
  // font-family: "Fredoka", sans-serif; /* Font chữ vui nhộn */
  font-family: "Comic Sans MS", cursive, sans-serif;
  align-items: center;
  transition: color 0.3s, transform 0.3s;
  padding: 10px 20px; /* Thêm padding trái phải để dễ bấm hơn */
  background-color: transparent;
  border-radius: 5px;
  margin: 5px 10px; /* Tạo khoảng cách hai bên */

  &:hover {
    color: #fff;
    background-color: #ff7043; /* Cam tươi nổi bật */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Bóng đổ nhẹ */
    transform: scale(1.05); /* Phóng to nhẹ khi hover */
  }
  @media (max-width: 1300px) {
    font-size: 18px;
    padding: 10px 15px; /* Giảm padding để tiết kiệm không gian */
    margin: 5px 5px;
    text-transform: capitalize;
    font-family: Arial, sans-serif;
  }
  @media (max-width: 920px) {
    font-size: 18px;
    padding: 10px 15px; /* Giảm padding để tiết kiệm không gian */
    margin: 5px 5px;
    text-transform: capitalize;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 8px 12px;
    margin: 5px 0; /* Loại bỏ khoảng cách trái phải để căn giữa */
    text-transform: capitalize;
    // font-family: Arial, sans-serif; /* Chỉ đổi font khi màn hình nhỏ */
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 8px 10px;
    text-align: center;
    width: 100%; /* Đảm bảo link chiếm toàn bộ chiều rộng */
    text-transform: capitalize;
  }
`;

const DropdownMenu = styled.div`
  display: ${(props) => (props.showMenu ? "block" : "none")};
  position: absolute;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  z-index: 10;
  padding: 10px;
  border-radius: 8px;
  top: 35px;
  right: 0;
  max-width: 300px;
  width: 100%;
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: ${(props) => (props.showMenu ? "1" : "0")};
  transform: ${(props) =>
    props.showMenu ? "translateY(0)" : "translateY(-10px)"};
  box-sizing: border-box;
`;

const DropdownItem = styled.a`
  color: #333;
  font-size: 16px;
  text-decoration: none;
  display: flex;
  align-items: center;
  padding: 8px 10px;
  transition: background-color 0.3s, color 0.3s;
  border-radius: 5px;

  &:hover {
    background-color: #ff5722;
    color: #fff;
  }
`;

const NavTitle = styled(Text)`
  font-size: 2rem;
  color: #ff1919;
`;
const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn || false);
  const username = useSelector((state) => state.user.username);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdownMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const toggleDropdownMenu = () => {
    setShowDropdownMenu(!showDropdownMenu);
  };

  const handleLogout = () => {
    // setIsLoggedIn(false);
    dispatch(clearUser());
    navigate("/");
    setShowMenu(false);
  };

  return (
    <HeaderContainer>
      {/* < LogoContainer> */}
      <Logo src={logoEdukids} alt="EduKids" />
      {/* </> */}
      <MenuIcon onClick={toggleMenu}>
        {showMenu ? <FaTimes /> : <FaBars />}
      </MenuIcon>
      <NavContainer>
        <NavList showMenu={showMenu}>
          <NavItem>
            <NavLink href="/">
              {" "}
              <FaHome style={{ marginRight: "10px" }} />
              Trang chủ
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/vocabulary">
              <FaBook style={{ marginRight: "10px" }} />
              Từ vựng
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/game">
              <FaGamepad style={{ marginRight: "10px" }} />
              Trò chơi
            </NavLink>
          </NavItem>
          {isLoggedIn && (
            <>
              <NavItem>
                <NavLink href="/test">
                  <FaClipboardCheck style={{ marginRight: "10px" }} />
                  Kiểm tra
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/review">
                  <FaRedoAlt style={{ marginRight: "10px" }} />
                  Ôn tập
                </NavLink>
              </NavItem>
            </>
          )}
          {!isLoggedIn ? (
            <NavItem>
              <NavLink href="/login">
                <FaUser style={{ marginRight: "10px" }} />
                Đăng nhập/Đăng ký
              </NavLink>
            </NavItem>
          ) : (
            <NavItem href={dropdownRef}>
              <NavLink onClick={toggleDropdownMenu}>
                <FaUser style={{ marginRight: "10px" }} />
                Tài khoản
              </NavLink>
              <DropdownMenu showMenu={showDropdownMenu}>
                {/* {!isLoggedIn ? ( */}
                {/* <DropdownItem href="/login">
                <FaSignInAlt style={{ marginRight: "8px" }} />
                Đăng nhập
              </DropdownItem> */}

                <>
                  <DropdownItem onClick={handleLogout}>
                    <FaSignOutAlt style={{ marginRight: "8px" }} />
                    Đăng xuất
                  </DropdownItem>
                  <DropdownItem href="/profile">
                    <FaCog style={{ marginRight: "8px" }} />
                    Cập nhật tài khoản
                  </DropdownItem>
                </>
              </DropdownMenu>
            </NavItem>
          )}
        </NavList>
      </NavContainer>
      {/* {isLoggedIn && <Username>{username}</Username>} */}
    </HeaderContainer>
  );
};

export default Header;
