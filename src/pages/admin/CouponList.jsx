import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Plus, Trash, ToggleLeft, ToggleRight, Edit } from 'lucide-react';

export default function CouponList() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function fetchCoupons() {
    try {
      const querySnapshot = await getDocs(collection(db, "coupons"));
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCoupons(list);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await deleteDoc(doc(db, "coupons", id));
      fetchCoupons();
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  }

  async function toggleStatus(coupon) {
    try {
      await updateDoc(doc(db, "coupons", coupon.id), {
        isActive: !coupon.isActive
      });
      fetchCoupons();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>COUPONS</h1>
        <Link to="/admin/coupons/new" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} /> ADD NEW COUPON
        </Link>
      </div>

      <div style={{ background: '#111', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#222', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>Code</th>
              <th style={{ padding: '1rem' }}>Discount</th>
              <th style={{ padding: '1rem' }}>Min. Purchase</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
               <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No coupons found.</td></tr>
            ) : coupons.map(coupon => (
              <tr key={coupon.id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--color-neon-green)' }}>{coupon.code}</td>
                <td style={{ padding: '1rem' }}>฿{coupon.discountAmount.toLocaleString()}</td>
                <td style={{ padding: '1rem' }}>฿{coupon.minPurchaseAmount.toLocaleString()}</td>
                <td style={{ padding: '1rem' }}>
                   {coupon.isActive ? <span style={{ color: '#4ade80' }}>Active</span> : <span style={{ color: '#ef4444' }}>Inactive</span>}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button 
                    onClick={() => toggleStatus(coupon)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginRight: '1rem', color: coupon.isActive ? '#4ade80' : '#666' }}
                    title="Toggle Status"
                  >
                    {coupon.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                  </button>
                  <Link to={`/admin/coupons/edit/${coupon.id}`} style={{ marginRight: '1rem', color: '#fff' }} title="Edit">
                     <Edit size={18} />
                  </Link>
                  <button 
                    onClick={() => handleDelete(coupon.id)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                    title="Delete"
                  >
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
