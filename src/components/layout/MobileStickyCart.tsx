import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './MobileStickyCart.css';

export default function MobileStickyCart() {
  const { cartCount, cartTotal } = useApp();

  if (cartCount === 0) return null;

  return (
    <div className="pk-mobile-sticky-cart">
      <Link to="/cart" className="pk-mobile-sticky-cart-inner">
        <span className="pk-mobile-sticky-cart-count">{cartCount} items</span>
        <span className="pk-mobile-sticky-cart-total">Rs. {cartTotal.toLocaleString()}</span>
        <span className="pk-mobile-sticky-cart-cta">View Cart</span>
      </Link>
    </div>
  );
}
