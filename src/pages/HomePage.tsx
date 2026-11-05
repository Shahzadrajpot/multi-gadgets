import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Alert, Image } from 'antd';
import { TruckOutlined, SafetyOutlined, GiftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import ProductCard from '../components/shared/ProductCard';
import { ProductGridSkeleton, CategoryGridSkeleton } from '../components/shared/Skeletons';
import { HeroSlider } from '../components/home/HeroSlider';
import { useApp } from '../context/AppContext';
import { fetchFeaturedProducts } from '../services/productService';
import { mapProduct } from '../utils/transform';
import { mockProducts } from '../data/mockData';
import type { Product } from '../types';
import './HomePage.css';

export default function HomePage() {
  const { categories, globalDiscount, loading, error } = useApp();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts(8)
      .then((data) => setFeaturedProducts(data.map((p) => mapProduct(p as Record<string, unknown>))))
      .catch(() => setFeaturedProducts(mockProducts.filter((p) => p.isFeatured).slice(0, 8)))
      .finally(() => setProductsLoading(false));
  }, []);

  return (
    <div className="pk-homepage">
      {globalDiscount?.isEnabled && (
        <div className="pk-global-discount-banner">
          <span>
            🎉 Global discount: {globalDiscount.type === 'percentage'
              ? `${globalDiscount.value}% off`
              : `Rs. ${globalDiscount.value} off`}
          </span>
        </div>
      )}

      {/* 3D MultiGadgets Hero Slider */}
      <HeroSlider />

      {error && (
        <div className="pk-container">
          <Alert message={error} type="warning" showIcon style={{ marginTop: 16 }} />
        </div>
      )}

      {/* Category Section */}
      <section className="pk-section pk-categories">
        <div className="pk-container">
          <h2 className="pk-section-title">Shop by Category</h2>
          {loading ? (
            <CategoryGridSkeleton count={3} />
          ) : categories.length > 0 ? (
            <Row gutter={[24, 24]}>
              {categories.map((cat) => (
                <Col xs={24} sm={12} md={8} key={cat.id}>
                  <Link to={cat.isActive ? `/shop?category=${cat.slug}` : '#'}>
                    <Card className="pk-category-card" hoverable>
                      {cat.image ? (
                        <Image
                          width="100%"
                          height={200}
                          src={cat.image}
                          style={{ objectFit: 'cover', borderRadius: 8, marginBottom: 16 }}
                          preview={false}
                        />
                      ) : (
                        <div className="pk-category-placeholder">
                          {cat.name.charAt(0)}
                        </div>
                      )}
                      <h3>{cat.name}</h3>
                      <p>{cat.productCount} products</p>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          ) : (
            <Alert message="No categories available yet" type="info" showIcon style={{ marginTop: 16 }} />
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="pk-section pk-featured">
        <div className="pk-container">
          <h2 className="pk-section-title">Featured Products</h2>
          {productsLoading ? (
            <ProductGridSkeleton count={4} />
          ) : featuredProducts.length > 0 ? (
            <Row gutter={[24, 24]}>
              {featuredProducts.map((product) => (
                <Col xs={24} sm={12} lg={6} key={product.id}>
                  <ProductCard
                    product={{
                      ...product,
                      category: categories.find((c) => c.id === product.categoryId),
                    }}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Alert message="No featured products available yet" type="info" showIcon style={{ marginTop: 16 }} />
          )}
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="pk-section pk-trust">
        <div className="pk-container">
          <Row gutter={[32, 24]} justify="center">
            <Col xs={12} md={6}>
              <div className="pk-trust-item">
                <CheckCircleOutlined />
                <span>100% Genuine Gadgets</span>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="pk-trust-item">
                <GiftOutlined />
                <span>Quality Tested Gear</span>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="pk-trust-item">
                <SafetyOutlined />
                <span>Secure Orders</span>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="pk-trust-item">
                <TruckOutlined />
                <span>Cash on Delivery</span>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
}
