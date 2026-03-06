'use client';

import { useEffect, useState } from 'react';
import styles from './Loader.module.css';

export default function Loader() {
  const [loading, setLoading] = useState(true);
  const [shrinking, setShrinking] = useState(false);
  const [splitting, setSplitting] = useState(false);

  useEffect(() => {
    // Phase 1: Keep full screen for a moment while site loads
    const t1 = setTimeout(() => {
      setShrinking(true); // Shrink the text slightly
    }, 1200);

    // Phase 2: Split the text and fade out the background
    const t2 = setTimeout(() => {
      setSplitting(true);
    }, 2400);

    // Phase 3: Remove loader from DOM entirely
    const t3 = setTimeout(() => {
      setLoading(false);
      document.body.style.overflow = ''; // Restore scrolling
    }, 4500);

    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      document.body.style.overflow = '';
    };
  }, []);

  if (!loading) return null;

  return (
    <div className={`${styles.loaderContainer} ${splitting ? styles.containerFadeOut : ''}`}>
      <div className={styles.logoWrapper}>
        <img 
          src="/loader-logo.png" 
          alt="Hubaab Studio Left"
          className={`${styles.logoImage} ${styles.leftImage} ${shrinking ? styles.shrink : ''} ${splitting ? styles.splitLeft : ''}`} 
        />
        <img 
          src="/loader-logo.png" 
          alt="Hubaab Studio Right"
          className={`${styles.logoImage} ${styles.rightImage} ${shrinking ? styles.shrink : ''} ${splitting ? styles.splitRight : ''}`} 
        />
      </div>
    </div>
  );
}
