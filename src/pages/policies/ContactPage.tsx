import { useEffect } from 'react';
import { Button } from 'antd';
import { PhoneOutlined, WhatsAppOutlined, MailOutlined, ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useApp } from '../../context/AppContext';
import './policies.css';

export default function ContactPage() {
  const { storeSettings } = useApp();

  useEffect(() => {
    document.title = 'Contact Us | Multi Gadgets';
  }, []);

  const whatsappUrl = `https://wa.me/${storeSettings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hello Multi Gadgets Support team, I have a question about...')}`;

  return (
    <div className="pk-policy-page pk-container">
      <div className="pk-policy-card">
        <div className="pk-policy-header">
          <div className="pk-policy-badge">
            <PhoneOutlined /> Customer Support
          </div>
          <h1>Get in Touch</h1>
          <p>We are here to assist with order tracking, product inquiries, and warranty assistance.</p>
        </div>

        <div className="pk-contact-grid">
          <div className="pk-contact-card">
            <WhatsAppOutlined style={{ color: '#25D366' }} />
            <h3>WhatsApp Support</h3>
            <p style={{ fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>+{storeSettings.whatsappNumber}</p>
            <p>Instant chat response</p>
          </div>

          <div className="pk-contact-card">
            <ClockCircleOutlined />
            <h3>Working Hours</h3>
            <p style={{ fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>Mon - Sat: 10:00 AM - 9:00 PM</p>
            <p>Sunday: Closed (Messages queued)</p>
          </div>

          <div className="pk-contact-card">
            <EnvironmentOutlined />
            <h3>Order Dispatch Hub</h3>
            <p style={{ fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>Karachi & Lahore Fulfillment Centers</p>
            <p>Fast nationwide dispatch</p>
          </div>

          <div className="pk-contact-card">
            <MailOutlined />
            <h3>Email Support</h3>
            <p style={{ fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>support@multigadgets.pk</p>
            <p>Response within 24 hours</p>
          </div>
        </div>

        <div className="pk-policy-cta">
          <h3>Prefer to chat directly?</h3>
          <p>Tap below to start a live WhatsApp chat with our support team.</p>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button type="primary" size="large" icon={<WhatsAppOutlined />} style={{ background: '#25D366', borderColor: '#25D366' }}>
              Chat on WhatsApp Now
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
