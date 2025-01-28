// src/components/Signup.js

import React, { useState } from "react";
import { Button, Form, Input, Typography, Layout, message,Select } from "antd";
import { API } from "../utills/services"; // Import the API instance
import { useNavigate } from "react-router-dom";
import { selectAccountTypes } from "../store/reducers/AccountType/AccountTypeSlice";
import { useSelector } from "react-redux";
import FormItem from "antd/es/form/FormItem";
const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (value) => {
    console.log("Selected Account Type ID:", value);
    
  };

  const accountType = useSelector(selectAccountTypes);
  const handleSignup = async (values) => {
    setIsLoading(true);


  
    try {
      const response = await API.post("/Account/signup", {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        mobileNumber: values.mobileNumber,
        accountType:values.accountType
      });

      message.success("Registration successful! Please log in.");
      navigate("/login"); // Redirect to login page after successful signup
    } catch (error) {
      console.error("Signup error:", error);
      const errorMsg =
        error.response?.data?.message || "Registration failed. Please try again.";
      message.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#1f1f1f" }}>
      <Content style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            backgroundColor: "#3a3a3a",
            padding: "40px",
            borderRadius: "8px",
            width: "100%",
            maxWidth: "500px",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Title level={3} style={{ color: "#ffffff" }}>
            Sign Up
          </Title>
          <Form layout="vertical" onFinish={handleSignup}>
            <Form.Item
              name="firstName"
              label={<Text style={{ color: "#e0e0e0" }}>First Name</Text>}
              rules={[{ required: true, message: "Please enter your first name" }]}
            >
              <Input placeholder="First Name" />
            </Form.Item>
            <Form.Item
              name="lastName"
              label={<Text style={{ color: "#e0e0e0" }}>Last Name</Text>}
              rules={[{ required: true, message: "Please enter your last name" }]}
            >
              <Input placeholder="Last Name" />
            </Form.Item>
            <Form.Item
              name="email"
              label={<Text style={{ color: "#e0e0e0" }}>Email</Text>}
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="mobileNumber"
              label={<Text style={{ color: "#e0e0e0" }}>Mobile Number</Text>}
              rules={[
                { required: true, message: "Please enter your mobile number" },
                { pattern: /^\d+$/, message: "Mobile number must be numeric" },
              ]}
            >
              <Input placeholder="Mobile Number" />
            </Form.Item>
            <Form.Item
              name="password"
              label={<Text style={{ color: "#e0e0e0" }}>Password</Text>}
              rules={[
                { required: true, message: "Please enter your password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label={<Text style={{ color: "#e0e0e0" }}>Confirm Password</Text>}
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm Password" />
            </Form.Item>
            <FormItem name="accountype"
              label={<Text style={{ color: "#e0e0e0" }}>Account Type</Text>}
              rules={[
                { required: true, message: "Please Account Type" },
                
              ]}>
            <Select
        placeholder="Select an Account Type"
        style={{ width: "100%" }}
        onChange={handleChange}
      >
        {accountType.map((type) => (
          <Option key={type.id} value={type.id}>
            {type.name}
          </Option>
        ))}
      </Select>
      </FormItem>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isLoading} block>
                {isLoading ? "Signing up..." : "Sign Up"}
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="link" onClick={() => navigate("/login")} style={{ color: "#ffffff" }}>
                Already have an account? Log In
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default Signup;
