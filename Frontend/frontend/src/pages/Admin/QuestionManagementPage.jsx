import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Footer from "../../components/footer/footer";
import styled from "styled-components";
import InputSearch from "../../components/InputSearch/Search";
import NavComponent from "../../components/nav/nav";
import AddQuestionForm from "../../components/forms/AddQuestionForm";
import * as QuestionService from "../../services/QuestionService";
import * as TopicService from "../../services/TopicService";
import * as ActivityService from "../../services/ActivityService";
import * as VocabularyService from "../../services/VocabularyService";
import QuestionsTable from "../../components/table/QuestionsTable";

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

const QuestionsManagementPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [testActivities, setTestActivities] = useState([]);
  const [reviewActivities, setReviewActivities] = useState([]);
  const [vocabularies, setVocabularies] = useState([]);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [editingQuestions, setEditingQuestions] = useState(null);

  useEffect(() => {
    fetchQuestions();
    fetchQuestionTypes();
    fetchTopics();
    fetchVocabularies();
    fetchTestAndReviewActivity();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await TopicService.getAllTopic();
      setTopics(response.data);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách chủ đề!");
    }
  };
  const fetchTestAndReviewActivity = async () => {
    try {
      const responseReview = await ActivityService.getActivityByReview();
      if (responseReview.status !== "OK") {
        message.error("Đã có lỗi xảy ra khi lấy danh sách bài ôn tập");
      }
      const responseTest = await ActivityService.getActivityByTest();
      if (responseTest.status !== "OK") {
        message.error("Đã có lỗi xảy ra khi lấy danh sách bài kiểm tratra");
      }
      setTestActivities(responseTest.data);
      setReviewActivities(responseReview.data);
    } catch (e) {
      message.error("Lỗi khi lấy danh sách bài tập");
    }
  };
  const fetchVocabularies = async () => {
    try {
      const response = await VocabularyService.getAllVocabulary();
      setVocabularies(response.data);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách từ vựng!");
    }
  };

  const fetchQuestionTypes = async () => {
    try {
      const response = await QuestionService.getAllQuestionTypes();
      setQuestionTypes(response.data);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách loại câu hỏi!");
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await QuestionService.getAllQuestions();
      setQuestions(response.data);
      console.log(response.data);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách câu hỏi!");
    }
  };

  const handleView = (question) => {
    message.info(`Xem chi tiết: ${question.questionName}`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await QuestionService.deleteQuestion(id);
      if (response.status === "OK") {
        message.success("Đã xóa câu hỏi thành công");
        fetchQuestions();
      }
    } catch (error) {
      message.error("Lỗi khi xóa câu hỏi!");
    }
  };
  const handleDeleteAll = async (ids) => {
    try {
      if (!ids.length) {
        message.warning("Không có câu hỏi nào để xóa!");
        return;
      }

      await Promise.all(ids.map((id) => QuestionService.deleteQuestion(id)));

      message.success("Đã xóa tất cả câu hỏi thành công");
      fetchQuestions();
    } catch (error) {
      message.error("Lỗi khi xóa câu hỏi!");
    }
  };

  const handleAddQuestion = () => {
    setIsModalOpen(true);
  };

  const handleEdit = (question) => {
    setEditingQuestions(question);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingQuestions(null);
  };

  const handleAddToGame = async (questionIds) => {
    try {
      const response = await ActivityService.addQuestionToGame(questionIds);
      if (response.status === "OK") {
        message.success("Đã thêm câu hỏi vào game thành công");
        // fetchQuestions();
      }
    } catch (error) {
      message.error("Lỗi khi thêm câu hỏi vào game!");
    }
  };
  const handleAddToExercise = async (questionIds, activityId) => {
    try {
      console.log("tới page");
      console.log("questionIds", questionIds);
      console.log("activityId", activityId);
      const response = await ActivityService.addQuestionToActivity(
        questionIds,
        activityId
      );
      if (response.status === "OK") {
        message.success("Đã thêm câu hỏi vào bài tập thành công");
        // fetchQuestions();
      }
      console.log(response);
    } catch (error) {
      message.error("Lỗi khi thêm câu hỏi vào bài tập!");
    }
  };

  const handleSubmit = async (data) => {
    try {
      let response;
      if (editingQuestions) {
        response = await QuestionService.updateQuestion(
          editingQuestions._id,
          data
        );
      } else {
        response = await QuestionService.createQuestion(data);
      }

      if (response.status === "OK") {
        message.success(
          editingQuestions
            ? "Cập nhật câu hỏi thành công!"
            : "Thêm câu hỏi thành công!"
        );
        console.log(response);
        setIsModalOpen(false);
        setEditingQuestions(null);
        fetchQuestions();
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
            <Title>Quản lý câu hỏi</Title>
            {/* <AddButton onClick={handleAddQuestion} icon={<PlusOutlined />}>
              Thêm câu hỏi
            </AddButton> */}
          </HeaderSection>

          <TableWrapper>
            <QuestionsTable
              onAdd={handleAddQuestion}
              questions={questions}
              onView={handleView}
              onEdit={handleEdit}
              topics={topics}
              questionTypes={questionTypes}
              onDelete={handleDelete}
              onDeleteAll={handleDeleteAll}
              onAddToGame={handleAddToGame}
              reviewActivities={reviewActivities}
              testActivities={testActivities}
              onAddToExercise={handleAddToExercise}
            />
          </TableWrapper>
        </MainContent>
      </ContentWrapper>

      <Footer />

      <AddQuestionForm
        topics={topics}
        vocabularies={vocabularies}
        questionTypes={questionTypes}
        visible={isModalOpen}
        onCancel={handleCloseModal}
        onSubmit={handleSubmit}
        initialValues={editingQuestions}
      />
    </PageContainer>
  );
};

export default QuestionsManagementPage;
