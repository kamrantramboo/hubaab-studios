export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout" style={{ height: '100vh', width: '100vw' }}>
      {children}
    </div>
  );
}
