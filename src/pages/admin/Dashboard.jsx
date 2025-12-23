import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Dashboard = () => {
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    revenue: 0,
    recentOrders: []
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
        const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const revenue = orders.reduce((sum, order) => {
            if (order.status !== 'cancelled') {
                return sum + (order.totalAmount || 0);
            }
            return sum;
        }, 0);

        // Create recent orders list (sort client side for now to avoid index)
        const recentOrders = orders
            .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
            .slice(0, 5);

        // Calculate Chart Data (Last 7 Days)
        const last7Days = [...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i)); // Correct order: 6 days ago -> today
          return d.toISOString().split('T')[0];
        });

        const chartData = last7Days.map(date => {
          const dailyRevenue = orders
            .filter(order => {
                if (!order.createdAt) return false;
                const orderDate = new Date(order.createdAt.seconds * 1000).toISOString().split('T')[0];
                return orderDate === date && order.status !== 'cancelled';
            })
            .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
          
          return { date, revenue: dailyRevenue };
        });
        
        const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1);

        setStats({
          orders: ordersCount,
          products: productsCount,
          revenue,
          recentOrders,
          chartData,
          maxRevenue
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
      <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Recent Orders */}
        <div style={{ background: '#111', border: '1px solid #333', borderRadius: '8px', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'white' }}>RECENT ORDERS</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: '#ccc', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #333' }}>
                <th style={{ paddingBottom: '0.8rem' }}>Order ID</th>
                <th style={{ paddingBottom: '0.8rem' }}>Customer</th>
                <th style={{ paddingBottom: '0.8rem' }}>Amount</th>
                <th style={{ paddingBottom: '0.8rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Note: In a real app we should fetch only the last 5 orders sorted by date. 
                  Currently assuming 'orders' in fetchStats could be sorted. 
                  For now, we'll slice the fetched orders if available. 
              */}
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.8rem 0' }}>#{order.id.slice(0, 6)}</td>
                    <td style={{ padding: '0.8rem 0' }}>{order.shippingAddress?.fullName || 'Guest'}</td>
                    <td style={{ padding: '0.8rem 0' }}>฿{order.totalAmount?.toLocaleString()}</td>
                    <td style={{ padding: '0.8rem 0' }}>
                      <span style={{ 
                        padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem',
                        background: order.status === 'paid' ? 'rgba(57, 255, 20, 0.1)' : '#222',
                        color: order.status === 'paid' ? 'var(--color-neon-green)' : '#888'
                      }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" style={{ padding: '1rem', textAlign: 'center' }}>No recent orders</td></tr>
              )}
            </tbody>
          </table>
        </div>

// ... (Calculate Chart Data) inside fetchStats
        const last7Days = [...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toISOString().split('T')[0];
        }).reverse();

        const chartData = last7Days.map(date => {
          const dailyRevenue = orders
            .filter(order => {
                // Ensure date exists and match YYYY-MM-DD
                if (!order.createdAt) return false;
                const orderDate = new Date(order.createdAt.seconds * 1000).toISOString().split('T')[0];
                return orderDate === date && order.status !== 'cancelled';
            })
            .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
          
          return { date, revenue: dailyRevenue };
        });
        
        // Find max revenue for scaling
        const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1); // Avoid div by 0

        setStats({
          orders: ordersCount,
          products: productsCount,
          revenue,
          recentOrders,
          chartData, // Add to state
          maxRevenue
        });

// ... (Render Chart)
        {/* Revenue Chart */}
        <div style={{ background: '#111', border: '1px solid #333', borderRadius: '8px', padding: '1.5rem' }}>
           <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'white' }}>REVENUE LAST 7 DAYS</h2>
           {stats.chartData && (
             <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px', gap: '0.5rem' }}>
               {stats.chartData.map((item, index) => (
                 <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <div 
                      style={{ 
                        width: '100%', 
                        background: 'var(--color-neon-green)', 
                        opacity: 0.8,
                        borderRadius: '4px 4px 0 0',
                        height: `${(item.revenue / stats.maxRevenue) * 100}%`,
                        minHeight: item.revenue > 0 ? '4px' : '0',
                        transition: 'height 1s ease',
                        position: 'relative'
                      }}
                      title={`฿${item.revenue}`}
                    >
                        {/* Tooltip on hover could go here, or just simple text */}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.5rem' }}>
                        {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
