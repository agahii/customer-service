import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  Upload,
  Avatar,
} from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import {
  addCustomerRegistration,
  fetchCustomerRegistration,
  updateCustomerRegistration,
  deleteCustomerRegistration,
  uploadCustomerLogo,
  uploadProjectLogo,
} from "../store/reducers/customer/customerSlice";
import { fetchIndustry } from "../store/reducers/Industries/IndustriesSlice";
import { fetchEmployee } from "../store/reducers/EmployeeRegistration/EmployeeRegistrationAction";
import { BASE_DOMAIN } from "../utills/services";

const { Option } = Select;

// Reusable Employee Select Component
const EmployeeSelect = React.memo(
  ({ label, name, employees, fetchEmployees, initialEmployees, required }) => (
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
                  onDropdownVisibleChange={(open) => {
                    if (open) fetchEmployees();
                  }}
                >
                  {initialEmployees?.map((emp) => (
                    <Option key={emp.id} value={emp.id}>
                      {emp.employeeName}
                    </Option>
                  ))}
                  {employees.map((emp) => (
                    <Option key={emp.id} value={emp.id}>
                      {emp.employeeName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Button type="primary" danger onClick={() => remove(fieldName)}>
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
  )
);

// Reusable Logo Upload Component
const LogoUpload = ({ id, imageUrl, onUpload }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
    {imageUrl ? (
      <img
        src={`${BASE_DOMAIN.replace("/api", "/Images")}${imageUrl}`}
        alt="Logo"
        style={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid #ddd",
        }}
      />
    ) : (
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          backgroundColor: "#f0f0f0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "12px",
          color: "#999",
          border: "2px solid #ddd",
        }}
      >
        No Logo
      </div>
    )}
    <Upload beforeUpload={(file) => onUpload(id, file)} showUploadList={false}>
      <Button icon={<UploadOutlined />}>Upload Logo</Button>
    </Upload>
  </div>
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
    return () => controller.abort();
  }, [dispatch, pagingInfo]);

  const openAddModal = () => {
    setIsEditing(false);
    setSelectedRecord(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const fetchEmployeesOnDemand = useCallback(() => {
    if (employees.length === 0) {
      dispatch(
        fetchEmployee({
          pagingInfo: { skip: 0, take: 100 },
          controller: new AbortController(),
        })
      ).catch((error) => {
        console.error("Error fetching employees:", error);
        message.error(`Failed to load employees: ${error}`);
      });
    }
  }, [dispatch, employees.length]);

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsEditing(true);
    form.setFieldsValue({
      ...record,
      customerProjectInp: record.customerProject?.map((project) => ({
        ...project,
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
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this customer?",
      onOk: () => {
        dispatch(deleteCustomerRegistration(id))
          .unwrap()
          .then(() => message.success("Customer deleted successfully"))
          .catch((error) => message.error(`Deletion failed: ${error}`));
      },
    });
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    const payload = {
      ...values,
      id: isEditing ? selectedRecord.id : undefined,
      customerProject: values.customerProjectInp?.map((project) => ({
        ...project,
        gccAgent: project.gccAgents,
        customerAgent: project.customerAgents,
        gccSupervisor: project.gccSupervisors,
        customerSupervisor: project.customerSupervisors,
      })),
    };

    const action = isEditing
      ? updateCustomerRegistration(payload)
      : addCustomerRegistration(payload);

    dispatch(action)
      .unwrap()
      .then(() => {
        message.success(`Customer ${isEditing ? "updated" : "added"} successfully`);
        setIsModalVisible(false);
        form.resetFields();
      })
      .catch((error) => message.error(`${isEditing ? "Update" : "Addition"} failed: ${error}`))
      .finally(() => setSubmitting(false));
  };

  const handleLogoUpload = async (id, file) => {
    try {
      await dispatch(uploadCustomerLogo({ id, file })).unwrap();
      message.success("Logo uploaded successfully!");
    } catch (error) {
      message.error(`Logo upload failed: ${error}`);
    }
  };

  const handleProjectLogoUpload = async (id, file) => {
    try {
      await dispatch(uploadProjectLogo({ id, file })).unwrap();
      message.success("Project logo uploaded successfully!");
    } catch (error) {
      message.error(`Project logo upload failed: ${error}`);
    }
  };

  const columns = useMemo(
    () => [
      {
        title: "Logo",
        key: "logo",
        render: (_, record) => (
          <LogoUpload
            id={record.id}
            imageUrl={record.imageUrl}
            onUpload={handleLogoUpload}
          />
        ),
      },
      { title: "Customer Name", dataIndex: "customerName", key: "customerName" },
      { title: "Customer Code", dataIndex: "customerCode", key: "customerCode" },
      { title: "Customer Address", dataIndex: "customerAddress", key: "customerAddress" },
      { title: "Mobile Number", dataIndex: "mobileNumber", key: "mobileNumber" },
      { title: "Contact Person Name", dataIndex: "contactPersonName", key: "contactPersonName" },
      { title: "Email Address", dataIndex: "emailAddress", key: "emailAddress" },
      {
        title: "Industry Type",
        key: "industryType",
        render: (_, record) => record.industry?.industryType || "N/A",
      },
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
    ],
    []
  );

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" onClick={openAddModal} style={{ marginBottom: 16 }}>
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
        scroll={{ x: true, y: 500 }}
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
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="customerName"
                label="Customer Name"
                rules={[{ required: true, message: "Please enter the customer name" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="customerCode"
                label="Customer Code"
                rules={[{ required: true, message: "Please enter the customer code" }]}
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
                rules={[{ required: true, message: "Please select an industry" }]}
              >
                <Select
                  placeholder="Select Industry"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  onDropdownVisibleChange={(open) => {
                    if (open) dispatch(fetchIndustry({ pagingInfo: { skip: 0, take: 100 } }));
                  }}
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
                rules={[{ required: true, message: "Please enter the customer address" }]}
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
                  { pattern: /^\d+$/, message: "Mobile number must be numeric" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="contactPersonName"
                label="Contact Person Name"
                rules={[{ required: true, message: "Please enter the contact person name" }]}
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
                  { type: "email", message: "Please enter a valid email address" },
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

          {isEditing && (
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item name="isActive" label="Is Active" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          )}

          <Form.List name="customerProjectInp">
            {(fields, { add, remove }) => (
              <div>
                <label style={{ fontWeight: "bold" }}>Projects</label>
                {fields.map(({ key, name, ...restField }) => {
                  const project = selectedRecord?.customerProject?.[name];
                  return (
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
                            rules={[{ required: true, message: "Please enter the project name" }]}
                          >
                            <Input placeholder="Project Name" />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                          <LogoUpload
                            id={form.getFieldValue(["customerProjectInp", name, "id"])}
                            imageUrl={form.getFieldValue(["customerProjectInp", name, "imageUrl"])}
                            onUpload={handleProjectLogoUpload}
                          />
                        </Col>
                      </Row>

                      <EmployeeSelect
                        label="GCC Agents"
                        name={[name, "gccAgents"]}
                        employees={employees}
                        fetchEmployees={fetchEmployeesOnDemand}
                        initialEmployees={project?.gccAgent?.map((agent) => agent.employee)}
                        required={false}
                      />

                      <EmployeeSelect
                        label="Customer Agents"
                        name={[name, "customerAgents"]}
                        employees={employees}
                        fetchEmployees={fetchEmployeesOnDemand}
                        initialEmployees={project?.customerAgent?.map((agent) => agent.employee)}
                        required={false}
                      />

                      <EmployeeSelect
                        label="GCC Supervisors"
                        name={[name, "gccSupervisors"]}
                        employees={employees}
                        fetchEmployees={fetchEmployeesOnDemand}
                        initialEmployees={project?.gccSupervisor?.map((sup) => sup.employee)}
                        required={false}
                      />

                      <EmployeeSelect
                        label="Customer Supervisors"
                        name={[name, "customerSupervisors"]}
                        employees={employees}
                        fetchEmployees={fetchEmployeesOnDemand}
                        initialEmployees={project?.customerSupervisor?.map((sup) => sup.employee)}
                        required={false}
                      />
                    </div>
                  );
                })}
                <Form.Item>
                  <Button type="primary" onClick={() => add()} block>
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
              {isEditing ? "Update" : "Add Customer"}
            </Button>
            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )};
  export default CustomerRegistration;