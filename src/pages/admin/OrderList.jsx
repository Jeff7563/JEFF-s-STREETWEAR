import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAlert } from '../../contexts/AlertContext';

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
      } catch (error) {
          showAlert('Failed to update status');
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
                    <div>
                        <select 
                            value={order.status} 
                            onChange={(e) => updateStatus(order.id, e.target.value)}
                            style={{ padding: '0.2rem', fontSize: '0.9rem' }}
                        >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
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
