import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { useAlert } from '../../contexts/AlertContext';

export default function CouponForm() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountAmount: '',
    minPurchaseAmount: '',
    isActive: true
  });

  const { id } = useParams();
  const isEditMode = !!id;

  async function fetchCoupon() {
    if (!id) return;
    try {
       const docRef = doc(db, 'coupons', id);
       const docSnap = await getDoc(docRef);
       if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            code: data.code || '',
            description: data.description || '',
            discountAmount: data.discountAmount || '',
            minPurchaseAmount: data.minPurchaseAmount || '',
            isActive: data.isActive !== undefined ? data.isActive : true
          });
       }
    } catch (error) {
       console.error("Error fetching coupon:", error);
       showAlert("Failed to load coupon data");
    }
  }

  useEffect(() => {
    fetchCoupon();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const couponData = {
        code: formData.code.toUpperCase(),
        description: formData.description,
        discountAmount: Number(formData.discountAmount),
        minPurchaseAmount: Number(formData.minPurchaseAmount),
        isActive: formData.isActive,
        updatedAt: serverTimestamp()
      };

      if (isEditMode) {
         await updateDoc(doc(db, "coupons", id), couponData);
      } else {
         couponData.createdAt = serverTimestamp();
         await addDoc(collection(db, "coupons"), couponData);
      }
      navigate('/admin/coupons');
    } catch (error) {
      console.error("Error saving coupon:", error);
      showAlert("Failed to save coupon");
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', color: 'white' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>{id ? 'EDIT COUPON' : 'CREATE NEW COUPON'}</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Code */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#888' }}>Coupon Code</label>
          <input 
            type="text" 
            required 
            placeholder="e.g. SAVE100"
            value={formData.code}
            onChange={e => setFormData({...formData, code: e.target.value})}
            style={{ 
              width: '100%', padding: '0.8rem', 
              background: '#111', border: '1px solid #333', color: 'white',
              fontSize: '1.1rem', textTransform: 'uppercase'
            }}
          />
        </div>

        {/* Description */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#888' }}>Description</label>
          <input 
            type="text" 
            required 
            placeholder="e.g. 100 THB Off min spend 1000"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            style={{ width: '100%', padding: '0.8rem', background: '#111', border: '1px solid #333', color: 'white' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          {/* Discount Amount */}
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#888' }}>Discount Amount (THB)</label>
            <input 
              type="number" 
              required 
              min="1"
              value={formData.discountAmount}
              onChange={e => setFormData({...formData, discountAmount: e.target.value})}
              style={{ width: '100%', padding: '0.8rem', background: '#111', border: '1px solid #333', color: 'white' }}
            />
          </div>

          {/* Min Purchase */}
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#888' }}>Min. Purchase (THB)</label>
            <input 
              type="number" 
              required 
              min="0"
              value={formData.minPurchaseAmount}
              onChange={e => setFormData({...formData, minPurchaseAmount: e.target.value})}
              style={{ width: '100%', padding: '0.8rem', background: '#111', border: '1px solid #333', color: 'white' }}
            />
          </div>
        </div>

        {/* Active Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           <input 
             type="checkbox" 
             checked={formData.isActive}
             onChange={e => setFormData({...formData, isActive: e.target.checked})}
             id="isActive"
             style={{ width: '20px', height: '20px', accentColor: 'var(--color-neon-green)' }}
           />
           <label htmlFor="isActive" style={{ cursor: 'pointer' }}>Active Immediately</label>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary"
          style={{ padding: '1rem', marginTop: '1rem', fontWeight: 'bold' }}
        >
          {loading ? 'SAVING...' : (id ? 'UPDATE COUPON' : 'CREATE COUPON')}
        </button>

      </form>
    </div>
  );
}
