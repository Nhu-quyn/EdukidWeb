import React, { useState, useEffect } from "react";
import { Button, message, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import Footer from "../../components/footer/footer";
import styled from "styled-components";
import InputSearch from "../../components/InputSearch/Search";
import NavComponent from "../../components/nav/nav";
import * as VocabularyService from "../../services/VocabularyService";
import VocabularyTable from "../../components/table/VocabularyTable";
import AddVocabularyForm from "../../components/forms/AddVocabularyForm";
import * as TopicService from "../../services/TopicService";

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
  // padding: 0px 0;
  border-bottom: 2px solid #ddd;
`;

const TableWrapper = styled.div`
  width: 100%;
  // max-width: 1300px;
  margin-top: 20px;
`;

const StyledButton = styled(Button)`
  background-color: #f6bbe5;
  border: none;
  font-size: 16px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 6px;
  height: 42px;

  &:hover {
    color: #fff;
    background-color: #e69ac9 !important;
  }
`;
const Title = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: #34495e;
  text-transform: uppercase;
  letter-spacing: 1.5px;
`;
const VocabularyManagementPage = () => {
  const [vocabularies, setVocabularies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const [editingVocabulary, setEditingVocabulary] = useState(null);

  useEffect(() => {
    fetchVocabularies();
    fetchTopics();
    fetchVocabularies();
  }, [selectedTopic]);

  const fetchVocabularies = async () => {
    try {
      const response = await VocabularyService.getAllVocabulary();
      console.log("API Response:", response);

      let data = response.data || [];
      console.log("Fetched Data:", data);

      if (selectedTopic) {
        console.log("Selected Topic:", selectedTopic);
        data = data.filter(
          (vocab) => vocab.topicId._id?.toString() === selectedTopic.toString()
        );
        console.log("Filtered Data:", data);
      }

      setVocabularies(data);
    } catch (error) {
      console.error("Error fetching vocabularies:", error);
      message.error("Lỗi khi lấy danh sách từ vựng!");
    }
  };

  const fetchTopics = async () => {
    try {
      const response = await TopicService.getAllTopic();
      setTopics(response.data);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách chủ đề!");
    }
  };

  const handleView = (vocab) => {
    message.info(`Xem chi tiết: ${vocab.word}`);
  };

  const handleDelete = async (vocabId) => {
    try {
      // message.success("Đã xóa từ vựng thành công");
      const response = await VocabularyService.deleteVocabulary(vocabId);
      if (response.status === "OK") {
        message.success("Đã xóa từ vựng thành công");
        fetchVocabularies();
      }
    } catch (error) {
      message.error("Lỗi khi xóa từ vựng!");
    }
  };

  const handleAddVocabulary = () => {
    setIsModalOpen(true);
  };

  const handleEdit = (vocab) => {
    setEditingVocabulary(vocab);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVocabulary(null);
  };

  const handleSubmit = async (data) => {
    try {
      let response;
      if (editingVocabulary) {
        response = await VocabularyService.updateVocabulary(
          editingVocabulary._id,
          data
        );
      } else {
        response = await VocabularyService.createVocabulary(data);
      }

      if (response.status === "OK") {
        message.success(
          editingVocabulary
            ? "Cập nhật từ vựng thành công!"
            : "Thêm từ vựng thành công!"
        );
        setIsModalOpen(false);
        setEditingVocabulary(null);
        fetchVocabularies();
      } else {
        message.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    } catch (error) {
      message.error("Lỗi kết nối đến server!");
    }
  };
  const handleTopicChange = (value) => {
    setSelectedTopic(value);
  };
  return (
    <PageContainer>
      <ContentWrapper>
        <NavComponent />
        <MainContent>
          <HeaderSection>
            <Title>Quản lý từ vựng</Title>
            {/* <AddButton onClick={handleAddQuestion} icon={<PlusOutlined />}>
              Thêm câu hỏi
            </AddButton> */}
          </HeaderSection>
          <TableWrapper>
            <VocabularyTable
              selectedTopic={selectedTopic}
              filterTopic={handleTopicChange}
              topics={topics}
              vocabularies={vocabularies}
              onAdd={handleAddVocabulary}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </TableWrapper>
        </MainContent>
      </ContentWrapper>
      <Footer />
      <AddVocabularyForm
        visible={isModalOpen}
        onCancel={handleCloseModal}
        onSubmit={handleSubmit}
        topics={topics}
        initialValues={editingVocabulary}
      />
    </PageContainer>
  );
};

export default VocabularyManagementPage;
