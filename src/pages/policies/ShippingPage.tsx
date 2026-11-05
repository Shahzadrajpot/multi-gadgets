import { useEffect } from 'react';
import { Button } from 'antd';
import { TruckOutlined, ClockCircleOutlined, DollarOutlined, SafetyCertificateOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { useApp } from '../../context/AppContext';
import './policies.css';

export default function ShippingPage() {
  const { storeSettings } = useApp();

  useEffect(() => {
    document.title = 'Shipping Policy | Multi Gadgets';
  }, []);

  const whatsappUrl = `https://wa.me/${storeSettings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hi, I have a question about shipping my order.')}`;

  return (
    <div className="pk-policy-page pk-container">
      <div className="pk-policy-card">
        <div className="pk-policy-header">
          <div className="pk-policy-badge">
            <TruckOutlined /> Nationwide Delivery
          </div>
          <h1>Shipping & Delivery Policy</h1>
          <p>Fast, reliable Cash on Delivery (COD) to all cities across Pakistan.</p>
        </div>

        <div className="pk-policy-content">
          <div className="pk-policy-section">
            <h2><ClockCircleOutlined /> Delivery Timeframes</h2>
            <p>We process and dispatch all orders within 24 hours of confirmation.</p>
            <ul>
              <li><strong>Major Metros (Karachi, Lahore, Islamabad, Rawalpindi):</strong> 2 to 3 business days.</li>
              <li><strong>Other Cities & Towns:</strong> 3 to 5 business days.</li>
              <li><strong>Remote / Rural Areas:</strong> 4 to 6 business days.</li>
            </ul>
          </div>

          <div className="pk-policy-section">
            <h2><DollarOutlined /> Shipping Rates</h2>
            <p>
              Standard flat-rate shipping nationwide is <strong>Rs. {storeSettings.deliveryCharges}</strong> via leading courier partners (Trax, PostEx, TCS, Leopards).
            </p>
            <p>
              Special promotions or orders exceeding designated threshold amounts automatically qualify for <strong>Free Shipping</strong> at checkout.
            </p>
          </div>

          <div className="pk-policy-section">
            <h2><SafetyCertificateOutlined /> Order Tracking & Verification</h2>
            <p>
              Once your parcel is dispatched, you will receive a tracking SMS and WhatsApp update with your courier consignment number. You can verify and inspect the parcel upon delivery.
            </p>
          </div>

          <div className="pk-policy-cta">
            <h3>Need urgent assistance with your delivery?</h3>
            <p>Our logistics team is available on WhatsApp to track or expedite your parcel.</p>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button type="primary" size="large" icon={<WhatsAppOutlined />}>
                Track via WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
