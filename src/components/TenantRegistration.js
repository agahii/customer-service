import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, DatePicker, Select, Divider, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { isValidPhoneNumber } from 'react-phone-number-input';
import moment from 'moment';
import './TenantRegistration.css';



import { addTenantRegistration}  from "../store/reducers/TenantRegistration/TenantRegistrationAction";  



const TenantRegistration = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("+1234567890"); // Properly formatted international number
  const [whatsapp, setWhatsapp] = useState("+1234567890");
  const handleFinish = (values) => {
    let payload = {
      companyName: values.fullName,
    }
    dispatch(addTenantRegistration(payload))
    console.log("Form Data:", payload);
    //alert("Registration Successful!");
    //navigate("/some-path");
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
          fullName: "John Doe",
          email: "johndoe@example.com",
          phone: "+14155552671",
          whatsapp: "+14155552671",
          office: "1234567890",
          landline: "0987654321",
          fax: "123456789",
          alternateEmail: "alternate@example.com",
          contactPerson: "Jane Doe",
          registrationDate: moment(), // Set to today's date
          website: "https://www.company.com",
          contactMethod: "email",
          comments: "Sample comments or notes."
        }}
      >
        {/* Full Name and Email Address */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[{ required: true, message: "Please enter your full name" }]}
            >
             
              <Input placeholder="Enter full name"  />
            </Form.Item>
          </Col>
          <Col span={12}>
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

        {/* Office Number and Landline Number */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Office Number"
              name="office"
              rules={[{ required: true, message: "Please enter your office number" }]}
            >
              <Input type="number" placeholder="Enter office number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Landline Number" name="landline">
              <Input type="number" placeholder="Enter landline number" />
            </Form.Item>
          </Col>
        </Row>

        {/* Fax Number and Alternate Email */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Fax Number (optional)" name="fax">
              <Input type="number" placeholder="Enter fax number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Alternate Email" name="alternateEmail">
              <Input placeholder="Enter alternate email" />
            </Form.Item>
          </Col>
        </Row>

        {/* Contact Person and Date of Registration */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Contact Person" name="contactPerson">
              <Input placeholder="Enter contact person" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Date of Registration"
              name="registrationDate"
              rules={[
                { required: true, message: "Please select the registration date" },
                {
                  validator: (_, value) =>
                    value && value.isBefore(new Date()) ? Promise.resolve() : Promise.reject("Date must be in the past"),
                },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* Company Website and Preferred Contact Method */}
        <Row gutter={16}>
          <Col span={12}>
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
          <Col span={12}>
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
        <Form.Item label="Notes/Comments" name="comments">
          <Input.TextArea rows={4} placeholder="Additional comments or notes" maxLength={300} />
        </Form.Item>

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
