import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Select, Button, Card, Typography, message } from "antd";
import { registerUser } from "../store/reducers/Signup/SignupSlice";
import { API } from "../utills/services";
import { Link } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;

const SignupForm = () => {
    const dispatch = useDispatch();
    const {loading,error} = useSelector((state) => state.signIn.loading);
  
    const onFinish = async (values) => {
        try {
          const response = await API.post("/Employee/Add", values);
          dispatch(registerUser(response.data));
          message.success("Signup successful!");
        } catch (error) {
          message.error("Signup failed. Please try again.");
        }
      };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f8f8f8",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "800px",
          background: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#a51d2d",
            padding: "20px",
          }}
        >
          <img
            src="/gcc.jpg"
            alt="Company Logo"
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </div>
        <div style={{ flex: 1, padding: "20px" }}>
          <Title level={3} style={{ color: "#a51d2d", textAlign: "center" }}>
            Signup
          </Title>
          {error && (
            <p style={{ color: "red", textAlign: "center" }}>{error}</p>
          )}
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Full Name"
              name="employeeName"
              rules={[
                { required: true, message: "Please enter your full name" },
              ]}
            >
              <Input placeholder="Enter your full name" />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please enter your address" }]}
            >
              <Input placeholder="Enter your address" />
            </Form.Item>

            <Form.Item
              label="Mobile Number"
              name="mobileNumber"
              rules={[
                { required: true, message: "Please enter your mobile number" },
                { len: 8, message: "Mobile number must be exactly 8 digits" },
              ]}
            >
              <Input placeholder="Enter 8-digit mobile number" maxLength={8} />
            </Form.Item>

            <Form.Item
              label="Email Address"
              name="emailaddress"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    return !value || getFieldValue("password") === value
                      ? Promise.resolve()
                      : Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm password" />
            </Form.Item>

            <Form.Item
              label="Account Type"
              name="accountType"
              rules={[
                { required: true, message: "Please select an account type" },
              ]}
            >
              <Select placeholder="Select account type">
                <Option value={1}>Admin</Option>
                <Option value={2}>Gcc Supervisor</Option>
                <Option value={3}>Gcc Agent</Option>
                <Option value={4}>Customer Supervisor</Option>
                <Option value={5}>Customer Agent</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                style={{ backgroundColor: "#a51d2d", borderColor: "#a51d2d" }}
              >
                Signup
              </Button>
            </Form.Item>
          </Form>
          <Typography.Text>
                      Already Has Account? <Link to="/login" style={{ color: 'rgb(165, 29, 45)' }}>Login here</Link>
                    </Typography.Text>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
