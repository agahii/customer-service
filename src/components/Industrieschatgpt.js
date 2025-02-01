// IndustryPage.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  Upload,
  message,
  Pagination,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  fetchIndustries,
  createIndustry,
  updateIndustry,
  deleteIndustry,
  uploadIndustryImage,
} from "../store/reducers/Industries/IndustriesSlice_chatgpt";

const IndustryPage = () => {
  const dispatch = useDispatch();
  const { industries, totalRecords, pageSize, pageIndex, loading, error } =
    useSelector((state) => state.industry);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 3 });

  useEffect(() => {
    dispatch(fetchIndustries({ 
      skip: (pagination.current - 1) * pagination.pageSize, 
      take: pagination.pageSize, 
      caseSensitive: false 
    }));
  }, [dispatch, pagination.current, pagination.pageSize]);
  

  const handleCreateOrUpdate = async (values) => {
    if (selectedIndustry) {
      await dispatch(updateIndustry({ ...selectedIndustry, ...values }));
    } else {
      await dispatch(createIndustry(values));
    }
    setIsModalVisible(false);
    setSelectedIndustry(null);
    form.resetFields();
    dispatch(
      fetchIndustries({
        skip: (pagination.current - 1) * pagination.pageSize,
        take: pagination.pageSize,
        caseSensitive: false,
      })
    );
  };

  useEffect(() => {
    if (selectedIndustry) {
      form.setFieldsValue(selectedIndustry);
    }
  }, [selectedIndustry, form]);

  const handleDelete = (industry) => {
    Modal.confirm({
      title: `Are you sure to delete ${industry.industryType}?`,
      onOk: async () => {
        await dispatch(deleteIndustry(industry.id));
        dispatch(
          fetchIndustries({
            skip: (pagination.current - 1) * pagination.pageSize,
            take: pagination.pageSize,
            caseSensitive: false,
          })
        );
      },
    });
  };

  const handleUpload = (info, id) => {
    if (info.file.status === "done") {
      dispatch(uploadIndustryImage({ id, file: info.file.originFileObj }));
    }
  };

  const handleSearch = () => {
    dispatch(
      fetchIndustries({
        skip: 0,
        take: pagination.pageSize,
        caseSensitive: false,
        filters: { name: searchQuery },
      })
    );
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", hidden: true },
    { title: "Industry Name", dataIndex: "industryType", key: "industryType" },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text) => <img src={text} alt="Industry" width={50} />,
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (text, record) => <Switch checked={record.isActive} />,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            onClick={() => {
              setSelectedIndustry(record);
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(record)}>
            Delete
          </Button>
          <Upload
            showUploadList={false}
            customRequest={(info) => handleUpload(info, record.id)}
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </>
      ),
    },
  ];

  return (
    <div>
      <Input.Search
        placeholder="Search Industries"
        onSearch={handleSearch}
        onChange={(e) => setSearchQuery(e.target.value)}
        enterButton
      />
      <Button
        type="primary"
        onClick={() => {
          setSelectedIndustry(null);
          form.resetFields(); 
          setIsModalVisible(true);
        }}
      >
        Add Industry
      </Button>
      <Table
        dataSource={industries}
        columns={columns}
        //rowKey={(record) => record.id}
        rowKey="id"
        loading={loading}
        //pagination={false}
        pagination={{
          
          pageSize: pagination.pageSize,
          current: Math.floor(0 / pagination.pageSize) + 1,
        }}
      />
      {/* <Pagination current={pagination.current} total={totalRecords} pageSize={pageSize} onChange={(page) => setPagination({ ...pagination, current: page })} /> */}
      <Pagination
  current={pagination.current}
  total={totalRecords}  
  pageSize={pagination.pageSize}
  onChange={(page, pageSize) => setPagination({ current: page, pageSize })}
/>

      <Modal
        title={selectedIndustry ? "Edit Industry" : "Add Industry"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedIndustry(null);
        }}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          onFinish={handleCreateOrUpdate}
          initialValues={selectedIndustry || {}}
        >
          <Form.Item
            name="industryType"
            label="Industry Name"
            rules={[{ required: true, message: "Please enter industry name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default IndustryPage;
