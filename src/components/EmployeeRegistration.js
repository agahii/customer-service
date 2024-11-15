import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Input, Button, Row, Col, Select } from "antd";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { addEmployeeRegistration } from "../store/reducers/EmployeeRegistration/EmployeeRegistrationAction"; // Import the action

const EmployeeRegistration = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const handleFinish = (values) => {
    const payload = {
      employeeName: values.employeeName,
      whatsapp,
      email: values.email,
      phone,
      position: values.position,
      department: values.department,
      preferredContact: values.preferredContact,
    };
    dispatch(addEmployeeRegistration(payload)); // Dispatch the action to save data
    console.log("Form Data:", payload);
  };

  const validatePhoneNumber = (rule, value) => {
    if (!value) return Promise.resolve();
    return isValidPhoneNumber(value)
      ? Promise.resolve()
      : Promise.reject("Invalid phone number format");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ textAlign: "center", color: "#333", fontWeight: "bold" }}>Employee Registration</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        style={{ maxWidth: "100%", margin: "0 auto", width: "80%" }}
        initialValues={{
          employeeName: "",
          whatsapp: "",
          email: "",
          phone: "",
          position: "",
          department: "",
          preferredContact: "",
        }}
      >
        {/* Employee Name */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Employee Name"
              name="employeeName"
              rules={[{ required: true, message: "Please enter employee name" }]}
            >
              <Input placeholder="Enter employee name" />
            </Form.Item>
          </Col>
        </Row>

        {/* Phone Number and WhatsApp Number */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[
                { required: true, message: "Please enter your phone number" },
                { validator: validatePhoneNumber },
              ]}
            >
              <PhoneInput
                international
                defaultCountry="US"
                value={phone}
                onChange={setPhone}
                placeholder="Enter phone number"
                className="phone-input-custom"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="WhatsApp Number"
              name="whatsapp"
              rules={[
                { required: true, message: "Please enter your WhatsApp number" },
                { validator: validatePhoneNumber },
              ]}
            >
              <PhoneInput
                international
                defaultCountry="US"
                value={whatsapp}
                onChange={setWhatsapp}
                placeholder="Enter WhatsApp number"
                className="phone-input-custom"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Email Address */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "Please enter your email address" },
                { type: "email", message: "Please enter a valid email address" },
              ]}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>
          </Col>
        </Row>

        {/* Position */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Position"
              name="position"
              rules={[{ required: true, message: "Please enter position" }]}
            >
              <Input placeholder="Enter position" />
            </Form.Item>
          </Col>
        </Row>

        {/* Department */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Department"
              name="department"
              rules={[{ required: true, message: "Please enter department" }]}
            >
              <Input placeholder="Enter department" />
            </Form.Item>
          </Col>
        </Row>

        {/* Preferred Contact */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Preferred Contact"
              name="preferredContact"
              rules={[{ required: true, message: "Please select a preferred contact method" }]}
            >
              <Select placeholder="Select preferred contact">
                <Select.Option value="phone">Phone</Select.Option>
                <Select.Option value="whatsapp">WhatsApp</Select.Option>
                <Select.Option value="email">Email</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Submit Button */}
        <Form.Item style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit" style={{ width: "150px" }}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EmployeeRegistration;
