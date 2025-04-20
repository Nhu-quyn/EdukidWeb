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
  message,
} from "antd";
import {
  CalendarOutlined,
  AimOutlined,
  SyncOutlined,
  ClockCircleOutlined,
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
      const response = await LearningGoalService.createLearningGoal(newGoal);
      fetchSchedules();

      if (response.status === "OK") {
        message.success("Mục tiêu học đã được lưu!");
        setDate(null);
        setTime(null);
        setIsDailyRepeat(false);
        setTargetWords(0);
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
                      <Row style={{ width: "100%" }} align="middle">
                        {/* Ngày bắt đầu (1 hàng riêng) */}
                        <Col
                          span={24}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 8,
                          }}
                        >
                          <CalendarOutlined
                            style={{ fontSize: 18, color: "#ff5722" }}
                          />
                          <Text
                            strong
                            style={{ fontSize: 16, color: "#ff5722" }}
                          >
                            {dayjs(item.startDate).format("DD/MM/YYYY")}
                          </Text>
                        </Col>

                        {/* Thông tin khác trên cùng 1 hàng */}
                        <Col
                          span={5}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <ClockCircleOutlined
                            style={{ fontSize: 16, color: "#2196F3" }}
                          />
                          <Text>{item.targetTimes || "Chưa đặt"}</Text>
                        </Col>

                        {item.targetWords && (
                          <Col
                            span={5}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <AimOutlined
                              style={{ fontSize: 16, color: "#4CAF50" }}
                            />
                            <Text>{item.targetWords} từ/ngày</Text>
                          </Col>
                        )}

                        <Col span={4}>
                          {item.repeat && (
                            <Tag color="green">🔄 Học mỗi ngày</Tag>
                          )}
                        </Col>

                        {/* Trạng thái bật/tắt */}
                        {/* <Col span={4} style={{ textAlign: "right" }}>
                          <Switch
                            checked={item.status === "active"}
                            onChange={(checked) =>
                              handleUpdateStatus(item._id, checked)
                            }
                          />
                        </Col> */}
                        {/* Bật/Tắt thông báo */}
                        <Col span={4} style={{ textAlign: "right" }}>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "end",
                              gap: 8,
                            }}
                          >
                            <div>
                              <Text style={{ marginRight: 8 }}>🔔</Text>
                              <Switch
                                checked={item.status === "active"}
                                onChange={(checked) =>
                                  handleUpdateStatus(item._id, checked)
                                }
                              />
                            </div>

                            <div>
                              <Text style={{ marginRight: 8 }}>🔁</Text>
                              <Switch
                                checked={item.repeatDaily}
                                onChange={async (checked) => {
                                  try {
                                    setLoading(true);
                                    // const response =
                                    //   await LearningGoalService.updateRepeat(
                                    //     item._id,
                                    //     checked
                                    //   );
                                    // if (response.status === "OK") {
                                    //   fetchSchedules();
                                    //   message.success(
                                    //     "Đã cập nhật chế độ lặp lại!"
                                    //   );
                                    // } else {
                                    //   message.error("Cập nhật thất bại!");
                                    // }
                                  } catch (error) {
                                    message.error(
                                      "Có lỗi xảy ra khi cập nhật!"
                                    );
                                  } finally {
                                    setLoading(false);
                                  }
                                }}
                              />
                            </div>
                          </div>
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

              <Text strong>📅 Chọn ngày học:</Text>
              <DatePicker
                value={date}
                onChange={setDate}
                style={{ width: "100%", marginBottom: 10 }}
              />

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
                Lưu mục tiêu 📝
              </StyledButton>
            </StyledCard>
          </Col>
        </Row>
      </MainContainer>
      <Footer />
    </Container>
  );
};

export default StudySchedule;
