import React, { useState } from "react";
import { Table, Button, Input, Select, Segmented, Tooltip } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
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

// const HeaderSection = styled.div`
//   width: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: 0px 20px 20px 0;
//   gap: 10px;
//   margin-right: 20px;
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
const ReviewsAndTestTable = ({
  onAdd,
  onEdit,
  onDelete,

  reviews,
  categories,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isTestMode, setIsTestMode] = useState("Ôn tập");

  const filteredReviews = reviews.filter((r) => {
    const isMatchingCategory =
      !selectedCategory || r?.categoryId?._id === selectedCategory;
    const isMatchingSearch = r?.activityName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const isMatchingMode =
      isTestMode === "Tất cả" ||
      (isTestMode === "Kiểm tra" && r?.categoryId?.categoryName === "test") ||
      (isTestMode === "Ôn tập" && r?.categoryId?.categoryName !== "test");

    return isMatchingCategory && isMatchingSearch && isMatchingMode;
  });

  const columns = [
    {
      title: "Mã hoạt động",
      dataIndex: "activityId",
      key: "activityId",
      align: "center",
    },
    {
      title: "Tên hoạt động",
      dataIndex: "activityName",
      key: "activityName",
      align: "center",
    },

    {
      title: "Mô tả",
      dataIndex: "activityDescription",
      key: "activityDescription",
      align: "center",
      width: 300,
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: "Thời gian kiểm tra (phút)",
      dataIndex: "testTime",
      align: "center",
      key: "testTime",
    },
    {
      title: "Mức độ",
      dataIndex: "activityLevel",
      align: "center",
      key: "activityLevel",
    },
    {
      title: "Danh mục",
      dataIndex: "categoryId",
      key: "categoryId",
      align: "center",
      render: (category) =>
        category?.categoryName === "test" ? "Kiểm tra" : "Ôn tập",
    },

    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <>
          <Button
            type="text"
            icon={<EditOutlined style={{ color: "#faad14" }} />}
            onClick={() => onEdit(record)}
            // style={{ marginRight: 8 }}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            danger
            onClick={() => onDelete(record._id)}
          />
        </>
        //    {/* <Tooltip title="Chỉnh sửa"> */}
        //    <Button
        //    type="text"
        //    icon={<EditOutlined style={{ color: "#faad14" }} />}
        //    onClick={() => onEdit(record)}
        //  />
        //  {/* </Tooltip> */}
        //  <Popconfirm
        //    title="Bạn có chắc muốn xóa?"
        //    onConfirm={() => onDelete(record._id)}
        //    okText="Xóa"
        //    cancelText="Hủy"
        //  >
      ),
    },
  ];

  return (
    <div>
      <HeaderSection>
        {/* <div style={{ display: "flex", alignItems: "center", gap: 10 }}> */}
        <Segmented
          options={["Tất cả", "Ôn tập", "Kiểm tra"]}
          value={isTestMode}
          onChange={setIsTestMode}
          style={{ background: "#f0f2f5", padding: "4px", borderRadius: 8 }}
        />
        <Search
          placeholder="Tìm kiếm hoạt động..."
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 250 }}
        />
        {/* <Select
          placeholder="Chọn danh mục"
          allowClear
          onChange={(value) => setSelectedCategory(value)}
          style={{ width: 200 }}
        >
          {/* {categories.map((category) => (
              <Option key={category._id} value={category._id}>
                {category.categoryName}
              </Option>
            ))} */}
        {/* </Select> */}
        {/* </div> */}
        <StyledButton onClick={onAdd} icon={<PlusOutlined />}>
          Thêm hoạt động
        </StyledButton>
      </HeaderSection>
      <Table
        columns={columns}
        dataSource={filteredReviews}
        rowKey="_id"
        pagination={{ pageSize: 8 }}
        bordered
        style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", borderRadius: 10 }}
      />
    </div>
  );
};

export default ReviewsAndTestTable;
