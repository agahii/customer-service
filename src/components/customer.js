// src/components/CustomerRegistration.js
import { Upload } from "antd";
import { UploadOutlined,EditOutlined,DeleteOutlined } from "@ant-design/icons";
import React, { useEffect, useState, useCallback } from "react";
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
  uploadCustomerLogo,
  uploadProjectLogo,
} from "../store/reducers/CustomerRegistration/CustomerRegistrationAction";
import { fetchIndustry } from "../store/reducers/IndustryRegistration/IndustryRegistrationAction";
import { fetchEmployee } from "../store/reducers/EmployeeRegistration/EmployeeRegistrationAction";
import { BASE_DOMAIN } from "../utills/services";
const { Option } = Select;

// Reusable Employee Select Component
const EmployeeSelect = ({
  label,
  name,
  employees,
  fetchEmployees,
  initialEmployees,
  required,
}) => (
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
                {/* Render initialEmployees first to display names for existing selections */}
                {initialEmployees &&
                  initialEmployees.map((emp) => (
                    <Option key={emp.id} value={emp.id}>
                      {emp.employeeName}
                    </Option>
                  ))}
                {/* Then render all loaded employees */}
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
  const {
    entities: industries,
    loading: industriesLoading,
    error: industriesError,
  } = useSelector((state) => state.industryRegistration);
  const {
    entities: employees,
    loading: employeesLoading,
    error: employeesError,
  } = useSelector((state) => state.employeeRegistration);

  const [pagingInfo, setPagingInfo] = useState({ skip: 0, take: 10 });

  useEffect(() => {
    const controller = new AbortController();
    dispatch(fetchCustomerRegistration({ pagingInfo, controller }));
    return () => {
      controller.abort();
    };
  }, [dispatch, pagingInfo]);

  // Function to open the Add Customer modal
  const openAddModal = () => {
    setIsEditing(false);
    setSelectedRecord(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  // Function to fetch employees when dropdown is opened
  const fetchEmployeesOnDemand = useCallback(() => {
    if (employees.length === 0 && !employeesLoading) {
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
  }, [dispatch, employees.length, employeesLoading]);

  // Function to open the Edit Customer modal
  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsEditing(true);

    form.setFieldsValue({
      ...record,
      customerProjectInp: record.customerProject?.map((project) => ({
        projectName: project.projectName,
        imageUrl: project.imageUrl,
        gccAgents: project.gccAgent?.map((agent) => ({
          fK_Employee_ID: agent.fK_Employee_ID,
        })) || [],
        customerAgents: project.customerAgent?.map((agent) => ({
          fK_Employee_ID: agent.fK_Employee_ID,
        })) || [],
        gccSupervisors: project.gccSupervisor?.map((sup) => ({
          fK_Employee_ID: sup.fK_Employee_ID,
        })) || [],
        customerSupervisors: project.customerSupervisor?.map((sup) => ({
          fK_Employee_ID: sup.fK_Employee_ID,
        })) || [],
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

  // ***** ONLY handleSubmit CHANGED TO MATCH PAYLOAD ***** //
  const handleSubmit = async (values) => {
    setSubmitting(true);

    // Prepare the payload to match the EXACT shape for PUT /api/Customer/Update
    const payload = {
      id: isEditing ? selectedRecord.id : undefined, // The top-level "id"
      fK_Industry_ID: values.fK_Industry_ID,
      customerName: values.customerName,
      // customerCode: values.customerCode,
      customerAddress: values.customerAddress,
      mobileNumber: values.mobileNumber,
      contactPersonName: values.contactPersonName,
      emailAddress: values.emailAddress,
      webAddress: values.webAddress,
      imageUrl: values.imageUrl,
      isActive: isEditing ? values.isActive : true,
      customerProject: values.customerProjectInp?.map((project, index) => {
        // If editing, we retrieve the existing ID from the selected record's projects
        const existingProject = isEditing
          ? selectedRecord.customerProject?.[index]
          : null;

        return {
          id: existingProject ? existingProject.id : "", // "id": "string" if new
          projectName: project.projectName || "",
          fK_Customer_ID: existingProject
            ? existingProject.fK_Customer_ID
            : "",
          isActive: true,
          gccAgent: project.gccAgents?.map((agent, i) => {
            const existingAgent = existingProject?.gccAgent?.[i];
            return {
              id: existingAgent ? existingAgent.id : "",
              fK_CustomerProject_ID: existingProject
                ? existingProject.id
                : "",
              fK_Employee_ID: agent.fK_Employee_ID || "",
            };
          }) || [],
          customerAgent: project.customerAgents?.map((agent, i) => {
            const existingAgent = existingProject?.customerAgent?.[i];
            return {
              id: existingAgent ? existingAgent.id : "",
              fK_CustomerProject_ID: existingProject
                ? existingProject.id
                : "",
              fK_Employee_ID: agent.fK_Employee_ID || "",
            };
          }) || [],
          gccSupervisor: project.gccSupervisors?.map((sup, i) => {
            const existingSup = existingProject?.gccSupervisor?.[i];
            return {
              id: existingSup ? existingSup.id : "",
              fK_CustomerProject_ID: existingProject
                ? existingProject.id
                : "",
              fK_Employee_ID: sup.fK_Employee_ID || "",
            };
          }) || [],
          customerSupervisor: project.customerSupervisors?.map((sup, i) => {
            const existingSup = existingProject?.customerSupervisor?.[i];
            return {
              id: existingSup ? existingSup.id : "",
              fK_CustomerProject_ID: existingProject
                ? existingProject.id
                : "",
              fK_Employee_ID: sup.fK_Employee_ID || "",
            };
          }) || [],
        };
      }),
    };

    const payloadAdd = {
      id: isEditing ? selectedRecord.id : undefined, // The top-level "id"
      fK_Industry_ID: values.fK_Industry_ID,
      customerName: values.customerName,
      // customerCode: values.customerCode,
      customerAddress: values.customerAddress,
      mobileNumber: values.mobileNumber,
      contactPersonName: values.contactPersonName,
      emailAddress: values.emailAddress,
      webAddress: values.webAddress,
      imageUrl: values.imageUrl,
      
      customerProjectInp: values.customerProjectInp?.map((project, index) => {
        // If editing, we retrieve the existing ID from the selected record's projects
        const existingProject = isEditing
          ? selectedRecord.customerProject?.[index]
          : null;

        return {
          
          projectName: project.projectName || "",
          
          gccAgentInp: project.gccAgents?.map((agent, i) => {
            const existingAgent = existingProject?.gccAgent?.[i];
            return {
              
              fK_Employee_ID: agent.fK_Employee_ID || "",
            };
          }) || [],

          
          customerAgentInp: project.customerAgents?.map((agent, i) => {
            const existingAgent = existingProject?.customerAgent?.[i];
            return {
             
              fK_Employee_ID: agent.fK_Employee_ID || "",
            };
          }) || [],
          gccSupervisorInp: project.gccSupervisors?.map((sup, i) => {
            const existingSup = existingProject?.gccSupervisor?.[i];
            return {
            
              fK_Employee_ID: sup.fK_Employee_ID || "",
            };
          }) || [],
          customerSupervisorInp: project.customerSupervisors?.map((sup, i) => {
            const existingSup = existingProject?.customerSupervisor?.[i];
            return {
             
              fK_Employee_ID: sup.fK_Employee_ID || "",
            };
          }) || [],
        };
      }),
    };

    if (isEditing) {
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
      dispatch(addCustomerRegistration(payloadAdd))
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
  useEffect(() => {
    const controller = new AbortController();
    dispatch(fetchCustomerRegistration({ pagingInfo, controller }));
    return () => {
      controller.abort();
    };
  }, [dispatch, pagingInfo]);
  // ***** END handleSubmit ***** //

  // Columns definition
  const columns = [
    {
      title: "Logo",
      key: "logo",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {record.imageUrl ? (
            <img
              src={`${BASE_DOMAIN.replace("/api", "/Images")}${record.imageUrl}`}
              alt="Customer Logo"
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
          <Upload
            beforeUpload={(file) => {
              handleLogoUpload(record.id, file);
              return false;
            }}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Upload Logo</Button>
          </Upload>
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "customerName",
      key: "customerName",
      width: 200,
    },
    {
      title: "Code",
      dataIndex: "customerCode",
      key: "customerCode",
      width: 150,
    },
    {
      title: "Address",
      dataIndex: "customerAddress",
      key: "customerAddress",
      width: 200,
    },
    {
      title: "Mobile#",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      width: 150,
    },
    {
      title: "Contact Person",
      dataIndex: "contactPersonName",
      key: "contactPersonName",
      width: 200,
    },
    {
      title: "Email",
      dataIndex: "emailAddress",
      key: "emailAddress",
      width: 200,
    },
    {
      title: "Industry Type",
      key: "industryType",
      width: 200,
      render: (_, record) => record.industry?.industryType || "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <>
        <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)} 
        />
        <Button 
            type="link" 
            icon={<DeleteOutlined />} 
            danger 
            onClick={() => handleDelete(record.id)} 
        />
    </>
      ),
    },
  ];

  const handleLogoUpload = async (id, file) => {
    if (file) {
      try {
        await dispatch(uploadCustomerLogo({ id, file })).unwrap();
        message.success("Logo uploaded successfully!");
      } catch (error) {
        message.error(`Logo upload failed: ${error}`);
      }
    }
  };
  
  
  const handleProjectLogoUpload = async (id, file) => {
    if (file) {
      try {
        await dispatch(uploadProjectLogo({ id, file })).unwrap();
  
        // Update the form dynamically after the logo is uploaded
        // const updatedProjects = form.getFieldValue("customerProjectInp").map((project) => {
        //   if (project.id === projectId) {
        //     return { ...project, imageUrl: `${BASE_DOMAIN}/Images/${file.name}` };
        //   }
        //   return project;
        // });
  
        // form.setFieldsValue({ customerProjectInp: updatedProjects });
  
        message.success("Project logo uploaded successfully!");
      } catch (error) {
        message.error(`Project logo upload failed: ${error}`);
      }
    }
  };
  



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
        tableLayout="fixed"
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
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          scrollToFirstError
          width="500px"
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="customerName"
                label="Customer Name"
                rules={[
                  { required: true, message: "Please enter the customer name" },
                ]}
               
              >
                <Input/>
              </Form.Item>
            </Col>
            {/* <Col xs={24} sm={12}>
              <Form.Item
                name="customerCode"
                label="Customer Code"
                rules={[
                  { required: true, message: "Please enter the customer code" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col> */}


            
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
                    if (open) {
                      dispatch(
                        fetchIndustry({
                          pagingInfo: { skip: 0, take: 100 },
                          controller: new AbortController(),
                        })
                      ).catch((error) => {
                        console.error("Error fetching industries:", error);
                        message.error(`Failed to load industries: ${error}`);
                      });
                    }
                  }}
                  loading={industriesLoading}
                >
                  {isEditing && selectedRecord && selectedRecord.industry && (
                    <Option
                      key={selectedRecord.industry.id}
                      value={selectedRecord.industry.id}
                    >
                      {selectedRecord.industry.industryType}
                    </Option>
                  )}
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
                  { required: true, message: "Please enter the customer address" },
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
                length={8}
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
                  { required: true, message: "Please enter the contact person name" },
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

          <Form.List name="customerProjectInp">
            {(fields, { add, remove }) => (
              <div>
                <label style={{ fontWeight: "bold" }}>Departments</label>
                {fields.map(({ key, name, ...restField }) => {
                  // Use the existing project data from 'selectedRecord' to show the employees' names
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

                        <Col xs={24} sm={12}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px", // Space between thumbnail and button
                }}
              >
                {form.getFieldValue(["customerProjectInp", name, "imageUrl"]) ? (
                  <img
                    src={`${BASE_DOMAIN.replace(
                      "/api",
                      "/Images"
                    )}${form.getFieldValue(["customerProjectInp", name, "imageUrl"])}`}
                    alt="Project Logo"
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
                          <Upload
              beforeUpload={(file) => {
                const projectId = form.getFieldValue(["customerProject", name, "id"]);
                handleProjectLogoUpload(projectId, file);
                return false; // Prevent auto-upload by Ant Design
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Upload Logo</Button>
            </Upload>
              </div>
            </Col>

                        <Col xs={24} sm={12}></Col>


                        
                      </Row>

                      <EmployeeSelect
                        label="GCC Agents"
                        name={[name, "gccAgents"]}
                        employees={employees}
                        fetchEmployees={fetchEmployeesOnDemand}
                        // Pass initialEmployees with employee objects to display names
                        initialEmployees={
                          isEditing && project
                            ? project.gccAgent?.map((agent) => agent.employee)
                            : []
                        }
                        required={false}
                      />

                      <EmployeeSelect
                        label="Customer Agents"
                        name={[name, "customerAgents"]}
                        employees={employees}
                        fetchEmployees={fetchEmployeesOnDemand}
                        initialEmployees={
                          isEditing && project
                            ? project.customerAgent?.map((agent) => agent.employee)
                            : []
                        }
                        required={false}
                      />

                      <EmployeeSelect
                        label="GCC Supervisors"
                        name={[name, "gccSupervisors"]}
                        employees={employees}
                        fetchEmployees={fetchEmployeesOnDemand}
                        initialEmployees={
                          isEditing && project
                            ? project.gccSupervisor?.map((sup) => sup.employee)
                            : []
                        }
                        required={false}
                      />

                      <EmployeeSelect
                        label="Customer Supervisors"
                        name={[name, "customerSupervisors"]}
                        employees={employees}
                        fetchEmployees={fetchEmployeesOnDemand}
                        initialEmployees={
                          isEditing && project
                            ? project.customerSupervisor?.map((sup) => sup.employee)
                            : []
                        }
                        required={false}
                      />
                    </div>
                  );
                })}
                <Form.Item>
                  <Button type="primary" onClick={() => add()} block>
                    Add Department
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
              disabled={industriesLoading || employeesLoading}
              style={{ marginRight: 8 }}
            >
              {isEditing ? "Update" : "Add Customer"}
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
