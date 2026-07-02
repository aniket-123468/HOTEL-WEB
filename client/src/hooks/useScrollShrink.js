import { useEffect, useState } from 'react';

/**
 * useScrollShrink — returns true when the page has scrolled past `threshold` pixels.
 * Used by Navbar to shrink from h-20 → h-16 on scroll.
 */
export default function useScrollShrink(threshold = 50) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return scrolled;
}
