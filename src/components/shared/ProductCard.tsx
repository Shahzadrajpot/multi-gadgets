import { Link } from 'react-router-dom';
import { Card, Button, Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import type { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { calculateFinalPrice } from '../../utils/discount';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

function formatPrice(price: number) {
  return `Rs. ${price.toLocaleString()}`;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { globalDiscount } = useApp();
  const productDiscount = product.discount
    ? { discount_type: product.discount.type, discount_value: product.discount.value }
    : null;
  const { finalPrice } = calculateFinalPrice(
    product.basePrice,
    productDiscount,
    globalDiscount,
    product.categoryId
  );
  const hasDiscount = finalPrice < product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - finalPrice) / product.basePrice) * 100)
    : 0;

  return (
    <Card
      className="pk-product-card"
      hoverable
      cover={
        <Link to={`/product/${product.slug}`} className="pk-product-card-image-wrap">
          <img alt={product.name} src={product.images[0] || '/placeholder-product.jpg'} />
          {hasDiscount && (
            <Tag className="pk-product-card-badge" color="red">
              {discountPercent}% OFF
            </Tag>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <Tag className="pk-product-card-badge pk-stock-badge">Low Stock</Tag>
          )}
          {product.stock === 0 && (
            <Tag className="pk-product-card-badge pk-out-of-stock">Out of Stock</Tag>
          )}
          <div className="pk-product-card-overlay">
            <Button type="primary" icon={<EyeOutlined />} size="large">
              Quick View
            </Button>
          </div>
        </Link>
      }
    >
      <div className="pk-product-card-body">
        <span className="pk-product-card-category">{product.category?.name || 'Kheri'}</span>
        <Link to={`/product/${product.slug}`} className="pk-product-card-name">
          {product.name}
        </Link>
        <div className="pk-product-card-price">
          {hasDiscount ? (
            <>
              <span className="pk-price-original">Rs. {product.basePrice.toLocaleString()}</span>
              <span className="pk-price-final">{formatPrice(finalPrice)}</span>
            </>
          ) : (
            <span className="pk-price-final">{formatPrice(product.basePrice)}</span>
          )}
        </div>
      </div>
    </Card>
  );
}
