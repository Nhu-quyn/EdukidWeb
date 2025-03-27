import React, { useState, useEffect } from "react";
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
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  AimOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import * as LearningGoalService from "../../services/LearningGoalService";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const StudySchedule = () => {
  const userId = useSelector((state) => state.user.user?._id);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [isDailyRepeat, setIsDailyRepeat] = useState(false);
  const [targetWords, setTargetWords] = useState(0);
  const [schedules, setSchedules] = useState([]);

  const fetchSchedules = async () => {
    try {
      const response = await LearningGoalService.getAllLearningGoal(userId);
      setSchedules(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy lịch trình:", error);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleSave = async () => {
    if (!date || !time || targetWords <= 0) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    const newGoal = {
      userId,
      startDate: date.format("YYYY-MM-DD"),
      targetTimes: time,
      repeat: isDailyRepeat,
      targetWords,
      status: "active",
    };
    try {
      await LearningGoalService.createLearningGoal(newGoal);
      fetchSchedules();
      setDate(null);
      setTime(null);
      setIsDailyRepeat(false);
      setTargetWords(0);
      alert("Mục tiêu học đã được lưu!");
    } catch (error) {
      console.error("Lỗi khi lưu mục tiêu:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await LearningGoalService.updateStatus(id, status);
      fetchSchedules();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      <Title level={2} style={{ textAlign: "center", color: "#1890ff" }}>
        🎯 Mục tiêu học từ vựng
      </Title>
      <Row gutter={20}>
        {/* Danh sách mục tiêu */}
        <Col span={12}>
          <Card title="Lịch trình học tập" bordered>
            {schedules.length > 0 ? (
              <List
                dataSource={schedules}
                renderItem={(item) => (
                  <List.Item>
                    <div style={{ flex: 1 }}>
                      📅 {item.startDate} ⏰ {item.targetTimes} 📖{" "}
                      {item.targetWords} từ/ngày
                    </div>
                    <Tag color={item.status === "active" ? "blue" : "orange"}>
                      {item.status === "active" ? "Đang học" : "Tạm dừng"}
                    </Tag>
                    <Switch
                      checked={item.status === "active"}
                      onChange={() =>
                        handleUpdateStatus(
                          item._id,
                          item.status === "active" ? "paused" : "active"
                        )
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Text>Chưa có mục tiêu nào.</Text>
            )}
          </Card>
        </Col>

        {/* Thiết lập mục tiêu */}
        <Col span={12}>
          <Card title="Thiết lập mục tiêu" bordered>
            <Text strong>
              <AimOutlined /> Nhập số từ vựng mục tiêu:
            </Text>
            <InputNumber
              min={1}
              value={targetWords}
              onChange={setTargetWords}
              style={{ width: "100%", marginBottom: 10 }}
            />

            <Text strong>
              <CalendarOutlined /> Chọn ngày bắt đầu:
            </Text>
            <DatePicker
              style={{ width: "100%", marginBottom: 10 }}
              onChange={(value) => setDate(value)}
            />

            <Text strong>
              <ClockCircleOutlined /> Chọn giờ học:
            </Text>
            <TimePicker
              style={{ width: "100%", marginBottom: 10 }}
              onChange={(value) =>
                setTime(value ? value.format("HH:mm") : null)
              }
            />

            <Text strong>Chế độ lặp lại hằng ngày:</Text>
            <Switch
              checked={isDailyRepeat}
              onChange={setIsDailyRepeat}
              style={{ marginBottom: 10 }}
            />

            <Button
              type="primary"
              style={{ width: "100%" }}
              onClick={handleSave}
            >
              Lưu mục tiêu học
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudySchedule;
