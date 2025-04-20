import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Button,
  Space,
  Image,
  Typography,
  Tag,
  Input,
  Popconfirm,
  message,
  Select,
  Modal,
} from "antd";

import {
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
const { confirm } = Modal;
const { Text } = Typography;
const { Search } = Input;
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
const StyledSearch = styled(Search)`
  font-size: 16px;
  font-weight: 600;
  width: 300px;
  padding: 10px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
`;

// const HeaderSection = styled.div`
//   width: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: 20px 0;
//   // border-bottom: 2px solid #ddd;
// `;
const HeaderSection = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0px 20px 20px 0; /* Thêm padding-right */
  gap: 10px; /* Khoảng cách giữa các phần tử */
  margin-right: 20px; /* Đẩy toàn bộ nội dung vào trong một chút */
`;
const VocabularyTable = ({
  selectedTopic,
  filterTopic,
  topics,
  onAdd,
  vocabularies,
  onEdit,
  onDelete,
}) => {
  //   const [vocabularies, setVocabularies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // const [selectedTopic, setSelectedTopic] = useState(null);

  //   useEffect(() => {
  //     fetchVocabularies();
  //   }, []);

  //   const fetchVocabularies = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:3001/api/vocabularies"
  //       );
  //       setVocabularies(response.data);
  //     } catch (error) {
  //       console.error("Lỗi khi tải từ vựng:", error);
  //     }
  //   };
  const filteredVocabularies = useMemo(() => {
    return vocabularies.filter(
      (vocabulary) =>
        vocabulary.vocabulary
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        vocabulary.meaning.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [vocabularies, searchTerm]);
  const showDeleteConfirm = (record) => {
    confirm({
      title: "Xác nhận xóa",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa từ vựng"${record.vocabulary}" không?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        onDelete(record._id);
      },
    });
  };
  const columns = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   key: "id",
    //   align: "center",
    //   render: (_, __, index) => <strong>#{index + 1}</strong>,
    // },
    {
      title: "Từ vựng",
      dataIndex: "vocabulary",
      key: "vocabulary",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "IPA",
      dataIndex: "vocabularyIpa",
      key: "vocabularyIpa",
      render: (text) => <Text type="secondary">{text}</Text>,
    },
    {
      title: "Nghĩa",
      dataIndex: "meaning",
      key: "meaning",
    },
    {
      title: "Từ loại",
      dataIndex: "partOfSpeech",
      key: "partOfSpeech",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Ảnh",
      dataIndex: "vocabularyImage",
      key: "vocabularyImage",
      render: (image) => <Image width={50} src={image} alt="Hình ảnh" />,
    },
    {
      title: "Chủ đề",
      dataIndex: "topicId",
      key: "topicId",
      render: (topic) => topic?.topicName || "Không có",
      // render: (topic) => topic.topicName,
      filters: topics.map((topic) => ({
        text: topic.topicName,
        value: topic._id,
      })),
      onFilter: (value, record) => record.topicId._id === value,
      render: (topic) => topic.topicName,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined style={{ color: "#faad14" }} />}
            onClick={() => onEdit(record)}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            danger
            onClick={() => showDeleteConfirm(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <HeaderSection>
        {/* <Select
          placeholder="Chọn chủ đề"
          style={{ width: 200 }}
          allowClear
          onChange={filterTopic}
          value={selectedTopic}
        >
          {topics.map((topic) => (
            <Select.Option key={topic._id} value={topic._id}>
              {topic.topicName}
            </Select.Option>
          ))}
        </Select> */}
        <StyledSearch
          placeholder="Tìm kiếm từ vựng..."
          onChange={(e) => setSearchTerm(e.target.value)}
          // style={{ marginBottom: 16, width: 300 }}
        />
        <StyledButton onClick={onAdd} icon={<PlusOutlined />}>
          Thêm từ vựng
        </StyledButton>
      </HeaderSection>
      <Table
        dataSource={filteredVocabularies}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 8 }}
        bordered
        style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", borderRadius: 10 }}
      />
      ;
    </div>
  );
};

export default VocabularyTable;
