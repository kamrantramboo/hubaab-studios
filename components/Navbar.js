'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
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

  // Don't show navbar on admin pages
  if (pathname?.startsWith('/admin')) return null;

  const closeMenu = () => setMenuOpen(false);
  const isLightTheme = pathname?.startsWith('/work');

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${isLightTheme ? 'light-theme' : ''}`}>
        <div className={styles.inner}>
          <Link href="/" className={styles.logo} onClick={closeMenu}>
            hubaab studio
          </Link>

          {/* Desktop nav — comma-separated like Bodeyco */}
          <div className={styles.desktopNav}>
            {navLinks.map((link, i) => (
              <span key={link.href} className={styles.navItem}>
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
                >
                  {link.label}
                </Link>
                {i < navLinks.length - 1 && <span className={styles.comma}>,</span>}
              </span>
            ))}
          </div>

          <div className={styles.right}>
            {pathname !== '/' && (
              <Link href="/inquiry" className={styles.ctaLink}>
                Start a project
              </Link>
            )}
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
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={styles.menuLink}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ))}
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
