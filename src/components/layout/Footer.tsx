import { Link } from 'react-router-dom';
import { Input, Button } from 'antd';
import { WhatsAppOutlined } from '@ant-design/icons';
import { useApp } from '../../context/AppContext';
import './Footer.css';

export default function Footer() {
  const { storeSettings } = useApp();

  const whatsappUrl = `https://wa.me/${storeSettings.whatsappNumber.replace(/\D/g, '')}`;

  return (
    <footer className="pk-footer">
      <div className="pk-footer-main pk-container">
        <div className="pk-footer-grid">
          <div className="pk-footer-brand">
            <h3 className="pk-footer-logo">Multi Gadgets</h3>
            <p>Your one-stop destination for premium tech accessories, smart gadgets, wireless audio, and fast charging gear.</p>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="pk-whatsapp-btn">
              <WhatsAppOutlined /> Chat on WhatsApp
            </a>
          </div>

          <div className="pk-footer-links">
            <h4>Quick Links</h4>
            <Link to="/shop">Shop All</Link>
            <Link to="/shop?category=smart-watches">Smart Watches</Link>
            <Link to="/shop?category=wireless-audio">Wireless Audio</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="pk-footer-links">
            <h4>Support</h4>
            <Link to="/shipping">Shipping Info</Link>
            <Link to="/returns">Return Policy</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>

          <div className="pk-footer-newsletter">
            <h4>Stay Updated</h4>
            <p>Subscribe for new gadget arrivals and exclusive tech deals.</p>
            <div className="pk-newsletter-form">
              <Input placeholder="Your email" size="large" />
              <Button type="primary" size="large">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="pk-footer-bottom">
        <div className="pk-container pk-footer-bottom-inner">
          <p>© {new Date().getFullYear()} Multi Gadgets. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
