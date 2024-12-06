import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Table, Button, Modal, Form, Input } from "antd";
import { addIndustryRegistration,fetchIndustry} from "../store/reducers/IndustryRegistration/IndustryRegistrationAction";

const IndustryRegistration = () => {
  const [data, setData] = useState([]); // Store table data
  const [isModalVisible, setIsModalVisible] = useState(false); // Control modal visibility
  const [form] = Form.useForm(); // Form instance
  const dispatch = useDispatch();

  const [pagingInfo, setpagingInfo] = useState({
    skip: 0,
    take: 10, // Initial page size
    filter: {
      logic: "and",
      filters: [],
    },
    group: [],
    sort: [],
  });


  // Handle form submission
  const handleAddRecord = (values) => {
    const payload = {
      industryType: values.industryName,
    };
    dispatch(addIndustryRegistration(payload)); 
    setIsModalVisible(false); // Close modal
  };

  useEffect(() => {
    const controller = new AbortController();
    dispatch(fetchIndustry({ pagingInfo, controller }))

  }, []);

  // Table columns
  const columns = [
    {
      title: "Row ID",
      dataIndex: "id",
      key: "id",
      width: "20%",
    },
    {
      title: "Industry Name",
      dataIndex: "industryType",
      key: "industryType",
      width: "80%",
    },
  ];

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ textAlign: "center", color: "#333", fontWeight: "bold" }}>Industry Registration</h1>
      
      {/* Add New Record Button */}
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add New Record
        </Button>
      </div>
      
      {/* Grid/Table */}
      <Table 
        columns={columns} 
        dataSource={data} 
        pagination={{ pageSize: 5 }} 
        bordered 
      />

      {/* Add New Record Modal */}
      <Modal
        title="Add New Industry"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleAddRecord}
        >
          <Form.Item
            label="Industry Name"
            name="industryName"
            rules={[{ required: true, message: "Please enter the industry name" }]}
          >
            <Input placeholder="Enter industry name" />
          </Form.Item>
          <Form.Item style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default IndustryRegistration;
