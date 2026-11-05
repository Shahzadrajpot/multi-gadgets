import { Row, Col } from 'antd';
import './Skeletons.css';

/**
 * Single Product Card Skeleton - 1:1 match with ProductCard dimensions
 */
export function ProductCardSkeleton() {
  return (
    <div className="mg-product-card-skeleton" aria-hidden="true">
      <div className="mg-skeleton-bone mg-product-card-skeleton-image" />
      <div className="mg-product-card-skeleton-body">
        <div className="mg-skeleton-bone mg-product-card-skeleton-cat" />
        <div className="mg-skeleton-bone mg-product-card-skeleton-title" />
        <div className="mg-skeleton-bone mg-product-card-skeleton-title-sub" />
        <div className="mg-skeleton-bone mg-product-card-skeleton-price" />
      </div>
    </div>
  );
}

export interface ProductGridSkeletonProps {
  count?: number;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
}

/**
 * Grid of Product Card Skeletons
 */
export function ProductGridSkeleton({
  count = 4,
  xs = 24,
  sm = 12,
  md = 8,
  lg = 6,
}: ProductGridSkeletonProps) {
  const items = Array.from({ length: count });
  return (
    <Row gutter={[24, 24]}>
      {items.map((_, i) => (
        <Col xs={xs} sm={sm} md={md} lg={lg} key={i}>
          <ProductCardSkeleton />
        </Col>
      ))}
    </Row>
  );
}

/**
 * Single Category Card Skeleton
 */
export function CategoryCardSkeleton() {
  return (
    <div className="mg-category-card-skeleton" aria-hidden="true">
      <div className="mg-skeleton-bone mg-category-card-skeleton-img" />
      <div className="mg-skeleton-bone mg-category-card-skeleton-title" />
      <div className="mg-skeleton-bone mg-category-card-skeleton-count" />
    </div>
  );
}

export interface CategoryGridSkeletonProps {
  count?: number;
}

/**
 * Grid of Category Skeletons
 */
export function CategoryGridSkeleton({ count = 3 }: CategoryGridSkeletonProps) {
  const items = Array.from({ length: count });
  return (
    <Row gutter={[24, 24]}>
      {items.map((_, i) => (
        <Col xs={24} sm={12} md={8} key={i}>
          <CategoryCardSkeleton />
        </Col>
      ))}
    </Row>
  );
}

/**
 * Product Detail Page Skeleton (for /product/:slug)
 */
export function ProductPageSkeleton() {
  return (
    <div className="pk-container mg-product-page-skeleton" aria-hidden="true">
      <Row gutter={[48, 48]}>
        <Col xs={24} md={12}>
          <div className="mg-skeleton-bone mg-product-page-skeleton-hero" />
          <div className="mg-product-page-skeleton-thumbs">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="mg-skeleton-bone mg-product-page-skeleton-thumb" />
            ))}
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div className="mg-product-page-skeleton-info">
            <div className="mg-skeleton-bone mg-product-page-skeleton-breadcrumb" />
            <div className="mg-skeleton-bone mg-product-page-skeleton-heading" />
            <div className="mg-skeleton-bone mg-product-page-skeleton-meta" />
            <div className="mg-skeleton-bone mg-product-page-skeleton-price-block" />
            <div className="mg-skeleton-bone mg-product-page-skeleton-chips-label" />
            <div className="mg-product-page-skeleton-chips">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="mg-skeleton-bone mg-product-page-skeleton-chip" />
              ))}
            </div>
            <div className="mg-skeleton-bone mg-product-page-skeleton-btn" style={{ marginTop: 12 }} />
            <div className="mg-skeleton-bone mg-product-page-skeleton-btn" />
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="mg-skeleton-bone mg-product-page-skeleton-desc-line" />
              <div className="mg-skeleton-bone mg-product-page-skeleton-desc-line" style={{ width: '92%' }} />
              <div className="mg-skeleton-bone mg-product-page-skeleton-desc-line" style={{ width: '85%' }} />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

/**
 * Universal Page Skeleton (for App Router Suspense fallback)
 */
export function PageSkeleton() {
  return (
    <div className="pk-container mg-page-skeleton" aria-hidden="true">
      <div className="mg-skeleton-bone mg-page-skeleton-banner" />
      <div className="mg-skeleton-bone mg-page-skeleton-heading" />
      <ProductGridSkeleton count={4} />
    </div>
  );
}

/**
 * Admin Dashboard Overview Skeleton (6 metric cards + recent orders table)
 */
export function AdminDashboardSkeleton() {
  return (
    <div className="mg-admin-dashboard-skeleton" aria-hidden="true">
      <div className="mg-skeleton-bone mg-admin-title-skeleton" />
      
      {/* 6 Stat Metric Cards */}
      <Row gutter={[24, 24]}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Col xs={12} md={8} lg={4} key={i}>
            <div className="mg-admin-stat-skeleton-card">
              <div className="mg-skeleton-bone mg-admin-stat-skeleton-icon" />
              <div className="mg-admin-stat-skeleton-content">
                <div className="mg-skeleton-bone mg-admin-stat-skeleton-val" />
                <div className="mg-skeleton-bone mg-admin-stat-skeleton-label" />
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Recent Orders Table Card */}
      <div className="mg-admin-table-skeleton-card">
        <div className="mg-skeleton-bone mg-admin-table-skeleton-header" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="mg-admin-table-skeleton-row">
            <div className="mg-skeleton-bone mg-admin-table-skeleton-cell" style={{ width: '15%' }} />
            <div className="mg-skeleton-bone mg-admin-table-skeleton-cell" style={{ width: '25%' }} />
            <div className="mg-skeleton-bone mg-admin-table-skeleton-cell" style={{ width: '15%' }} />
            <div className="mg-skeleton-bone mg-admin-table-skeleton-cell" style={{ width: '12%' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default {
  ProductCardSkeleton,
  ProductGridSkeleton,
  CategoryCardSkeleton,
  CategoryGridSkeleton,
  ProductPageSkeleton,
  PageSkeleton,
  AdminDashboardSkeleton,
};
