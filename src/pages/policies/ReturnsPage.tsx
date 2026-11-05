import { useEffect } from 'react';
import { Button } from 'antd';
import { UndoOutlined, CheckCircleOutlined, CloseCircleOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { useApp } from '../../context/AppContext';
import './policies.css';

export default function ReturnsPage() {
  const { storeSettings } = useApp();

  useEffect(() => {
    document.title = 'Return & Warranty Policy | Multi Gadgets';
  }, []);

  const whatsappUrl = `https://wa.me/${storeSettings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hi Multi Gadgets team, I would like to initiate a return or replacement.')}`;

  return (
    <div className="pk-policy-page pk-container">
      <div className="pk-policy-card">
        <div className="pk-policy-header">
          <div className="pk-policy-badge">
            <UndoOutlined /> Customer Protection
          </div>
          <h1>Return & Replacement Policy</h1>
          <p>Hassle-free 7-day replacement warranty for all gadgets and accessories.</p>
        </div>

        <div className="pk-policy-content">
          <div className="pk-policy-section">
            <h2><CheckCircleOutlined /> 7-Day Replacement Guarantee</h2>
            <p>
              At <strong>Multi Gadgets</strong>, customer satisfaction is our top priority. We offer a full <strong>7-Day Replacement Warranty</strong> on all electronic devices, smartwatches, earbuds, and chargers if:
            </p>
            <ul>
              <li>The item arrives damaged, scratched, or inoperative.</li>
              <li>There is a manufacturing defect or technical malfunction.</li>
              <li>The product received does not match the specifications or color ordered.</li>
            </ul>
          </div>

          <div className="pk-policy-section">
            <h2><CloseCircleOutlined /> What Is Not Covered</h2>
            <p>Returns cannot be accepted under the following conditions:</p>
            <ul>
              <li>Damage caused by physical drops, liquid immersion, or unauthorized repair attempts.</li>
              <li>Products returned without original packaging, cables, documentation, or accessories.</li>
              <li>Requests made after the 7-day inspection window has expired.</li>
            </ul>
          </div>

          <div className="pk-policy-section">
            <h2>How to Claim a Replacement</h2>
            <p>Initiating a claim is fast and simple:</p>
            <ol style={{ paddingLeft: 24, marginBottom: 16 }}>
              <li>Record a short 10-second video or take photos clearly showing the defect.</li>
              <li>Send the media along with your <strong>Order Number</strong> to our WhatsApp support line.</li>
              <li>Our technical support officer will verify the issue and arrange a doorstep replacement dispatch within 24 hours.</li>
            </ol>
          </div>

          <div className="pk-policy-cta">
            <h3>Need to file a warranty claim?</h3>
            <p>Our claims resolution team responds within 2 business hours.</p>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button type="primary" size="large" icon={<WhatsAppOutlined />}>
                Claim Warranty on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
