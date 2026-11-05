import { Link } from 'react-router-dom';
import { Button, InputNumber, Card } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useApp } from '../context/AppContext';
import { calculateFinalPrice } from '../utils/discount';
import './CartPage.css';

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, storeSettings, globalDiscount } = useApp();

  const getItemPrice = (item: typeof cart[0]) => {
    const productDiscount = item.product.discount
      ? { discount_type: item.product.discount.type, discount_value: item.product.discount.value }
      : null;
    const { finalPrice } = calculateFinalPrice(
      item.product.basePrice,
      productDiscount,
      globalDiscount,
      item.product.categoryId
    );
    return finalPrice * item.quantity;
  };

  const subtotal = cart.reduce((sum, i) => sum + i.product.basePrice * i.quantity, 0);
  const totalWithDiscount = cart.reduce((sum, i) => sum + getItemPrice(i), 0);
  const productDiscount = subtotal - totalWithDiscount;
  const deliveryCharges = cart.length > 0 ? storeSettings.deliveryCharges : 0;
  const grandTotal = totalWithDiscount + deliveryCharges;

  if (cart.length === 0) {
    return (
      <div className="pk-cart-empty pk-container">
        <h2>Your cart is empty</h2>
        <p>Add some premium gadgets to get started.</p>
        <Link to="/shop">
          <Button type="primary" size="large">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pk-cart-page">
      <div className="pk-container pk-cart-layout">
        <main className="pk-cart-items">
          <h1>Shopping Cart</h1>
          {cart.map((item) => (
            <Card key={`${item.product.id}-${item.size}`} className="pk-cart-item">
              <div className="pk-cart-item-content">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="pk-cart-item-image"
                />
                <div className="pk-cart-item-details">
                  <Link to={`/product/${item.product.slug}`} className="pk-cart-item-name">
                    {item.product.name}
                  </Link>
                  <p className="pk-cart-item-size">Option: {item.size}</p>
                  <div className="pk-cart-item-price">
                    Rs. {(getItemPrice(item) / item.quantity).toLocaleString()} × {item.quantity} = Rs.{' '}
                    {getItemPrice(item).toLocaleString()}
                  </div>
                </div>
                <div className="pk-cart-item-actions">
                  <InputNumber
                    min={1}
                    max={item.product.stock}
                    value={item.quantity}
                    onChange={(v) => updateCartQuantity(item.product.id, item.size, v || 1)}
                    size="middle"
                  />
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeFromCart(item.product.id, item.size)}
                  />
                </div>
              </div>
            </Card>
          ))}
        </main>

        <aside className="pk-cart-summary">
          <Card>
            <h3>Order Summary</h3>
            <div className="pk-summary-row">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            {productDiscount > 0 && (
              <div className="pk-summary-row pk-discount">
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
            <Link to="/checkout">
              <Button type="primary" size="large" block>
                Proceed to Checkout
              </Button>
            </Link>
          </Card>
        </aside>
      </div>
    </div>
  );
}
