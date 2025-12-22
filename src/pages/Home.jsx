import { Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/ProductCard';
import { ArrowRight, ChevronRight, CheckCircle } from 'lucide-react';

const Home = () => {
  const { products, loading } = useProducts();
  
  // Get latest products
  const newArrivals = products.slice(0, 5);
  // Mock trending (just reshuffled/same for now)
  const trending = products.slice(0, 5).reverse();

  return (
    <div style={{ paddingBottom: '4rem' }}>
      
      {/* 1. Hero Banner (Sasom Style - Wide & Clean) */}
      <div style={{ 
        height: '500px', 
        width: '100%', 
        position: 'relative',
        marginBottom: '3rem'
      }}>
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          background: 'linear-gradient(90deg, #0a0a0a 0%, transparent 50%), url(https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2000&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center'
        }}>
           <div className="container" style={{ width: '100%' }}>
              <h1 className="glitch-text" style={{ 
                fontSize: '4rem', 
                marginBottom: '1rem', 
                maxWidth: '600px',
                lineHeight: 1
              }}>
                JEFF's<br /><span style={{ color: 'var(--color-neon-green)' }}>STREETWEAR</span>
              </h1>
              <p style={{ fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '500px', color: '#ccc' }}>
                Born from the streets, raised by the culture. We don't chase trends; we set the pace. For the dreamers, the rebels, and the ones who refuse to fade away.
              </p>
              <Link to="/shop">
                <button className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                   SHOP NOW <ArrowRight size={20} />
                </button>
              </Link>
           </div>
        </div>
      </div>

      {/* 2. Trust Badges Section */}
      <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '4rem', flexWrap: 'wrap' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#aaa' }}>
            <CheckCircle color="var(--color-neon-green)" /> 100% Authentic
         </div>
         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#aaa' }}>
            <CheckCircle color="var(--color-neon-green)" /> Verified Sellers
         </div>
         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#aaa' }}>
            <CheckCircle color="var(--color-neon-green)" /> Global Shipping
         </div>
      </div>

      {/* 3. New Arrivals (Horizontal Scroll) */}
      <Section title="NEW ARRIVALS" link="/shop?sort=newest">
        {loading ? <div>Loading...</div> : (
          <HorizontalScroll>
            {newArrivals.map(product => (
               <div key={product.id} style={{ width: '280px', flexShrink: 0 }}>
                  <ProductCard product={product} />
               </div>
            ))}
          </HorizontalScroll>
        )}
      </Section>

      {/* 4. Trending (Horizontal Scroll) */}
      <Section title="TRENDING NOW" link="/shop?sort=trending">
        {loading ? <div>Loading...</div> : (
          <HorizontalScroll>
            {trending.map(product => (
               <div key={product.id} style={{ width: '280px', flexShrink: 0 }}>
                  <ProductCard product={product} />
               </div>
            ))}
          </HorizontalScroll>
        )}
      </Section>

    </div>
  );
};

// Start Helper Components for Home Page
const Section = ({ title, link, children }) => (
  <div className="container" style={{ marginBottom: '4rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
      <h2 style={{ fontSize: '1.8rem', margin: 0 }}>{title}</h2>
      <Link to={link || '/shop'} style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--color-neon-green)' }}>
        View All <ChevronRight size={18} />
      </Link>
    </div>
    {children}
  </div>
);

const HorizontalScroll = ({ children }) => (
  <div style={{ 
    display: 'flex', 
    gap: '1.5rem', 
    overflowX: 'auto', 
    paddingBottom: '1rem',
    scrollSnapType: 'x mandatory'
  }} className="hide-scrollbar">
    {children}
  </div>
);
// End Helper Components

export default Home;
