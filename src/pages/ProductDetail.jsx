import { useParams } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { getImageUrl } from '../services/cloudinary';
import { useState } from 'react';
import { CheckCircle, ShieldCheck, Truck, Heart } from 'lucide-react';
import { useAlert } from '../contexts/AlertContext';
import ProductReviews from '../components/ProductReviews';

const ProductDetail = () => {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState(null);
  const { showAlert } = useAlert();

  const product = products.find(p => p.id === id);
  const inWishlist = product ? isInWishlist(product.id) : false;



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
          
          <button
             onClick={() => toggleWishlist(product.id)}
             style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid var(--color-grey)',
                color: 'var(--color-white)',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                marginBottom: '1.5rem',
                transition: 'all 0.2s'
             }}
             onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--color-neon-green)';
                e.currentTarget.style.color = 'var(--color-neon-green)';
             }}
             onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--color-grey)';
                e.currentTarget.style.color = 'var(--color-white)';
             }}
          >
             <Heart size={20} fill={inWishlist ? "currentColor" : "none"} color={inWishlist ? "#ff3b30" : "currentColor"} style={{ color: inWishlist ? '#ff3b30' : 'inherit' }} /> 
             {inWishlist ? 'REMOVE FROM WISHLIST' : 'ADD TO WISHLIST'}
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

      {/* Product Reviews */}
      <ProductReviews productId={product.id} />

      {/* Related Products */}
      <div style={{ marginTop: '0rem', borderTop: 'none', paddingTop: '4rem' }}>
         <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem', textAlign: 'center' }}>YOU MIGHT ALSO LIKE</h2>
         
         <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
            gap: '2rem' 
          }}>
            {products
              .filter(p => p.category === product.category && p.id !== product.id)
              .sort(() => 0.5 - Math.random()) // Shuffle
              .slice(0, 4)
              .map(related => (
                 <a key={related.id} href={`/product/${related.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ border: '1px solid #333', background: '#111', height: '100%', transition: 'transform 0.2s' }} 
                         onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                         onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                       <div style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
                          <img 
                            src={related.images && related.images[0] ? getImageUrl(related.images[0]) : 'https://placehold.co/400x600'} 
                            alt={related.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                       </div>
                       <div style={{ padding: '1rem' }}>
                          <div style={{ color: '#666', fontSize: '0.8rem', textTransform: 'uppercase' }}>{related.category}</div>
                          <h4 style={{ color: 'white', margin: '0.5rem 0', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{related.name}</h4>
                          <span style={{ color: 'white', fontWeight: 'bold' }}>฿{related.price.toLocaleString()}</span>
                       </div>
                    </div>
                 </a>
              ))}
         </div>
         {products.filter(p => p.category === product.category && p.id !== product.id).length === 0 && (
            <p style={{ textAlign: 'center', color: '#666' }}>No similar products found.</p>
         )}
      </div>

    </div>
  );
}

export default ProductDetail;
