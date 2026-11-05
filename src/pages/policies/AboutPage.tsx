import { useEffect } from 'react';
import { Button, Row, Col } from 'antd';
import { ThunderboltOutlined, CheckCircleOutlined, StarOutlined, WhatsAppOutlined, RocketOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './policies.css';

export default function AboutPage() {
  const { storeSettings } = useApp();

  useEffect(() => {
    document.title = 'About Us | Multi Gadgets';
  }, []);

  const whatsappUrl = `https://wa.me/${storeSettings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hello Multi Gadgets, I would like to learn more about your store.')}`;

  return (
    <div className="pk-policy-page pk-container">
      <div className="pk-policy-card">
        <div className="pk-policy-header">
          <div className="pk-policy-badge">
            <ThunderboltOutlined /> Premium Tech Gear
          </div>
          <h1>About Multi Gadgets</h1>
          <p>Delivering authentic smartwatches, wireless audio, and fast charging tech nationwide.</p>
        </div>

        <div className="pk-policy-content">
          <div className="pk-policy-section">
            <h2><RocketOutlined /> Our Mission</h2>
            <p>
              Welcome to <strong>Multi Gadgets</strong> — your trusted online store for cutting-edge consumer electronics, wearable tech, and mobile accessories in Pakistan.
            </p>
            <p>
              Our mission is simple: provide tech enthusiasts and everyday smartphone users with high-performance gadgets at honest, affordable prices, backed by responsive customer support and nationwide Cash on Delivery.
            </p>
          </div>

          <div className="pk-policy-section">
            <h2>Why Choose Multi Gadgets?</h2>
            <Row gutter={[20, 20]} style={{ marginTop: 16 }}>
              <Col xs={24} sm={12}>
                <div className="pk-contact-card">
                  <CheckCircleOutlined />
                  <h3>100% Quality Tested</h3>
                  <p>Every piece of hardware is inspected and tested before packaging.</p>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div className="pk-contact-card">
                  <StarOutlined />
                  <h3>7-Day Replacement</h3>
                  <p>Hassle-free warranty on all gadgets for complete peace of mind.</p>
                </div>
              </Col>
            </Row>
          </div>

          <div className="pk-policy-cta">
            <h3>Ready to upgrade your daily gear?</h3>
            <p>Explore our curated collections of smart accessories and audio tech.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/shop">
                <Button type="primary" size="large">Browse Products</Button>
              </Link>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button size="large" icon={<WhatsAppOutlined />}>Contact Support</Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
