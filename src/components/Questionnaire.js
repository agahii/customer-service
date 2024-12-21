// src/components/Questionnaire.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Select, Button, message, Space, Alert } from "antd";
import { fetchCustomerRegistration } from "../store/reducers/CustomerRegistration/CustomerRegistrationAction";
import { addQuestionnaire } from "../store/reducers/Questionnaire/QuestionnaireAction"; // Ensure correct path

const { Option } = Select;

const Questionnaire = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Access customer data and error from CustomerRegistration slice
  const { entities: customers, loading: customersLoading, error: customersError } = useSelector(
    (state) => state.customerRegistration
  );

  // Fetch customers on component mount
  useEffect(() => {
    const controller = new AbortController();
    dispatch(fetchCustomerRegistration({ pagingInfo: { skip: 0, take: 100 }, controller }));
    return () => {
      controller.abort();
    };
  }, [dispatch]);

  // Handle and display errors related to fetching customers
  useEffect(() => {
    if (customersError) {
      message.error(`Failed to load customers: ${customersError}`);
    }
  }, [customersError]);

  // Debugging: Log fetched customers
  useEffect(() => {
    if (customers && customers.length > 0) {
      console.log("Fetched Customers in Questionnaire:", customers);
    }
  }, [customers]);

  // Handle form submission
  const onFinish = async (values) => {
    const payload = {
      customerId: values.customerName,
      projectId: values.customerProject,
      // Add additional fields as necessary
    };

    console.log("Submitting Questionnaire with payload:", payload);

    try {
      await dispatch(addQuestionnaire(payload)).unwrap(); // Ensure addQuestionnaire handles the payload correctly
      message.success("Questionnaire submitted successfully!");
      form.resetFields();
      setSelectedCustomer(null);
    } catch (error) {
      console.error("Submission Error:", error);
      message.error(`Submission failed: ${error}`);
    }
  };

  // Handle customer selection change
  const handleCustomerChange = (value) => {
    setSelectedCustomer(value);
    // Reset project selection when customer changes
    form.setFieldsValue({ customerProject: undefined });
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>Create Questionnaire</h1>

      {/* Display error alert if there's an error fetching customers and no customers are loaded */}
      {customersError && (!customers || customers.length === 0) && (
        <Alert
          message="Error"
          description={`Failed to load customers: ${customersError}`}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        {/* Customer Name Dropdown */}
        <Form.Item
          name="customerName"
          label="Customer Name"
          rules={[{ required: true, message: "Please select a customer" }]}
        >
          <Select
            showSearch
            placeholder="Select a customer"
            loading={customersLoading}
            onChange={handleCustomerChange}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            notFoundContent={customersLoading ? "Loading..." : "No customers found"}
          >
            {Array.isArray(customers) && customers.map((customer) => (
              <Option key={customer.id} value={customer.id}>
                {customer.customerName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Customer Project Dropdown */}
        <Form.Item
          name="customerProject"
          label="Customer Project"
          rules={[{ required: true, message: "Please select a project" }]}
        >
          <Select
            showSearch
            placeholder="Select a project"
            loading={customersLoading} // Projects are part of customer data
            disabled={!selectedCustomer || customersLoading}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            notFoundContent={
              selectedCustomer
                ? "No projects found"
                : "Please select a customer first"
            }
          >
            {selectedCustomer &&
              Array.isArray(customers) &&
              customers
                .find((customer) => customer.id === selectedCustomer)
                ?.customerProject.map((project) => (
                  <Option key={project.id} value={project.id}>
                    {project.projectName}
                  </Option>
                ))}
          </Select>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" disabled={customersLoading}>
              Submit Questionnaire
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
                setSelectedCustomer(null);
              }}
            >
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Questionnaire;
