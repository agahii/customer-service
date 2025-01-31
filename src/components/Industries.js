import React, { useEffect, useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Card, Row, Col, Typography, message, Table, Input, Modal, Form } from 'antd';
import { UserOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, PlusOutlined, EditOutlined, DeleteOutlined, FileExcelOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { logout } from "../store/reducers/Login/LoginSlice";
import { fetchIndustries, addIndustry, updateIndustry, deleteIndustry } from '../store/reducers/Industries/IndustriesSlice';
import * as XLSX from 'xlsx';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

const IndustriesPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState(null);
  const [form] = Form.useForm();
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem('authToken');
  const industries = useSelector((state) => state.industry.industries);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      dispatch(fetchIndustries());
    }
  }, [token, navigate, dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    dispatch(logout());
    axios.defaults.headers.common['Authorization'] = '';
    navigate('/login');
  };

  const showModal = (industry = null) => {
    setEditingIndustry(industry);
    form.setFieldsValue(industry || { name: '' });
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteIndustry(id));
  };

  const handleSubmit = (values) => {
    if (editingIndustry) {
      dispatch(updateIndustry({ id: editingIndustry.id, ...values }));
    } else {
      dispatch(addIndustry(values));
    }
    setModalVisible(false);
    form.resetFields();
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(industries);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Industries');
    XLSX.writeFile(workbook, 'industries.xlsx');
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Actions', key: 'actions', render: (_, record) => (
      <>
        <Button icon={<EditOutlined />} onClick={() => showModal(record)} style={{ marginRight: 8 }} />
        <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} danger />
      </>
    )}
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* <Sider collapsible collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} style={{ background: 'linear-gradient(to bottom, #a51d2d, #6b0f1a)', paddingTop: '20px' }}>
        <Menu theme="dark" mode="inline" style={{ background: 'transparent', marginTop: '20px' }}>
          <Menu.Item key="dashboard" onClick={() => navigate('/')} >Dashboard</Menu.Item>
          <Menu.Item key="industries" onClick={() => navigate('/industries')}>Industries</Menu.Item>
        </Menu>
      </Sider> */}
      <Layout>
        <Header style={{ backgroundColor: 'rgb(165, 29, 45)', display: 'flex', justifyContent: 'space-between', padding: '0 20px' }}>
          <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} style={{ color: 'white' }} />
          <Dropdown overlay={<Menu><Menu.Item onClick={handleLogout} icon={<LogoutOutlined />}>Logout</Menu.Item></Menu>}>
            <div style={{ color: 'white', cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} /> <span>Admin</span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: '20px', background: '#fff', padding: '20px' }}>
          <Title level={3}>Industries</Title>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Search placeholder="Search Industries" style={{ width: 300 }} />
            <div>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>Add Industry</Button>
              <Button icon={<FileExcelOutlined />} onClick={exportToExcel} style={{ marginLeft: 8 }}>Export</Button>
            </div>
          </div>
          <Table dataSource={industries} columns={columns} rowKey="id" />
          <Modal title={editingIndustry ? "Edit Industry" : "Add Industry"} visible={modalVisible} onCancel={() => setModalVisible(false)} onOk={() => form.submit()}>
            <Form form={form} onFinish={handleSubmit} layout="vertical">
              <Form.Item name="name" label="Industry Name" rules={[{ required: true, message: 'Please enter industry name' }]}> 
                <Input />
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default IndustriesPage;
