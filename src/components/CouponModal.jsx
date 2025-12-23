import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
      document.body.style.overflow = 'hidden'; // Lock body scroll
      fetchCoupons();
    } else {
      document.body.style.overflow = 'unset'; // Unlock body scroll
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
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

  return createPortal(
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 99999, // Super high z-index
      padding: '1rem'
    }} onClick={onClose}>
      <div style={{
        background: '#111', border: '1px solid #333',
        width: '100%', maxWidth: '450px',
        maxHeight: '85vh', // Slightly less than 90vh for safety
        display: 'flex', flexDirection: 'column', 
        borderRadius: '12px',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        animation: 'fadeIn 0.2s ease-out'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header - Fixed */}
        <div style={{ 
            padding: '1.5rem', 
            paddingBottom: '0.5rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid #222', // Subtle separator
            marginBottom: '1rem',
            flexShrink: 0 // Prevent header from shrinking
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Ticket color="var(--color-neon-green)" />
                <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'white' }}>MY COUPONS</h2>
            </div>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}>
                <X size={24} />
            </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ 
            padding: '0 1.5rem 1.5rem', 
            overflowY: 'auto', 
            flex: 1, // Take remaining space
            minHeight: 0 // Crucial for nested flex scrolling
        }}>
            {loading ? (
            <div style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>Loading coupons...</div>
            ) : coupons.length === 0 ? (
            <div style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>No active coupons available.</div>
            ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {coupons.map(coupon => {
                const isEligible = subtotal >= coupon.minPurchaseAmount;
                const isSelected = discount.code === coupon.code;

                return (
                    <div key={coupon.id} style={{
                    background: isEligible ? '#222' : '#0f0f0f',
                    border: isSelected ? '1px solid var(--color-neon-green)' : '1px solid #333',
                    borderRadius: '8px',
                    padding: '1.2rem',
                    opacity: isEligible ? 1 : 0.5,
                    position: 'relative',
                    flexShrink: 0 // Prevent coupons from squishing
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: isEligible ? 'white' : '#666', letterSpacing: '1px' }}>{coupon.code}</div>
                        {isSelected && <span style={{ fontSize: '0.7rem', color: 'black', background: 'var(--color-neon-green)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>APPLIED</span>}
                    </div>
                    
                    <div style={{ color: '#ccc', fontSize: '1rem', marginBottom: '1rem' }}>{coupon.description}</div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.9rem', color: '#888' }}>Min. Spend: <span style={{ color: 'white' }}>฿{coupon.minPurchaseAmount.toLocaleString()}</span></div>
                        <button 
                        onClick={() => handleApply(coupon)}
                        disabled={!isEligible}
                        style={{
                            background: isEligible ? 'var(--color-neon-green)' : '#222',
                            color: isEligible ? 'black' : '#555',
                            border: 'none',
                            padding: '0.6rem 1.2rem',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            cursor: isEligible ? 'pointer' : 'not-allowed',
                            fontSize: '0.9rem',
                            textTransform: 'uppercase'
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
    </div>,
    document.body
  );
}
