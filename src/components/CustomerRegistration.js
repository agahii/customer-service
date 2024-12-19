// src/components/CustomerRegistration.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Switch,
  Row,
  Col,
} from "antd";
import {
  addCustomerRegistration,
  fetchCustomerRegistration,
  updateCustomerRegistration,
  deleteCustomerRegistration,
} from "../store/reducers/CustomerRegistration/CustomerRegistrationAction";
import { fetchIndustry } from "../store/reducers/IndustryRegistration/IndustryRegistrationAction";
import { fetchEmployee } from "../store/reducers/EmployeeRegistration/EmployeeRegistrationAction";

const { Option } = Select;

// Reusable Employee Select Component
const EmployeeSelect = ({ label, name, employees, required }) => (
  <Form.List name={name}>
    {(fields, { add, remove }) => (
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: "bold" }}>{label}</label>
        {fields.map(({ key, name: fieldName, ...restField }) => (
          <div key={key} style={{ display: "flex", marginBottom: 8 }}>
            <Form.Item
              {...restField}
              name={[fieldName, "fK_Employee_ID"]}
              rules={[{ required, message: `Select ${label}` }]}
              style={{ flex: 1, marginRight: 8 }}
            >
              <Select
                showSearch
                placeholder={`Select ${label}`}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {employees.map((emp) => (
                  <Option key={emp.id} value={emp.id}>
                    {emp.employeeName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Button
              type="primary"
              danger
              onClick={() => remove(fieldName)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Form.Item>
          <Button type="primary" onClick={() => add()} block>
            Add {label}
          </Button>
        </Form.Item>
      </div>
    )}
  </Form.List>
);

const CustomerRegistration = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const dispatch = useDispatch();
  const { entities, loading, total } = useSelector(
    (state) => state.customerRegistration
  );
  const { entities: industries } = useSelector(
    (state) => state.industryRegistration
  );
  const { entities: employees } = useSelector(
    (state) => state.employeeRegistration
  );

  const [pagingInfo, setPagingInfo] = useState({ skip: 0, take: 10 });

  useEffect(() => {
    const controller = new AbortController();
    dispatch(fetchCustomerRegistration({ pagingInfo, controller }));
    dispatch(
      fetchIndustry({
        pagingInfo: { skip: 0, take: 100 },
        controller: new AbortController(),
      })
    );
    dispatch(
      fetchEmployee({
        pagingInfo: { skip: 0, take: 100 },
        controller: new AbortController(),
      })
    );

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
        gccAgentInp:
          project.gccAgents?.map((agent) => ({
            fK_Employee_ID: agent.fK_Employee_ID,
          })) || [],
        customerAgentInp:
          project.customerAgents?.map((agent) => ({
            fK_Employee_ID: agent.fK_Employee_ID,
          })) || [],
        gccSupervisorInp:
          project.gccSupervisors?.map((sup) => ({
            fK_Employee_ID: sup.fK_Employee_ID,
          })) || [],
        customerSupervisorInp:
          project.customerSupervisors?.map((sup) => ({
            fK_Employee_ID: sup.fK_Employee_ID,
          })) || [],
      })),
    };

    console.log("Payload to be sent:", payload);

    if (isEditing) {
      payload.id = selectedRecord.id;
      payload.isActive = values.isActive;
      payload.customerProject = payload.customerProjectInp.map((project) => ({
        ...project,
        isActive: true,
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
        gccAgents: project.gccAgent?.map((agent) => ({
          fK_Employee_ID: agent.fK_Employee_ID,
        })),
        customerAgents: project.customerAgent?.map((agent) => ({
          fK_Employee_ID: agent.fK_Employee_ID,
        })),
        gccSupervisors: project.gccSupervisor?.map((sup) => ({
          fK_Employee_ID: sup.fK_Employee_ID,
        })),
        customerSupervisors: project.customerSupervisor?.map((sup) => ({
          fK_Employee_ID: sup.fK_Employee_ID,
        })),
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

  // Removed "Web Address" and "Image URL" columns
  const columns = [
    { title: "Industry ID", dataIndex: "fK_Industry_ID", key: "fK_Industry_ID", width: 200 },
    { title: "Customer Name", dataIndex: "customerName", key: "customerName", width: 200 },
    { title: "Customer Code", dataIndex: "customerCode", key: "customerCode", width: 150 },
    { title: "Customer Address", dataIndex: "customerAddress", key: "customerAddress", width: 200 },
    { title: "Mobile Number", dataIndex: "mobileNumber", key: "mobileNumber", width: 150 },
    { title: "Contact Person Name", dataIndex: "contactPersonName", key: "contactPersonName", width: 200 },
    { title: "Email Address", dataIndex: "emailAddress", key: "emailAddress", width: 200 },
    {
      title: "Actions",
      key: "actions",
      width: 150,
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
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: 16 }}
      >
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
        tableLayout="fixed"
        scroll={{ x: true }}
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
        width={1000}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          scrollToFirstError
        >
          {/* Customer Details in Two Columns */}
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="customerName"
                label="Customer Name"
                rules={[
                  { required: true, message: "Please enter the customer name" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="customerCode"
                label="Customer Code"
                rules={[
                  { required: true, message: "Please enter the customer code" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="fK_Industry_ID"
                label="Industry"
                rules={[
                  { required: true, message: "Please select an industry" },
                ]}
              >
                <Select
                  placeholder="Select Industry"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {industries.map((ind) => (
                    <Option key={ind.id} value={ind.id}>
                      {ind.industryType}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="customerAddress"
                label="Customer Address"
                rules={[
                  {
                    required: true,
                    message: "Please enter the customer address",
                  },
                ]}
              >
                <Input.TextArea rows={2} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="mobileNumber"
                label="Mobile Number"
                rules={[
                  { required: true, message: "Please enter the mobile number" },
                  {
                    pattern: /^\d+$/,
                    message: "Mobile number must be numeric",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="contactPersonName"
                label="Contact Person Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter the contact person name",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="emailAddress"
                label="Email Address"
                rules={[
                  { required: true, message: "Please enter the email address" },
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
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
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
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
            </Col>
            <Col xs={24} sm={12}></Col>
          </Row>

          {isEditing && (
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="isActive"
                  label="Is Active"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}></Col>
            </Row>
          )}

          {/* Projects Section */}
          <Form.List name="customerProjectInp">
            {(fields, { add, remove }) => (
              <div>
                <label style={{ fontWeight: "bold" }}>Projects</label>
                {fields.map(({ key, name, ...restField }) => (
                  <div
                    key={key}
                    style={{
                      border: "1px solid #d9d9d9",
                      padding: 16,
                      marginBottom: 16,
                      borderRadius: 4,
                      position: "relative",
                      background: "#fafafa",
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

                    <Row gutter={16}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          {...restField}
                          name={[name, "projectName"]}
                          label="Project Name"
                          rules={[
                            {
                              required: true,
                              message: "Please enter the project name",
                            },
                          ]}
                        >
                          <Input placeholder="Project Name" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}></Col>
                    </Row>

                    <EmployeeSelect
                      label="GCC Agents"
                      name={[name, "gccAgents"]}
                      employees={employees}
                      required={false}
                    />

                    <EmployeeSelect
                      label="Customer Agents"
                      name={[name, "customerAgents"]}
                      employees={employees}
                      required={false}
                    />

                    <EmployeeSelect
                      label="GCC Supervisors"
                      name={[name, "gccSupervisors"]}
                      employees={employees}
                      required={false}
                    />

                    <EmployeeSelect
                      label="Customer Supervisors"
                      name={[name, "customerSupervisors"]}
                      employees={employees}
                      required={false}
                    />
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
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              style={{ marginRight: 8 }}
            >
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
