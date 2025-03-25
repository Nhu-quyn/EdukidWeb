import React, { useState } from "react";
import { Input, Button, Form, Select, Card } from "antd";

const AddDataPage = () => {
  const [form] = Form.useForm();
  const { Option } = Select;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Thêm Dữ Liệu
        </h2>
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input
              placeholder="Nhập tên..."
              className="rounded-lg p-2 border border-gray-300"
            />
          </Form.Item>

          <Form.Item label="Loại" name="type" rules={[{ required: true }]}>
            <Select placeholder="Chọn loại" className="rounded-lg p-2">
              <Option value="A">Loại A</Option>
              <Option value="B">Loại B</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea
              rows={3}
              placeholder="Nhập mô tả..."
              className="rounded-lg p-2 border border-gray-300"
            />
          </Form.Item>

          <div className="flex justify-between gap-4">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold p-2 rounded-lg"
            >
              Lưu
            </Button>
            <Button
              htmlType="reset"
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold p-2 rounded-lg"
            >
              Hủy
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AddDataPage;
