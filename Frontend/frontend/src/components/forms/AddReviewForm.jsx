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
  questionTypes = [],
}) => {
  const [form] = Form.useForm();
  // const [isTestMode, setIsTestMode] = useState(false);
  const [isTestMode, setIsTestMode] = useState(
    initialValues?.categoryId?.categoryName === "test"
  );
  const [isGame, setIsGame] = useState(false);

  const [filteredQuestions, setFilteredQuestions] = useState(questions); // Lưu câu hỏi đã lọc
  const [selectedTopic, setSelectedTopic] = useState(null); // Lưu chủ đề đã chọn
  const [selectedQuestionType, setSelectedQuestionType] = useState(null);
  useEffect(() => {
    if (initialValues) {
      if (initialValues?.categoryId?.categoryName) {
        setIsTestMode(initialValues.categoryId.categoryName === "test");
      }
      const activityName = initialValues?.activityName;
      setIsGame(activityName === "Trò chơi");
      console.log(activityName);
    } else {
      form.resetFields();
      setIsTestMode(false);
    }

    // console.log(initialValues?.categoryId?.categoryName);
  }, [initialValues]);

  const excludeTypes = [
    "listen_choose_word",
    "listen_choose_image",
    "image_match",
  ];
  const includeGameTypes = [
    "listen_choose_word",
    "listen_choose_image",
    "image_match",
    "word_match",
    "audio_record",
  ];
  useEffect(() => {
    const activityName = form.getFieldValue("activityName");
    setIsGame(activityName === "Trò chơi");
    console.log(activityName);
  }, [form.getFieldValue("activityName")]);

  useEffect(() => {
    // const filtered = questions.filter((question) => {
    //   const questionType = question.questionTypeId?.questionTypeId;
    //   const topicId = question.topicId?._id;
    //   const questionTypeId = question.questionTypeId?._id;

    //   const isAllowedType = !excludeTypes.includes(questionType);
    //   const matchesSelectedTopic = !selectedTopic || topicId === selectedTopic;
    //   const matchesSelectedQuestionType =
    //     !selectedQuestionType || questionTypeId === selectedQuestionType;
    const filtered = questions.filter((question) => {
      const questionType = question.questionTypeId?.questionTypeId;
      const topicId = question.topicId?._id;
      const questionTypeId = question.questionTypeId?._id;

      const matchesSelectedTopic = !selectedTopic || topicId === selectedTopic;
      const matchesSelectedQuestionType =
        !selectedQuestionType || questionTypeId === selectedQuestionType;

      const isAllowedType = isGame
        ? includeGameTypes.includes(questionType)
        : !excludeTypes.includes(questionType);
      return (
        isAllowedType && matchesSelectedTopic && matchesSelectedQuestionType
      );
    });

    setFilteredQuestions(filtered);
  }, [questions, selectedTopic, selectedQuestionType, isGame]);

  //chưa hoàn thiện bộ lọc câu hỏi theo chủ đề
  useEffect(() => {
    if (!initialValues || Object.keys(initialValues).length === 0) return;
    if (initialValues?.activityName === "Trò chơi") {
      form.setFieldsValue({
        ...initialValues,
        questions: initialValues?.questionId,
      });
    } else {
      form.setFieldsValue({
        ...initialValues,
        mode: initialValues?.mode || "review", // Mặc định là "review"
        activityLevel: initialValues?.activityLevel || "easy",
        questions: initialValues?.questionId,
      });
    }
  }, [initialValues, form]);

  // const handleFinish = (values) => {
  //   // onSubmit({ ...values, mode: isTestMode ? "test" : "review" });
  //   // form.resetFields();
  //   const payload = {
  //     ...values,
  //     mode: isTestMode ? "test" : "review",
  //     questionId: values.questions, // đưa về đúng tên field API cần
  //   };

  //   onSubmit(payload);
  //   form.resetFields();
  // };
  const handleFinish = (values) => {
    const isGame = values.activityName === "Trò chơi";

    const payload = {
      ...values,
      ...(isGame ? {} : { mode: isTestMode ? "test" : "review" }),
      questionId: values.questions,
    };

    onSubmit(payload);
    // console.log(payload);
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
        {!isGame && (
          <Form.Item label="Chế độ">
            <Switch
              checked={isTestMode}
              onChange={() => setIsTestMode(!isTestMode)}
              checkedChildren="Kiểm tra"
              unCheckedChildren="Ôn tập"
            />
          </Form.Item>
        )}

        {/* <Row gutter={16}>
          <Col span={12}> */}
        {!isGame && (
          <Form.Item
            name="activityId"
            label="Mã hoạt động"
            rules={[{ required: true, message: "Vui lòng nhập mã hoạt động!" }]}
          >
            <Input placeholder="Nhập mã hoạt động" />
          </Form.Item>
        )}
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
        {!isGame && (
          <Form.Item name="activityDescription" label="Mô tả hoạt động">
            <Input.TextArea
              placeholder="Nhập mô tả"
              autoSize={{ minRows: 2, maxRows: 4 }}
            />
          </Form.Item>
        )}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="topic" label="Chủ đề">
              <Select
                placeholder="Chọn chủ đề"
                allowClear
                onChange={(value) => setSelectedTopic(value)}
              >
                {topics.map((topic) => (
                  <Option key={topic._id} value={topic._id}>
                    {topic.topicName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="questionType" label="Loại câu hỏi">
              <Select
                placeholder="Chọn loại câu hỏi"
                allowClear
                onChange={(value) => setSelectedQuestionType(value)}
              >
                {questionTypes.map((questionType) => (
                  <Option key={questionType._id} value={questionType._id}>
                    {questionType.questionTypeId}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="questions" label="Danh sách câu hỏi">
              <Select mode="multiple" placeholder="Chọn câu hỏi" showSearch>
                {filteredQuestions.map((question) => (
                  <Option key={question._id} value={question._id}>
                    {question.questionContent}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Mức độ hoạt động */}
        {!isGame && (
          <Form.Item
            name="activityLevel"
            label="Mức độ hoạt động"
            rules={[{ required: true, message: "Vui lòng chọn mức độ!" }]}
          >
            <Select placeholder="Chọn mức độ">
              <Option value="easy">Dễ</Option>
              <Option value="normal">Trung bình</Option>
              <Option value="hard">Khó</Option>
            </Select>
          </Form.Item>
        )}

        <Form.Item
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 20,
          }}
        >
          <Button type="primary" htmlType="submit">
            {initialValues?._id ? "Cập nhật" : "Thêm mới"}
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
