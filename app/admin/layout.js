export const metadata = {
  title: 'Admin — hubaab studio',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh' }}>
      {children}
    </div>
  );
}
