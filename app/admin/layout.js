export const metadata = {
  title: 'Admin — Hubaab Studios',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh' }}>
      {children}
    </div>
  );
}
