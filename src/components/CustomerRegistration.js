import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table, Modal, Form, Input, message } from "antd";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";
import {
  fetchCustomers,
  addCustomerRegistration,
  updateCustomerRegistration,
  deleteCustomerRegistration,
} from "../store/reducers/CustomerRegistration/CustomerRegistrationAction";

const CustomerRegistration = () => {
  const dispatch = useDispatch();
  const { customers, loading, error } = useSelector((state) => state.customerRegistration);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();

  const [mobileNumber, setMobileNumber] = useState("");

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (error) message.error(`Error: ${error}`);
  }, [error]);

  const showAddModal = () => {
    form.resetFields();
    setMobileNumber("");
    setIsEditing(false);
    setSelectedRecord(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsEditing(true);
    setMobileNumber(record.mobileNumber || "");
    form.setFieldsValue({
      ...record,
      projects: record.customerProjectInp || [],
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteCustomerRegistration(id))
      .then(() => message.success("Customer deleted successfully"))
      .catch(() => message.error("Failed to delete customer"));
  };

  const handleSubmit = (values) => {
    const payload = {
      fK_Industry_ID: values.fK_Industry_ID,
      customerName: values.customerName,
      customerCode: values.customerCode,
      customerAddress: values.customerAddress,
      mobileNumber: mobileNumber,
      contactPersonName: values.contactPersonName,
      emailAddress: values.emailAddress,
      webAddress: values.webAddress,
      imageUrl: values.imageUrl,
      customerProjectInp: values.projects
        ? values.projects.map((project) => ({
            projectName: project.projectName,
            fK_Employee_ID: project.agentId,
          }))
        : [],
    };

    if (isEditing && selectedRecord) {
      dispatch(updateCustomerRegistration({ ...payload, id: selectedRecord.id }))
        .then(() => message.success("Customer updated successfully"))
        .catch(() => message.error("Failed to update customer"));
    } else {
      dispatch(addCustomerRegistration(payload))
        .then(() => message.success("Customer added successfully"))
        .catch(() => message.error("Failed to add customer"));
    }

    setIsModalVisible(false);
    form.resetFields();
    setMobileNumber("");
  };

  const columns = [
    { title: "Customer Name", dataIndex: "customerName", key: "customerName" },
    { title: "Email", dataIndex: "emailAddress", key: "emailAddress" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record.id)} style={{ marginLeft: 8 }}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Customer Registration</h1>
      <Button type="primary" onClick={showAddModal} style={{ marginBottom: "20px" }}>
        Add New Customer
      </Button>

      <Table dataSource={customers} columns={columns} rowKey="id" loading={loading} />

      <Modal
        title={isEditing ? "Edit Customer" : "Add New Customer"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item name="fK_Industry_ID" label="Industry ID" rules={[{ required: true }]}>
            <Input placeholder="Enter Industry ID" />
          </Form.Item>
          <Form.Item name="customerName" label="Customer Name" rules={[{ required: true }]}>
            <Input placeholder="Enter Customer Name" />
          </Form.Item>
          <Form.Item name="customerCode" label="Customer Code" rules={[{ required: true }]}>
            <Input placeholder="Enter Customer Code" />
          </Form.Item>
          <Form.Item name="customerAddress" label="Customer Address" rules={[{ required: true }]}>
            <Input placeholder="Enter Customer Address" />
          </Form.Item>
          <Form.Item label="Mobile Number" required>
            <div style={{ border: "1px solid #d9d9d9", borderRadius: "6px", padding: "4px 11px" }}>
              <PhoneInput
                international
                defaultCountry="US"
                value={mobileNumber}
                onChange={(value) => setMobileNumber(value || "")}
                placeholder="Enter Mobile Number"
                style={{ border: "none", width: "100%" }}
              />
            </div>
            {!isValidPhoneNumber(mobileNumber) && mobileNumber && (
              <span style={{ color: "red" }}>Invalid phone number format</span>
            )}
          </Form.Item>
          <Form.Item name="contactPersonName" label="Contact Person Name" rules={[{ required: true }]}>
            <Input placeholder="Enter Contact Person Name" />
          </Form.Item>
          <Form.Item name="emailAddress" label="Email Address" rules={[
            { required: true, message: "Email Address is required" },
            { type: "email", message: "Please enter a valid Email Address" }
          ]}>
            <Input placeholder="Enter Email Address" />
          </Form.Item>
          <Form.Item name="webAddress" label="Web Address">
            <Input placeholder="Enter Web Address" />
          </Form.Item>
          <Form.Item name="imageUrl" label="Image URL">
            <Input placeholder="Enter Image URL" />
          </Form.Item>

          <Form.List name="projects">
            {(fields, { add, remove }) => (
              <>
                <h3>Projects</h3>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <Form.Item
                      {...restField}
                      label="Project Name"
                      name={[name, "projectName"]}
                      rules={[{ required: true, message: "Project Name is required" }]}
                    >
                      <Input placeholder="Enter Project Name" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      label="Assigned Agent ID"
                      name={[name, "agentId"]}
                      rules={[{ required: true, message: "Agent ID is required" }]}
                    >
                      <Input placeholder="Enter Agent ID" />
                    </Form.Item>
                    <Button danger onClick={() => remove(name)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="dashed" onClick={() => add()} block>
                  + Add Project
                </Button>
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
