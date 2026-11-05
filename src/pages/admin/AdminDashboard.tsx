import { useState, useEffect } from 'react';
import { Row, Col, Card, Table } from 'antd';
import { ShoppingOutlined, InboxOutlined, DollarOutlined, TagOutlined, FileTextOutlined } from '@ant-design/icons';
import { AdminDashboardSkeleton } from '../../components/shared/Skeletons';
import { getOrderStats } from '../../services/orderService';
import { fetchOrders } from '../../services/orderService';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    outOfStock: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOrderStats(), fetchOrders({ pageSize: 5 })])
      .then(([s, orders]) => {
        setStats(s);
        setRecentOrders(orders);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { title: 'Total Products', value: stats.totalProducts, icon: <ShoppingOutlined /> },
    { title: 'Active Products', value: stats.activeProducts, icon: <TagOutlined /> },
    { title: 'Out of Stock', value: stats.outOfStock, icon: <InboxOutlined /> },
    { title: 'Total Orders', value: stats.totalOrders, icon: <FileTextOutlined /> },
    { title: 'Pending Orders', value: stats.pendingOrders, icon: <FileTextOutlined /> },
    { title: 'Total Revenue', value: `Rs. ${stats.totalRevenue.toLocaleString()}`, icon: <DollarOutlined /> },
  ];

  if (loading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="pk-admin-dashboard">
      <h1>Dashboard Overview</h1>
      <Row gutter={[24, 24]}>
        {statCards.map((stat, i) => (
          <Col xs={12} md={8} lg={4} key={i}>
            <Card className="pk-stat-card">
              <div className="pk-stat-icon">{stat.icon}</div>
              <div className="pk-stat-content">
                <span className="pk-stat-value">{stat.value}</span>
                <span className="pk-stat-title">{stat.title}</span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Recent Orders">
            <Table
              dataSource={recentOrders}
              columns={[
                { title: 'Order ID', dataIndex: 'order_number', key: 'order_number' },
                { title: 'Customer', dataIndex: 'customer_name', key: 'customer_name' },
                {
                  title: 'Total',
                  dataIndex: 'total',
                  key: 'total',
                  render: (v: number) => `Rs. ${(v || 0).toLocaleString()}`,
                },
                { title: 'Status', dataIndex: 'status', key: 'status' },
              ]}
              pagination={false}
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
