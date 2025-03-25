import React, { useState } from "react";
import {
  Table,
  Button,
  Input,
  Popconfirm,
  Segmented,
  message,
  Select,
  Image,
  Tooltip,
  Space,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import styled from "styled-components";

const { Search } = Input;
const { Option } = Select;

const StyledButton = styled(Button)`
  background: #2ecc71;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  &:hover {
    background: #27ae60;
  }
`;

const HeaderSection = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0px 20px 20px 0; /* Thêm padding-right */
  gap: 10px; /* Khoảng cách giữa các phần tử */
  margin-right: 20px; /* Đẩy toàn bộ nội dung vào trong một chút */
`;

const QuestionsTable = ({
  onAdd,
  questions,
  onEdit,
  onDelete,
  onDeleteAll,
  onAddToGame,
  onAddToExercise,
  reviewActivities,
  testActivities,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [filterType, setFilterType] = useState("Trò chơi");
  const [isTestMode, setIsTestMode] = useState(false);
  const [subFilter, setSubFilter] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const filteredQuestions = questions.filter((q) =>
    q?.questionContent?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteAll = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn ít nhất một câu hỏi để xóa.");
      return;
    }
    onDeleteAll(selectedRowKeys);
    setSelectedRowKeys([]);
  };

  const handleAddToGame = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn ít nhất một câu hỏi để thêm vào Game.");
      return;
    }
    onAddToGame(selectedRowKeys);
  };

  const handleAddToExercise = () => {
    if (filterType === "Trò chơi") {
      handleAddToGame();
    }
    if (!selectedExercise) {
      message.warning("Vui lòng chọn bài tập.");
      return;
    }
    console.log("tới toAdd");
    onAddToExercise(selectedRowKeys, selectedExercise);
  };
  const questionTypeIcons = {
    word_match: (
      <Space>
        <Tooltip title="Bài tập">
          <EditOutlined style={{ color: "#2196f3" }} />
        </Tooltip>
        <Tooltip title="Trò chơi">
          <PlayCircleOutlined style={{ color: "#ff9800" }} />
        </Tooltip>
      </Space>
    ),
    image_match: (
      <Space>
        <Tooltip title="Trò chơi">
          <PlayCircleOutlined style={{ color: "#ff9800" }} />
        </Tooltip>
      </Space>
    ),
    audio_record: (
      <Space>
        <Tooltip title="Bài tập">
          <EditOutlined style={{ color: "#2196f3" }} />
        </Tooltip>
        <Tooltip title="Trò chơi">
          <PlayCircleOutlined style={{ color: "#ff9800" }} />
        </Tooltip>
      </Space>
    ),
    listen_choose_word: (
      <Space>
        {/* <Tooltip title="Bài tập">
          <EditOutlined style={{ color: "#2196f3" }} />
        </Tooltip> */}
        <Tooltip title="Trò chơi">
          <PlayCircleOutlined style={{ color: "#ff9800" }} />
        </Tooltip>
      </Space>
    ),
    listen_choose_image: (
      <Space>
        {/* <Tooltip title="Bài tập">
          <EditOutlined style={{ color: "#2196f3" }} />
        </Tooltip> */}
        <Tooltip title="Trò chơi">
          <PlayCircleOutlined style={{ color: "#ff9800" }} />
        </Tooltip>
      </Space>
    ),
  };
  const columns = [
    {
      title: "",
      dataIndex: "_id",
      key: "_id",
      render: (_, record) => (
        <input
          type="checkbox"
          checked={selectedRowKeys.includes(record._id)}
          onChange={(e) =>
            setSelectedRowKeys((prev) =>
              e.target.checked
                ? [...prev, record._id]
                : prev.filter((id) => id !== record._id)
            )
          }
        />
      ),
    },
    {
      title: "Nội dung câu hỏi",
      dataIndex: "questionContent",
      key: "questionContent",
      render: (text, record) => {
        const icon = questionTypeIcons[
          record.questionTypeId.questionTypeId
        ] || (
          <Tooltip title="Bài tập">
            <EditOutlined style={{ color: "#2196f3" }} />
          </Tooltip>
        ); // Mặc định là bài tập
        return (
          <Space>
            {icon} <span>{text}</span>
          </Space>
        );
      },
    },

    {
      title: "Đáp án",
      dataIndex: "answer",
      key: "answer",
      render: (answer) => {
        // Kiểm tra nếu answer là đường dẫn hình ảnh
        if (
          typeof answer === "string" &&
          /\.(jpg|jpeg|png|gif)$/i.test(answer)
        ) {
          return (
            <img
              src={answer}
              alt="Đáp án"
              style={{
                width: 50,
                height: 50,
                objectFit: "cover",
                borderRadius: 5,
              }}
            />
          );
        }
        return <span>{answer}</span>;
      },
    },

    // {
    //   title: "Tùy chọn",
    //   dataIndex: "options",
    //   key: "options",
    //   render: (options) =>
    //     Array.isArray(options) ? options.join(", ") : "Không có",
    // },
    {
      title: "Loại câu hỏi",
      dataIndex: "questionTypeId",
      key: "questionTypeId",
      render: (questionType) => questionType.questionTypeId,
    },
    {
      title: "Chủ đề",
      dataIndex: "topicId",
      key: "topicId",
      render: (topic) => topic.topicName,
    },
    { title: "Điểm", dataIndex: "score", key: "score" },
    // {
    //   title: "Hình ảnh",
    //   dataIndex: "image",
    //   key: "image",
    //   render: (img) => (img ? <Image src={img} width={50} /> : "Không có"),
    // },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 10 }}>
          {/* <Tooltip title="Chỉnh sửa"> */}
          <Button
            type="text"
            icon={<EditOutlined style={{ color: "#faad14" }} />}
            onClick={() => onEdit(record)}
          />
          {/* </Tooltip> */}
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => onDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger type="text" icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <HeaderSection>
        <Button
          type="default"
          danger
          disabled={!selectedRowKeys.length}
          onClick={handleDeleteAll}
        >
          Xóa tất cả
        </Button>

        <Button
          type="default"
          onClick={handleAddToGame}
          disabled={!selectedRowKeys.length}
        >
          Thêm vào Game
        </Button>

        <Segmented
          options={["Trò chơi", "Ôn tập", "Kiểm tra"]}
          onChange={(value) => setFilterType(value)}
        />

        <Button
          type="default"
          danger
          disabled={!selectedRowKeys.length}
          onClick={handleDeleteAll}
        >
          Xóa tất cả
        </Button>

        <Select
          showSearch
          style={{ width: 200 }}
          placeholder={`Chọn ${filterType}`}
          onChange={(value) => setSelectedExercise(value)}
        >
          {(filterType === "Kiểm tra" ? testActivities : reviewActivities).map(
            (activity) => (
              <Option key={activity._id} value={activity._id}>
                {activity.activityName}
              </Option>
            )
          )}
        </Select>

        <Button
          type="default"
          onClick={handleAddToExercise}
          disabled={!selectedRowKeys.length || !selectedExercise}
        >
          Thêm vào {filterType}
        </Button>

        {/* </div> */}
        <Search
          placeholder="Tìm kiếm câu hỏi..."
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
        <StyledButton onClick={onAdd} icon={<PlusOutlined />}>
          Thêm câu hỏi
        </StyledButton>
      </HeaderSection>

      <Table
        columns={columns}
        dataSource={filteredQuestions}
        rowKey="_id"
        pagination={{ pageSize: 8 }}
        bordered
        style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", borderRadius: 10 }}
      />
      <div></div>
    </div>
  );
};

export default QuestionsTable;

//Thêm dữ liệu color, chủ đề, thêm question => game hiển thị=> lấy bảng xếp hạng test. thêm bài tập fix giao diện test + quiz
