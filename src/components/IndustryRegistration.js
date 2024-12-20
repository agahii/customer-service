// src/components/IndustryRegistration.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Modal, Form, Input, message } from "antd";
import {
  addIndustryRegistration,
  fetchIndustry,
  updateIndustryRegistration,
  deleteIndustryRegistration,
} from "../store/reducers/IndustryRegistration/IndustryRegistrationAction";

const IndustryRegistration = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { entities, loading, error, total } = useSelector(
    (state) => state.industryRegistration
  );

  // Simplified pagingInfo without filter, group, sort
  const [pagingInfo, setPagingInfo] = useState({
    skip: 0,
    take: 10,
  });

  const showAddModal = () => {
    form.resetFields();
    setSelectedRecord(null);
    setIsEditing(false);
    setIsModalVisible(true);
  };

  const handleSubmit = (values) => {
    const payload = { industryType: values.industryName };

    if (isEditing && selectedRecord) {
      const updatedPayload = { ...payload, id: selectedRecord.id };
      dispatch(updateIndustryRegistration(updatedPayload))
        .unwrap()
        .then(() => {
          message.success("Industry updated successfully.");
        })
        .catch((err) => {
          // Removed error message to align with Customer Registration
          console.error(`Update failed: ${err.reasonPhrase || err}`);
        });
    } else {
      dispatch(addIndustryRegistration(payload))
        .unwrap()
        .then(() => {
          message.success("Industry added successfully.");
        })
        .catch((err) => {
          // Removed error message to align with Customer Registration
          console.error(`Addition failed: ${err.reasonPhrase || err}`);
        });
    }

    setIsModalVisible(false);
    form.resetFields();
    setSelectedRecord(null);
    setIsEditing(false);
  };

  useEffect(() => {
    const controller = new AbortController();
    dispatch(fetchIndustry({ pagingInfo, controller }))
      .unwrap()
      .catch((err) => {
        // Removed error message to align with Customer Registration
        console.error(`Fetching industries failed: ${err.reasonPhrase || err}`);
      });
    return () => controller.abort();
  }, [dispatch, pagingInfo]);

  useEffect(() => {
    if (error) {
      // Removed error message to align with Customer Registration
      console.error(`Error: ${error.reasonPhrase || error}`);
    }
  }, [error]);

  const handleTableChange = (pagination) => {
    setPagingInfo((prev) => ({
      ...prev,
      skip: (pagination.current - 1) * pagination.pageSize,
      take: pagination.pageSize,
    }));
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsEditing(true);
    form.setFieldsValue({ industryName: record.industryType });
    setIsModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this industry?",
      content: `Industry Name: ${record.industryType}`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        dispatch(deleteIndustryRegistration(record.id))
          .unwrap()
          .then(() => {
            message.success("Industry deleted successfully.");
          })
          .catch((err) => {
            // Removed error message to align with Customer Registration
            console.error(`Deletion failed: ${err.reasonPhrase || err}`);
          });
      },
    });
  };

  const columns = [
    {
      title: "Industry Name",
      dataIndex: "industryType",
      key: "industryType",
      width: "60%",
    },
    {
      title: "Actions",
      key: "actions",
      width: "40%",
      render: (text, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ textAlign: "center", color: "#333", fontWeight: "bold" }}>
        Industry Registration
      </h1>

      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <Button type="primary" onClick={showAddModal}>
          Add New Record
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={entities}
        rowKey={(record) => record.id}
        loading={loading}
        pagination={{
          total,
          pageSize: pagingInfo.take,
          current: Math.floor(pagingInfo.skip / pagingInfo.take) + 1,
        }}
        bordered
        onChange={handleTableChange}
      />

      <Modal
        title={isEditing ? "Edit Industry" : "Add New Industry"}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setIsEditing(false);
          setSelectedRecord(null);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Industry Name"
            name="industryName"
            rules={[
              { required: true, message: "Please enter the industry name" },
            ]}
          >
            <Input placeholder="Enter industry name" />
          </Form.Item>
          <Form.Item style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditing ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default IndustryRegistration;
