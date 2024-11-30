import React from "react";
import { useDispatch } from "react-redux";
import { Form, Input, Button } from "antd";
import { addIndustryRegistration } from "../store/reducers/IndustryRegistration/IndustryRegistrationAction"; // Import the action

const IndustryRegistration = () => {
  const dispatch = useDispatch();

  const handleFinish = (values) => {
    const payload = {
      industryType: values.industryName,
    };
    const res = dispatch(addIndustryRegistration(payload)); // Dispatch the action to save data
    console.log("r",res )

    console.log("Form Data:", payload);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ textAlign: "center", color: "#333", fontWeight: "bold" }}>Industry Registration</h1>
      <Form
        layout="vertical"
        onFinish={handleFinish}
        style={{ maxWidth: "100%", margin: "0 auto", width: "50%" }}
        initialValues={{
          industryName: "",
        }}
      >
        {/* Industry Name */}
        <Form.Item
          label="Industry Name"
          name="industryName"
          rules={[{ required: true, message: "Please enter the industry name" }]}
        >
          <Input placeholder="Enter industry name" />
        </Form.Item>

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

export default IndustryRegistration;
