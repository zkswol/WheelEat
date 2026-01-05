import React, { useState, useEffect } from 'react';
import './RestaurantAdBanner.css';

function RestaurantAdBanner({ variant = 'top' }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageError, setImageError] = useState({});

  // Restaurant profile and dishes data
  const slides = [
    {
      type: 'profile',
      restaurantName: 'NLS Nasi Lemak Shop',
      location: 'Sunway Square Mall',
      rating: '4.4',
      reviews: '36 reviews',
      description: 'Authentic Malaysian cuisine with free-flow sambal!',
      image: '/images/ads/nls-restaurant.jpg', // Restaurant interior
      placeholderBg: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
      cta: 'Visit Restaurant'
    },
    {
      type: 'dish',
      dishName: 'Nasi Lemak',
      description: 'Traditional coconut rice with fried chicken, sambal, and sides',
      image: '/images/ads/nasi-lemak.jpg',
      placeholderBg: 'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)',
      price: 'From RM 8.90',
      cta: 'Order Now'
    },
    {
      type: 'dish',
      dishName: 'Rendang',
      description: 'Slow-cooked beef in rich, aromatic spices',
      image: '/images/ads/rendang.jpg',
      placeholderBg: 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)',
      price: 'From RM 12.90',
      cta: 'Order Now'
    },
    {
      type: 'dish',
      dishName: 'Laksa',
      description: 'Spicy coconut curry noodles with prawns and vegetables',
      image: '/images/ads/laksa.jpg',
      placeholderBg: 'linear-gradient(135deg, #ff7675 0%, #fd79a8 100%)',
      price: 'From RM 10.90',
      cta: 'Order Now'
    },
    {
      type: 'dish',
      dishName: 'Lontong Sayur',
      description: 'Rice cakes in creamy coconut curry soup',
      image: '/images/ads/lontong.jpg',
      placeholderBg: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
      price: 'From RM 9.90',
      cta: 'Order Now'
    }
  ];

  // Auto-advance slides every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const currentSlideData = slides[currentSlide];
  const isProfile = currentSlideData.type === 'profile';

  const handleClick = () => {
    // Handle ad click - could navigate to restaurant page or open menu
    console.log('Ad clicked:', currentSlideData);
    // You can add navigation logic here
  };

  return (
    <div className={`restaurant-ad-banner ${variant}`} onClick={handleClick}>
      <div className="ad-banner-content">
        <div 
          className="ad-banner-image-container"
          style={{
            background: imageError[currentSlide] ? currentSlideData.placeholderBg : 'transparent'
          }}
        >
          {!imageError[currentSlide] && (
            <img 
              src={currentSlideData.image} 
              alt={isProfile ? currentSlideData.restaurantName : currentSlideData.dishName}
              className="ad-banner-image"
              onError={() => {
                setImageError(prev => ({ ...prev, [currentSlide]: true }));
              }}
            />
          )}
          {imageError[currentSlide] && (
            <div className="ad-banner-placeholder">
              {isProfile ? '🏪' : '🍽️'}
            </div>
          )}
          <div className="ad-banner-overlay" />
        </div>
        
        <div className="ad-banner-text">
          {isProfile ? (
            <>
              <div className="ad-banner-header">
                <span className="ad-label">Ad</span>
                <span className="ad-restaurant-name">{currentSlideData.restaurantName}</span>
              </div>
              <div className="ad-banner-location">{currentSlideData.location}</div>
              <div className="ad-banner-rating">
                <span className="ad-rating-stars">★★★★★</span>
                <span className="ad-rating-value">{currentSlideData.rating}</span>
                <span className="ad-reviews-count">({currentSlideData.reviews})</span>
              </div>
              <div className="ad-banner-description">{currentSlideData.description}</div>
            </>
          ) : (
            <>
              <div className="ad-banner-header">
                <span className="ad-label">Ad</span>
                <span className="ad-restaurant-name">{currentSlideData.restaurantName}</span>
              </div>
              <div className="ad-dish-name">{currentSlideData.dishName}</div>
              <div className="ad-banner-description">{currentSlideData.description}</div>
              <div className="ad-dish-price">{currentSlideData.price}</div>
            </>
          )}
          
          <button className="ad-cta-button">{currentSlideData.cta}</button>
        </div>
      </div>
      
      {/* Slide indicators */}
      <div className="ad-slide-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`ad-indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSlide(index);
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default RestaurantAdBanner;

