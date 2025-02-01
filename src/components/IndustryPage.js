import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Modal, Form, Input, Upload, Switch } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import {
  fetchIndustries,
  addIndustry,
  updateIndustry,
  deleteIndustry,
  downloadIndustries,
} from "../store/reducers/Industries/IndustriesSlice";

const IndustryPage = () => {
  const dispatch = useDispatch();
  const { industries, status } = useSelector((state) => state.industry);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchIndustries({ take: 10, skip: 0 }));
  }, [dispatch]);

  const showModal = (industry = null) => {
    setEditingIndustry(industry);
    setIsModalVisible(true);
    form.setFieldsValue(industry || { industryType: "", isActive: true });
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingIndustry) {
        dispatch(updateIndustry({ id: editingIndustry.id, data: values }));
      } else {
        console.log(values.values)
        dispatch(addIndustry(values.values));
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleDelete = (id) => {
    dispatch(deleteIndustry(id));
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Industry Type", dataIndex: "industryType", key: "industryType" },
    { title: "Image URL", dataIndex: "imageUrl", key: "imageUrl", render: (url) => <img src={url} alt="Industry" width={50} /> },
    { title: "Active", dataIndex: "isActive", key: "isActive", render: (active) => (active ? "Yes" : "No") },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button onClick={() => showModal(record)}>Edit</Button>
          <Button onClick={() => handleDelete(record.id)} danger>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => showModal()} icon={<PlusOutlined />}>Add Industry</Button>
      <Button onClick={() => dispatch(downloadIndustries())} style={{ marginLeft: 10 }}>Download Excel</Button>
      <Table dataSource={industries} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      <Modal title={editingIndustry ? "Edit Industry" : "Add Industry"} visible={isModalVisible} onOk={handleOk} onCancel={() => setIsModalVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="industryType" label="Industry Type" rules={[{ required: true, message: "Please enter industry type" }]}> <Input /> </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked"> <Switch /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default IndustryPage;
