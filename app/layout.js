import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Loader from '@/components/Loader';

export const metadata = {
  title: 'hubaab studio — A Cinematic Production Studio',
  description: 'hubaab studio is a cinematic production studio specializing in cinematic videos and photography. We create beautiful visual stories through thoughtful collaboration and craft.',
  icons: {
    icon: '/loader-logo.png',
    shortcut: '/loader-logo.png',
    apple: '/loader-logo.png',
  },
  openGraph: {
    title: 'hubaab studio — A Cinematic Production Studio',
    description: 'Cinematic videos and photography brought to life through storytelling and craft.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Loader />
        <Navbar />
        <main className="main-wrapper">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
