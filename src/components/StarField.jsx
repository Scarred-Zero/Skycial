import React, { useEffect, useRef } from 'react';

const StarField = () => {
  const starFieldRef = useRef(null);

  useEffect(() => {
    const starField = starFieldRef.current;
    if (!starField) return;

    // Create stars
    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.width = Math.random() * 3 + 1 + 'px';
      star.style.height = star.style.width;
      star.style.animationDelay = Math.random() * 3 + 's';
      starField.appendChild(star);
    }

    return () => {
      if (starField) {
        starField.innerHTML = '';
      }
    };
  }, []);

  return <div ref={starFieldRef} className="star-field" />;
};

export default StarField;