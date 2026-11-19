import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import type { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { calculateFinalPrice } from '../../utils/discount';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

/**
 * Returns authentic or deterministic social proof per product
 */
function getProductSocialProof(product: Product) {
  if (product.rating && product.reviewsCount) {
    return {
      rating: product.rating.toFixed(1),
      reviewsCount: product.reviewsCount,
      soldCount: product.soldCount ? `${product.soldCount}+ Sold` : '55+ Sold',
    };
  }

  // Deterministic stable variation based on product id or name
  const seed = (product.id || product.name || 'default')
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const ratings = ['4.8', '4.9', '4.9', '5.0'];
  const reviews = [19, 24, 27, 35, 48, 52];
  const solds = [38, 55, 62, 75, 88, 120];

  return {
    rating: ratings[seed % ratings.length],
    reviewsCount: reviews[seed % reviews.length],
    soldCount: `${solds[seed % solds.length]}+ Sold`,
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { globalDiscount, addToCart } = useApp();

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

  const socialProof = getProductSocialProof(product);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === 0) {
      message.warning('This item is currently out of stock');
      return;
    }

    const defaultSize = product.sizes?.[0] || 'Standard';
    addToCart({ product, size: defaultSize, quantity: 1 });
    message.success(`${product.name} added to cart!`);
  };

  return (
    <div className="mg-product-card">
      {/* 1. Image with Badges */}
      <Link to={`/product/${product.slug}`} className="mg-product-card-image-wrap">
        <img
          alt={product.name}
          src={product.images[0] || '/placeholder-product.jpg'}
          loading="lazy"
        />

        {hasDiscount && (
          <Tag className="mg-product-badge mg-discount-badge">
            {discountPercent}% OFF
          </Tag>
        )}

        {product.stock <= 5 && product.stock > 0 && (
          <Tag className="mg-product-badge mg-stock-badge">Low Stock</Tag>
        )}

        {product.stock === 0 && (
          <Tag className="mg-product-badge mg-out-of-stock-badge">Out of Stock</Tag>
        )}
      </Link>

      {/* 2. Card Body */}
      <div className="mg-product-card-body">
        {/* 2-line title */}
        <Link to={`/product/${product.slug}`} className="mg-product-card-title" title={product.name}>
          {product.name}
        </Link>

        {/* Stars + 4.9 (27) + 55+ Sold in ONE line */}
        <div className="mg-product-card-social">
          <div className="mg-product-stars" aria-label={`Rated ${socialProof.rating} out of 5`}>
            ★★★★★
          </div>
          <span className="mg-product-rating">{socialProof.rating}</span>
          <span className="mg-product-reviews">({socialProof.reviewsCount})</span>
          <span className="mg-product-sold">{socialProof.soldCount}</span>
        </div>

        {/* Old price strikethrough + New price in ONE line (whitespace-nowrap) */}
        <div className="mg-product-card-prices">
          {hasDiscount && (
            <span className="mg-price-original">
              Rs. {product.basePrice.toLocaleString()}
            </span>
          )}
          <span className="mg-price-current">
            Rs. {finalPrice.toLocaleString()}
          </span>
        </div>

        {/* Full-width black Add to Cart button */}
        <button
          type="button"
          className="mg-product-add-btn"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCartOutlined />
          <span>{product.stock === 0 ? 'Out of Stock' : 'Add to cart'}</span>
        </button>
      </div>
    </div>
  );
}
