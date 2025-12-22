import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useCart } from '../contexts/CartContext';
import { X, Ticket } from 'lucide-react';
import { useAlert } from '../contexts/AlertContext';

export default function CouponModal({ isOpen, onClose }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { subtotal, applyCoupon, discount } = useCart();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (isOpen) {
      fetchCoupons();
    }
  }, [isOpen]);

  async function fetchCoupons() {
    setLoading(true);
    try {
      const q = query(collection(db, "coupons"), where("isActive", "==", true));
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCoupons(list);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
    setLoading(false);
  }

  function handleApply(coupon) {
    const result = applyCoupon(coupon);
    if (result.success) {
      onClose(); // Close on success
    } else {
      showAlert(result.message);
    }
  }

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000
    }} onClick={onClose}>
      <div style={{
        background: '#111', border: '1px solid #333',
        width: '90%', maxWidth: '400px',
        borderRadius: '12px',
        padding: '1.5rem',
        position: 'relative'
      }} onClick={e => e.stopPropagation()}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Ticket color="var(--color-neon-green)" />
          <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'white' }}>MY COUPONS</h2>
        </div>

        {loading ? (
          <div style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>No active coupons available.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '60vh', overflowY: 'auto' }}>
            {coupons.map(coupon => {
              const isEligible = subtotal >= coupon.minPurchaseAmount;
              const isSelected = discount.code === coupon.code;

              return (
                <div key={coupon.id} style={{
                  background: isEligible ? '#1a1a1a' : '#111',
                  border: isSelected ? '1px solid var(--color-neon-green)' : '1px solid #333',
                  borderRadius: '8px',
                  padding: '1rem',
                  opacity: isEligible ? 1 : 0.6,
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: isEligible ? 'white' : '#888' }}>{coupon.code}</div>
                    {isSelected && <span style={{ fontSize: '0.7rem', color: 'black', background: 'var(--color-neon-green)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>APPLIED</span>}
                  </div>
                  
                  <div style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '1rem' }}>{coupon.description}</div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>Min. Spend: ฿{coupon.minPurchaseAmount.toLocaleString()}</div>
                    <button 
                      onClick={() => handleApply(coupon)}
                      disabled={!isEligible}
                      style={{
                        background: isEligible ? 'white' : '#333',
                        color: isEligible ? 'black' : '#666',
                        border: 'none',
                        padding: '0.4rem 1rem',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        cursor: isEligible ? 'pointer' : 'not-allowed',
                        fontSize: '0.8rem'
                      }}
                    >
                      {isSelected ? 'USED' : 'USE NOW'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
