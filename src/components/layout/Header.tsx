import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Input, Badge, Drawer, Grid } from 'antd';
import { SearchOutlined, ShoppingCartOutlined, UserOutlined, MenuOutlined } from '@ant-design/icons';
import { useApp } from '../../context/AppContext';
import MegaMenu from './MegaMenu';
import './Header.css';

const { Header: AntHeader } = Layout;
const { useBreakpoint } = Grid;

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, categories } = useApp();
  const navigate = useNavigate();
  const screens = useBreakpoint();

  const isMobile = !screens.md;

  return (
    <>
      <AntHeader className="pk-header">
        <div className="pk-header-inner pk-container">
          <Link to="/" className="pk-logo" aria-label="Multi Gadgets Home">
            <img 
              src="/Logo.webp" 
              onError={(e) => {
                // Fallback for subpaths
                if (!e.currentTarget.src.includes('/public/Logo.webp')) {
                  e.currentTarget.src = '/public/Logo.webp';
                }
              }}
              alt="Multi Gadgets"
              style={{ height: '52px', width: 'auto', objectFit: 'contain' }} 
            />
          </Link>

          {!isMobile && <MegaMenu categories={categories} />}

          <div className="pk-header-actions">
            <button
              className="pk-header-icon-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <SearchOutlined />
            </button>

            <Link to="/cart" className="pk-header-icon-btn pk-cart-link">
              <Badge count={cartCount} size="small" offset={[-4, 4]}>
                <ShoppingCartOutlined />
              </Badge>
            </Link>

            <Link to="/account" className="pk-header-icon-btn" aria-label="Account">
              <UserOutlined />
            </Link>

            {isMobile && (
              <button
                className="pk-header-icon-btn"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Menu"
              >
                <MenuOutlined />
              </button>
            )}
          </div>
        </div>
      </AntHeader>

      <Drawer
        title="Search"
        placement="top"
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        styles={{ body: { paddingTop: 24 } }}
      >
        <Input
          size="large"
          placeholder="Search products..."
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
          onPressEnter={() => {
            if (searchQuery.trim()) {
              navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
              setSearchOpen(false);
              setSearchQuery('');
            }
          }}
        />
      </Drawer>

      <Drawer
        title="Navigation"
        placement="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        styles={{ body: { padding: '16px' } }}
      >
        <nav className="mg-mobile-nav">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="mg-mobile-link">
            Home
          </Link>
          <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="mg-mobile-link">
            Shop All
          </Link>
          <Link to="/shop?discounted=true" onClick={() => setMobileMenuOpen(false)} className="mg-mobile-link mg-mobile-link-deals">
            🔥 Best Deals
          </Link>

          <div className="mg-mobile-section-title">CATEGORIES</div>
          <div className="mg-mobile-categories-list">
            {categories.filter(c => c.isActive).map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="mg-mobile-category-item"
              >
                <span>{cat.name}</span>
                <span className="mg-mobile-cat-badge">{cat.productCount}</span>
              </Link>
            ))}
          </div>

          <div className="mg-mobile-section-title">INFO & SUPPORT</div>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="mg-mobile-link">
            About Us
          </Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="mg-mobile-link">
            Contact
          </Link>
          <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="mg-mobile-link">
            Shopping Cart ({cartCount})
          </Link>
        </nav>
      </Drawer>
    </>
  );
}
