'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState({});

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
        est: formatTime('America/New_York'),
        pst: formatTime('America/Los_Angeles'),
        gmt: formatTime('Europe/London'),
      });
    };
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  const isLightTheme = pathname?.startsWith('/work');

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
              <Link href="/news">News</Link>
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
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://vimeo.com" target="_blank" rel="noopener noreferrer">Vimeo</a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </nav>
          </div>

          <div className={styles.column}>
            <h4 className={styles.colTitle}>Location</h4>
            <div className={styles.locations}>
              <div className={styles.location}>
                <span className={styles.city}>Local</span>
                <span className={styles.time}>{currentTime.ist || '--:--:--'} IST</span>
              </div>
              <div className={styles.location}>
                <span className={styles.city}>New York</span>
                <span className={styles.time}>{currentTime.est || '--:--:--'} EST</span>
              </div>
              <div className={styles.location}>
                <span className={styles.city}>Los Angeles</span>
                <span className={styles.time}>{currentTime.pst || '--:--:--'} PST</span>
              </div>
              <div className={styles.location}>
                <span className={styles.city}>London</span>
                <span className={styles.time}>{currentTime.gmt || '--:--:--'} GMT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className={styles.newsletter}>
          <h4 className={styles.colTitle}>Keep in Touch</h4>
          <p className={styles.newsletterText}>
            Sign up to receive occasional updates from hubaab studio, including recent projects, studio work, and behind-the-scenes content.
          </p>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <span className={styles.copyright}>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
