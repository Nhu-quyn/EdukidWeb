import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Footer from "../../components/footer/footer";
import styled from "styled-components";
import InputSearch from "../../components/InputSearch/Search";
import NavComponent from "../../components/nav/nav";
import AddReviewForm from "../../components/forms/AddReviewForm";
import * as ActivityService from "../../services/ActivityService";
import ReviewsTable from "../../components/table/ReviewTable";

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

const TableWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
`;

const ReviewsAndTestsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await ActivityService.getTestAndReview();
      setReviews(response.data);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách đánh giá!");
    }
  };

  const handleView = (review) => {
    message.info(`Xem chi tiết: ${review.reviewText}`);
  };

  const handleDelete = async (id) => {
    try {
      await ActivityService.deleteActivity(id);
      message.success("Đã xóa đánh giá thành công");
      fetchReviews();
    } catch (error) {
      message.error("Lỗi khi xóa đánh giá!");
    }
  };

  const handleAddReview = () => {
    setIsModalOpen(true);
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReview(null);
  };

  const handleSubmit = async (data) => {
    try {
      let response;
      if (editingReview) {
        response = await ActivityService.updateActivity(
          editingReview._id,
          data
        );
      } else {
        console.log(data);
        response = await ActivityService.addTestAndReview(data);
        // console.log(response);
      }

      if (response.status === "OK") {
        message.success(
          editingReview
            ? "Cập nhật đánh giá thành công!"
            : "Thêm đánh giá thành công!"
        );
        setIsModalOpen(false);
        setEditingReview(null);
        fetchReviews();
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
            <Title>Quản lý đánh giá</Title>
          </HeaderSection>

          <TableWrapper>
            <ReviewsTable
              onAdd={handleAddReview}
              reviews={reviews}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </TableWrapper>
        </MainContent>
      </ContentWrapper>

      <Footer />

      <AddReviewForm
        visible={isModalOpen}
        onCancel={handleCloseModal}
        onSubmit={handleSubmit}
        initialValues={editingReview}
      />
    </PageContainer>
  );
};

export default ReviewsAndTestsPage;
