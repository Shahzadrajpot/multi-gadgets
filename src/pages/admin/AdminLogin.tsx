import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Card, App } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import './AdminLogin.css';

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = App.useApp();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success('Login successful');
      // Redirect after a small delay to allow auth state to update
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 300);
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="pk-admin-login">
      <Card className="pk-admin-login-card">
        <h1>Multi Gadgets</h1>
        <p className="pk-admin-login-subtitle">Admin Control Panel</p>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, type: 'email', message: 'Enter valid email' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Enter password' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
