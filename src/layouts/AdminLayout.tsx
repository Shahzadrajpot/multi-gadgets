import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  SettingOutlined,
  PercentageOutlined,
  PictureOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: '/admin', icon: <DashboardOutlined />, label: <Link to="/admin">Dashboard</Link> },
  { key: '/admin/products', icon: <ShoppingOutlined />, label: <Link to="/admin/products">Products</Link> },
  { key: '/admin/categories', icon: <AppstoreOutlined />, label: <Link to="/admin/categories">Categories</Link> },
  { key: '/admin/orders', icon: <FileTextOutlined />, label: <Link to="/admin/orders">Orders</Link> },
  { key: '/admin/discounts', icon: <PercentageOutlined />, label: <Link to="/admin/discounts">Discounts</Link> },
  { key: '/admin/banners', icon: <PictureOutlined />, label: <Link to="/admin/banners">Banners</Link> },
  { key: '/admin/settings', icon: <SettingOutlined />, label: <Link to="/admin/settings">Settings</Link> },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const profileMenu = {
    items: [
      { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true },
    ],
    onClick: async ({ key }: { key: string }) => {
      if (key === 'logout') {
        try {
          await logout();
        } finally {
          navigate('/admin/login');
        }
      }
    },
  };

  return (
    <Layout className="pk-admin-layout">
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light" width={260}>
        <div className="pk-admin-logo">
          {collapsed ? 'MG' : 'Multi Gadgets'}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ height: 'calc(100% - 64px)', borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header className="pk-admin-header">
          <button
            className="pk-admin-trigger"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
          <Dropdown menu={profileMenu} placement="bottomRight">
            <div className="pk-admin-user">
              <Avatar icon={<UserOutlined />} />
              <span>Admin</span>
            </div>
          </Dropdown>
        </Header>
        <Content className="pk-admin-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
