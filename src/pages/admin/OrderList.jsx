import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAlert } from '../../contexts/AlertContext';
import { CheckCircle, Trash, XCircle, Clock } from 'lucide-react';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const sn = await getDocs(q);
        setOrders(sn.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }
    fetchOrders();
  }, []);

  async function updateStatus(id, newStatus) {
      try {
          await updateDoc(doc(db, 'orders', id), { status: newStatus });
          setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
          showAlert(`Order marked as ${newStatus}`);
      } catch (error) {
          showAlert('Failed to update status');
      }
  }

  async function deleteOrder(id) {
    if (!window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, 'orders', id));
      setOrders(orders.filter(o => o.id !== id));
      showAlert("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      showAlert("Failed to delete order");
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Customer Orders</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {orders.map(order => (
            <div key={order.id} style={{ border: '1px solid var(--color-grey-light)', padding: '1.5rem', borderRadius: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div>
                        <span style={{ fontWeight: 'bold' }}>#{order.id.slice(0, 6)}</span>
                        <span style={{ margin: '0 1rem', color: 'var(--color-grey-dark)' }}>
                            {new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <select 
                            value={order.status} 
                            onChange={(e) => updateStatus(order.id, e.target.value)}
                            style={{ 
                                padding: '0.4rem', 
                                fontSize: '0.9rem', 
                                background: '#111', 
                                color: 'white', 
                                border: '1px solid #333',
                                borderRadius: '4px'
                            }}
                        >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        
                        {/* Instant Actions */}
                        {order.status !== 'paid' && order.status !== 'cancelled' && (
                             <button 
                               onClick={() => updateStatus(order.id, 'paid')}
                               style={{ 
                                   display: 'flex', alignItems: 'center', gap: '0.3rem', 
                                   background: 'rgba(57, 255, 20, 0.1)', 
                                   border: '1px solid var(--color-neon-green)', 
                                   color: 'var(--color-neon-green)', 
                                   padding: '0.4rem 0.8rem', 
                                   borderRadius: '4px', 
                                   cursor: 'pointer' 
                               }}
                               title="Mark as Paid"
                             >
                               <CheckCircle size={16} /> Paid
                             </button>
                        )}
                        <button 
                             onClick={() => deleteOrder(order.id)} // Using deleteOrder function
                             style={{ 
                                 background: 'transparent', 
                                 border: '1px solid #ef4444', 
                                 color: '#ef4444', 
                                 padding: '0.4rem', 
                                 borderRadius: '4px', 
                                 cursor: 'pointer' 
                             }}
                             title="Delete Order"
                        >
                           <Trash size={16} />
                        </button>
                    </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                        <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Items</p>
                        {order.items.map((item, idx) => (
                            <div key={idx} style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                {item.quantity}x {item.name} ({item.size})
                            </div>
                        ))}
                    </div>
                    <div>
                        <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Shipping</p>
                        <p style={{ fontSize: '0.9rem' }}>{order.shippingAddress.name}</p>
                        <p style={{ fontSize: '0.9rem' }}>{order.shippingAddress.street}</p>
                        <p style={{ fontSize: '0.9rem' }}>{order.shippingAddress.city}, {order.shippingAddress.zip}</p>
                        <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>Total: ฿{order.totalAmount.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;
