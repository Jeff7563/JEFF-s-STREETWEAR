import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Search, Ticket, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import PromoBar from './PromoBar';

import CouponModal from './CouponModal';
import '../index.css';

const Navbar = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
    <PromoBar />
    <nav style={{
      position: 'fixed',
      top: '35px', // Below PromoBar
      left: 0,
      width: '100%',
      padding: '0.8rem 0',
      backgroundColor: 'rgba(10,10,10,0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--color-grey)',
      zIndex: 1000,
      height: '70px', // Explicit height for layout consistency
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>


        
        {/* Left Group: Logo + Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {/* Logo */}
          <Link to="/" style={{ 
            fontSize: '1.8rem', 
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-white)',
            letterSpacing: '-1px',
            flexShrink: 0,
            textDecoration: 'none'
          }}>
            JEFF'S
          </Link>

          {/* Home / Shop Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
             <Link to="/" style={{
               padding: '0.5rem 1rem',
               fontSize: '0.9rem',
               fontWeight: 'bold',
               color: isActive('/') ? 'black' : '#888',
               background: isActive('/') ? 'var(--color-neon-green)' : 'transparent',
               borderRadius: '4px',
               transition: 'all 0.2s',
               textDecoration: 'none'
             }}>
               HOME
             </Link>
             <Link to="/shop" style={{
               padding: '0.5rem 1rem',
               fontSize: '0.9rem',
               fontWeight: 'bold',
               color: isActive('/shop') ? 'black' : '#888',
               background: isActive('/shop') ? 'var(--color-neon-green)' : 'transparent',
               borderRadius: '4px',
               transition: 'all 0.2s',
               textDecoration: 'none'
             }}>
               SHOP
             </Link>
          </div>
        </div>
        
        {/* Middle: Search Bar - Absolutely Centered */}
        <div style={{ 
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: '500px'
        }}>
           <input 
             type="text" 
             placeholder="Search Model, Brand..." 
             style={{
               width: '100%',
               background: 'rgba(255,255,255,0.08)',
               border: '1px solid transparent',
               borderRadius: '4px', 
               padding: '0.6rem 1rem 0.6rem 2.5rem',
               color: 'var(--color-white)',
               fontSize: '0.9rem'
             }}
           />
           <Search 
             size={16} 
             color="#666" 
             style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} 
           />
        </div>
        
        {/* Right: Actions */}
        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', flexShrink: 0, zIndex: 10 }}>
          
           {/* Coupon Icon */}
           <button 
            onClick={() => setIsCouponOpen(true)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Coupons"
          >
            <div style={{ 
               width: '35px', height: '35px', 
               borderRadius: '50%', 
               background: 'transparent', 
               border: '1px solid var(--color-grey)',
               display: 'flex', alignItems: 'center', justifyContent: 'center',
               color: 'white',
               transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-neon-green)';
              e.currentTarget.style.color = 'var(--color-neon-green)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-grey)';
              e.currentTarget.style.color = 'white';
            }}
            >
               <Ticket size={18} />
            </div>
          </button>

          {/* Wishlist Icon */}
          <Link to="/wishlist" style={{ textDecoration: 'none' }}>
            <div style={{ 
               width: '35px', height: '35px', 
               borderRadius: '50%', 
               background: 'transparent', 
               border: '1px solid var(--color-grey)',
               display: 'flex', alignItems: 'center', justifyContent: 'center',
               color: 'white',
               transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-neon-green)';
              e.currentTarget.style.color = 'var(--color-neon-green)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-grey)';
              e.currentTarget.style.color = 'white';
            }}
            >
               <Heart size={18} />
            </div>
          </Link>

          <Link to="/cart" style={{ textDecoration: 'none' }}>
            <div style={{ 
               width: '35px', height: '35px', 
               borderRadius: '50%', 
               background: 'transparent', 
               border: '1px solid var(--color-grey)',
               display: 'flex', alignItems: 'center', justifyContent: 'center',
               color: 'white',
               transition: 'all 0.3s',
               position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-neon-green)';
              e.currentTarget.style.color = 'var(--color-neon-green)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-grey)';
              e.currentTarget.style.color = 'white';
            }}
            >
               <ShoppingBag size={18} />
            </div>
          </Link>
          
          {/* Profile / Login Link */}
          {currentUser ? (
            <Link to="/profile">
              <div style={{ 
                width: '35px', height: '35px', 
                borderRadius: '50%', 
                background: 'var(--color-neon-green)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'black', fontWeight: 'bold',
                fontSize: '0.9rem'
              }}>
                {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : <User size={18} />}
              </div>
            </Link>
          ) : (
            <Link to="/login" style={{
               fontSize: '0.9rem',
               fontWeight: 'bold',
               color: 'white',
               border: '1px solid #333',
               padding: '0.4rem 1rem'
            }}>
              LOGIN
            </Link>
          )}
        </div>
      </div>
      

      
      {/* Coupon Modal */}
      <CouponModal isOpen={isCouponOpen} onClose={() => setIsCouponOpen(false)} />

    </nav>
    </>
  );
};

export default Navbar;
