import { useEffect } from 'react';
import { LockOutlined, SafetyOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import './policies.css';

export default function PrivacyPage() {
  useEffect(() => {
    document.title = 'Privacy Policy | Multi Gadgets';
  }, []);

  return (
    <div className="pk-policy-page pk-container">
      <div className="pk-policy-card">
        <div className="pk-policy-header">
          <div className="pk-policy-badge">
            <LockOutlined /> Data Security
          </div>
          <h1>Privacy Policy</h1>
          <p>How Multi Gadgets protects and respects your personal information.</p>
        </div>

        <div className="pk-policy-content">
          <div className="pk-policy-section">
            <h2><SafetyOutlined /> Information We Collect</h2>
            <p>
              When placing an order on <strong>Multi Gadgets</strong>, we collect only the essential details required to deliver your goods:
            </p>
            <ul>
              <li><strong>Contact Information:</strong> Full name, active phone number, and delivery address.</li>
              <li><strong>Order Data:</strong> Selected gadget models, color variants, and purchase amounts.</li>
            </ul>
          </div>

          <div className="pk-policy-section">
            <h2><EyeInvisibleOutlined /> How We Use and Protect Your Data</h2>
            <p>
              Your personal information is strictly used for order fulfillment, courier delivery routing, and SMS/WhatsApp shipping updates.
            </p>
            <ul>
              <li>We <strong>never sell, rent, or trade</strong> customer personal details to third-party advertisers.</li>
              <li>Your delivery address is shared only with certified courier services to complete your parcel drop-off.</li>
              <li>All database transactions are securely processed over SSL/TLS encrypted connections.</li>
            </ul>
          </div>

          <div className="pk-policy-section">
            <h2>Cash on Delivery (COD) Privacy</h2>
            <p>
              Because we primarily support Cash on Delivery, your sensitive financial details (credit card or debit card numbers) are never stored on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
