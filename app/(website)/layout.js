'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Loader from '@/components/Loader';

export default function WebsiteLayout({ children }) {
  return (
    <>
      <Loader />
      <Navbar />
      <main className="main-wrapper">
        {children}
      </main>
      <Footer />
    </>
  );
}
