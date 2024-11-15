import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Input, Button, Select, Divider, Row, Col } from "antd";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { addTenantRegistration } from "../store/reducers/TenantRegistration/TenantRegistrationAction";
import './TenantRegistration.css';

const TenantRegistration = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [phone, setPhone] = useState("+1234567890"); // Properly formatted international number
  const [whatsapp, setWhatsapp] = useState("+1234567890");
  
  const handleFinish = (values) => {
    let payload = {
      companyName: values.companyName, // Update here to match the form field
    };
    dispatch(addTenantRegistration(payload));
    console.log("Form Data:", payload);
  };

  const validatePhoneNumber = (rule, value) => {
    if (!value) return Promise.resolve();
    return isValidPhoneNumber(value) ? Promise.resolve() : Promise.reject("Invalid phone number format");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ textAlign: "center", color: "#333", fontWeight: "bold" }}>Tenant Registration</h1>
      <Divider />
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        style={{ maxWidth: "100%", margin: "0 auto", width: "80%" }}
        initialValues={{
          companyName: "Sample Company", // Default company name
          email: "johndoe@example.com",
          phone: "+14155552671",
          whatsapp: "+14155552671",
          office: "1234567890",
          landline: "0987654321",
          fax: "123456789",
          alternateEmail: "alternate@example.com",
          contactPerson: "Jane Doe",
          website: "https://www.company.com",
          contactMethod: "email",
          comments: "Sample comments or notes."
        }}
      >
        {/* Company Name */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Company Name"
              name="companyName" // Change the name to companyName
              rules={[{ required: true, message: "Please enter the company name" }]}
            >
              <Input placeholder="Enter company name" />
            </Form.Item>
          </Col>
        </Row>

        {/* Contact Person and Email Address (Swapped order) */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Contact Person"
              name="contactPerson"
              rules={[{ required: true, message: "Please enter contact person" }]}
            >
              <Input placeholder="Enter contact person" />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "Please enter your email address" },
                { type: 'email', message: "Please enter a valid email address" }
              ]}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>
          </Col>
        </Row>

        {/* Phone Number and WhatsApp Number */}
        <Row gutter={16}>
          <Col span={24}>
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
        </Row>

        <Row gutter={16}>
          <Col span={24}>
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

        {/* Office Number and Landline Number */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Office Number"
              name="office"
              rules={[{ required: true, message: "Please enter your office number" }]}
            >
              <Input type="number" placeholder="Enter office number" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Landline Number" name="landline">
              <Input type="number" placeholder="Enter landline number" />
            </Form.Item>
          </Col>
        </Row>

        {/* Fax Number and Alternate Email */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Fax Number (optional)" name="fax">
              <Input type="number" placeholder="Enter fax number" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Alternate Email" name="alternateEmail">
              <Input placeholder="Enter alternate email" />
            </Form.Item>
          </Col>
        </Row>

        {/* Company Website and Preferred Contact Method */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Company Website"
              name="website"
              rules={[
                { 
                  pattern: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .?%&=]*)?$/, 
                  message: "Please enter a valid website (e.g., https://www.company.com)"
                }
              ]}
            >
              <Input placeholder="Enter company website (optional)" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Preferred Contact Method"
              name="contactMethod"
              rules={[{ required: true, message: "Please select a contact method" }]}
            >
              <Select placeholder="Select contact method">
                <Select.Option value="email">Email</Select.Option>
                <Select.Option value="phone">Phone</Select.Option>
                <Select.Option value="whatsapp">WhatsApp</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Notes/Comments */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Notes/Comments" name="comments">
              <Input.TextArea rows={4} placeholder="Additional comments or notes" maxLength={300} />
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

export default TenantRegistration;
