import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Footer from "../../components/footer/footer";
import styled from "styled-components";
import InputSearch from "../../components/InputSearch/Search";
import NavComponent from "../../components/nav/nav";
import AddTopicForm from "../../components/forms/AddTopicForm";
import * as TopicService from "../../services/TopicService";
import TopicTable from "../../components/table/TopicTable";

// const PageContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   min-height: 100vh;
//   background: #f4f6f9;
//   font-family: "Fredoka", sans-serif;
// `;

// const ContentWrapper = styled.div`
//   display: flex;
//   flex: 1;
// `;

// const MainContent = styled.div`
//   flex: 1;
//   padding: 32px;
//   background: #fff;
//   border-radius: 12px;
//   box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
//   display: flex;
//   flex-direction: column;
//   align-items: center;
// `;

// const HeaderSection = styled.div`
//   width: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: 0px 0;
//   border-bottom: 2px solid #ddd;
// `;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f4f6f9;
  font-family: "Fredoka", sans-serif;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderSection = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 0;
  border-bottom: 2px solid #ddd;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: #34495e;
  text-transform: uppercase;
  letter-spacing: 1.5px;
`;

const SearchContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

const StyledInputSearch = styled(InputSearch)`
  width: 100%;
  max-width: 400px;
  height: 42px;
  font-size: 16px;
`;

const TableWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
`;

const AddButton = styled(Button)`
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
const TopicManagementPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topics, setTopics] = useState([]);
  const [editingTopic, setEditingTopic] = useState(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await TopicService.getAllTopic();
      setTopics(response.data);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách chủ đề!");
    }
  };

  const handleView = (topic) => {
    message.info(`Xem chi tiết: ${topic.topicName}`);
  };

  const handleDelete = async (topic) => {
    // message.warning(`Xóa: ${topic.topicName}`);
    try {
      const response = await TopicService.deleteTopic(topic._id);
      if (response.status === "OK") {
        message.success("Đã xóa chủ đề thành công");
        fetchTopics();
      }
    } catch (error) {
      message.error("Lỗi khi lấy danh sách chủ đề!");
    }
  };

  const handleAddTopic = () => {
    setIsModalOpen(true);
  };

  const handleEdit = (topic) => {
    setEditingTopic(topic);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTopic(null);
  };

  const handleSubmit = async (data) => {
    try {
      let response;
      if (editingTopic) {
        // Gọi API cập nhật nếu đang chỉnh sửa
        response = await TopicService.updateTopic(editingTopic._id, data);
      } else {
        // Gọi API tạo mới nếu không có chủ đề nào đang chỉnh sửa
        response = await TopicService.createTopic(data);
      }

      if (response.status === "OK") {
        message.success(
          editingTopic
            ? "Cập nhật chủ đề thành công!"
            : "Thêm chủ đề thành công!"
        );
        setIsModalOpen(false);
        setEditingTopic(null);
        fetchTopics(); // Cập nhật lại danh sách chủ đề
      } else {
        message.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    } catch (error) {
      message.error("Lỗi kết nối đến server!");
    }
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <NavComponent />

        <MainContent>
          <HeaderSection>
            <Title>Quản lý chủ đề</Title>
            {/* <AddButton onClick={handleAddQuestion} icon={<PlusOutlined />}>
              Thêm câu hỏi
            </AddButton> */}
          </HeaderSection>
          {/* <HeaderSection>
            <StyledButton onClick={handleAddTopic} icon={<PlusOutlined />}>
              Thêm chủ đề
            </StyledButton>
            <SearchContainer>
              <StyledInputSearch placeholder="Tìm kiếm..." />
            </SearchContainer>
          </HeaderSection> */}
          <TableWrapper>
            <TopicTable
              onAdd={handleAddTopic}
              topics={topics}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </TableWrapper>
        </MainContent>
      </ContentWrapper>
      <Footer />
      <AddTopicForm
        visible={isModalOpen}
        onCancel={handleCloseModal}
        onSubmit={handleSubmit}
        initialValues={editingTopic}
      />
    </PageContainer>
  );
};

export default TopicManagementPage;
