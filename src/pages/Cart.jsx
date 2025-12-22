import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { getImageUrl } from '../services/cloudinary';
import { Trash2 } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ paddingTop: '150px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>YOUR CART IS EMPTY</h1>
        <Link to="/shop" className="btn-primary">GO SHOPPING</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '4rem' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '3rem', borderBottom: '1px solid var(--color-grey)', paddingBottom: '1rem' }}>SHOPPING CART</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '4rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {cartItems.map((item) => (
            <div key={`${item.id}-${item.size}`} style={{ 
              display: 'flex', 
              gap: '1.5rem', 
              border: '1px solid var(--color-grey)', 
              padding: '1rem',
              backgroundColor: 'rgba(255,255,255,0.05)'
            }}>
              <div style={{ width: '100px', aspectRatio: '3/4' }}>
                <img 
                  src={item.image ? getImageUrl(item.image) : 'https://placehold.co/100x133?text=No+Image'} 
                  alt={item.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{item.name}</h3>
                  <button onClick={() => removeFromCart(item.id, item.size)} style={{ background: 'transparent', color: 'red' }}>
                    <Trash2 size={20} />
                  </button>
                </div>
                
                <p style={{ color: 'var(--color-grey)', marginBottom: '1rem' }}>SIZE: {item.size}</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }}>฿{item.price.toLocaleString()}</p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button 
                    onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                    style={{ background: 'var(--color-grey)', color: 'white', width: '30px', height: '30px' }}
                  >-</button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                    style={{ background: 'var(--color-grey)', color: 'white', width: '30px', height: '30px' }}
                  >+</button>
                </div>
              </div>
            </div>
          ))}
          
          <button onClick={clearCart} style={{ alignSelf: 'flex-start', background: 'transparent', color: 'var(--color-grey)', textDecoration: 'underline', marginTop: '1rem' }}>
            CLEAR CART
          </button>
        </div>
        
        {/* Checkout Section */}
        <div style={{ 
          border: '1px solid var(--color-neon-green)', 
          padding: '2rem', 
          height: 'fit-content',
          position: 'sticky',
          top: '120px'
        }}>
          <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>ORDER SUMMARY</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>SUBTOTAL</span>
            <span>฿{cartTotal.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <span>SHIPPING</span>
            <span>CALCULATED AT CHECKOUT</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-neon-green)' }}>
            <span>TOTAL</span>
            <span>฿{cartTotal.toLocaleString()}</span>
          </div>
          
          <Link to="/checkout">
            <button className="btn-primary" style={{ width: '100%' }}>
              PROCEED TO CHECKOUT
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
