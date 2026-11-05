import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  LeftOutlined,
  RightOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  TruckOutlined,
  CompassOutlined,
} from '@ant-design/icons';
import './HeroSlider.css';

interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  image: string;
  alt: string;
  accentGlow: string;
  specs: string[];
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'smartwatches',
    badge: '🔥 2026 Tech Series',
    title: 'Next-Gen Ultra Smartwatches',
    subtitle:
      'Retina AMOLED display, precision biometric tracking, and Bluetooth calling engineered in aerospace-grade titanium.',
    primaryCtaText: 'Shop Smartwatches',
    primaryCtaLink: '/shop?category=smart-watches',
    secondaryCtaText: 'View Top Rated',
    secondaryCtaLink: '/shop',
    image: '/hero/smartwatch-3d.jpg',
    alt: '3D Ultra Smartwatch with AMOLED Display',
    accentGlow: 'rgba(56, 189, 248, 0.45)',
    specs: ['AMOLED Always-On', '10-Day Battery', 'Bio-Sensing Pro'],
  },
  {
    id: 'earbuds',
    badge: '🎧 Immersive Hi-Fi Sound',
    title: 'Active Noise Cancelling Earbuds',
    subtitle:
      'Experience studio-grade spatial acoustics with intelligent 45dB hybrid ANC and ultra-low latency gaming audio.',
    primaryCtaText: 'Explore Audio Gear',
    primaryCtaLink: '/shop?category=audio',
    secondaryCtaText: 'Browse Best Sellers',
    secondaryCtaLink: '/shop',
    image: '/hero/earbuds-3d.jpg',
    alt: '3D ANC Wireless Earbuds with Charging Case',
    accentGlow: 'rgba(96, 165, 250, 0.45)',
    specs: ['45dB Hybrid ANC', '48hr Total Playback', 'Spatial 3D Audio'],
  },
  {
    id: 'chargers',
    badge: '⚡ Turbo GaN Power',
    title: '65W GaN Chargers & Power Banks',
    subtitle:
      'Ultra-compact Gallium Nitride high-speed turbo gear and magnetic wireless power banks to charge all your devices at peak speed.',
    primaryCtaText: 'Power Up Now',
    primaryCtaLink: '/shop?category=chargers',
    secondaryCtaText: 'See Power Deals',
    secondaryCtaLink: '/shop',
    image: '/hero/charger-3d.jpg',
    alt: '3D 65W GaN Charger and MagSafe Power Bank',
    accentGlow: 'rgba(251, 191, 36, 0.45)',
    specs: ['65W GaN Turbo', 'MagSafe Compatible', 'Dual USB-C Delivery'],
  },
];

const SLIDE_DURATION = 2000; // 5 seconds per slide

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Touch swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      // Swiped left -> next slide
      nextSlide();
    } else if (distance < -50) {
      // Swiped right -> prev slide
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const active = HERO_SLIDES[currentSlide];

  return (
    <section
      className="mg-hero-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Featured Gadgets Showcase"
    >
      {/* Dynamic Background Glow */}
      <div
        className="mg-hero-bg-glow"
        style={{ background: active.accentGlow }}
        aria-hidden="true"
      />
      <div className="mg-hero-grid-pattern" aria-hidden="true" />

      {/* Navigation Arrows (Desktop) */}
      <button
        type="button"
        className="mg-hero-arrow-btn mg-hero-arrow-prev"
        onClick={prevSlide}
        aria-label="Previous Slide"
      >
        <LeftOutlined />
      </button>
      <button
        type="button"
        className="mg-hero-arrow-btn mg-hero-arrow-next"
        onClick={nextSlide}
        aria-label="Next Slide"
      >
        <RightOutlined />
      </button>

      {/* Viewport with Horizontal Sliding Track */}
      <div className="mg-hero-viewport">
        <div
          className="mg-hero-track"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {HERO_SLIDES.map((slide, index) => (
            <div className="mg-hero-slide-item" key={slide.id}>
              <div className="pk-container mg-hero-slide-content">
                {/* Text / CTA Column */}
                <div className="mg-hero-text-col">
                  <div className="mg-hero-badge">
                    <span className="mg-hero-badge-dot" />
                    <span>{slide.badge}</span>
                  </div>

                  <h1 className="mg-hero-title">{slide.title}</h1>
                  <p className="mg-hero-subtitle">{slide.subtitle}</p>

                  {/* Tech Specs */}
                  <div className="mg-hero-specs">
                    {slide.specs.map((spec) => (
                      <span key={spec} className="mg-hero-spec-pill">
                        <CheckCircleOutlined style={{ color: '#38bdf8' }} />
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Action CTAs */}
                  <div className="mg-hero-actions">
                    <Link to={slide.primaryCtaLink} className="mg-hero-btn-primary">
                      {slide.primaryCtaText}
                      <ArrowRightOutlined />
                    </Link>
                    <Link to={slide.secondaryCtaLink} className="mg-hero-btn-secondary">
                      {slide.secondaryCtaText}
                    </Link>
                  </div>

                  {/* Trust bar */}
                  <div className="mg-hero-trust-bar">
                    <span>
                      <TruckOutlined style={{ color: '#38bdf8' }} /> Cash on Delivery Nationwide
                    </span>
                    <span>•</span>
                    <span>100% Genuine Tech</span>
                  </div>
                </div>

                {/* 3D Product Visual Column */}
                <div className="mg-hero-visual-col">
                  <div className="mg-hero-3d-card">
                    <div className="mg-hero-product-img-wrap">
                      <img
                        src={slide.image}
                        alt={slide.alt}
                        className="mg-hero-product-img"
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />
                      <div className="mg-hero-3d-tag">
                        <CompassOutlined spin={false} />
                        <span>360° Tech View</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Minimalist Navigation Dots */}
      <div className="mg-hero-controls">
        <div className="mg-hero-dots" role="tablist" aria-label="Slider Pagination">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              className={`mg-hero-dot ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
              aria-selected={idx === currentSlide}
              role="tab"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSlider;
