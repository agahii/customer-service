// src/components/Login.js

import React, { useState } from "react";
import { Button, Form, Input, Typography, Layout, message } from "antd";
import { API } from "../utills/services"; // Import the API instance
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Title, Text } = Typography;

const Login = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      console.log("Submitting login with values:", values); // Debugging

      const response = await API.post("/Account/Login", {
        email: values.email, // Changed from values.username to values.email
        password: values.password,
      });

      console.log("API Response:", response); // Debugging

      const { responseCode, message: apiMessage, data } = response.data;

      if (responseCode === 1000) { // Assuming 1000 is success
        const { token } = data;
        if (token) {
          localStorage.setItem("authToken", token);
          API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          message.success("Login successful!");
          onLogin();
          navigate("/"); // Redirect to home or desired page
        } else {
          message.error("Invalid response from server.");
        }
      } else if (responseCode === 2000) {
        message.warning(apiMessage || "You need to confirm your email.");
      } else {
        message.error(apiMessage || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMsg =
        error.response?.data?.message || "Login failed. Please try again.";
      message.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#1f1f1f" }}>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#3a3a3a",
            padding: "40px",
            borderRadius: "8px",
            width: "100%",
            maxWidth: "400px",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Title level={3} style={{ color: "#ffffff" }}>
            Login
          </Title>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label={<Text style={{ color: "#e0e0e0" }}>Email</Text>}
              name="email" // Changed from "username" to "email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              label={<Text style={{ color: "#e0e0e0" }}>Password</Text>}
              name="password"
              rules={[{ required: true, message: "Please enter your password" }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isLoading} block>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="link"
                onClick={() => navigate("/signup")}
                style={{ color: "#ffffff" }}
              >
                Don't have an account? Sign Up
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default Login;
