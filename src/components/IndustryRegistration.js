import React, { useEffect, useState } from "react"; // Added useState to the import
import { useDispatch, useSelector } from "react-redux"; // Added useSelector to fetch Redux state
import { Table, Button, Modal, Form, Input } from "antd";
import { addIndustryRegistration, fetchIndustry } from "../store/reducers/IndustryRegistration/IndustryRegistrationAction";

const IndustryRegistration = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); // Control modal visibility
  const [form] = Form.useForm(); // Form instance
  const dispatch = useDispatch();

  const { entities, loading, error, total } = useSelector(
    (state) => state.industryRegistration
  ); // Fetching data from Redux state

  const [pagingInfo, setPagingInfo] = useState({
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
    form.resetFields(); // Reset form fields after submission
  };

  // Fetch data on mount and whenever pagingInfo changes
  useEffect(() => {
    const controller = new AbortController();
    dispatch(fetchIndustry({ pagingInfo, controller }));
    return () => controller.abort(); // Cleanup on unmount
  }, [dispatch, pagingInfo]);

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

  // Handle pagination change
  const handleTableChange = (pagination) => {
    setPagingInfo((prev) => ({
      ...prev,
      skip: (pagination.current - 1) * pagination.pageSize,
      take: pagination.pageSize,
    }));
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ textAlign: "center", color: "#333", fontWeight: "bold" }}>
        Industry Registration
      </h1>

      {/* Add New Record Button */}
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add New Record
        </Button>
      </div>

      {/* Grid/Table */}
      <Table
        columns={columns}
        dataSource={entities}
        rowKey={(record) => record.id}
        loading={loading}
        pagination={{
          total,
          pageSize: pagingInfo.take,
          current: Math.floor(pagingInfo.skip / pagingInfo.take) + 1,
        }}
        bordered
        onChange={handleTableChange}
      />

      {/* Add New Record Modal */}
      <Modal
        title="Add New Industry"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handleAddRecord}>
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
