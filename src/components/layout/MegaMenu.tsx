import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DownOutlined, RightOutlined, FireOutlined } from '@ant-design/icons';
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
  // Auto-switch: 1 column if <= 5 categories, 2 columns if > 5 categories
  const isMultiColumn = activeCategories.length > 5;

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

      {/* Clean Text-Only Categories Dropdown */}
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

        {/* Dropdown Panel with Dynamic 1 or 2 Columns */}
        <div
          className={`mg-dropdown-panel ${isOpen ? 'visible' : ''} ${
            isMultiColumn ? 'multi-column' : 'single-column'
          }`}
        >
          <div className={`mg-dropdown-list ${isMultiColumn ? 'two-cols' : 'one-col'}`}>
            {activeCategories.length > 0 ? (
              activeCategories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.slug}`}
                  className="mg-category-text-item"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="mg-category-text-name">{cat.name}</span>
                </Link>
              ))
            ) : (
              <div className="mg-category-empty">No categories available</div>
            )}
          </div>

          <div className="mg-dropdown-footer">
            <Link to="/shop" className="mg-dropdown-footer-link" onClick={() => setIsOpen(false)}>
              <span>View All Categories</span>
              <RightOutlined style={{ fontSize: 10 }} />
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
