import { useWishlist } from '../contexts/WishlistContext';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { Heart } from 'lucide-react';

const Wishlist = () => {
    const { wishlist, loading: wishlistLoading } = useWishlist();
    const { products, loading: productsLoading } = useProducts();

    const wishlistProducts = products.filter(p => wishlist.includes(p.id));
    const loading = wishlistLoading || productsLoading;

    return (
        <div className="container" style={{ paddingTop: '120px', paddingBottom: '4rem', minHeight: '80vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Heart size={32} color="var(--color-neon-green)" />
                <h1 style={{ fontSize: '2.5rem', margin: 0 }}>MY WISHLIST</h1>
            </div>

            {loading ? (
                 <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
                    gap: '2rem' 
                  }}>
                    {Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                  </div>
            ) : wishlistProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', border: '1px dashed #333', color: '#666' }}>
                    <h2>YOUR WISHLIST IS EMPTY</h2>
                    <p>Start adding items you love!</p>
                    <a href="/shop" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none', fontSize: '1rem' }}>
                        BROWSE SHOP
                    </a>
                </div>
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
                    gap: '2rem' 
                  }}>
                    {wishlistProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
            )}
        </div>
    );
};

export default Wishlist;
