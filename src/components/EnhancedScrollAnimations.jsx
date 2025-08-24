import React, { useEffect, useRef, useState } from 'react';

const EnhancedScrollAnimations = ({ 
  children, 
  className = '', 
  animationType = 'fadeIn',
  delay = 0,
  duration = 1000,
  threshold = 0.1,
  triggerOnce = true
}) => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && (!triggerOnce || !hasAnimated)) {
            setIsVisible(true);
            setHasAnimated(true);
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold, triggerOnce, hasAnimated]);

  const getAnimationStyles = () => {
    const baseStyles = {
      transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      transitionDelay: `${delay}ms`
    };

    if (!isVisible) {
      switch (animationType) {
        case 'slideUp':
          return {
            ...baseStyles,
            transform: 'translateY(50px)',
            opacity: 0
          };
        case 'slideDown':
          return {
            ...baseStyles,
            transform: 'translateY(-50px)',
            opacity: 0
          };
        case 'slideLeft':
          return {
            ...baseStyles,
            transform: 'translateX(50px)',
            opacity: 0
          };
        case 'slideRight':
          return {
            ...baseStyles,
            transform: 'translateX(-50px)',
            opacity: 0
          };
        case 'scale':
          return {
            ...baseStyles,
            transform: 'scale(0.8)',
            opacity: 0
          };
        case 'rotate':
          return {
            ...baseStyles,
            transform: 'rotate(-5deg) scale(0.9)',
            opacity: 0
          };
        case 'blur':
          return {
            ...baseStyles,
            filter: 'blur(10px)',
            opacity: 0
          };
        case 'bounce':
          return {
            ...baseStyles,
            transform: 'translateY(100px)',
            opacity: 0
          };
        default:
          return {
            ...baseStyles,
            opacity: 0
          };
      }
    }

    // Visible state
    switch (animationType) {
      case 'bounce':
        return {
          ...baseStyles,
          transform: 'translateY(0)',
          opacity: 1,
          animation: 'bounce 0.6s ease-out'
        };
      default:
        return {
          ...baseStyles,
          transform: 'translate(0, 0) scale(1) rotate(0deg)',
          opacity: 1,
          filter: 'blur(0px)'
        };
    }
  };

  return (
    <div 
      ref={elementRef} 
      className={className}
      style={getAnimationStyles()}
    >
      {children}
    </div>
  );
};

// Staggered animation wrapper for multiple children
export const StaggeredAnimation = ({ 
  children, 
  staggerDelay = 100, 
  animationType = 'slideUp',
  className = ''
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <EnhancedScrollAnimations
          key={index}
          animationType={animationType}
          delay={index * staggerDelay}
        >
          {child}
        </EnhancedScrollAnimations>
      ))}
    </div>
  );
};

// Parallax effect component
export const ParallaxElement = ({ 
  children, 
  speed = 0.5, 
  className = '' 
}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (elementRef.current) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * speed;
        elementRef.current.style.transform = `translateY(${rate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};

// Floating animation component
export const FloatingElement = ({ 
  children, 
  className = '',
  floatDistance = 20,
  duration = 3000
}) => {
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFloating(prev => !prev);
    }, duration);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div 
      className={className}
      style={{
        transform: `translateY(${isFloating ? -floatDistance : 0}px)`,
        transition: `transform ${duration}ms ease-in-out`
      }}
    >
      {children}
    </div>
  );
};

export default EnhancedScrollAnimations;

