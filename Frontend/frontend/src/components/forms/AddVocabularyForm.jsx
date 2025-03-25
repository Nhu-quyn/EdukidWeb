import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  message,
  Upload,
  Typography,
} from "antd";
import {
  UploadOutlined,
  LoadingOutlined,
  PictureOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { Text } = Typography;

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/drzjvhpwi/image/upload";
const UPLOAD_PRESET = "Your_cloud_image";

const DEFAULT_IMAGE = "https://via.placeholder.com/200x150?text=No+Image"; // Ảnh mặc định

const AddVocabularyForm = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  topics,
}) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(
    initialValues?.vocabularyImage || DEFAULT_IMAGE
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        topicId: initialValues.topicId?._id || initialValues.topicId,
      });
      setImageUrl(initialValues.vocabularyImage || DEFAULT_IMAGE);
    } else {
      form.resetFields();
      setImageUrl(DEFAULT_IMAGE);
    }
  }, [initialValues, form]);

  const handleFinish = (values) => {
    if (!values.vocabulary || !values.meaning || !values.topicId || !imageUrl) {
      message.error("Vui lòng nhập đầy đủ thông tin và tải ảnh lên!");
      return;
    }
    onSubmit({ ...values, vocabularyImage: imageUrl });
  };

  const handleUpload = async ({ file }) => {
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

  return (
    <Modal
      title={initialValues ? "Chỉnh sửa từ vựng" : "Thêm từ vựng mới"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="vocabulary"
          label="Từ vựng"
          rules={[{ required: true }]}
        >
          <Input placeholder="Nhập từ vựng" />
        </Form.Item>

        <Form.Item name="meaning" label="Ý nghĩa" rules={[{ required: true }]}>
          <Input placeholder="Nhập ý nghĩa" />
        </Form.Item>

        <Form.Item
          name="partOfSpeech"
          label="Từ loại"
          rules={[{ required: true }]}
        >
          <Input placeholder="Danh từ, động từ, tính từ..." />
        </Form.Item>

        <Form.Item
          name="vocabularyIpa"
          label="Phiên âm IPA"
          rules={[{ required: true }]}
        >
          <Input placeholder="Nhập phiên âm IPA" />
        </Form.Item>

        <Form.Item name="topicId" label="Chủ đề" rules={[{ required: true }]}>
          <Select placeholder="Chọn chủ đề">
            {topics?.map((topic) => (
              <Option key={topic._id} value={topic._id}>
                {topic.topicName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Ảnh minh họa">
          <div style={{ textAlign: "center", marginBottom: 10 }}>
            <img
              src={imageUrl}
              alt="Preview"
              style={{
                width: 200,
                height: 150,
                objectFit: "cover",
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            />
          </div>

          <Upload
            customRequest={handleUpload}
            showUploadList={false}
            accept="image/*"
          >
            <Button
              type="dashed"
              icon={loading ? <LoadingOutlined /> : <UploadOutlined />}
              disabled={loading}
              block
            >
              {loading ? "Đang tải lên..." : "Chọn ảnh từ thiết bị"}
            </Button>
          </Upload>

          <Text
            type="secondary"
            style={{
              fontSize: 12,
              display: "block",
              textAlign: "center",
              marginTop: 5,
            }}
          >
            (Ảnh sẽ hiển thị sau khi tải lên thành công)
          </Text>
        </Form.Item>

        <Form.Item style={{ textAlign: "center", marginTop: 20 }}>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            {initialValues ? "Cập nhật" : "Thêm mới"}
          </Button>
          <Button onClick={onCancel}>Hủy</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddVocabularyForm;
