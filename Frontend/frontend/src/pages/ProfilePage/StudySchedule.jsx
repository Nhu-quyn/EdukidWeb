import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  DatePicker,
  TimePicker,
  Button,
  Card,
  List,
  Switch,
  Tag,
  Typography,
  InputNumber,
  Row,
  Col,
  Space,
  message,
} from "antd";

import {
  CalendarOutlined,
  AimOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import * as LearningGoalService from "../../services/LearningGoalService";
import dayjs from "dayjs";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import ImageBackground from "../../assets/backgroundgame2.jpg";
import WelcomeImage from "../../assets/welcome.jpg";
import { ConfigConsumer } from "antd/es/config-provider";

const { Title, Text } = Typography;

// 🎨 Styled Components
const MainContainer = styled.div`
  // width: 90%;
  // max-width: 900px;
  // background: #f9f7fe;
  // border-radius: 16px;
  // box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
  // padding: 30px;
  // border: 3px solid #ffcc00;

  // @media (max-width: 768px) {
  //   padding: 20px;
  // }
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px;
  background: #f9f7fe;
  border-radius: 16px;
  border: 3px solid #ffcc00;
`;
const Container = styled.div`
  background: url(${ImageBackground}) no-repeat center center;
  background-attachment: fixed;
  min-height: 100vh;
  // padding: 20px;
  display: flex;
  flex-direction: column;
  background-size: cover;
  backdrop-filter: brightness(1.1) contrast(1.2);
`;
const HeaderTitle = styled(Title)`
  text-align: center;
  color: #ff5722;
  font-family: "Comic Sans MS", cursive;
`;

const StyledCard = styled(Card)`
  border-radius: 15px;
  background: #fffaf0;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.1);
`;

const ListItem = styled(List.Item)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  background: #fffbf0;
  border-radius: 8px;
  margin: 5px 0;
`;

const StyledButton = styled(Button)`
  background: #ff9800;
  color: white;
  font-weight: bold;
  border-radius: 12px;
  &:hover {
    background: #f57c00;
  }
`;

const StudySchedule = () => {
  const userId = useSelector((state) => state.user.user?._id);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [isDailyRepeat, setIsDailyRepeat] = useState(false);
  const [targetWords, setTargetWords] = useState(0);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await LearningGoalService.getAllLearningGoal(userId);
      const formattedSchedules = response.data.map((item) => ({
        ...item,
        startDate: dayjs(item.startDate).format("YYYY-MM-DD"),
      }));
      setSchedules(formattedSchedules);
    } catch (error) {
      message.error("Lỗi khi lấy lịch trình!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);
  const handleEdit = (item) => {
    setDate(dayjs(item.startDate));
    setTime(item.targetTimes ? dayjs(item.targetTimes, "HH:mm") : null);
    setIsDailyRepeat(item.repeat);
    setTargetWords(item.targetWords);
    setEditing(item);
  };
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const res = await LearningGoalService.deleteLearningGoal(id);
      if (res.status === "OK") {
        message.success("Xóa lịch học thành công!");
        fetchSchedules();
      } else {
        message.error("Xóa thất bại!");
      }
    } catch (error) {
      message.error("Đã có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };
  const handleSave = async () => {
    if (!date || (!time && targetWords <= 0)) {
      message.warning("Vui lòng nhập thời gian hoặc số từ vựng mục tiêu!");
      return;
    }

    const newGoal = {
      userId,
      startDate: date.format("YYYY-MM-DD"),
      targetTimes: time ? time.format("HH:mm") : "",
      repeat: isDailyRepeat,
      targetWords,
      status: "active",
    };

    try {
      setLoading(true);

      let response;

      if (editing) {
        const editingData = {
          userId,
          startDate: date.format("YYYY-MM-DD"),
          targetTimes: time ? time.format("HH:mm") : "",
          isDailyRepeat: isDailyRepeat,
          targetWords,
          status: editing.status,
        };
        console.log("Editing goal:", editing);
        response = await LearningGoalService.updateLearningGoal(
          editing._id,
          editingData
        );
      } else {
        response = await LearningGoalService.createLearningGoal(newGoal);
      }

      if (response.status === "OK") {
        message.success(
          editing
            ? "Cập nhật lịch học thành công!"
            : "Mục tiêu học đã được lưu!"
        );
        fetchSchedules();
        setDate(null);
        setTime(null);
        setIsDailyRepeat(false);
        setTargetWords(0);
        setEditing(null);
      } else {
        message.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, isActive) => {
    try {
      setLoading(true);
      const response = await LearningGoalService.updateStatus(
        id,
        isActive ? "active" : "paused"
      );
      if (response.status === "OK") {
        fetchSchedules();
        message.success("Cập nhật trạng thái thành công!");
      } else {
        message.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container>
      <Header />
      <MainContainer>
        <HeaderTitle level={2}>📚 Lịch học vui vẻ 🎈</HeaderTitle>
        <Row gutter={20}>
          {/* Lịch trình học */}
          <Col span={12}>
            <StyledCard title="📆 Lịch học" bordered>
              {schedules.length > 0 ? (
                <List
                  dataSource={schedules.sort((a, b) =>
                    dayjs(a.startDate).diff(dayjs(b.startDate))
                  )}
                  loading={loading}
                  renderItem={(item) => (
                    <ListItem>
                      <Row
                        style={{
                          width: "100%",
                          padding: 12,
                          border: "1px solid #f0f0f0",
                          borderRadius: 8,
                          background: "#fafafa",
                        }}
                        justify="space-between"
                        align="middle"
                        gutter={[12, 12]}
                      >
                        {/* Cột thời gian học */}
                        <Col flex="1">
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <ClockCircleOutlined style={{ color: "#2196F3" }} />
                            <Text strong>
                              {item.targetTimes || "Chưa đặt thời gian"}
                            </Text>
                          </div>
                        </Col>

                        {/* Cột số từ/ngày */}
                        {item.targetWords && (
                          <Col flex="1">
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <AimOutlined style={{ color: "#4CAF50" }} />
                              <Text strong>{item.targetWords} từ/ngày</Text>
                            </div>
                          </Col>
                        )}

                        {/* Nhãn lặp lại */}
                        {/* <Col>
                          {item.repeat && (
                            <Tag color="green">🔄 Học mỗi ngày</Tag>
                          )}
                        </Col> */}

                        {/* Công tắc thông báo */}
                        <Col>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <Text style={{ marginBottom: 0 }}>🔔</Text>
                            <Switch
                              size="small"
                              checked={item.status === "active"}
                              onChange={(checked) =>
                                handleUpdateStatus(item._id, checked)
                              }
                            />
                          </div>
                        </Col>

                        {/* Nút thao tác */}
                        <Col>
                          <Space size={8}>
                            <Button
                              // size="small"
                              style={{ color: "#fbc02d" }} // màu vàng đậm
                              type="text"
                              icon={<EditOutlined />}
                              onClick={() => handleEdit(item)}
                            />
                            <Button
                              // size="small"
                              danger
                              type="text"
                              icon={<DeleteOutlined />}
                              onClick={() => handleDelete(item._id)}
                            />
                          </Space>
                        </Col>
                      </Row>
                    </ListItem>
                  )}
                />
              ) : (
                <Text>🎈 Chưa có lịch học nào.</Text>
              )}
            </StyledCard>
          </Col>

          {/* Thiết lập mục tiêu */}
          <Col span={12}>
            <StyledCard title="✨ Thiết lập mục tiêu" bordered>
              <Text strong>🎯 Số từ vựng mục tiêu:</Text>
              <InputNumber
                min={1}
                value={targetWords}
                onChange={setTargetWords}
                style={{ width: "100%", marginBottom: 10 }}
              />

              {/* {editingId ? (
                <Text strong>📅 Ngày học: {date?.format("DD/MM/YYYY")}</Text>
              ) : ( */}
              <>
                <Text strong>📅 Chọn ngày bắt đầu:</Text>
                <DatePicker
                  value={date}
                  onChange={setDate}
                  style={{ width: "100%", marginBottom: 10 }}
                />
              </>
              {/* )} */}

              <Text strong>⏰ Chọn giờ học:</Text>
              <TimePicker
                value={time}
                onChange={setTime}
                format="HH:mm"
                style={{ width: "100%", marginBottom: 10 }}
              />

              <Text strong>
                🔁 Học hàng ngày?{" "}
                <Switch
                  checked={isDailyRepeat}
                  onChange={setIsDailyRepeat}
                  style={{ marginLeft: 10 }}
                />
              </Text>

              <StyledButton
                type="primary"
                block
                onClick={handleSave}
                loading={loading}
              >
                {editing ? "Cập nhật mục tiêu ✏️" : "Lưu mục tiêu 📝"}
              </StyledButton>
              {editing && (
                <Button
                  block
                  onClick={() => {
                    setEditing(null);
                    setDate(null);
                    setTime(null);
                    setTargetWords(0);
                    setIsDailyRepeat(false);
                  }}
                  style={{ marginTop: 10 }}
                >
                  ➕ Thêm mới mục tiêu khác
                </Button>
              )}
            </StyledCard>
          </Col>
        </Row>
      </MainContainer>
      <Footer />
    </Container>
  );
};

export default StudySchedule;
