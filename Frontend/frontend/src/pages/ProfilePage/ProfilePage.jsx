import React, { useState, useEffect } from "react";
import {
  Layout,
  Avatar,
  Button,
  Input,
  Upload,
  message,
  notification,
} from "antd";
import {
  UploadOutlined,
  CalendarOutlined,
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
import * as UserService from "../../services/UserService";
import backgroundImage from "../../assets/backgroundgame2.jpg";
import styled from "styled-components";

const { Content } = Layout;

const ProfilePage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.user);
  const userId = user._id;
  const dispatch = useDispatch();

  // const [user, setUser] = useState({
  //   avatar: "https://via.placeholder.com/120",
  //   email: "user@example.com",
  //   username: "Nguyen Van A",
  //   parentEmail: "parent@example.com",
  //   birthdate: "09-01-1999",
  //   bio: "Chào mừng bạn đến với hồ sơ của tôi!",
  // });
  const CLOUDINARY_URL =
    "https://api.cloudinary.com/v1_1/drzjvhpwi/image/upload";
  const UPLOAD_PRESET = "Your_cloud_image";
  const DEFAULT_IMAGE = "https://via.placeholder.com/200x150?text=No+Image";

  const [editing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const [changingPassword, setChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  useEffect(() => {
    setEditedUser(user); // Đồng bộ lại khi `user` thay đổi
  }, [user]);
  const openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
      placement: "topRight", // Vị trí hiển thị
    });
  };
  const fetchUser = async () => {
    try {
      const response = await UserService.getUser(userId); // Giả sử API này trả về dữ liệu user
      // console.log(response);
      if (response.status == "OK") {
        setUser(response.data);
        dispatch(setUser(response.data));
        // console.log(response.data);
        // message.success("Lấy thông tin người dùng thành công");
      }
    } catch (error) {
      openNotification("error", "Lỗi!", "Không thể lấy thông tin người dùng!");
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  // Hàm tải ảnh lên Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);
      if (data.secure_url) {
        const updateAvatar = await UserService.updateAvatar(userId, {
          avatar: data.secure_url,
        });
        if (updateAvatar.status === "OK") {
          console.log(updateAvatar.data);
          openNotification(
            "success",
            "Thành công!",
            "Cập nhật ảnh đại diện thành công!"
          );
          await fetchUser();
        }
      } else {
        throw new Error("Lỗi khi tải ảnh lên");
      }
    } catch (error) {
      openNotification("error", "Lỗi!", "Không thể cập nhật ảnh đại diện!");
    }
  };
  const isValidEmail = (email) => {
    const regex =
      /^[^\s@]+@[^\s@]+\.(com|net|org|edu|gov|mil|int|info|biz|vn|co\.uk|io)$/i;
    return regex.test(email);
  };

  const handleUpdateUser = async () => {
    try {
      // console.log(editedUser);
      if (editedUser.parentEmail) {
        if (!isValidEmail(editedUser.parentEmail)) {
          openNotification(
            "error",
            "Lỗi!",
            "Email phụ huynh không hợp lệ. Vui lòng kiểm tra lại!"
          );
          return;
        }
      }

      const updatedUser = await UserService.updateUser(userId, editedUser);
      if (updatedUser.status === "OK") {
        openNotification(
          "success",
          "Thành công!",
          "Cập nhật thông tin thành công!"
        );
        await fetchUser(); // Lấy thông tin mới nhất
        // dispatch(setUser(updatedUser.data)); // Cập nhật lại Redux
        setEditing(false); // Thoát chế độ chỉnh sửa
      }
    } catch (error) {
      openNotification("error", "Lỗi!", "Không thể cập nhật thông tin!");
    }
  };
  const handleUpdatePassword = async () => {
    try {
      if (!passwords.new || passwords.new.length < 8) {
        openNotification(
          "warning",
          "Cảnh báo!",
          "Mật khẩu mới phải có ít nhất 8 ký tự!"
        );
        return;
      }

      if (passwords.new !== passwords.confirm) {
        openNotification(
          "error",
          "Lỗi!",
          "Mật khẩu mới và xác nhận không khớp!"
        );
        return;
      }

      const currentPassword = passwords.current;
      const newPassword = passwords.new;

      const updatePassword = await UserService.updatePassword(
        userId,
        currentPassword,
        newPassword
      );

      if (updatePassword.status === "OK") {
        openNotification(
          "success",
          "Thành công!",
          "Cập nhật mật khẩu thành công!"
        );
        await fetchUser();
      } else {
        message.error(updatePassword.message);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật mật khẩu:", error);
      // message.error();
      openNotification("error", "Lỗi!", "Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  return (
    // <Container></Container>
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ContentWrapper>
        <Header>
          <HomeButton
            icon={<HomeOutlined />}
            onClick={() => navigate("/")}
            type="link"
          >
            {/* Trang chủ */}
          </HomeButton>
          <LogoutButton
            icon={<LogoutOutlined />}
            onClick={() => console.log("Đăng xuất")}
            // type="primary"
            // danger
          >
            Đăng xuất
          </LogoutButton>
        </Header>

        {/* Avatar và icon lịch */}
        <AvatarWrapper>
          <Upload
            showUploadList={false}
            beforeUpload={(file) => {
              uploadImageToCloudinary(file); // Gọi hàm ngay khi chọn file
              return false; // Ngăn không cho Upload tự động gửi request
            }}
          >
            <Avatar
              className="avatar"
              icon={<UserOutlined />}
              src={user.avatar || null}
            />
            <Button
              className="upload-button"
              icon={<UploadOutlined />}
              style={{ marginTop: 10 }}
            />
          </Upload>
        </AvatarWrapper>

        <CalendarIcon onClick={() => navigate("/profile/study-schedule")} />

        {/* Thông tin người dùng */}
        <InfoWrapper>
          <h2>Thông tin người dùng</h2>
          <Label>Email:</Label>
          <Input value={user.email} disabled />

          <Label>Tên người dùng:</Label>
          {editing ? (
            <Input
              name="username"
              value={editedUser.username}
              onChange={handleChange}
            />
          ) : (
            <p>{user.username}</p>
          )}

          <Label>Email phụ huynh:</Label>
          {editing ? (
            <Input
              name="parentEmail"
              value={editedUser.parentEmail}
              onChange={handleChange}
            />
          ) : (
            <p>{user.parentEmail}</p>
          )}

          {/* <Label>Ngày sinh:</Label>
          {editing ? (
            <Input
              name="birthdate"
              value={user.birthdate}
              onChange={handleChange}
            />
          ) : (
            <p>{user.birthdate || "Chưa cập nhật"}</p>
          )} */}
          {/* 
          <Label>Bio:</Label>
          {editing ? (
            <Input name="bio" value={user.bio} onChange={handleChange} />
          ) : (
            <p>{user.bio}</p>
          )} */}

          <Button
            type="primary"
            style={{ marginTop: 10 }}
            onClick={() => {
              if (editing) {
                handleUpdateUser(); // Gọi cập nhật khi bấm "Lưu"
              }
              setEditing(!editing);
            }}
          >
            {editing ? "Lưu" : "Chỉnh sửa"}
          </Button>

          {!user.isOAuth && (
            <Button
              type="dashed"
              style={{ marginTop: 10, marginLeft: 10 }}
              onClick={() => setChangingPassword(!changingPassword)}
            >
              Đổi mật khẩu
            </Button>
          )}

          {!user.isOAuth && changingPassword && (
            <div style={{ marginTop: 20 }}>
              <Label>Mật khẩu hiện tại:</Label>
              <Input.Password name="current" onChange={handlePasswordChange} />
              <Label>Mật khẩu mới:</Label>
              <Input.Password name="new" onChange={handlePasswordChange} />
              <Label>Nhập lại mật khẩu:</Label>
              <Input.Password name="confirm" onChange={handlePasswordChange} />
              <Button
                type="primary"
                style={{ marginTop: 10 }}
                onClick={handleUpdatePassword}
              >
                Cập nhật mật khẩu
              </Button>
            </div>
          )}
        </InfoWrapper>
      </ContentWrapper>
    </Layout>
  );
};

// Styled Components
const Container = styled.div`
  background: url(${backgroundImage}) no-repeat center center;
  background-attachment: fixed;
  min-height: 100vh;
  // padding: 20px;
  display: flex;
  flex-direction: column;
  background-size: cover;
  backdrop-filter: brightness(1.1) contrast(1.2);
`;
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  gap: 20px;
  width: 90%;
  max-width: 900px;
  background: #f9f7fe;
  border-radius: 16px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
  padding: 30px;
  border: 3px solid #ffcc00;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const AvatarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 20px;

  .avatar {
    width: 120px;
    height: 120px;
    font-size: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 6px solid #ff66b2;
    transition: transform 0.3s ease-in-out;

    &:hover {
      transform: scale(1.1);
    }

    @media (min-width: 768px) {
      width: 160px;
      height: 160px;
    }

    @media (min-width: 1024px) {
      width: 180px;
      height: 180px;
    }
  }

  .upload-button {
    position: absolute;
    bottom: 0;
    right: 10px;
    background: #40a9ff; /* Xanh dương nhạt */
    border-radius: 50%;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.3);
    padding: 8px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    color: white;

    &:hover {
      background: #1890ff; /* Xanh dương đậm hơn khi hover */
      transform: scale(1.1);
      box-shadow: 0px 4px 8px rgba(64, 169, 255, 0.5);
    }
  }
`;

const CalendarIcon = styled(CalendarOutlined)`
  font-size: 28px;
  color: #ff66b2;
  position: absolute;
  bottom: 15px;
  right: 15px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    color: #ffffff;
    background: linear-gradient(135deg, #ff66b2 0%, #ffcc00 100%);
    border-radius: 50%;
    padding: 6px;
    transform: scale(1.1);
    box-shadow: 0px 4px 10px rgba(255, 102, 178, 0.5);
  }
`;

const InfoWrapper = styled.div`
  width: 100%;
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  border: 2px dashed #ff66b2;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const Label = styled.p`
  font-weight: bold;
  color: #ff66b2;
  font-size: 16px;
  margin: 8px 0 4px;
`;
// Nút "Trở về Home"
const HomeButton = styled(HomeOutlined)`
  // background: #ffcc00;
  color: #ffcc00;
  font-weight: bold;
  border-radius: 8px;
  padding: 12px 18px;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 40px;

  &:hover {
    // background: #ffcc00;
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 20%;
    font-size: 32px;
    padding: 10px;
  }

  @media (max-width: 480px) {
    font-size: 32px;
    padding: 8px;
  }
`;

// Nút "Đăng xuất"
const LogoutButton = styled(Button)`
  // background: #ff7875;
  color: white;
  color: #ff7875;
  font-weight: bold;
  // border-radius: 8px;
  padding: 12px 18px;
  // transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;

  &:hover {
    // background: #ff4d4f;
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 20%;
    font-size: 12px;
    padding: 10px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 8px;
  }
`;
export default ProfilePage;
