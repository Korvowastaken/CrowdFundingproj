import React, { useEffect, useRef } from 'react';

const ScrollAnimations = ({ children, className = '', animationType = 'fadeIn' }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
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
  }, []);

  const getAnimationClasses = () => {
    switch (animationType) {
      case 'slideUp':
        return 'transform translate-y-20 opacity-0 transition-all duration-1000 ease-out animate-in:translate-y-0 animate-in:opacity-100';
      case 'slideLeft':
        return 'transform -translate-x-20 opacity-0 transition-all duration-1000 ease-out animate-in:translate-x-0 animate-in:opacity-100';
      case 'slideRight':
        return 'transform translate-x-20 opacity-0 transition-all duration-1000 ease-out animate-in:translate-x-0 animate-in:opacity-100';
      case 'scale':
        return 'transform scale-95 opacity-0 transition-all duration-1000 ease-out animate-in:scale-100 animate-in:opacity-100';
      case 'rotate':
        return 'transform rotate-12 opacity-0 transition-all duration-1000 ease-out animate-in:rotate-0 animate-in:opacity-100';
      default:
        return 'opacity-0 transition-all duration-1000 ease-out animate-in:opacity-100';
    }
  };

  return (
    <div ref={elementRef} className={`${getAnimationClasses()} ${className}`}>
      {children}
    </div>
  );
};

export default ScrollAnimations;

