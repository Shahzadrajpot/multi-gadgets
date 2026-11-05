import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Row, Col, Slider, Checkbox, Select, Drawer, Button, Empty } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import ProductCard from '../components/shared/ProductCard';
import { ProductGridSkeleton } from '../components/shared/Skeletons';
import { useApp } from '../context/AppContext';
import { fetchProducts } from '../services/productService';
import { mapProduct } from '../utils/transform';
import { mockProducts } from '../data/mockData';
import { MAX_PRICE_FILTER } from '../constants';
import type { Product } from '../types';
import './ShopPage.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category');
  const searchQuery = searchParams.get('q') || searchParams.get('search') || undefined;
  const { categories } = useApp();

  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE_FILTER]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [discountedOnly, setDiscountedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const categoryId = categorySlug ? categories.find((c) => c.slug === categorySlug)?.id : undefined;

  useEffect(() => {
    setLoading(true);
    fetchProducts({
      categoryId,
      search: searchQuery,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      discountedOnly,
      inStockOnly,
      sortBy: sortBy as 'newest' | 'price_asc' | 'price_desc',
      page,
      pageSize: 12,
    })
      .then((data) => setProducts(data.map((p) => mapProduct(p as Record<string, unknown>))))
      .catch(() => {
        let fallback = [...mockProducts];
        if (categoryId) fallback = fallback.filter((p) => p.categoryId === categoryId);
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          fallback = fallback.filter((p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
        }
        if (discountedOnly) fallback = fallback.filter((p) => p.discount);
        if (inStockOnly) fallback = fallback.filter((p) => p.stock > 0);
        fallback = fallback.filter((p) => p.basePrice >= priceRange[0] && p.basePrice <= priceRange[1]);
        if (sortBy === 'price_asc') fallback.sort((a, b) => a.basePrice - b.basePrice);
        else if (sortBy === 'price_desc') fallback.sort((a, b) => b.basePrice - a.basePrice);
        setProducts(fallback);
      })
      .finally(() => setLoading(false));
  }, [categoryId, searchQuery, priceRange, inStockOnly, discountedOnly, sortBy, page]);

  return (
    <div className="pk-shop-page">
      <div className="pk-container pk-shop-layout">
        <aside className="pk-shop-sidebar">
          <h3>Filters</h3>
          <div className="pk-filter-group">
            <label>Category</label>
            <div className="pk-filter-categories">
              {categories.filter((c) => c.isActive).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.slug}`}
                  className={categorySlug === cat.slug ? 'active' : ''}
                >
                  {cat.name} ({cat.productCount})
                </Link>
              ))}
            </div>
          </div>
          <div className="pk-filter-group">
            <label>Price Range</label>
            <Slider
              range
              min={0}
              max={10000}
              value={priceRange}
              onChange={(v) => setPriceRange(v as [number, number])}
              tooltip={{ formatter: (v) => `Rs. ${v?.toLocaleString()}` }}
            />
          </div>
          <div className="pk-filter-group">
            <Checkbox checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)}>
              In Stock Only
            </Checkbox>
          </div>
          <div className="pk-filter-group">
            <Checkbox checked={discountedOnly} onChange={(e) => setDiscountedOnly(e.target.checked)}>
              Discounted Only
            </Checkbox>
          </div>
        </aside>

        <main className="pk-shop-main">
          <div className="pk-shop-header">
            <h1>
              {searchQuery
                ? `Search: "${searchQuery}"`
                : categorySlug
                ? categories.find((c) => c.slug === categorySlug)?.name || 'Shop'
                : 'All Gadgets'}
            </h1>
            <div className="pk-shop-controls">
              <Button
                icon={<FilterOutlined />}
                onClick={() => setFilterDrawerOpen(true)}
                className="pk-mobile-filter-btn"
              >
                Filters
              </Button>
              <Select
                value={sortBy}
                onChange={setSortBy}
                options={SORT_OPTIONS}
                style={{ width: 180 }}
              />
            </div>
          </div>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length > 0 ? (
            <>
              <Row gutter={[24, 24]}>
                {products.map((product) => (
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
              <div className="pk-shop-pagination" style={{ marginTop: 48, textAlign: 'center' }}>
                <Button 
                  disabled={page === 1}
                  onClick={() => setPage(Math.max(1, page - 1))}
                  style={{ marginRight: 8 }}
                >
                  Previous
                </Button>
                <span style={{ margin: '0 16px', minWidth: 40 }}>Page {page}</span>
                <Button 
                  disabled={products.length < 12}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <Empty description="No products found" className="pk-shop-empty" />
          )}
        </main>
      </div>

      <Drawer
        title="Filters"
        placement="left"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        width={320}
      >
        <div className="pk-filter-group">
          <label>Price Range</label>
          <Slider
            range
            min={0}
            max={10000}
            value={priceRange}
            onChange={(v) => setPriceRange(v as [number, number])}
          />
        </div>
        <div className="pk-filter-group">
          <Checkbox checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)}>
            In Stock Only
          </Checkbox>
        </div>
        <div className="pk-filter-group">
          <Checkbox checked={discountedOnly} onChange={(e) => setDiscountedOnly(e.target.checked)}>
            Discounted Only
          </Checkbox>
        </div>
      </Drawer>
    </div>
  );
}
