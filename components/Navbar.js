'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import styles from './Navbar.module.css';

const navLinks = [
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/news', label: 'News' },
  { href: '/careers', label: 'Careers' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);

      // Hide navbar when scrolling down past 100px, show when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Watch hero visibility from homepage
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setHeroVisible(document.body.dataset.heroVisible === 'true');
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-hero-visible'] });
    return () => observer.disconnect();
  }, []);

  // Don't show navbar on admin pages
  if (pathname?.startsWith('/admin')) return null;

  const closeMenu = () => setMenuOpen(false);
  const isLightTheme = pathname?.startsWith('/work');

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${hidden ? styles.hidden : ''} ${menuOpen ? styles.menuOpen : ''} ${isLightTheme ? 'light-theme' : ''}`}>
        <div className={styles.inner}>
          <Link href="/" className={styles.logo} onClick={closeMenu}>
            hubaab studio
          </Link>

          {/* Desktop nav — comma-separated like Bodeyco */}
          <div className={styles.desktopNav}>
            <Link href="/work" className={`${styles.navLink} ${pathname.startsWith('/work') ? styles.active : ''}`}>
              Work
            </Link>
            <span className={styles.comma}>,</span>
            <Link href="/about" className={`${styles.navLink} ${pathname === '/about' ? styles.active : ''}`}>
              About
            </Link>
            <span className={styles.comma}>,</span>
            <Link href="/careers" className={`${styles.navLink} ${pathname === '/careers' ? styles.active : ''}`}>
              Careers
            </Link>
          </div>

          <div className={styles.right}>
            <Link href="/inquiry" className={styles.ctaLink}>
              Start a project
            </Link>
            <button
              className={styles.menuButton}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu — Bodeyco-style slide down with sections */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''} ${isLightTheme ? 'light-theme' : ''}`}>
        <div className={`${styles.mobileMenuInner} ${menuOpen ? styles.mobileMenuContentVisible : ''}`}>
          <div className={styles.menuSection}>
            <h2 className={styles.menuSectionTitle}>Menu</h2>
            <div className={styles.menuLinks}>
              <Link href="/work" onClick={closeMenu} className={styles.menuLink}>Work</Link>
              <Link href="/about" onClick={closeMenu} className={styles.menuLink}>About</Link>
              <Link href="/careers" onClick={closeMenu} className={styles.menuLink}>Careers</Link>
              <Link href="/inquiry" onClick={closeMenu} className={styles.menuLink}>Inquire</Link>
            </div>
          </div>

          <div className={`${styles.menuSection} ${styles.menuSectionBorder}`}>
            <h2 className={styles.menuSectionTitle}>Contact</h2>
            <div className={styles.menuContactGroup}>
              <p className={styles.menuContactLabel}>Inquiries</p>
              <a href="mailto:info@hubaabstudios.com" className={styles.menuContactLink}>
                info@hubaabstudios.com
              </a>
            </div>
            <div className={styles.menuContactGroup}>
              <p className={styles.menuContactLabel}>Opportunities</p>
              <a href="mailto:careers@hubaabstudios.com" className={styles.menuContactLink}>
                careers@hubaabstudios.com
              </a>
            </div>
          </div>

          <div className={`${styles.menuSection} ${styles.menuSectionBorder}`}>
            <h2 className={styles.menuSectionTitle}>Platforms</h2>
            <div className={styles.menuLinks}>
              <a href="https://www.instagram.com/hubaab_studios/?hl=en" target="_blank" rel="noopener noreferrer" className={styles.menuLink}>
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
