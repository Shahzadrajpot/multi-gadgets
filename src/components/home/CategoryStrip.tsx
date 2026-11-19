import { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { Category } from '../../types';
import { CategoryStripSkeleton } from '../shared/Skeletons';
import './CategoryStrip.css';

interface CategoryStripProps {
  categories: Category[];
  loading?: boolean;
}

// Curated high-res gadget cutouts matching the exact aesthetic of the user's reference
const DEFAULT_GADGET_CATEGORIES = [
  {
    name: 'Smart Watches',
    slug: 'smart-watches',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=220&auto=format&fit=crop&q=80',
  },
  {
    name: 'Earbuds',
    slug: 'wireless-audio',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=220&auto=format&fit=crop&q=80',
  },
  {
    name: 'Power Banks',
    slug: 'power-charging',
    image: 'https://images.unsplash.com/photo-1622445262464-84b14e4b7de7?w=220&auto=format&fit=crop&q=80',
  },
  {
    name: 'Accessories',
    slug: 'smart-accessories',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=220&auto=format&fit=crop&q=80',
  },
  {
    name: 'Audio Speakers',
    slug: 'wireless-audio',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=220&auto=format&fit=crop&q=80',
  },
  {
    name: 'Fast Chargers',
    slug: 'power-charging',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=220&auto=format&fit=crop&q=80',
  },
  {
    name: 'Car Gadgets',
    slug: 'smart-accessories',
    image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=220&auto=format&fit=crop&q=80',
  },
];

export function CategoryStrip({ categories, loading }: CategoryStripProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll boundary to show/hide arrows
  const checkScroll = useCallback(() => {
    if (!railRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = railRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    const rail = railRef.current;
    if (rail) {
      rail.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (rail) rail.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, categories]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!railRef.current) return;
    const rail = railRef.current;
    const firstItem = rail.querySelector<HTMLElement>('.mg-category-strip-item');
    // Calculate stride: item width + gap (32px)
    const itemStride = firstItem ? firstItem.offsetWidth + 32 : 124;
    // Calculate number of visible whole items (leaving arrow padding space)
    const visibleWidth = rail.clientWidth - 96;
    const itemsToScroll = Math.max(1, Math.floor(visibleWidth / itemStride));
    const scrollAmount = (direction === 'left' ? -1 : 1) * itemsToScroll * itemStride;
    rail.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (loading) {
    return <CategoryStripSkeleton count={8} />;
  }

  // Combine New Arrivals + dynamic categories (or defaults if empty)
  const itemsToRender = categories.length > 0
    ? categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        image: cat.image || DEFAULT_GADGET_CATEGORIES.find((d) => d.slug === cat.slug)?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=220',
      }))
    : DEFAULT_GADGET_CATEGORIES.map((d, i) => ({
        id: `def-${i}`,
        name: d.name,
        slug: d.slug,
        image: d.image,
      }));

  return (
    <section className="mg-category-strip-wrapper" aria-label="Shop categories rail">
      <div className="pk-container mg-category-strip-container">
        {/* Left Arrow Button (shows when scrolled right) */}
        {canScrollLeft && (
          <button
            type="button"
            className="mg-strip-arrow left"
            onClick={() => handleScroll('left')}
            aria-label="Scroll categories left"
          >
            <LeftOutlined />
          </button>
        )}

        {/* Scrollable Categories Rail */}
        <div className="mg-category-strip-rail" ref={railRef}>
          {/* 1. New Arrivals Item (Matches reference screenshot 1st position) */}
          <Link to="/shop?sort=newest" className="mg-category-strip-item">
            <div className="mg-category-strip-img-box">
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=220&auto=format&fit=crop&q=80"
                alt="New Arrivals"
                loading="lazy"
              />
            </div>
            <span className="mg-category-strip-title">New Arrivals</span>
          </Link>

          {/* 2. Categories List */}
          {itemsToRender.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="mg-category-strip-item"
            >
              <div className="mg-category-strip-img-box">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to crisp gadget placeholder
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=220';
                  }}
                />
              </div>
              <span className="mg-category-strip-title">{cat.name}</span>
            </Link>
          ))}
        </div>

        {/* Right Arrow Button (Dark circular button overlaying right edge like reference) */}
        {canScrollRight && (
          <button
            type="button"
            className="mg-strip-arrow right"
            onClick={() => handleScroll('right')}
            aria-label="Scroll categories right"
          >
            <RightOutlined />
          </button>
        )}
      </div>
    </section>
  );
}
