import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { Package, User, LogOut } from 'lucide-react';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    async function fetchOrders() {
      if (!currentUser) return;
      try {
        // Note: This query requires a Firestore Index. 
        // If it fails, check the console for the index creation link.
        // REMOVED orderBy to avoid needing a composite index immediately
        const q = query(
          collection(db, 'orders'), 
          where('userId', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const orderList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).sort((a, b) => {
           // Sort by createdAt desc in JS
           const timeA = a.createdAt?.seconds || 0;
           const timeB = b.createdAt?.seconds || 0;
           return timeB - timeA;
        });
        setOrders(orderList);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
      setLoading(false);
    }
    fetchOrders();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '4rem', color: 'white', minHeight: '80vh' }}>
      
      {/* Profile Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem', borderBottom: '1px solid #333', paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ 
            width: '80px', height: '80px', 
            borderRadius: '50%', 
            background: 'var(--color-neon-green)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem', fontWeight: 'bold', color: 'black',
            boxShadow: '0 0 15px rgba(204, 255, 0, 0.3)'
          }}>
             {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', margin: 0, color: 'white', fontFamily: 'var(--font-heading)' }}>
              {currentUser.displayName || 'Guest User'}
            </h1>
            <p style={{ color: '#888', marginTop: '0.5rem' }}>{currentUser.email}</p>
          </div>
        </div>
        <button 
           onClick={handleLogout} 
           style={{ 
             background: 'rgba(220, 38, 38, 0.1)', 
             border: '1px solid #dc2626', 
             color: '#dc2626',
             padding: '0.6rem 1.5rem',
             borderRadius: '4px',
             display: 'flex', 
             alignItems: 'center', 
             gap: '0.6rem',
             cursor: 'pointer',
             fontSize: '0.9rem',
             fontWeight: 'bold',
             transition: 'all 0.3s',
             letterSpacing: '1px',
             textTransform: 'uppercase'
           }}
           onMouseEnter={(e) => {
             e.currentTarget.style.background = '#dc2626';
             e.currentTarget.style.color = 'white';
             e.currentTarget.style.boxShadow = '0 0 20px rgba(220, 38, 38, 0.4)';
             e.currentTarget.style.transform = 'translateY(-2px)';
           }}
           onMouseLeave={(e) => {
             e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)';
             e.currentTarget.style.color = '#dc2626';
             e.currentTarget.style.boxShadow = 'none';
             e.currentTarget.style.transform = 'translateY(0)';
           }}
        >
          <LogOut size={18} /> LOGOUT
        </button>
      </div>

      <div style={{ display: 'flex', gap: '3rem', flexDirection: 'row', flexWrap: 'wrap' }}>
        
        {/* Sidebar Menu */}
        <div style={{ width: '250px', flexShrink: 0 }}>
          <div
            onClick={() => setActiveTab('orders')}
            style={{ 
              padding: '1rem', 
              cursor: 'pointer', 
              background: activeTab === 'orders' ? 'rgba(255,255,255,0.05)' : 'transparent',
              color: activeTab === 'orders' ? 'var(--color-neon-green)' : 'white',
              borderLeft: activeTab === 'orders' ? '3px solid var(--color-neon-green)' : '3px solid transparent',
              display: 'flex', alignItems: 'center', gap: '1rem',
              marginBottom: '0.5rem', fontWeight: 'bold',
              transition: 'all 0.2s'
            }}
          >
            <Package size={20} /> MY ORDERS
          </div>
          <div 
             onClick={() => setActiveTab('info')}
             style={{ 
               padding: '1rem', 
               cursor: 'pointer', 
               background: activeTab === 'info' ? 'rgba(255,255,255,0.05)' : 'transparent',
               color: activeTab === 'info' ? 'var(--color-neon-green)' : 'white',
               borderLeft: activeTab === 'info' ? '3px solid var(--color-neon-green)' : '3px solid transparent',
               display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 'bold',
               transition: 'all 0.2s'
             }}
          >
             <User size={20} /> PROFILE INFO
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          
          {activeTab === 'orders' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'white', fontFamily: 'var(--font-heading)' }}>
                ORDER HISTORY
              </h2>
              {loading ? <div style={{color: '#888'}}>Loading history...</div> : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', border: '1px dashed #333', borderRadius: '8px' }}>
                  <p style={{ marginBottom: '1rem', color: '#888' }}>You haven't placed any orders yet.</p>
                  <Link to="/shop" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center' }}>
                    START SHOPPING
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {orders.map(order => (
                    <div key={order.id} style={{ 
                      background: '#0a0a0a', 
                      border: '1px solid #333', 
                      padding: '1.5rem',
                      borderRadius: '8px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #222', paddingBottom: '1rem' }}>
                         <div>
                            <span style={{ color: '#666', fontSize: '0.8rem', textTransform: 'uppercase' }}>ORDER ID</span><br/>
                            <span style={{ fontFamily: 'monospace', color: 'white', fontSize: '1.1rem' }}>#{order.id.slice(0,8)}</span>
                         </div>
                         <div style={{ textAlign: 'right' }}>
                            <span style={{ color: '#666', fontSize: '0.8rem', textTransform: 'uppercase' }}>DATE</span><br/>
                            <span style={{color: '#ccc'}}>{order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</span>
                         </div>
                      </div>
                      
                      <div style={{ marginBottom: '1rem' }}>
                         {order.items && order.items.map((item, idx) => (
                           <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem', color: '#ddd' }}>
                              <span>{item.quantity} x {item.name} <span style={{color: '#666'}}>| {item.size}</span></span>
                              <span>฿{(item.price * item.quantity).toLocaleString()}</span>
                           </div>
                         ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #222' }}>
                         <div style={{ 
                           padding: '0.3rem 1rem', 
                           borderRadius: '4px', 
                           fontSize: '0.8rem',
                           background: order.status === 'delivered' ? 'rgba(204, 255, 0, 0.1)' : 'rgba(255,255,255,0.1)',
                           color: order.status === 'delivered' ? 'var(--color-neon-green)' : 'white',
                           border: order.status === 'delivered' ? '1px solid var(--color-neon-green)' : '1px solid #444',
                           textTransform: 'uppercase',
                           fontWeight: 'bold',
                           letterSpacing: '1px'
                         }}>
                            {order.status || 'Pending'}
                         </div>
                         <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'white' }}>
                            Total: <span style={{color: 'var(--color-neon-green)'}}>฿{order.totalAmount ? order.totalAmount.toLocaleString() : '0'}</span>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'info' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'white', fontFamily: 'var(--font-heading)' }}>
                PERSONAL INFORMATION
              </h2>
              <div style={{ background: '#0a0a0a', padding: '2rem', border: '1px solid #333', borderRadius: '8px' }}>
                 <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', color: '#666', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>Display Name</label>
                    <div style={{ fontSize: '1.2rem', color: 'white', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>{currentUser.displayName || 'Not Set'}</div>
                 </div>
                 <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', color: '#666', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>Email Address</label>
                    <div style={{ fontSize: '1.2rem', color: 'white', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>{currentUser.email}</div>
                 </div>
                 <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', color: '#666', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>User ID</label>
                    <div style={{ fontFamily: 'monospace', color: '#444' }}>{currentUser.uid}</div>
                 </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;
