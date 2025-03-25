import React, { useState, useEffect } from "react";
import { Layout, Avatar, Button, Input, Upload, message } from "antd";
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
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const fetchUser = async () => {
    try {
      const response = await UserService.getUser(userId); // Giả sử API này trả về dữ liệu user
      if (response.status == "OK") {
        setUser(response.data);
        dispatch(setUser(response.data));
        // console.log(response.data);
        // message.success("Lấy thông tin người dùng thành công");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
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
        setUser((prev) => ({ ...prev, avatar: data.secure_url }));
        dispatch(setUser({ ...user, avatar: data.secure_url }));
        message.success("Cập nhật ảnh đại diện thành công!");
      } else {
        throw new Error("Lỗi khi tải ảnh lên");
      }
    } catch (error) {
      message.error("Không thể tải ảnh lên. Vui lòng thử lại.");
    }
  };

  const handleUpdateUser = async () => {
    try {
      // console.log("data", data);
      const updatedUser = await UserService.updateUser(userId, user); // Gửi API update
      if (updatedUser.status === "OK") {
        message.success("Cập nhật thành công!");
      }
      await fetchUser();
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  return (
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
          <Button
            icon={<HomeOutlined />}
            onClick={() => navigate("/")}
            type="link"
          >
            Trở về Home
          </Button>
          <Button
            icon={<LogoutOutlined />}
            onClick={() => console.log("Đăng xuất")}
            type="primary"
            danger
          >
            Đăng xuất
          </Button>
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
              value={user.username}
              onChange={handleChange}
            />
          ) : (
            <p>{user.username}</p>
          )}

          <Label>Email phụ huynh:</Label>
          {editing ? (
            <Input
              name="parentEmail"
              value={user.parentEmail}
              onChange={handleChange}
            />
          ) : (
            <p>{user.parentEmail}</p>
          )}

          <Label>Ngày sinh:</Label>
          {editing ? (
            <Input
              name="birthdate"
              value={user.birthdate}
              onChange={handleChange}
            />
          ) : (
            <p>{user.birthdate}</p>
          )}

          <Label>Bio:</Label>
          {editing ? (
            <Input name="bio" value={user.bio} onChange={handleChange} />
          ) : (
            <p>{user.bio}</p>
          )}

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

          <Button
            type="dashed"
            style={{ marginTop: 10, marginLeft: 10 }}
            onClick={() => setChangingPassword(!changingPassword)}
          >
            Đổi mật khẩu
          </Button>

          {changingPassword && (
            <div style={{ marginTop: 20 }}>
              <Label>Mật khẩu hiện tại:</Label>
              <Input.Password name="current" onChange={handlePasswordChange} />
              <Label>Mật khẩu mới:</Label>
              <Input.Password name="new" onChange={handlePasswordChange} />
              <Label>Nhập lại mật khẩu:</Label>
              <Input.Password name="confirm" onChange={handlePasswordChange} />
              <Button type="primary" style={{ marginTop: 10 }}>
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
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  gap: 20px;
  width: 90%;
  max-width: 900px;
  background: white;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  padding: 30px;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

// const AvatarWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   position: relative;

//   .avatar {
//     width: 120px;
//     height: 120px;

//     @media (min-width: 768px) {
//       width: 150px;
//       height: 150px;
//     }

//     @media (min-width: 1024px) {
//       width: 180px;
//       height: 180px;
//     }
//   }
// `;
const AvatarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 20px;

  .avatar {
    width: 340px;
    font-size: 120px;
    height: 340px;
    border-radius: 50%;
    object-fit: cover;

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
    background: white;
    border-radius: 50%;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
    padding: 5px;
    cursor: pointer;
  }
`;

const CalendarIcon = styled(CalendarOutlined)`
  font-size: 28px;
  color: #1890ff;
  position: absolute;
  bottom: 15px;
  right: 15px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    color: #ffffff;
    background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
    border-radius: 50%;
    padding: 6px;
    transform: scale(1.1);
    box-shadow: 0px 4px 10px rgba(24, 144, 255, 0.5);
  }
`;

const InfoWrapper = styled.div`
  width: 100%;
`;

const Label = styled.p`
  font-weight: bold;
  margin: 8px 0 4px;
`;

export default ProfilePage;
