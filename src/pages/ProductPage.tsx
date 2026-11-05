import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumb, Button, InputNumber, Select, Tag, Divider, message } from 'antd';
import { WhatsAppOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { ProductPageSkeleton } from '../components/shared/Skeletons';
import { useApp } from '../context/AppContext';
import { fetchProductBySlug } from '../services/productService';
import { mockProducts } from '../data/mockData';
import { mapProduct } from '../utils/transform';
import { calculateFinalPrice } from '../utils/discount';
import type { Product } from '../types';
import './ProductPage.css';

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

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Multi Gadgets`;
    }
  }, [product]);

  const category = categories.find((c) => c.id === product.categoryId);

  const handleAddToCart = () => {
    // For gadgets, color / option is REQUIRED if options exist
    if (product.sizes.length > 0 && !selectedSize) {
      message.error('Please select a color / option before adding to cart');
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

            {product.sizes.length > 0 && (
              <div className="pk-product-option">
                <label><strong>Color / Option (Required)</strong></label>
                <Select
                  placeholder="Please select an option"
                  value={selectedSize || undefined}
                  onChange={setSelectedSize}
                  options={product.sizes.map((s) => ({ value: s, label: s }))}
                  style={{ width: '100%' }}
                  size="large"
                  status={!selectedSize ? 'warning' : undefined}
                />
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
                disabled={product.stock === 0 || (product.sizes.length > 0 && !selectedSize)}
              >
                Add to Cart
              </Button>
              <Link to="/checkout">
                <Button size="large">Buy Now</Button>
              </Link>
              <a href={whatsappOrderUrl} target="_blank" rel="noopener noreferrer">
                <Button size="large" icon={<WhatsAppOutlined />}>
                  WhatsApp Order
                </Button>
              </a>
            </div>

            <div className="pk-product-delivery">
              <p>Cash on Delivery available nationwide. Delivery within 3-5 business days.</p>
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
