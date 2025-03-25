import { useState, useMemo } from "react";
import { Table, Button, Image, Space, Tooltip, Modal, Input } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import styled from "styled-components";

const { confirm } = Modal;
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

const HeaderSection = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0px 20px 20px 0;
  gap: 10px;
  margin-right: 20px;
`;

const TopicTable = ({ topics, onView, onEdit, onDelete, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const showDeleteConfirm = (record) => {
    confirm({
      title: "Xác nhận xóa",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa chủ đề "${record.topicName}" không?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        onDelete(record);
      },
    });
  };

  // Lọc danh sách theo topicName hoặc topicVietnamese
  const filteredTopics = useMemo(() => {
    return topics.filter(
      (topic) =>
        topic.topicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.topicVietnamese.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [topics, searchTerm]);

  const columns = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   key: "id",
    //   align: "center",
    //   render: (_, __, index) => <strong>#{index + 1}</strong>,
    // },
    {
      title: "Tên chủ đề",
      dataIndex: "topicName",
      key: "topicName",
      render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>,
    },
    {
      title: "Tên Tiếng Việt",
      dataIndex: "topicVietnamese",
      key: "topicVietnamese",
      render: (text) => (
        <span style={{ color: "#1677ff", fontWeight: 500 }}>{text}</span>
      ),
    },
    {
      title: "Ảnh",
      dataIndex: "topicImage",
      key: "topicImage",
      align: "center",
      render: (url) => (
        <Image
          src={url || "https://via.placeholder.com/100"}
          alt="Topic Image"
          width={50}
          height={50}
          style={{
            borderRadius: 8,
            boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
          }}
        />
      ),
    },

    {
      title: "Hành động",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: "#faad14" }} />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => showDeleteConfirm(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <HeaderSection>
        <Search
          placeholder="Tìm kiếm chủ đề..."
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
        <StyledButton onClick={onAdd} icon={<PlusOutlined />}>
          Thêm chủ đề
        </StyledButton>
      </HeaderSection>
      <Table
        dataSource={filteredTopics}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        bordered
        style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", borderRadius: 10 }}
      />
    </div>
  );
};

export default TopicTable;
