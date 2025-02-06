import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchticketstatus } from "../store/reducers/TicketStatus/statusSlice"
import { ExclamationCircleOutlined, ClockCircleOutlined, CheckCircleOutlined } from "@ant-design/icons"

import { Card, Col, Row, Spin, Empty } from 'antd';

const statusLabels = {
  Unassigned: 'Unassigned Tickets',
  Pending: 'Pending Tickets',
  Resolved: 'Resolved Tickets',
};

const statusConfig = {
  Unassigned: { label: 'Unassigned Tickets', icon: <ExclamationCircleOutlined style={{ fontSize: '30px', color: '#fa8c16' }} /> },
  Pending: { label: 'Pending Tickets', icon: <ClockCircleOutlined style={{ fontSize: '30px', color: '#1890ff' }} /> },
  Resolved: { label: 'Resolved Tickets', icon: <CheckCircleOutlined style={{ fontSize: '30px', color: '#52c41a' }} /> },
};

const StatusCards = ({ projectId = null }) => {
  const dispatch = useDispatch();
  const { statuses, loading, error } = useSelector((state) => state.status);

  useEffect(() => {
    dispatch(fetchticketstatus(projectId));
  }, [dispatch, projectId]);

  const getStatusCount = (status) => {
    const item = statuses.find((s) => s.Status === status);
    return item ? item.Count : 0;
  };

  return (
    <div style={{ padding: '20px', background: '#f5f5f5' }}>
      {loading ? (
        <Spin tip="Loading..." size="large" />
      ) : error ? (
        <Empty description={`Error: ${error}`} />
      ) : statuses.length === 0 ? (
        <Empty description="No Ticket Data Available" />
      ) : (
        <Row gutter={[16, 16]} justify="center">
          {Object.keys(statusConfig).map((status) => (
            <Col xs={24} sm={12} md={8} key={status}>
              <Card
                title={statusConfig[status].label}
                bordered={false}
                style={{
                  borderRadius: '12px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  textAlign: 'center',
                  height: '180px',
                }}
              >
                <div style={{ marginBottom: '10px' }}>{statusConfig[status].icon}</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
                  {getStatusCount(status)}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default StatusCards;