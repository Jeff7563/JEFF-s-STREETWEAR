import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/cloudinary';
import { Heart } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';

const ProductCard = ({ product }) => {
  const { id, name, price, images, category } = product;
  const { isInWishlist, toggleWishlist } = useWishlist();
  const imageUrl = images && images.length > 0 ? getImageUrl(images[0]) : 'https://placehold.co/400x600?text=No+Image';

  const inWishlist = isInWishlist(id);

  return (
    <div style={{ position: 'relative' }}>
    <Link to={`/product/${id}`} style={{ display: 'block' }}>
      <div style={{
        border: '1px solid var(--color-grey)',
        transition: 'transform 0.2s',
        position: 'relative',
        overflow: 'hidden',
        height: '100%'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translate(-4px, -4px)';
        e.currentTarget.style.boxShadow = '6px 6px 0px var(--color-neon-green)';
        e.currentTarget.style.border = '1px solid var(--color-white)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translate(0, 0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.border = '1px solid var(--color-grey)';
      }}
      >
        <div style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
          <img 
            src={imageUrl} 
            alt={name} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              transition: 'transform 0.5s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        </div>
        
        <div style={{ padding: '1rem', background: 'var(--color-black)' }}>
          <div style={{ 
            fontSize: '0.8rem', 
            color: 'var(--color-neon-green)', 
            marginBottom: '0.25rem',
            textTransform: 'uppercase' 
          }}>
            {category}
          </div>
          <h3 style={{ 
            fontSize: '1.2rem', 
            marginBottom: '0.5rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: 'var(--color-white)'
          }}>
            {name}
          </h3>
          <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-white)' }}>
            ฿{price.toLocaleString()}
          </div>
        </div>
      </div>
    </Link>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(id);
            }}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(0,0,0,0.5)',
              border: 'none',
              borderRadius: '50%',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Heart size={20} color={inWishlist ? '#ff3b30' : 'white'} fill={inWishlist ? '#ff3b30' : 'none'} />
          </button>
    </div>
  );
};

export default ProductCard;
