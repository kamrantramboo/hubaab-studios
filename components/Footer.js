'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState({});
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      const formatTime = (tz) => {
        return now.toLocaleTimeString('en-US', {
          timeZone: tz,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
      };
      setCurrentTime({
        ist: formatTime('Asia/Kolkata'),
        delhi: formatTime('Asia/Kolkata'),
      });
    };
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const isLightTheme = pathname?.startsWith('/work');

  if (pathname === '/') {
    return null;
  }

  return (
    <footer className={`${styles.footer} ${isLightTheme ? 'light-theme' : ''}`}>
      <div className={styles.inner}>
        {/* Top section: brand */}
        <div className={styles.brand}>
          <Link href="/" className={styles.brandName}>hubaab studio</Link>
        </div>

        {/* Main columns */}
        <div className={styles.columns}>
          <div className={styles.column}>
            <h4 className={styles.colTitle}>Menu</h4>
            <nav className={styles.colLinks}>
              <Link href="/work">Work</Link>
              <Link href="/about">About</Link>
              <Link href="/careers">Careers</Link>
            </nav>
          </div>

          <div className={styles.column}>
            <h4 className={styles.colTitle}>Contact</h4>
            <div className={styles.colContent}>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>Inquiries</span>
                <a href="mailto:info@hubaabstudios.com">info@hubaabstudios.com</a>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>Opportunities</span>
                <a href="mailto:careers@hubaabstudios.com">careers@hubaabstudios.com</a>
              </div>
            </div>
          </div>

          <div className={styles.column}>
            <h4 className={styles.colTitle}>Platforms</h4>
            <nav className={styles.colLinks}>
              <a href="https://www.instagram.com/hubaab_studios/?hl=en" target="_blank" rel="noopener noreferrer">Instagram</a>
            </nav>
          </div>

          <div className={styles.column}>
            <h4 className={styles.colTitle}>Location</h4>
            <div className={styles.locations}>
              <Link href="/about" className={styles.location}>
                <span className={styles.city}>Srinagar</span>
                <span className={styles.time}>{currentTime.ist || '--:--:--'} IST</span>
              </Link>
              <Link href="/about" className={styles.location}>
                <span className={styles.city}>Delhi</span>
                <span className={styles.time}>{currentTime.delhi || '--:--:--'} IST</span>
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.newsletter}>
          <h2 className={styles.newsletterHeading}>Keep in Touch</h2>
          <p className={styles.newsletterText}>
            Sign up to receive occasional updates from hubaab studio, including recent projects, studio work, and behind-the-scenes content.
          </p>
          {subscribed ? (
            <div style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: '500', marginTop: '16px' }}>
              ✓ Thank you for subscribing.
            </div>
          ) : (
            <form 
              className={styles.newsletterForm} 
              onSubmit={(e) => {
                e.preventDefault();
                setSubscribed(true);
              }}
            >
              <input type="email" placeholder="Email Address" required className={styles.newsletterInput} />
              <button type="submit" className={styles.newsletterSubmit}>Join</button>
            </form>
          )}
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <span className={styles.copyright}>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
