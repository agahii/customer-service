import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table, Modal, Form, Input, Select, message } from "antd";
import {
  fetchCustomers,
  addCustomerRegistration,
  updateCustomerRegistration,
  deleteCustomerRegistration,
} from "../store/reducers/CustomerRegistration/CustomerRegistrationAction";

const { Option } = Select;

const CustomerRegistration = () => {
  const dispatch = useDispatch();

  const { customers, loading, error } = useSelector(
    (state) => state.customerRegistration
  );

  // State for modals
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [form] = Form.useForm();

  // Fetch customers on component mount
  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(`Error: ${error}`);
    }
  }, [error]);

  // Show Add/Edit Modal
  const showAddModal = () => {
    form.resetFields();
    setIsEditing(false);
    setSelectedRecord(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsEditing(true);
    form.setFieldsValue({
      customerName: record.customerName,
      emailAddress: record.emailAddress,
      projects: record.customerProject || [],
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this customer?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        dispatch(deleteCustomerRegistration(id)).then(() => {
          message.success("Customer deleted successfully");
        });
      },
    });
  };

  const handleSubmit = (values) => {
    const payload = {
      customerName: values.customerName,
      emailAddress: values.emailAddress,
      customerProject: values.projects?.map((project) => ({
        projectName: project.projectName,
        fK_Employee_ID: project.agentId,
      })),
    };

    if (isEditing && selectedRecord) {
      const updatedPayload = { ...payload, id: selectedRecord.id };
      dispatch(updateCustomerRegistration(updatedPayload))
        .then(() => message.success("Customer updated successfully"))
        .catch(() => message.error("Failed to update customer"));
    } else {
      dispatch(addCustomerRegistration(payload))
        .then(() => message.success("Customer added successfully"))
        .catch(() => message.error("Failed to add customer"));
    }

    setIsModalVisible(false);
    form.resetFields();
  };

  // Table columns (Customer Code removed)
  const columns = [
    { title: "Customer Name", dataIndex: "customerName", key: "customerName" },
    { title: "Email", dataIndex: "emailAddress", key: "emailAddress" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Customer Registration</h1>
      <Button type="primary" onClick={showAddModal} style={{ marginBottom: "20px" }}>
        Add New Customer
      </Button>

      <Table
        dataSource={customers}
        columns={columns}
        rowKey="id"
        loading={loading}
        bordered
      />

      <Modal
        title={isEditing ? "Edit Customer" : "Add New Customer"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Customer Name"
            name="customerName"
            rules={[{ required: true, message: "Please enter the customer name" }]}
          >
            <Input placeholder="Enter customer name" />
          </Form.Item>

          <Form.Item
            label="Email Address"
            name="emailAddress"
            rules={[
              { required: true, message: "Please enter the email address" },
              { type: "email", message: "Enter a valid email address" },
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          <Form.List name="projects">
            {(fields, { add, remove }) => (
              <>
                <h3>Projects</h3>
                {fields.map(({ key, name, ...restField }) => (
                  <div
                    key={key}
                    style={{
                      border: "1px solid #ddd",
                      padding: "16px",
                      marginBottom: "16px",
                      position: "relative",
                    }}
                  >
                    <Form.Item
                      {...restField}
                      label="Project Name"
                      name={[name, "projectName"]}
                      rules={[
                        { required: true, message: "Please enter project name" },
                      ]}
                    >
                      <Input placeholder="Enter project name" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      label="Assigned Agent ID"
                      name={[name, "agentId"]}
                      rules={[
                        { required: true, message: "Please enter agent ID" },
                      ]}
                    >
                      <Input placeholder="Enter agent ID" />
                    </Form.Item>

                    <Button
                      type="danger"
                      onClick={() => remove(name)}
                      style={{ position: "absolute", top: 0, right: 0 }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    + Add Project
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit">
              {isEditing ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerRegistration;
