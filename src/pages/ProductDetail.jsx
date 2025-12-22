import { useParams } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { getImageUrl } from '../services/cloudinary';
import { useState } from 'react';
import { CheckCircle, ShieldCheck, Truck } from 'lucide-react';
import { useAlert } from '../contexts/AlertContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(null);
  const { showAlert } = useAlert();

  const product = products.find(p => p.id === id);

  if (loading) return <div className="container" style={{ paddingTop: '100px' }}>Loading...</div>;
  if (!product) return <div className="container" style={{ paddingTop: '100px' }}>Product not found</div>;

  const images = product.images && product.images.length > 0 ? product.images : [null]; // Handle no images

  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '4rem' }}>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '4rem',
        alignItems: 'start'
      }}>
        
        {/* Left: Image Gallery (Scrollable Vertical Stack for Sasom feel) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {images.map((img, idx) => (
            <div key={idx} style={{ 
              width: '100%', 
              background: 'var(--color-black)', 
              border: '1px solid var(--color-grey)',
              aspectRatio: '1'
            }}>
               <img 
                 src={img ? getImageUrl(img) : 'https://placehold.co/600x600?text=No+Image'} 
                 alt={product.name} 
                 style={{ width: '100%', height: '100%', objectFit: 'contain' }}
               />
            </div>
          ))}
        </div>

        {/* Right: Sticky Info Panel */}
        <div style={{ position: 'sticky', top: '100px' }}>
          {/* Brand/Category */}
          <div style={{ 
            color: 'var(--color-neon-green)', 
            textTransform: 'uppercase', 
            marginBottom: '0.5rem', 
            fontWeight: 'bold',
            letterSpacing: '1px'
          }}>
            {product.category || 'Streetwear'}
          </div>
          
          {/* Product Name */}
          <h1 style={{ 
            fontSize: '2.5rem', 
            lineHeight: 1.1, 
            marginBottom: '1.5rem',
            color: 'var(--color-white)' 
          }}>
            {product.name}
          </h1>

          {/* Price */}
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            marginBottom: '2rem',
            color: 'var(--color-white)'
          }}>
            ฿{product.price.toLocaleString()}
          </div>

          {/* Size Selector */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
               <label style={{ fontWeight: 'bold' }}>Select Size</label>
               <span style={{ color: 'var(--color-grey-light)', textDecoration: 'underline', cursor: 'pointer' }}>Size Guide</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              {(product.sizes || [{size: 'S'}, {size: 'M'}, {size: 'L'}, {size: 'XL'}]).map((s, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSize(s.size)}
                  style={{
                    padding: '1rem',
                    background: selectedSize === s.size ? 'var(--color-neon-green)' : 'transparent',
                    color: selectedSize === s.size ? 'var(--color-black)' : 'var(--color-white)',
                    border: '1px solid var(--color-grey)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontWeight: 'bold'
                  }}
                >
                  {s.size}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <button 
            className="btn-primary" 
            style={{ width: '100%', marginBottom: '1.5rem' }}
            onClick={() => {
              if (!selectedSize) return showAlert('Please select a size');
              addToCart(product, selectedSize);
              showAlert('Added to cart!');
            }}
          >
            ADD TO CART
          </button>

          {/* Trust Signals (Sasom Style) */}
          <div style={{ 
            border: '1px solid var(--color-grey)', 
            padding: '1.5rem', 
            background: 'rgba(255,255,255,0.05)' 
          }}>
             <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <ShieldCheck size={24} color="var(--color-neon-green)" />
                <div>
                  <h4 style={{ fontSize: '1rem', margin: 0 }}>Authenticity Guarantee</h4>
                  <p style={{ fontSize: '0.8rem', color: '#aaa' }}>Verified by our experts.</p>
                </div>
             </div>
             <div style={{ display: 'flex', gap: '1rem' }}>
                <Truck size={24} color="var(--color-neon-green)" />
                <div>
                  <h4 style={{ fontSize: '1rem', margin: 0 }}>Ready to Ship</h4>
                  <p style={{ fontSize: '0.8rem', color: '#aaa' }}>Dispatched within 24 hours.</p>
                </div>
             </div>
          </div>

          {/* Description */}
          <div style={{ marginTop: '2rem' }}>
             <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Product Details</h3>
             <p style={{ color: '#ccc', lineHeight: '1.6' }}>
               {product.description || "No description available for this item."}
             </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
