import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Upload,
  message,
  InputNumber,
  Checkbox,
  Radio,
} from "antd";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";

const { Option } = Select;

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/drzjvhpwi/image/upload";
const UPLOAD_PRESET = "Your_cloud_image";
const DEFAULT_IMAGE = "https://via.placeholder.com/200x150?text=No+Image";

const requiredFields = {
  image_match: ["questionContent", "answer", "images"],

  //chỉnh sửa yêu cầu (sau đó xử lý lại bằng images => options )
  // image_match: ["questionContent", "answer", "options"],
  word_match: ["questionContent", "answer", "options", "image"],
  audio_record: ["questionContent", "answer"],
  listen_choose_word: ["questionContent", "answer", "options"],
  // listen_choose_image: ["questionContent", "answer", "options", "images"],
  listen_choose_image: ["questionContent", "answer", "images", "word"],
  word_select_sound: ["questionContent", "answer", "options"],

  fill_blank: ["questionContent", "answer"],
  sentence_text: ["questionContent", "answer"],
  translation: ["questionContent", "answer", "word"],
  translation_match: ["questionContent", "options", "answer"],
  image_write_word: ["questionContent", "image", "answer"],
  multiple_choice: ["questionContent", "options", "answer"],
  image_select_sound: ["questionContent", "image", "options", "answer"],
  listen_and_translate: ["questionContent", "word", "answer"],
};

const AddQuestionForm = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  questionTypes,
  topics,
  vocabularies,
}) => {
  const [form] = Form.useForm();
  const [imageUrls, setImageUrls] = useState([
    DEFAULT_IMAGE,
    DEFAULT_IMAGE,
    DEFAULT_IMAGE,
  ]);
  const [questionImage, setQuestionImage] = useState(DEFAULT_IMAGE);
  const [loading, setLoading] = useState(false);
  const [requiredFieldsForType, setRequiredFieldsForType] = useState([]);
  const [filteredVocabularies, setFilteredVocabularies] = useState([]);
  const [useVocabulary, setUseVocabulary] = useState(false);
  const [optionsList, setOptionsList] = useState(["", "", ""]); // Ít nhất có 2 ô nhập

  useEffect(() => {
    if (initialValues) {
      // Gán các giá trị cơ bản
      form.setFieldsValue({
        ...initialValues,
        questionTypeId: initialValues.questionTypeId?._id,
        topicId: initialValues.topicId?._id,
      });

      if (initialValues.vocabularyId) {
        setUseVocabulary(true);
      }

      handleTopicChange(initialValues.topicId?._id);
      const options = initialValues.options || [];

      // Hàm kiểm tra chuỗi là ảnh
      const isImage = (val) =>
        typeof val === "string" && val.match(/\.(jpeg|jpg|png|gif|webp)$/i);
      setQuestionImage(initialValues.image || DEFAULT_IMAGE);
      const allAreImages =
        options.length > 0 && options.every((opt) => isImage(opt));
      const allAreText =
        options.length > 0 &&
        options.every((opt) => typeof opt === "string" && !isImage(opt));

      // Trường hợp là option ảnh
      if (allAreImages) {
        setImageUrls([
          ...options,
          ...Array(3 - options.length).fill(DEFAULT_IMAGE),
        ]);
        setOptionsList([]); // xóa text nếu đang sửa từ ảnh
      }
      // Trường hợp là option chữ
      else if (allAreText) {
        setOptionsList([...options, ...Array(3 - options.length).fill("")]);
        setImageUrls([DEFAULT_IMAGE, DEFAULT_IMAGE, DEFAULT_IMAGE]);
      }
      // Nếu không xác định được dạng options
      else {
        setOptionsList(["", "", ""]);
        setImageUrls([DEFAULT_IMAGE, DEFAULT_IMAGE, DEFAULT_IMAGE]);
      }

      // Đảm bảo gọi sau khi set xong option/image
      if (initialValues.questionTypeId?._id) {
        handleQuestionTypeChange(initialValues.questionTypeId._id);
      }
    } else {
      form.resetFields();
      setOptionsList(["", "", ""]);
      setImageUrls([DEFAULT_IMAGE, DEFAULT_IMAGE, DEFAULT_IMAGE]);
    }
  }, [initialValues, form, requiredFieldsForType]);

  // useEffect(() => {
  //   if (initialValues) {
  //     form.setFieldsValue({
  //       ...initialValues,
  //       questionTypeId: initialValues.questionTypeId?._id, // Lấy _id nếu có
  //       topicId: initialValues.topicId._id,
  //     });
  //     if (initialValues.vocabularyId) {
  //       setUseVocabulary(true);
  //     }
  //     // console.log(initialValues.topicId);
  //     setImageUrls(
  //       initialValues.options || [DEFAULT_IMAGE, DEFAULT_IMAGE, DEFAULT_IMAGE]
  //     );

  //     // initialValues.questionTypeId = initialValues.questionTypeId._id;
  //     // console.log(initialValues.questionTypeId);
  //     handleQuestionTypeChange(initialValues.questionTypeId);
  //   } else {
  //     form.resetFields();
  //     setImageUrls([DEFAULT_IMAGE, DEFAULT_IMAGE, DEFAULT_IMAGE]);
  //   }
  //   if (requiredFieldsForType.includes("options") && optionsList.length === 0) {
  //     setOptionsList(["", "", ""]); // Thêm 2 ô nhập mặc định
  //   }
  // }, [initialValues, form, requiredFieldsForType]);
  const handleTopicChange = (topicId) => {
    console.log(topicId);
    const filtered = vocabularies.filter(
      (vocab) => vocab.topicId._id === topicId
    );
    console.log(vocabularies[0].topicId);

    setFilteredVocabularies(filtered);
    // form.setFieldsValue({ vocabularyId: undefined });
  };

  // Cập nhật lựa chọn khi nhập vào input
  const handleOptionChange = (index, value) => {
    const newOptions = [...optionsList];
    newOptions[index] = value;
    setOptionsList(newOptions);
  };
  const handleUseVocabularyChange = (e) => {
    setUseVocabulary(e.target.checked);
    if (!e.target.checked) {
      // form.setFieldsValue({ vocabularyId: undefined });
    }
  };

  const handleFinish = (values) => {
    console.log("Form Values:", values); // Kiểm tra có `answer` hay không

    if (!values.answer) {
      message.error("Bạn phải chọn một đáp án!");
      return;
    }
    // Lọc ảnh hợp lệ (khác DEFAULT_IMAGE)
    const validImages = imageUrls.filter((url) => url !== DEFAULT_IMAGE);

    // Loại bỏ các trường có giá trị rỗng hoặc undefined
    const cleanedValues = Object.fromEntries(
      Object.entries(values).filter(([_, v]) => v !== "" && v !== undefined)
    );

    // Nếu `questionImage` là mặc định, sử dụng `optionsList`

    // Chuẩn bị dữ liệu gửi đi
    const dataToSend = {
      ...cleanedValues,
      options: requiredFieldsForType.includes("images")
        ? validImages
        : optionsList,
      image: questionImage !== DEFAULT_IMAGE ? questionImage : undefined,
    };

    // console.log("++", dataToSend);
    onSubmit(dataToSend);

    // Reset form sau khi submit
    form.resetFields();
    setImageUrls([DEFAULT_IMAGE, DEFAULT_IMAGE, DEFAULT_IMAGE]);
    setOptionsList(["", "", ""]); // Giữ ít nhất 2 ô nhập
  };

  const handleQuestionTypeChange = (questionTypeId) => {
    const selectedType = questionTypes.find(
      (type) => type._id === questionTypeId
    );
    setRequiredFieldsForType(
      selectedType ? requiredFields[selectedType.questionTypeId] || [] : []
    );
  };

  // const handleFinish = (values) => {};

  const handleUpload = async ({ file }, index) => {
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
        const newImageUrls = [...imageUrls];
        newImageUrls[index] = data.secure_url;
        setImageUrls(newImageUrls);
        message.success("Tải ảnh lên thành công!");
      }
    } catch (error) {
      message.error("Tải ảnh lên thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setImageUrls([DEFAULT_IMAGE, DEFAULT_IMAGE, DEFAULT_IMAGE]);
    setOptionsList(["", "", ""]);
    setQuestionImage(DEFAULT_IMAGE);
    setUseVocabulary(false);
    setFilteredVocabularies([]);
    setRequiredFieldsForType([]);
    onCancel();
  };

  return (
    <Modal
      title={initialValues ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="questionTypeId"
          label="Loại câu hỏi"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Chọn loại câu hỏi"
            onChange={handleQuestionTypeChange}
          >
            {questionTypes?.map((type) => (
              <Option key={type._id} value={type._id}>
                {type.questionTypeName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Checkbox onChange={handleUseVocabularyChange}>Theo từ vựng</Checkbox>
        </Form.Item>
        <Form.Item name="topicId" label="Chủ đề">
          <Select
            placeholder="Chọn chủ đề"
            onChange={handleTopicChange}
            allowClear
          >
            {topics.map((topic) => (
              <Option key={topic._id} value={topic._id}>
                {topic.topicName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {useVocabulary && (
          <Form.Item
            name="vocabularyId"
            label="Từ vựng"
            optionLabelProp="label" // Đảm bảo hiển thị đúng label (tên từ vựng)
            rules={[{ required: true }]}
          >
            <Select showSearch placeholder="Chọn từ vựng">
              {filteredVocabularies.map((vocab) => (
                <Option key={vocab._id} value={vocab._id}>
                  {vocab.vocabulary}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {requiredFieldsForType.includes("questionContent") && (
          <Form.Item
            name="questionContent"
            label="Nội dung câu hỏi"
            rules={[{ required: true }]}
          >
            <Input.TextArea placeholder="Nhập nội dung câu hỏi" />
          </Form.Item>
        )}
        {requiredFieldsForType.includes("word") && (
          <Form.Item
            name="word"
            label="Nhập từ /cụm từ/ câu"
            rules={[{ required: true }]}
          >
            <Input.TextArea placeholder="Nhập từ/ cụm từ/ câu" />
          </Form.Item>
        )}
        {/* {requiredFieldsForType.includes("answer") &&
          !requiredFieldsForType.includes("images") &&
          !requiredFieldsForType.includes("options") && (
            <Form.Item
              name="answer"
              label="Đáp án đúng"
              rules={[{ required: true }]}
            >
              <Input placeholder="Nhập đáp án đúng" />
            </Form.Item>
          )} */}

        {/* {requiredFieldsForType.includes("options") && (
          <>
            {optionsList.map((option, index) => (
              <Form.Item
                key={index}
                label={`Lựa chọn ${index + 1}`}
                rules={[{ required: true, message: "Vui lòng nhập lựa chọn!" }]}
              >
                <Input
                  placeholder={`Nhập lựa chọn ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
              </Form.Item>
            ))}
          </>
        )}
        {requiredFieldsForType.includes("image") && (
          <Form.Item label="Tải ảnh câu hỏi" name="questionImage">
            <Upload
              listType="picture-card"
              showUploadList={false}
              beforeUpload={() => false} // Không upload ngay, chỉ cập nhật state
              onChange={(info) => {
                const file = info.file;
                const reader = new FileReader();
                reader.onload = () => {
                  setQuestionImage(reader.result); // Lưu ảnh vào biến questionImage
                };
                reader.readAsDataURL(file);
              }}
            >
              {questionImage && questionImage !== DEFAULT_IMAGE ? (
                <img
                  src={questionImage}
                  alt="Hình ảnh"
                  style={{ width: "100%" }}
                />
              ) : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        )}

        {requiredFieldsForType.includes("images") && (
          <Form.Item label="Ảnh minh họa">
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              {imageUrls.map((url, index) => (
                <div
                  key={index}
                  style={{
                    width: 120,
                    height: 120,
                    position: "relative",
                    borderRadius: 8,
                    overflow: "hidden",
                    border: "1px solid #ddd",
                  }}
                >
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <Upload
                    customRequest={(options) => handleUpload(options, index)} // Liên kết hàm tải lên với index của ảnh
                    showUploadList={false}
                    accept="image/*"
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0, 0, 0, 0.4)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#fff",
                        fontSize: 14,
                        cursor: "pointer",
                        opacity: 0,
                        transition: "opacity 0.3s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
                    >
                      {loading ? <LoadingOutlined /> : <UploadOutlined />}
                      <span style={{ marginLeft: 5 }}>Tải lên</span>
                    </div>
                  </Upload>
                </div>
              ))}
            </div>
          </Form.Item>
        )} */}
        {requiredFieldsForType.includes("options") && (
          <>
            {optionsList.map((option, index) => (
              <Form.Item
                key={index}
                label={`Lựa chọn ${index + 1}`}
                rules={[{ required: true, message: "Vui lòng nhập lựa chọn!" }]}
              >
                <Input
                  placeholder={`Nhập lựa chọn ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
              </Form.Item>
            ))}
          </>
        )}

        {requiredFieldsForType.includes("image") && (
          <Form.Item label="Tải ảnh câu hỏi" name="questionImage">
            <Upload
              listType="picture-card"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={(info) => {
                const file = info.file;
                const reader = new FileReader();
                reader.onload = () => {
                  setQuestionImage(reader.result);
                };
                reader.readAsDataURL(file);
              }}
            >
              {questionImage ? (
                <img
                  src={questionImage}
                  alt="Hình ảnh"
                  style={{ width: "100%" }}
                />
              ) : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        )}

        {requiredFieldsForType.includes("images") && (
          <Form.Item label="Ảnh minh họa">
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              {imageUrls.map((url, index) => (
                <div
                  key={index}
                  style={{
                    width: 120,
                    height: 120,
                    position: "relative",
                    borderRadius: 8,
                    overflow: "hidden",
                    border: "1px solid #ddd",
                  }}
                >
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <Upload
                    customRequest={(options) => handleUpload(options, index)}
                    showUploadList={false}
                    accept="image/*"
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0, 0, 0, 0.4)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#fff",
                        fontSize: 14,
                        cursor: "pointer",
                        opacity: 0,
                        transition: "opacity 0.3s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
                    >
                      {loading ? <LoadingOutlined /> : <UploadOutlined />}
                      <span style={{ marginLeft: 5 }}>Tải lên</span>
                    </div>
                  </Upload>
                </div>
              ))}
            </div>
          </Form.Item>
        )}

        {/* <Form.Item
          name="answer"
          label="Chọn đáp án đúng"
          rules={[{ required: true, message: "Vui lòng chọn đáp án!" }]}
        >
          <Radio.Group
            onChange={(e) => form.setFieldsValue({ answer: e.target.value })}
          >
            {imageUrls.some((url) => url !== DEFAULT_IMAGE)
              ? imageUrls
                  .filter((url) => url !== DEFAULT_IMAGE)
                  .map((url, index) => (
                    <Radio key={index} value={url}>
                      <img
                        src={url}
                        alt={`Ảnh ${index + 1}`}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: 5,
                        }}
                      />
                    </Radio>
                  ))
              : optionsList
                  .filter((opt) => opt.trim() !== "")
                  .map((opt, index) => (
                    <Radio key={index} value={opt.trim()}>
                      {opt.trim()}
                    </Radio>
                  ))}
          </Radio.Group>
        </Form.Item> */}
        {/* <Form.Item
          name="answer"
          label="Chọn đáp án đúng"
          rules={[{ required: true, message: "Vui lòng chọn đáp án!" }]}
        >
          {imageUrls.some((url) => url !== DEFAULT_IMAGE) ||
          optionsList.some((opt) => opt.trim() !== "") ? (
            <Radio.Group
              onChange={(e) => form.setFieldsValue({ answer: e.target.value })}
            >
              {imageUrls.some((url) => url !== DEFAULT_IMAGE) &&
                imageUrls
                  .filter((url) => url !== DEFAULT_IMAGE)
                  .map((url, index) => (
                    <Radio key={`image-${index}`} value={url}>
                      <img
                        src={url}
                        alt={`Ảnh ${index + 1}`}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: 5,
                        }}
                      />
                    </Radio>
                  ))}

              {optionsList.some((opt) => opt.trim() !== "") &&
                optionsList
                  .filter((opt) => opt.trim() !== "")
                  .map((opt, index) => (
                    <Radio key={`option-${index}`} value={opt.trim()}>
                      {opt.trim()}
                    </Radio>
                  ))}
            </Radio.Group>
          ) : (
            <Input
              placeholder="Nhập đáp án"
              onChange={(e) => form.setFieldsValue({ answer: e.target.value })}
            />
          )}
        </Form.Item> */}
        <Form.Item
          name="answer"
          label="Chọn đáp án đúng"
          rules={[{ required: true, message: "Vui lòng chọn đáp án!" }]}
        >
          {imageUrls.some((url) => url !== DEFAULT_IMAGE) ? (
            // Nếu có ảnh hợp lệ, hiển thị các ảnh trong Radio.Group
            <Radio.Group
              onChange={(e) => form.setFieldsValue({ answer: e.target.value })}
            >
              {imageUrls
                .filter((url) => url !== DEFAULT_IMAGE)
                .map((url, index) => (
                  <Radio key={`image-${index}`} value={url}>
                    <img
                      src={url}
                      alt={`Ảnh ${index + 1}`}
                      style={{
                        width: 50,
                        height: 50,
                        objectFit: "cover",
                        borderRadius: 5,
                      }}
                    />
                  </Radio>
                ))}
            </Radio.Group>
          ) : optionsList.some((opt) => opt.trim() !== "") ? (
            // Nếu không có ảnh hợp lệ, hiển thị các lựa chọn
            <Radio.Group
              onChange={(e) => form.setFieldsValue({ answer: e.target.value })}
            >
              {optionsList
                .filter((opt) => opt.trim() !== "")
                .map((opt, index) => (
                  <Radio key={`option-${index}`} value={opt.trim()}>
                    {opt.trim()}
                  </Radio>
                ))}
            </Radio.Group>
          ) : (
            // Nếu không có ảnh và không có lựa chọn, hiển thị input
            <Input
              placeholder="Nhập đáp án"
              onChange={(e) => form.setFieldsValue({ answer: e.target.value })}
            />
          )}
        </Form.Item>

        <Form.Item name="score" label="Điểm số" rules={[{ required: true }]}>
          <InputNumber min={1} max={100} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="questionLevel"
          label="Mức độ câu hỏi"
          rules={[{ required: true }]}
        >
          <Select placeholder="Chọn mức độ">
            <Option value="easy">Dễ</Option>
            <Option value="medium">Trung bình</Option>
            <Option value="hard">Khó</Option>
          </Select>
        </Form.Item>

        <Form.Item
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 20,
          }}
        >
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            {initialValues ? "Cập nhật" : "Thêm mới"}
          </Button>
          <Button onClick={onCancel}>Hủy</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddQuestionForm;
