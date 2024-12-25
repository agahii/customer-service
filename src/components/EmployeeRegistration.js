// src/components/EmployeeRegistration.jsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Modal, Form, Input, message, Row, Col } from "antd";
import {
  addEmployeeRegistration,
  fetchEmployee,
  updateEmployeeRegistration,
  deleteEmployeeRegistration,
} from "../store/reducers/EmployeeRegistration/EmployeeRegistrationAction";

const EmployeeRegistration = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { entities, loading, error, total } = useSelector(
    (state) => state.employeeRegistration
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
    const payload = {
      accountType: 1,
      employeeName: values.employeeName,
      employeeCode: values.employeeCode,
      employeeAddress: values.employeeAddress,
      mobileNumber: values.mobileNumber,
      contactPersonName: values.contactPersonName,
      emailAddress: values.emailAddress,
      webAddress: values.webAddress,
      imageUrl: values.imageUrl,
    };

    console.log("Submitting Payload:", payload); // Debugging

    if (isEditing && selectedRecord) {
      const updatedPayload = { ...payload, id: selectedRecord.id };
      console.log("Updating Employee with Payload:", updatedPayload); // Debugging
      dispatch(updateEmployeeRegistration(updatedPayload))
        .unwrap()
        .then(() => {
          message.success("Employee updated successfully.");
        })
        .catch((err) => {
          console.error("Update Error:", err);
        });
    } else {
      dispatch(addEmployeeRegistration(payload))
        .unwrap()
        .then(() => {
          message.success("Employee added successfully.");
        })
        .catch((err) => {
          console.error("Addition Error:", err);
        });
    }

    setIsModalVisible(false);
    form.resetFields();
    setSelectedRecord(null);
    setIsEditing(false);
  };

  useEffect(() => {
    const controller = new AbortController();
    dispatch(fetchEmployee({ pagingInfo, controller }))
      .unwrap()
      .then(() => {
        console.log("Fetch Employees Success");
      })
      .catch((err) => {
        console.error("Fetching Employees Error:", err);
      });
    return () => controller.abort();
  }, [dispatch, pagingInfo]);

  useEffect(() => {
    if (error) {
      console.error("Error:", error);
    }
  }, [error]);

  const handleTableChange = (pagination) => {
    console.log("Table Pagination Changed:", pagination);
    setPagingInfo((prev) => ({
      ...prev,
      skip: (pagination.current - 1) * pagination.pageSize,
      take: pagination.pageSize,
    }));
  };

  const handleEdit = (record) => {
    console.log("Editing Record:", record);
    setSelectedRecord(record);
    setIsEditing(true);
    form.setFieldsValue({
      employeeName: record.employeeName,
      employeeCode: record.employeeCode,
      employeeAddress: record.employeeAddress,
      mobileNumber: record.mobileNumber,
      contactPersonName: record.contactPersonName,
      emailAddress: record.emailAddress,
      webAddress: record.webAddress,
      imageUrl: record.imageUrl,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (record) => {
    console.log("Deleting Record:", record);
    Modal.confirm({
      title: "Are you sure you want to delete this employee?",
      content: `Employee Name: ${record.employeeName}`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        dispatch(deleteEmployeeRegistration(record.id))
          .unwrap()
          .then(() => {
            message.success("Employee deleted successfully.");
          })
          .catch((err) => {
            console.error("Deletion Error:", err);
          });
      },
    });
  };

  const columns = [
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      key: "employeeName",
      width: "20%",
    },
    {
      title: "Employee Code",
      dataIndex: "employeeCode",
      key: "employeeCode",
      width: "10%",
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      width: "15%",
    },
    {
      title: "Email Address",
      dataIndex: "emailAddress",
      key: "emailAddress",
      width: "20%",
    },
    {
      title: "Contact Person",
      dataIndex: "contactPersonName",
      key: "contactPersonName",
      width: "15%",
    },
    {
      title: "Actions",
      key: "actions",
      width: "20%",
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
    <div style={{ padding: "10px 20px" }}> {/* Reduced top and bottom padding from 20px to 10px 20px */}
      <h1
        style={{
          textAlign: "center",
          color: "#333",
          fontWeight: "bold",
          margin: "0 0 20px 0", // Removed top margin, added bottom margin
        }}
      >
        Employee Registration
      </h1>

      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <Button type="primary" onClick={showAddModal}>
          Add New Employee
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
        scroll={{ y: 400 }} 
      />

      <Modal
        title={isEditing ? "Edit Employee" : "Add New Employee"}
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Employee Name"
                name="employeeName"
                rules={[
                  { required: true, message: "Please enter the employee name" },
                ]}
              >
                <Input placeholder="Enter employee name" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Employee Code"
                name="employeeCode"
                rules={[
                  { required: true, message: "Please enter the employee code" },
                ]}
              >
                <Input placeholder="Enter employee code" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Employee Address"
                name="employeeAddress"
                rules={[
                  { required: true, message: "Please enter the employee address" },
                ]}
              >
                <Input placeholder="Enter employee address" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Mobile Number"
                name="mobileNumber"
                rules={[
                  { required: true, message: "Please enter your mobile number" },
                  {
                    pattern: /^\+?[1-9]\d{1,14}$/, // E.164 international format
                    message: "Invalid mobile number format",
                  },
                ]}
              >
                <Input placeholder="Enter mobile number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Contact Person Name"
                name="contactPersonName"
                rules={[
                  {
                    required: true,
                    message: "Please enter the contact person name",
                  },
                ]}
              >
                <Input placeholder="Enter contact person name" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Email Address"
                name="emailAddress"
                rules={[
                  { required: true, message: "Please enter your email address" },
                  { type: "email", message: "Please enter a valid email address" },
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Web Address"
                name="webAddress"
                rules={[{ required: false }]}
              >
                <Input placeholder="Enter web address" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Image URL"
                name="imageUrl"
                rules={[{ required: false }]}
              >
                <Input placeholder="Enter image URL" />
              </Form.Item>
            </Col>
          </Row>

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

export default EmployeeRegistration;
