import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchIndustry,
    addIndustryRegistration,
    updateIndustryRegistration,
    deleteIndustryRegistration,
    uploadIndustryLogo
} from "../store/reducers/Industries/IndustriesSlice";
import { Button, Input, Table, Spin, message, Modal, Form, Switch,Avatar,Upload } from "antd";
import { EditOutlined, DeleteOutlined,UploadOutlined } from "@ant-design/icons";

const IndustryRegistration = () => {
    const dispatch = useDispatch();
    const { entities, loading, error, total } = useSelector((state) => state.industryRegistration);
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editItem, setEditItem] = React.useState(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchData();
    }, [pagination.current, pagination.pageSize, search]);

    const fetchData = () => {
        dispatch(fetchIndustry({ 
            pagingInfo: { skip: (pagination.current - 1) * pagination.pageSize, take: pagination.pageSize }, 
            controller: new AbortController(),
            search: search,
        }));
    };

    const handleAdd = async (values) => {
        dispatch(addIndustryRegistration(values))
            .unwrap()
            .then(() => {
                message.success("Industry added successfully");
                setIsModalOpen(false);
                form.resetFields();
                fetchData();
            })
            .catch((err) => message.error(err));
    };

    const handleEdit = async (values) => {
        dispatch(updateIndustryRegistration({ ...editItem, ...values }))
            .unwrap()
            .then(() => {
                message.success("Industry updated successfully");
                setIsModalOpen(false);
                setEditItem(null);
                form.resetFields();
                fetchData();
            })
            .catch((err) => message.error(err));
    };

    const handleDelete = (id,industryType) => {
        Modal.confirm({
            title: `Are you sure you want to delete this industry ${industryType}?`,
            onOk: () => {
                dispatch(deleteIndustryRegistration(id))
                    .unwrap()
                    .then(() => {
                        message.success("Industry deleted successfully");
                        fetchData();
                    })
                    .catch((err) => message.error(err));
            },
        });
    };

    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };
   


  const handleLogoUpload = async (id, file) => {
      if (file) {
        try {
          
                await dispatch(uploadIndustryLogo({ id, file })).unwrap();
          
          
                message.success("Project logo uploaded successfully!");
                fetchData();
              } catch (error) {
                message.error(`Project logo upload failed: ${error}`);
              }
            }
          };

    const columns = [
        {
            title: "Image",
            dataIndex: "imageUrl",
            key: "imageUrl",
            width:300,
            render: (_, record) => (
              <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar src={record.imageUrl} size={50} />
                  <div style={{ marginLeft: 10 }}>
                      <Upload
                      accept="image/*"
                                  beforeUpload={(file) => {
                                    handleLogoUpload(record.id, file);
                                    return false; // Prevent auto-upload by Ant Design
                                  }}
                                  showUploadList={false}
                                >
                                  <Button icon={<UploadOutlined />}>Upload Logo</Button>
                                </Upload>
                  </div>
              </div>
          ),
      },
        { title: "ID", dataIndex: "id", key: "id" ,hidden:"true"},
        { title: "Name", dataIndex: "industryType", key: "industryType",width:250 },
        {
            title: "InActive",
            dataIndex: "inActive",
            key: "inActive",
            render: (inActive, record) => (
                <Switch 
                    checked={!inActive} 
                    onChange={(checked) => {
                        const updatedRecord = { ...record, inActive: !checked };
                        dispatch(updateIndustryRegistration(updatedRecord))
                            .unwrap()
                            .then(() => fetchData())
                            .catch((err) => message.error(err));
                    }}
                />
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <>
                    <Button 
                        type="link" 
                        icon={<EditOutlined />} 
                        onClick={() => { setEditItem(record); setIsModalOpen(true); form.setFieldsValue(record); }} 
                    />
                    <Button 
                        type="link" 
                        icon={<DeleteOutlined />} 
                        danger 
                        onClick={() => handleDelete(record.id,record.industryType)} 
                    />
                </>
            ),
        },
    ];

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Industry Registration</h2>
            <Input 
                placeholder="Search by Name" 
                value={search} 
                onChange={handleSearch} 
                className="mb-4" 
            />
            <Button type="primary" onClick={() => { setIsModalOpen(true); form.resetFields(); }}>Add Industry</Button>
            <Spin spinning={loading} className="block mt-4">
                <Table 
                    columns={columns} 
                    dataSource={entities} 
                    rowKey="id" 
                    pagination={{ current: pagination.current, pageSize: pagination.pageSize, total }} 
                    onChange={handleTableChange} 
                />
            </Spin>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <Modal
                title={editItem ? "Edit Industry" : "Add Industry"}
                open={isModalOpen}
                onCancel={() => { setIsModalOpen(false); setEditItem(null); }}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={editItem ? handleEdit : handleAdd}>
                    <Form.Item name="industryType" label="Industry Name" rules={[{ required: true, message: "Please enter industry name" }]}> 
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default IndustryRegistration;
