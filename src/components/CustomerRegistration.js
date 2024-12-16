// src/components/CustomerRegistration.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Modal, Form, Input, Select, message, Switch } from "antd";
import {
  addCustomerRegistration,
  fetchCustomerRegistration,
  updateCustomerRegistration,
  deleteCustomerRegistration,
} from "../store/reducers/CustomerRegistration/CustomerRegistrationAction";
import { fetchIndustry } from "../store/reducers/IndustryRegistration/IndustryRegistrationAction";
import { fetchEmployee } from "../store/reducers/EmployeeRegistration/EmployeeRegistrationAction";

const { Option } = Select;

const CustomerRegistration = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false); // For handling form submission state

  const dispatch = useDispatch();
  const { entities, loading, total } = useSelector((state) => state.customerRegistration);
  const { entities: industries } = useSelector((state) => state.industryRegistration);
  const { entities: employees } = useSelector((state) => state.employeeRegistration);

  const [pagingInfo, setPagingInfo] = useState({ skip: 0, take: 10 });

  useEffect(() => {
    const controller = new AbortController();
    dispatch(fetchCustomerRegistration({ pagingInfo, controller }));
    dispatch(fetchIndustry({ pagingInfo: { skip: 0, take: 100 }, controller: new AbortController() }));
    dispatch(fetchEmployee({ pagingInfo: { skip: 0, take: 100 }, controller: new AbortController() }));

    return () => {
      controller.abort();
    };
  }, [dispatch, pagingInfo]);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    const payload = {
      ...values,
      customerProjectInp: values.customerProjectInp?.map((project) => ({
        projectName: project.projectName,
        gccAgentInp: project.gccAgentInp || [],
        customerAgentInp: project.customerAgentInp || [],
        gccSupervisorInp: project.gccSupervisorInp || [],
        customerSupervisorInp: project.customerSupervisorInp || [],
      })),
    };

    if (isEditing) {
      payload.id = selectedRecord.id;
      payload.isActive = values.isActive;
      // Map customerProjectInp to customerProject for update
      payload.customerProject = payload.customerProjectInp.map((project) => ({
        ...project,
        isActive: true, // or derive from form if available
      }));
      delete payload.customerProjectInp;
      dispatch(updateCustomerRegistration(payload))
        .unwrap()
        .then(() => {
          message.success("Customer updated successfully");
        })
        .catch((error) => {
          message.error(`Update failed: ${error}`);
        })
        .finally(() => {
          setSubmitting(false);
        });
    } else {
      dispatch(addCustomerRegistration(payload))
        .unwrap()
        .then(() => {
          message.success("Customer added successfully");
        })
        .catch((error) => {
          message.error(`Addition failed: ${error}`);
        })
        .finally(() => {
          setSubmitting(false);
        });
    }

    setIsModalVisible(false);
    form.resetFields();
    setIsEditing(false);
    setSelectedRecord(null);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsEditing(true);
    form.setFieldsValue({
      ...record,
      customerProjectInp: record.customerProject?.map((project) => ({
        projectName: project.projectName,
        gccAgentInp: project.gccAgent?.map((agent) => agent.fK_Employee_ID),
        customerAgentInp: project.customerAgent?.map((agent) => agent.fK_Employee_ID),
        gccSupervisorInp: project.gccSupervisor?.map((sup) => sup.fK_Employee_ID),
        customerSupervisorInp: project.customerSupervisor?.map((sup) => sup.fK_Employee_ID),
      })),
      isActive: record.isActive,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this customer?",
      onOk: () => {
        dispatch(deleteCustomerRegistration(id))
          .unwrap()
          .then(() => {
            message.success("Customer deleted successfully");
          })
          .catch((error) => {
            message.error(`Deletion failed: ${error}`);
          });
      },
    });
  };

  const columns = [
    { title: "Customer Name", dataIndex: "customerName", key: "customerName" },
    { title: "Customer Code", dataIndex: "customerCode", key: "customerCode" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>
        Add Customer
      </Button>

      <Table
        dataSource={entities}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          total,
          pageSize: pagingInfo.take,
          current: Math.floor(pagingInfo.skip / pagingInfo.take) + 1,
          onChange: (page, pageSize) =>
            setPagingInfo({ skip: (page - 1) * pageSize, take: pageSize }),
        }}
      />

      <Modal
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setIsEditing(false);
          setSelectedRecord(null);
          form.resetFields();
        }}
        footer={null}
        title={isEditing ? "Edit Customer" : "Add Customer"}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="customerName"
            label="Customer Name"
            rules={[{ required: true, message: "Please enter the customer name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="customerCode"
            label="Customer Code"
            rules={[{ required: true, message: "Please enter the customer code" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="fK_Industry_ID"
            label="Industry"
            rules={[{ required: true, message: "Please select an industry" }]}
          >
            <Select placeholder="Select Industry">
              {industries.map((ind) => (
                <Option key={ind.id} value={ind.id}>
                  {ind.industryType}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="customerAddress"
            label="Customer Address"
            rules={[{ required: true, message: "Please enter the customer address" }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="mobileNumber"
            label="Mobile Number"
            rules={[
              { required: true, message: "Please enter the mobile number" },
              { pattern: /^\d+$/, message: "Mobile number must be numeric" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="contactPersonName"
            label="Contact Person Name"
            rules={[{ required: true, message: "Please enter the contact person name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="emailAddress"
            label="Email Address"
            rules={[
              { required: true, message: "Please enter the email address" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="webAddress"
            label="Web Address"
            rules={[
              { required: true, message: "Please enter the web address" },
              { type: "url", message: "Please enter a valid URL" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="imageUrl"
            label="Image URL"
            rules={[
              { required: false },
              { type: "url", message: "Please enter a valid URL" },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Conditionally show isActive switch when editing */}
          {isEditing && (
            <Form.Item
              name="isActive"
              label="Is Active"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>
          )}

          {/* Projects Section */}
          <Form.List name="customerProjectInp">
            {(fields, { add, remove }) => (
              <div>
                <label>Projects</label>
                {fields.map(({ key, name, ...restField }) => (
                  <div
                    key={key}
                    style={{
                      border: "1px solid #d9d9d9",
                      padding: 16,
                      marginBottom: 16,
                      borderRadius: 4,
                      position: "relative",
                    }}
                  >
                    <Button
                      type="link"
                      danger
                      onClick={() => remove(name)}
                      style={{ position: "absolute", top: 0, right: 0 }}
                    >
                      Remove
                    </Button>
                    <Form.Item
                      {...restField}
                      name={[name, "projectName"]}
                      label="Project Name"
                      rules={[{ required: true, message: "Please enter the project name" }]}
                    >
                      <Input placeholder="Project Name" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "gccAgentInp"]}
                      label="GCC Agents"
                      rules={[{ required: false }]}
                    >
                      <Select
                        mode="multiple"
                        placeholder="Select GCC Agents"
                        allowClear
                      >
                        {employees.map((emp) => (
                          <Option key={emp.id} value={emp.id}>
                            {emp.employeeName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "customerAgentInp"]}
                      label="Customer Agents"
                      rules={[{ required: false }]}
                    >
                      <Select
                        mode="multiple"
                        placeholder="Select Customer Agents"
                        allowClear
                      >
                        {employees.map((emp) => (
                          <Option key={emp.id} value={emp.id}>
                            {emp.employeeName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "gccSupervisorInp"]}
                      label="GCC Supervisors"
                      rules={[{ required: false }]}
                    >
                      <Select
                        mode="multiple"
                        placeholder="Select GCC Supervisors"
                        allowClear
                      >
                        {employees.map((emp) => (
                          <Option key={emp.id} value={emp.id}>
                            {emp.employeeName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "customerSupervisorInp"]}
                      label="Customer Supervisors"
                      rules={[{ required: false }]}
                    >
                      <Select
                        mode="multiple"
                        placeholder="Select Customer Supervisors"
                        allowClear
                      >
                        {employees.map((emp) => (
                          <Option key={emp.id} value={emp.id}>
                            {emp.employeeName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    Add Project
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting} style={{ marginRight: 8 }}>
              {isEditing ? "Update" : "Add"}
            </Button>
            <Button
              onClick={() => {
                setIsModalVisible(false);
                setIsEditing(false);
                setSelectedRecord(null);
                form.resetFields();
              }}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerRegistration;
