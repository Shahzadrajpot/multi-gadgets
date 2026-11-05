import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import Header from './Header';
import Footer from './Footer';
import FloatingWhatsApp from './FloatingWhatsApp';
import MobileStickyCart from './MobileStickyCart';
import './MainLayout.css';

const { Content } = Layout;

export default function MainLayout() {
  return (
    <Layout className="pk-main-layout">
      <Header />
      <Content className="pk-content">
        <Outlet />
      </Content>
      <Footer />
      <FloatingWhatsApp />
      <MobileStickyCart />
    </Layout>
  );
}
