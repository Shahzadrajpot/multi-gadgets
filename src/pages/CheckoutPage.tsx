import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message } from 'antd';
import { useApp } from '../context/AppContext';
import { createOrder } from '../services/orderService';
import { reduceProductStock } from '../services/productService';
import { calculateFinalPrice } from '../utils/discount';
import './CheckoutPage.css';

const { TextArea } = Input;

export default function CheckoutPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { cart, storeSettings, globalDiscount, clearCart } = useApp();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const getItemDetails = (item: typeof cart[0]) => {
    const productDiscount = item.product.discount
      ? { discount_type: item.product.discount.type, discount_value: item.product.discount.value }
      : null;
    const { finalPrice } = calculateFinalPrice(
      item.product.basePrice,
      productDiscount,
      globalDiscount,
      item.product.categoryId
    );
    return {
      unitPrice: finalPrice,
      discountAmount: (item.product.basePrice - finalPrice) * item.quantity,
      total: finalPrice * item.quantity,
    };
  };

  const subtotal = cart.reduce((sum, i) => sum + i.product.basePrice * i.quantity, 0);
  const itemsWithTotals = cart.map((i) => ({ ...i, ...getItemDetails(i) }));
  const totalBeforeDelivery = itemsWithTotals.reduce((s, i) => s + i.total, 0);
  const productDiscount = subtotal - totalBeforeDelivery;
  const deliveryCharges = cart.length > 0 ? storeSettings.deliveryCharges : 0;
  const grandTotal = totalBeforeDelivery + deliveryCharges;

  const onFinish = async (values: {
    fullName: string;
    phone: string;
    city: string;
    address: string;
    notes?: string;
  }) => {
    setSubmitting(true);
    try {
      const order = await createOrder({
        customer_name: values.fullName,
        phone: values.phone,
        city: values.city,
        address: values.address,
        notes: values.notes,
        items: itemsWithTotals.map((item) => ({
          product_id: item.product.id,
          product_name: item.product.name,
          size: item.size,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          discount_amount: item.discountAmount,
          total: item.total,
        })),
        subtotal,
        product_discount: productDiscount,
        global_discount: 0,
        delivery_charges: deliveryCharges,
        total: grandTotal,
      });

      for (const item of cart) {
        await reduceProductStock(item.product.id, item.quantity);
      }

      setOrderNumber(order.order_number);
      clearCart();
      setOrderPlaced(true);
      message.success('Order placed successfully!');
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  if (orderPlaced) {
    const whatsappUrl = `https://wa.me/${storeSettings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
      `Order Confirmation: ${orderNumber}\nI've placed an order. Please confirm.`
    )}`;

    return (
      <div className="pk-checkout-confirmation pk-container">
        <Card className="pk-confirmation-card">
          <div className="pk-confirmation-icon">✓</div>
          <h1>Order Placed Successfully!</h1>
          <p className="pk-order-id">Order ID: {orderNumber}</p>
          <p>Thank you for your order. We'll contact you shortly to confirm.</p>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button type="primary" size="large">
              Confirm via WhatsApp
            </Button>
          </a>
          <Button type="link" onClick={() => navigate('/shop')} style={{ marginTop: 16 }}>
            Continue Shopping
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="pk-checkout-page">
      <div className="pk-container pk-checkout-layout">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="pk-checkout-form"
        >
          <h1>Checkout</h1>
          <Card title="Delivery Information">
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input size="large" placeholder="Your full name" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: 'Phone number is required' },
                { 
                  pattern: /^03\d{9}$/, 
                  message: 'Enter valid Pakistani phone number (03XXXXXXXXX)'
                },
              ]}
            >
              <Input size="large" placeholder="03001234567" />
            </Form.Item>
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: 'Please enter your city' }]}
            >
              <Input size="large" placeholder="Karachi, Lahore, Islamabad, etc." />
            </Form.Item>
            <Form.Item
              name="address"
              label="Complete Address"
              rules={[
                { required: true, message: 'Address is required' },
                { 
                  min: 10,
                  message: 'Address must be at least 10 characters'
                }
              ]}
            >
              <TextArea rows={3} placeholder="House/Office number, area, street, and any landmarks" />
            </Form.Item>
            <Form.Item name="notes" label="Order Notes (Optional)">
              <TextArea rows={2} placeholder="Special instructions" />
            </Form.Item>
          </Card>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={submitting}
          >
            Place Order (Cash on Delivery)
          </Button>
        </Form>

        <aside className="pk-checkout-summary">
          <Card title="Order Summary">
            {itemsWithTotals.map((item) => (
              <div key={`${item.product.id}-${item.size}`} className="pk-summary-item">
                <div>
                  <strong>{item.product.name}</strong>
                  <span> × {item.quantity} (Size: {item.size})</span>
                </div>
                <span>Rs. {item.total.toLocaleString()}</span>
              </div>
            ))}
            <div className="pk-summary-totals">
              <div className="pk-summary-row">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              {productDiscount > 0 && (
                <div className="pk-summary-row">
                  <span>Discount</span>
                  <span>- Rs. {productDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="pk-summary-row">
                <span>Delivery</span>
                <span>Rs. {deliveryCharges.toLocaleString()}</span>
              </div>
              <div className="pk-summary-row pk-total">
                <span>Total</span>
                <span>Rs. {grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
