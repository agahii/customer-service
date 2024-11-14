import React, { useState } from "react";
import { Button, Form, Input, Typography, Layout } from "antd";

const { Content } = Layout;
const { Title, Text } = Typography;

const Login = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (values) => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin();  // Simulate login
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#1f1f1f" }}>
      <Content style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{
          backgroundColor: "#3a3a3a",
          padding: "40px",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
        }}>
          <Title level={3} style={{ color: "#ffffff" }}>Login</Title>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label={<Text style={{ color: "#e0e0e0" }}>Username</Text>}
              name="username"
              rules={[{ required: true, message: "Please enter your username" }]}
            >
              <Input placeholder="Username" />
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
          </Form>
        </div>
      </Content>
    </Layout>
  );
};


export default Login;
