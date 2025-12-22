import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/ProductCard';
import { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';

const Shop = () => {
  const { products, loading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');

  // Derive categories from products
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [products]);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Sort
    if (sortOrder === 'low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'high-low') {
      result.sort((a, b) => b.price - a.price);
    } else {
      // newest (assuming products are naturally ordered or need createdAt check)
      // If no createdAt, keep default
    }

    return result;
  }, [products, selectedCategory, sortOrder]);

  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '4rem' }}>
      
      <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
        
        {/* Sidebar Filter (Sasom Style) */}
        <div style={{ width: '220px', flexShrink: 0, position: 'sticky', top: '100px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #333' }}>
              <Filter size={20} color="var(--color-neon-green)" />
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>FILTERS</h3>
           </div>

           {/* Category Group */}
           <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem', textTransform: 'uppercase' }}>Categories</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {categories.map(cat => (
                  <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: selectedCategory === cat ? 'white' : '#888' }}>
                     <input 
                       type="radio" 
                       name="category" 
                       value={cat}
                       checked={selectedCategory === cat} 
                       onChange={() => setSelectedCategory(cat)}
                       style={{ accentColor: 'var(--color-neon-green)' }}
                     />
                     {cat}
                  </label>
                ))}
              </div>
           </div>

           {/* Price Sort Group */}
           <div>
              <h4 style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem', textTransform: 'uppercase' }}>Sort By</h4>
              <select 
                value={sortOrder} 
                onChange={e => setSortOrder(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  background: 'transparent', 
                  color: 'white', 
                  border: '1px solid #333', 
                  borderRadius: '4px' 
                }}
              >
                 <option value="newest" style={{color: 'black'}}>Newest Arrivals</option>
                 <option value="low-high" style={{color: 'black'}}>Price: Low to High</option>
                 <option value="high-low" style={{color: 'black'}}>Price: High to Low</option>
              </select>
           </div>
        </div>

        {/* Main Product Grid */}
        <div style={{ flex: 1 }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>
                 {selectedCategory.toUpperCase()} <span style={{ color: '#666', fontSize: '1rem' }}>({filteredProducts.length})</span>
              </h2>
           </div>

           {loading ? (
             <div>Loading products...</div>
           ) : filteredProducts.length === 0 ? (
             <div style={{ padding: '4rem', textAlign: 'center', color: '#666', border: '1px dashed #333' }}>No products found.</div>
           ) : (
             <div style={{ 
               display: 'grid', 
               gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
               gap: '2rem' 
             }}>
               {filteredProducts.map(product => (
                 <ProductCard key={product.id} product={product} />
               ))}
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default Shop;
