import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DownOutlined, AppstoreOutlined, RightOutlined, FireOutlined } from '@ant-design/icons';
import type { Category } from '../../types';
import './MegaMenu.css';

interface MegaMenuProps {
  categories: Category[];
}

export default function MegaMenu({ categories }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const activeCategories = categories.filter((c) => c.isActive);

  // Close dropdown on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.search]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="mg-mega-menu">
      <div className="mg-nav-item">
        <Link to="/" className={`mg-nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          Home
        </Link>
      </div>

      <div className="mg-nav-item">
        <Link
          to="/shop"
          className={`mg-nav-link ${
            location.pathname === '/shop' &&
            !location.search.includes('discounted') &&
            !location.search.includes('category')
              ? 'active'
              : ''
          }`}
        >
          Shop All
        </Link>
      </div>

      {/* Solution A: Professional Categories Dropdown */}
      <div
        className="mg-nav-item mg-dropdown-trigger"
        ref={dropdownRef}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <button
          type="button"
          className={`mg-nav-link mg-dropdown-btn ${
            isOpen || location.search.includes('category') ? 'active' : ''
          }`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span>Categories</span>
          <DownOutlined className={`mg-chevron ${isOpen ? 'open' : ''}`} />
        </button>

        {/* Dropdown Mega Panel */}
        <div className={`mg-dropdown-panel ${isOpen ? 'visible' : ''}`}>
          <div className="mg-dropdown-header">
            <div className="mg-dropdown-header-title">
              <AppstoreOutlined />
              <span>Explore Categories</span>
            </div>
            <Link to="/shop" className="mg-dropdown-view-all" onClick={() => setIsOpen(false)}>
              <span>View All</span>
              <RightOutlined />
            </Link>
          </div>

          <div className="mg-dropdown-grid">
            {activeCategories.length > 0 ? (
              activeCategories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.slug}`}
                  className="mg-category-card"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="mg-category-thumb">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} />
                    ) : (
                      <div className="mg-category-thumb-fallback">
                        <AppstoreOutlined />
                      </div>
                    )}
                  </div>
                  <div className="mg-category-info">
                    <span className="mg-category-name">{cat.name}</span>
                    <span className="mg-category-count">{cat.productCount} products</span>
                  </div>
                  <RightOutlined className="mg-category-arrow" />
                </Link>
              ))
            ) : (
              <div className="mg-category-empty">No categories available</div>
            )}
          </div>

          <div className="mg-dropdown-footer">
            <Link to="/shop" className="mg-dropdown-footer-link" onClick={() => setIsOpen(false)}>
              ⚡ Browse All Latest Tech & Gadgets ➔
            </Link>
          </div>
        </div>
      </div>

      <div className="mg-nav-item">
        <Link
          to="/shop?discounted=true"
          className={`mg-nav-link mg-nav-link-deals ${
            location.search.includes('discounted=true') ? 'active' : ''
          }`}
        >
          <FireOutlined className="mg-deals-icon" />
          <span>Deals</span>
        </Link>
      </div>

      <div className="mg-nav-item">
        <Link to="/about" className={`mg-nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
          About
        </Link>
      </div>

      <div className="mg-nav-item">
        <Link to="/contact" className={`mg-nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
          Contact
        </Link>
      </div>
    </nav>
  );
}
