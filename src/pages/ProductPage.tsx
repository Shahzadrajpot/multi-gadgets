import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumb, Button, InputNumber, Tag, Divider, message } from 'antd';
import { WhatsAppOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { ProductPageSkeleton } from '../components/shared/Skeletons';
import { useApp } from '../context/AppContext';
import { fetchProductBySlug } from '../services/productService';
import { mockProducts } from '../data/mockData';
import { mapProduct } from '../utils/transform';
import { calculateFinalPrice } from '../utils/discount';
import type { Product } from '../types';
import './ProductPage.css';

/**
 * Intelligent helper to resolve realistic hex preview colors for gadget finishes
 */
function getSwatchColorHex(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('black') || lower.includes('dark') || lower.includes('midnight') || lower.includes('obsidian')) return '#18181b';
  if (lower.includes('titanium') || lower.includes('gray') || lower.includes('grey') || lower.includes('space') || lower.includes('graphite')) return '#64748b';
  if (lower.includes('silver') || lower.includes('chrome') || lower.includes('platinum')) return '#cbd5e1';
  if (lower.includes('white') || lower.includes('pearl') || lower.includes('ivory')) return '#f8fafc';
  if (lower.includes('orange') || lower.includes('amber') || lower.includes('trail')) return '#ea580c';
  if (lower.includes('blue') || lower.includes('ocean') || lower.includes('sky')) return '#2563eb';
  if (lower.includes('green') || lower.includes('olive') || lower.includes('mint')) return '#16a34a';
  if (lower.includes('gold') || lower.includes('yellow') || lower.includes('champagne')) return '#d97706';
  if (lower.includes('red') || lower.includes('crimson') || lower.includes('ruby')) return '#dc2626';
  if (lower.includes('purple') || lower.includes('violet') || lower.includes('lavender')) return '#9333ea';
  if (lower.includes('pink') || lower.includes('rose')) return '#ec4899';
  return '#475569';
}

export default function ProductPage() {
  const { slug } = useParams();
  const { addToCart, storeSettings, categories, globalDiscount } = useApp();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  useEffect(() => {
    if (!slug) return;
    setMainImageIndex(0);
    fetchProductBySlug(slug)
      .then((data) => (data ? setProduct(mapProduct(data as Record<string, unknown>)) : null))
      .catch(() => {
        const found = mockProducts.find((p) => p.slug === slug);
        setProduct(found ?? null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Multi Gadgets`;
    }
  }, [product]);

  if (loading) {
    return <ProductPageSkeleton />;
  }

  if (!product) {
    return (
      <div className="pk-container pk-product-not-found">
        <h2>Product not found</h2>
        <Link to="/shop">Back to Shop</Link>
      </div>
    );
  }

  const productDiscount = product.discount
    ? { discount_type: product.discount.type, discount_value: product.discount.value }
    : null;
  const { finalPrice } = calculateFinalPrice(
    product.basePrice,
    productDiscount,
    globalDiscount,
    product.categoryId
  );

  const category = categories.find((c) => c.id === product.categoryId);

  const handleAddToCart = () => {
    // For gadgets, color / option is REQUIRED if options exist
    if (product.sizes.length > 0 && !selectedSize) {
      message.warning('Please select a color / option before adding to cart');
      return;
    }
    addToCart({
      product,
      size: selectedSize || product.sizes[0] || 'Standard',
      quantity,
    });
    message.success('Added to cart!');
  };

  const whatsappOrderUrl = `https://wa.me/${storeSettings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
    `I want to order: ${product.name} (Option: ${selectedSize || 'Standard'}, Qty: ${quantity})`
  )}`;

  return (
    <div className="pk-product-page">
      <div className="pk-container">
        <Breadcrumb
          items={[
            { title: <Link to="/">Home</Link> },
            { title: <Link to="/shop">Shop</Link> },
            { title: category?.name || 'Gadgets' },
            { title: product.name },
          ]}
          className="pk-product-breadcrumb"
        />

        <div className="pk-product-layout">
          <div className="pk-product-gallery">
            <div className="pk-product-main-image">
              <img src={product.images[mainImageIndex] || '/placeholder.jpg'} alt={product.name} />
            </div>
            <div className="pk-product-thumbnails">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  className={`pk-thumbnail ${i === mainImageIndex ? 'active' : ''}`}
                  onClick={() => setMainImageIndex(i)}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          </div>

          <div className="pk-product-info">
            <span className="pk-product-category">{category?.name}</span>
            <h1 className="pk-product-title">{product.name}</h1>
            <p className="pk-product-sku">SKU: {product.sku}</p>
            <div className="pk-product-stock">
              {product.stock > 0 ? (
                <Tag color="green">In Stock ({product.stock} available)</Tag>
              ) : (
                <Tag color="red">Out of Stock</Tag>
              )}
            </div>

            <div className="pk-product-pricing">
              {finalPrice < product.basePrice ? (
                <>
                  <span className="pk-price-original">Rs. {product.basePrice.toLocaleString()}</span>
                  <span className="pk-price-final">Rs. {finalPrice.toLocaleString()}</span>
                </>
              ) : (
                <span className="pk-price-final">Rs. {product.basePrice.toLocaleString()}</span>
              )}
            </div>

            {/* Interactive Color / Option Swatches */}
            {product.sizes.length > 0 && (
              <div className="mg-product-swatches-section">
                <div className="mg-swatch-header">
                  <span className="mg-swatch-title">
                    Color / Option:{' '}
                    <strong className="mg-swatch-selected-name">
                      {selectedSize || 'Choose Option'}
                    </strong>
                  </span>
                  {!selectedSize && (
                    <span className="mg-swatch-required-badge">* Required</span>
                  )}
                </div>

                <div className="mg-swatches-grid" role="radiogroup" aria-label="Product color options">
                  {product.sizes.map((sizeOption) => {
                    const isSelected = selectedSize === sizeOption;
                    const colorHex = getSwatchColorHex(sizeOption);

                    return (
                      <button
                        key={sizeOption}
                        type="button"
                        className={`mg-swatch-chip ${isSelected ? 'active' : ''}`}
                        onClick={() => setSelectedSize(sizeOption)}
                        role="radio"
                        aria-checked={isSelected}
                      >
                        <span className="mg-swatch-dot" style={{ backgroundColor: colorHex }} />
                        <span className="mg-swatch-text">{sizeOption}</span>
                        {isSelected && <span className="mg-swatch-check">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pk-product-option">
              <label>Quantity</label>
              <InputNumber
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(v) => setQuantity(v || 1)}
                size="large"
                style={{ width: 120 }}
              />
            </div>

            <div className="pk-product-actions">
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                onClick={handleAddToCart}
                className={`mg-btn-add-to-cart ${!selectedSize && product.sizes.length > 0 ? 'unselected' : ''}`}
                disabled={product.stock === 0}
              >
                {!selectedSize && product.sizes.length > 0 ? 'Select Color to Add' : 'Add to Cart'}
              </Button>
              <Link 
                to="/checkout" 
                onClick={(e) => {
                  if (product.sizes.length > 0 && !selectedSize) {
                    e.preventDefault();
                    message.warning('Please select a color option before checkout');
                  }
                }}
              >
                <Button size="large" className="mg-btn-buy-now">Buy Now</Button>
              </Link>
              <a href={whatsappOrderUrl} target="_blank" rel="noopener noreferrer">
                <Button size="large" icon={<WhatsAppOutlined />} className="mg-btn-whatsapp">
                  WhatsApp Order
                </Button>
              </a>
            </div>

            <div className="pk-product-delivery">
              <p>Cash on Delivery available nationwide. Delivery within 3 business days.</p>
            </div>

            {product.description && (
              <>
                <Divider />
                <div className="pk-product-description">
                  <h3>Description</h3>
                  <p>{product.description}</p>
                </div>
              </>
            )}

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="pk-product-specs">
                <h3>Specifications</h3>
                <dl>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key}>
                      <dt>{key}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {product.careInstructions && (
              <div className="pk-product-care">
                <h3>Care Instructions</h3>
                <p>{product.careInstructions}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
