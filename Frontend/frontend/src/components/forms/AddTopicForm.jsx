import React, { useState, useEffect } from "react";
import { Form, Input, Upload, Button, message, Modal, Avatar } from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import styled from "styled-components";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/drzjvhpwi/image/upload";
const UPLOAD_PRESET = "Your_cloud_image";

const AddTopicForm = ({ visible, onSubmit, onCancel, initialValues }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setImageUrl(initialValues.topicImage || null);
    } else {
      form.resetFields();
      setImageUrl(null);
    }
  }, [initialValues, form]);

  const handleUpload = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.secure_url) {
        setImageUrl(data.secure_url);
        message.success("Tải ảnh lên thành công!");
      }
    } catch (error) {
      message.error("Tải ảnh lên thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const processedValues = {
          ...values,
          topicDescription:
            values.topicDescription?.trim() === ""
              ? null
              : values.topicDescription,
          topicImage: imageUrl,
        };

        onSubmit(processedValues);
        form.resetFields();
        setImageUrl(null);
      })
      .catch((info) => console.log("Validate Failed:", info));
  };

  return (
    <Modal
      title={initialValues ? "Chỉnh sửa Chủ Đề" : "Thêm Chủ Đề"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
    >
      <StyledForm form={form} layout="vertical">
        <Form.Item
          label="Tên chủ đề"
          name="topicName"
          rules={[{ required: true, message: "Vui lòng nhập tên chủ đề!" }]}
        >
          <Input placeholder="Nhập tên chủ đề" />
        </Form.Item>
        <Form.Item
          label="Tên chủ đề tiếng Việt"
          name="topicVietnamese"
          rules={[{ required: true, message: "Vui lòng nhập tên chủ đề!" }]}
        >
          <Input placeholder="Nhập tên chủ đề" />
        </Form.Item>

        <Form.Item label="Mô tả chủ đề" name="topicDescription">
          <StyledTextArea
            rows={4}
            placeholder="Nhập mô tả chi tiết về chủ đề"
          />
        </Form.Item>

        <Form.Item label="Hình ảnh chủ đề">
          <Upload.Dragger
            showUploadList={false}
            beforeUpload={(file) => {
              handleUpload(file);
              return false;
            }}
            disabled={loading}
          >
            {imageUrl ? (
              <StyledAvatar src={imageUrl} alt="Ảnh chủ đề" />
            ) : (
              <UploadBox>
                <PlusOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                <p>Nhấn hoặc kéo thả để tải ảnh</p>
              </UploadBox>
            )}
          </Upload.Dragger>
        </Form.Item>

        <Form.Item label="Video chủ đề" name="topicVideo">
          <StyledInput placeholder="Dán URL video vào đây" />
        </Form.Item>

        <Button
          type="primary"
          onClick={handleSubmit}
          style={{ marginRight: 10 }}
        >
          {initialValues ? "Cập nhật" : "Tạo"}
        </Button>
        <Button onClick={onCancel}>Hủy</Button>
      </StyledForm>
    </Modal>
  );
};

export default AddTopicForm;

const StyledForm = styled(Form)`
  max-width: 500px;
  margin: auto;
  .ant-form-item-label {
    font-weight: bold;
  }
`;

const StyledTextArea = styled(Input.TextArea)`
  font-size: 16px;
  padding: 10px;
`;

const StyledInput = styled(Input)`
  font-size: 16px;
  padding: 8px;
`;

const StyledAvatar = styled(Avatar)`
  width: 100%;
  height: 180px;
  border-radius: 10px;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const UploadBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;
  border: 2px dashed #1890ff;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  background: #f9f9f9;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #e6f7ff;
    border-color: #40a9ff;
  }
`;
