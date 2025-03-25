import React, { useState } from "react";
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
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  AimOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const StudySchedule = () => {
  const [goalTitle, setGoalTitle] = useState("");
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [isDailyRepeat, setIsDailyRepeat] = useState(false);
  const [targetWords, setTargetWords] = useState(0);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(true);
  const [showNotification, setShowNotification] = useState(true);

  const handleSave = () => {
    if (!goalTitle.trim() || !date || !time || targetWords <= 0) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const newGoal = {
      goalTitle,
      date,
      time,
      isDailyRepeat,
      targetWords,
      status: "pending",
    };

    setHistory([...history, newGoal]);
    setGoalTitle("");
    setDate(null);
    setTime(null);
    setIsDailyRepeat(false);
    setTargetWords(0);
    alert("Mục tiêu học đã được lưu!");
  };

  const toggleStatus = (index) => {
    setHistory((prevHistory) =>
      prevHistory.map((item, i) =>
        i === index
          ? {
              ...item,
              status: item.status === "pending" ? "completed" : "pending",
            }
          : item
      )
    );
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        padding: 20,
        textAlign: "center",
        background: "#f0f9ff",
        borderRadius: 10,
      }}
    >
      <Title level={2} style={{ color: "#1890ff" }}>
        🎯 Mục tiêu học từ vựng
      </Title>

      {showNotification && (
        <Card style={{ background: "#fffbeb", marginBottom: 10 }}>
          <Text strong>Thông báo:</Text> Hãy đặt mục tiêu học từ vựng mỗi ngày
          để đạt được tiến bộ nhanh chóng!
          <Button type="link" onClick={() => setShowNotification(false)}>
            Tắt thông báo
          </Button>
        </Card>
      )}

      <Card title="Thiết lập mục tiêu" bordered style={{ textAlign: "left" }}>
        <Text strong>
          <AimOutlined /> Nhập mục tiêu học:
        </Text>
        <InputNumber
          min={1}
          value={targetWords}
          onChange={setTargetWords}
          style={{ width: "100%", marginBottom: 10, borderRadius: 5 }}
        />

        <Text strong>
          <CalendarOutlined /> Chọn ngày bắt đầu:
        </Text>
        <DatePicker
          style={{ width: "100%", marginBottom: 10, borderRadius: 5 }}
          onChange={(value) => setDate(value)}
        />

        <Text strong>
          <ClockCircleOutlined /> Chọn giờ học:
        </Text>
        <TimePicker
          style={{ width: "100%", marginBottom: 10, borderRadius: 5 }}
          onChange={(value) => setTime(value ? value.format("HH:mm") : null)}
        />

        <Text strong>Chế độ lặp lại hằng ngày:</Text>
        <Switch
          checked={isDailyRepeat}
          onChange={setIsDailyRepeat}
          style={{ marginBottom: 10 }}
        />

        <Button
          type="primary"
          style={{ width: "100%", borderRadius: 5 }}
          onClick={handleSave}
        >
          Lưu mục tiêu học
        </Button>
      </Card>

      <div style={{ marginTop: 20 }}>
        <Switch checked={showHistory} onChange={setShowHistory} /> Hiển thị lịch
        sử
      </div>

      {showHistory && (
        <Card
          title="Lịch sử học tập"
          style={{ marginTop: 20, textAlign: "left" }}
        >
          <List
            dataSource={history}
            renderItem={(item, index) => (
              <List.Item>
                🎯 {item.goalTitle} 📅 {item.date?.format("YYYY-MM-DD")} ⏰{" "}
                {item.time} 📖 {item.targetWords} từ/ngày
                <Tag color={item.status === "pending" ? "blue" : "green"}>
                  {item.status === "pending" ? "Chưa hoàn thành" : "Hoàn thành"}
                </Tag>
                <Switch
                  checked={item.status === "completed"}
                  onChange={() => toggleStatus(index)}
                />
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  );
};

export default StudySchedule;
