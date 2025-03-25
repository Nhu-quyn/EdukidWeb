import React, { useEffect, useState } from "react";
import { Form, Input, Button, Modal, Select, Switch, Row, Col } from "antd";

const { Option } = Select;

const AddActivityForm = ({
  visible,
  onCancel,
  onSubmit,
  initialValues = {},
  topics = [],
  questions = [],
}) => {
  const [form] = Form.useForm();
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    if (!initialValues || Object.keys(initialValues).length === 0) return;
    form.setFieldsValue({
      ...initialValues,
      mode: initialValues?.mode || "review", // Mặc định là "review" nếu chưa có mode
      activityLevel: initialValues?.activityLevel || "easy",
    });
  }, [initialValues, form]);

  const handleFinish = (values) => {
    onSubmit({ ...values, mode: isTestMode ? "test" : "review" });
    form.resetFields();
  };

  return (
    <Modal
      title={initialValues?._id ? "Chỉnh sửa hoạt động" : "Thêm hoạt động mới"}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        {/* Chế độ */}
        <Form.Item label="Chế độ">
          <Switch
            checked={isTestMode}
            onChange={() => setIsTestMode(!isTestMode)}
            checkedChildren="Kiểm tra"
            unCheckedChildren="Ôn tập"
          />
        </Form.Item>

        {/* <Row gutter={16}>
          <Col span={12}> */}
        <Form.Item
          name="activityId"
          label="Mã hoạt động"
          rules={[{ required: true, message: "Vui lòng nhập mã hoạt động!" }]}
        >
          <Input placeholder="Nhập mã hoạt động" />
        </Form.Item>
        {/* </Col> */}
        {/* <Col span={12}> */}
        <Form.Item
          name="activityName"
          label="Tên hoạt động"
          rules={[{ required: true, message: "Vui lòng nhập tên hoạt động!" }]}
        >
          <Input placeholder="Nhập tên hoạt động" />
        </Form.Item>
        {/* </Col>
        </Row> */}

        {isTestMode && (
          <Form.Item
            name="testTime"
            label="Thời gian kiểm tra (phút)"
            rules={[
              { required: true, message: "Vui lòng nhập thời gian kiểm tra!" },
            ]}
          >
            <Input type="number" placeholder="Nhập thời gian kiểm tra" />
          </Form.Item>
        )}
        <Form.Item name="activityDescription" label="Mô tả hoạt động">
          <Input.TextArea
            placeholder="Nhập mô tả"
            autoSize={{ minRows: 2, maxRows: 4 }}
          />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="topic" label="Chủ đề">
              <Select placeholder="Chọn chủ đề" allowClear>
                {topics.map((topic) => (
                  <Option key={topic._id} value={topic._id}>
                    {topic.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="questions" label="Danh sách câu hỏi">
              <Select mode="multiple" placeholder="Chọn câu hỏi" showSearch>
                {questions.map((question) => (
                  <Option key={question._id} value={question._id}>
                    {question.content}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Mức độ hoạt động */}
        <Form.Item
          name="activityLevel"
          label="Mức độ hoạt động"
          rules={[{ required: true, message: "Vui lòng chọn mức độ!" }]}
        >
          <Select placeholder="Chọn mức độ">
            <Option value="easy">Dễ</Option>
            <Option value="normal">Bình thường</Option>
            <Option value="hard">Khó</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {initialValues?._id ? "Cập nhật" : "Thêm"}
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={onCancel}>
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddActivityForm;
