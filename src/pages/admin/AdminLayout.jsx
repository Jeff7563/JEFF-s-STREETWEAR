import { Link, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="container" style={{ paddingTop: '100px', display: 'flex', gap: '2rem' }}>
      <aside style={{ width: '250px', flexShrink: 0 }}>
        <div style={{ position: 'sticky', top: '100px', background: 'var(--color-off-white)', padding: '1.5rem', borderRadius: 'var(--border-radius)' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>ADMIN PANEL</h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link to="/admin" style={{ padding: '0.5rem', fontWeight: '500' }}>Dashboard</Link>
                <Link to="/admin/products" style={{ padding: '0.5rem', fontWeight: '500' }}>Products</Link>
                <Link to="/admin/orders" style={{ padding: '0.5rem', fontWeight: '500' }}>Orders</Link>
                <Link to="/admin/coupons" style={{ padding: '0.5rem', fontWeight: '500' }}>Coupons</Link>
            </nav>
        </div>
      </aside>
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
