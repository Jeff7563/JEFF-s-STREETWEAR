import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ 
      background: '#050505', 
      color: '#fff', 
      paddingTop: '5rem', 
      paddingBottom: '2rem',
      borderTop: '1px solid #222',
      marginTop: 'auto' // Pushes footer to bottom if flex container
    }}>
      <div className="container">
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '3rem',
          marginBottom: '4rem'
        }}>
          
          {/* Column 1: Brand & Contact */}
          <div>
             <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '1.5rem', letterSpacing: '-1px' }}>
                JEFF'S <span style={{ color: 'var(--color-neon-green)' }}>STREETWEAR</span>
             </h2>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#888' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                   <Mail size={18} color="var(--color-neon-green)" /> support@jeffs-streetwear.com
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                   <Phone size={18} color="var(--color-neon-green)" /> 02-123-4567
                </div>
                <div style={{ display: 'flex', alignItems: 'start', gap: '0.8rem' }}>
                   <MapPin size={18} color="var(--color-neon-green)" style={{ flexShrink: 0 }} /> 
                   <span>123 Streetwear Ave, Bangkok, Thailand 10110</span>
                </div>
             </div>
          </div>

          {/* Column 2: About */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1.5rem', textTransform: 'uppercase' }}>About Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <Link to="/" style={{ color: '#888', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = '#888'}>Our Story</Link>
              <Link to="/" style={{ color: '#888', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = '#888'}>Authenticity</Link>
              <Link to="/" style={{ color: '#888', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = '#888'}>Careers</Link>
              <Link to="/" style={{ color: '#888', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = '#888'}>News</Link>
            </div>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Customer Care</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <Link to="/" style={{ color: '#888', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = '#888'}>Help Center</Link>
              <Link to="/" style={{ color: '#888', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = '#888'}>Returns & Refunds</Link>
              <Link to="/" style={{ color: '#888', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = '#888'}>Shipping Policy</Link>
              <Link to="/" style={{ color: '#888', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = '#888'}>Contact Us</Link>
            </div>
          </div>

          {/* Column 4: Stay Connected */}
          <div>
             <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Follow Us</h4>
             <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <a href="#" style={{ color: 'white', background: '#222', padding: '0.6rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <Facebook size={20} />
                </a>
                <a href="#" style={{ color: 'white', background: '#222', padding: '0.6rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <Instagram size={20} />
                </a>
                <a href="#" style={{ color: 'white', background: '#222', padding: '0.6rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <Twitter size={20} />
                </a>
                <a href="#" style={{ color: 'white', background: '#222', padding: '0.6rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <Youtube size={20} />
                </a>
             </div>
             
             {/* Newsletter Mockup */}
             <h5 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#aaa' }}>SUBSCRIBE TO OUR NEWSLETTER</h5>
             <div style={{ display: 'flex' }}>
                <input type="email" placeholder="Your email address" style={{ 
                   background: '#1a1a1a', 
                   border: '1px solid #333', 
                   color: 'white',
                   padding: '0.8rem',
                   width: '100%',
                   borderRadius: '4px 0 0 4px',
                   outline: 'none'
                }} />
                <button style={{ 
                   background: 'var(--color-neon-green)', 
                   color: 'black', 
                   border: 'none', 
                   padding: '0 1.2rem', 
                   fontWeight: 'bold',
                   borderRadius: '0 4px 4px 0',
                   cursor: 'pointer'
                }}>GO</button>
             </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{ 
          borderTop: '1px solid #1a1a1a', 
          paddingTop: '2rem', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '1rem',
          fontSize: '0.9rem',
          color: '#666'
        }}>
           <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
             <span>© 2025 JEFF'S STREETWEAR. All rights reserved.</span>
             <Link to="#" style={{ color: '#666', textDecoration: 'none' }}>Privacy Policy</Link>
             <Link to="#" style={{ color: '#666', textDecoration: 'none' }}>Terms of Service</Link>
             <Link to="#" style={{ color: '#666', textDecoration: 'none' }}>Cookie Policy</Link>
           </div>
           
           {/* Payment Icons Mock */}
           <div style={{ display: 'flex', gap: '0.5rem', opacity: 0.5 }}>
              <div style={{ width: '40px', height: '25px', background: '#333', borderRadius: '2px' }}></div>
              <div style={{ width: '40px', height: '25px', background: '#333', borderRadius: '2px' }}></div>
              <div style={{ width: '40px', height: '25px', background: '#333', borderRadius: '2px' }}></div>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
