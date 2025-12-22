import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../contexts/AlertContext';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart, subtotal, discount } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  
  const [address, setAddress] = useState({
    name: currentUser?.displayName || '',
    street: '',
    city: '',
    zip: '',
    country: ''
  });
  const [loading, setLoading] = useState(false);

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!currentUser) {
        showAlert("Please login to checkout.");
        navigate('/login');
        return;
    }
    
    setLoading(true);
    try {
      const orderData = {
        userId: currentUser.uid,
        items: cartItems,
        totalAmount: cartTotal,
        shippingAddress: address,
        status: 'pending',
        createdAt: serverTimestamp()
      };
      
      await addDoc(collection(db, 'orders'), orderData);
      clearCart();
      showAlert('Order placed successfully!');
      navigate('/');
    } catch (error) {
      console.error("Error placing order: ", error);
      showAlert("Failed to place order. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '4rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-neon-green)' }}>CHECKOUT</h1>
        
        <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>FULL NAME</label>
            <input 
              type="text" 
              required
              value={address.name}
              onChange={e => setAddress({...address, name: e.target.value})}
              style={{ width: '100%', padding: '1rem', background: 'transparent', border: '1px solid var(--color-white)', color: 'white' }}
            />
          </div>
          
           <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>STREET ADDRESS</label>
            <input 
              type="text" 
              required
              value={address.street}
              onChange={e => setAddress({...address, street: e.target.value})}
              style={{ width: '100%', padding: '1rem', background: 'transparent', border: '1px solid var(--color-white)', color: 'white' }}
            />
          </div>
          
           <div style={{ display: 'flex', gap: '1rem' }}>
             <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>CITY</label>
                <input 
                  type="text" 
                  required
                  value={address.city}
                  onChange={e => setAddress({...address, city: e.target.value})}
                  style={{ width: '100%', padding: '1rem', background: 'transparent', border: '1px solid var(--color-white)', color: 'white' }}
                />
             </div>
             <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>ZIP CODE</label>
                <input 
                  type="text" 
                  required
                  value={address.zip}
                  onChange={e => setAddress({...address, zip: e.target.value})}
                  style={{ width: '100%', padding: '1rem', background: 'transparent', border: '1px solid var(--color-white)', color: 'white' }}
                />
             </div>
           </div>
           
           <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>COUNTRY</label>
            <input 
              type="text" 
              required
              value={address.country}
              onChange={e => setAddress({...address, country: e.target.value})}
              style={{ width: '100%', padding: '1rem', background: 'transparent', border: '1px solid var(--color-white)', color: 'white' }}
            />
          </div>


          <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#ccc' }}>
              <span>Subtotal:</span>
              <span>฿{subtotal.toLocaleString()}</span>
            </div>
            {discount.amount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--color-neon-green)' }}>
                <span>Discount ({discount.code}):</span>
                <span>-฿{discount.amount.toLocaleString()}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', borderTop: '1px solid #333', paddingTop: '1rem' }}>
              <span>TOTAL:</span>
              <span>฿{cartTotal.toLocaleString()}</span>
            </div>
            
            <button 
                type="submit" 
                disabled={loading}
                className="btn-primary" 
                style={{ width: '100%', marginTop: '1.5rem' }}
            >
                {loading ? 'PROCESSING...' : 'CONFIRM ORDER'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
