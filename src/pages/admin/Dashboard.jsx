import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Dashboard = () => {
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch Products Count
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const productsCount = productsSnapshot.size;

        // Fetch Orders for Count and Revenue
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const ordersCount = ordersSnapshot.size;

        // Calculate Revenue (Sum of totalAmount)
        // Optionally filter out 'cancelled' orders if desired, but for now summing all non-cancelled
        const orders = ordersSnapshot.docs.map(doc => doc.data());
        const revenue = orders.reduce((sum, order) => {
            if (order.status !== 'cancelled') {
                return sum + (order.totalAmount || 0);
            }
            return sum;
        }, 0);

        setStats({
          orders: ordersCount,
          products: productsCount,
          revenue
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
      setLoading(false);
    }

    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>DASHBOARD</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        
        {/* Orders Card */}
        <div style={{ padding: '2rem', background: '#111', border: '1px solid #333', color: 'white', borderRadius: '8px' }}>
            <h3 style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.5rem' }}>TOTAL ORDERS</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>{stats.orders}</p>
        </div>

        {/* Products Card */}
        <div style={{ padding: '2rem', background: '#111', border: '1px solid #333', color: 'white', borderRadius: '8px' }}>
            <h3 style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.5rem' }}>TOTAL PRODUCTS</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>{stats.products}</p>
        </div>

        {/* Revenue Card */}
        <div style={{ padding: '2rem', background: '#111', border: '1px solid #333', color: 'white', borderRadius: '8px' }}>
            <h3 style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.5rem' }}>TOTAL REVENUE</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: 'var(--color-neon-green)' }}>
                ฿{stats.revenue.toLocaleString()}
            </p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
