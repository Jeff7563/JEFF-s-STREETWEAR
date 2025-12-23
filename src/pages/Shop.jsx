import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/ProductCard';
import { useState, useMemo, useEffect } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import SkeletonCard from '../components/SkeletonCard';

const Shop = () => {
  const { products, loading } = useProducts();
  
  // -- Filter States --
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortOrder, setSortOrder] = useState('newest');
  
  // -- Mobile Filter Toggle --
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Mobile toggle

  // -- Available Options --
  // Derive categories from products
  const availableCategories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return Array.from(cats);
  }, [products]);

  // Hardcoded sizes for now (ideal: derive from inventory)
  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11'];

  // -- Handlers --
  const toggleCategory = (cat) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handlePriceChange = (e, type) => {
    setPriceRange({ ...priceRange, [type]: e.target.value });
  };

  // -- Logic: Filter & Sort --
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Category Filter (OR logic)
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    // 2. Size Filter (OR logic - if product has ANY of the selected sizes)
    // Note: Assuming product.sizes is an array of objects like [{size: 'M'}] or just strings
    // If product.sizes is undefined, we assume all sizes available or skip? 
    // Let's assume generic streetwear sizing for demo if data missing
    if (selectedSizes.length > 0) {
      result = result.filter(p => {
        const pSizes = p.sizes ? p.sizes.map(s => s.size || s) : ['S', 'M', 'L', 'XL']; // Fallback
        return pSizes.some(size => selectedSizes.includes(size));
      });
    }

    // 3. Price Filter
    if (priceRange.min !== '') {
      result = result.filter(p => p.price >= Number(priceRange.min));
    }
    if (priceRange.max !== '') {
      result = result.filter(p => p.price <= Number(priceRange.max));
    }

    // 4. Sort
    if (sortOrder === 'low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'high-low') {
      result.sort((a, b) => b.price - a.price);
    } else {
      // newest: sort by createdAt if available
      result.sort((a, b) => {
         const timeA = a.createdAt?.seconds || 0;
         const timeB = b.createdAt?.seconds || 0;
         return timeB - timeA;
      });
    }

    return result;
  }, [products, selectedCategories, selectedSizes, priceRange, sortOrder]);

  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '4rem' }}>
      
      {/* Mobile Filter Toggle Button */}
      <div className="mobile-filter-bar" style={{ display: 'none', marginBottom: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
         <button 
           onClick={() => setIsFilterOpen(!isFilterOpen)}
           style={{ 
             display: 'flex', alignItems: 'center', gap: '0.5rem', 
             background: '#222', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '4px' 
           }}
         >
           <Filter size={18} /> FILTER
         </button>
         
         <select 
             value={sortOrder} 
             onChange={e => setSortOrder(e.target.value)}
             style={{ padding: '0.8rem', background: '#222', color: 'white', border: 'none', borderRadius: '4px' }}
          >
             <option value="newest">Newest</option>
             <option value="low-high">Price: Low - High</option>
             <option value="high-low">Price: High - Low</option>
          </select>
      </div>

      <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start', position: 'relative' }}>
        
        {/* Sidebar Filter */}
        <div className={`shop-sidebar ${isFilterOpen ? 'open' : ''}`} style={{ 
          width: '250px', 
          flexShrink: 0, 
          position: 'sticky', 
          top: '100px',
          height: 'calc(100vh - 120px)',
          overflowY: 'auto',
          paddingRight: '1rem'
        }}>
           {/* Mobile Close Button */}
           <button 
             className="mobile-close-btn"
             onClick={() => setIsFilterOpen(false)}
             style={{ 
               display: 'none', 
               position: 'absolute', 
               top: '1rem', 
               right: '1rem', 
               background: 'none', 
               border: 'none', 
               color: 'white' 
             }}
           >
             <X size={24} />
           </button>

           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #333' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <Filter size={20} color="var(--color-neon-green)" />
                 <h3 style={{ margin: 0, fontSize: '1.2rem', letterSpacing: '1px' }}>FILTERS</h3>
              </div>
              {/* Clear All */}
              {(selectedCategories.length > 0 || selectedSizes.length > 0 || priceRange.min || priceRange.max) && (
                <button 
                  onClick={() => { setSelectedCategories([]); setSelectedSizes([]); setPriceRange({min: '', max: ''}); }}
                  style={{ background: 'none', border: 'none', color: '#666', fontSize: '0.8rem', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Clear All
                </button>
              )}
           </div>

           {/* 1. Categories */}
           <div style={{ marginBottom: '2.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Category</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {availableCategories.map(cat => (
                  <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', color: selectedCategories.includes(cat) ? 'white' : '#888', transition: 'color 0.2s' }}>
                     <div style={{ 
                        width: '18px', height: '18px', 
                        border: selectedCategories.includes(cat) ? '1px solid var(--color-neon-green)' : '1px solid #444', 
                        background: selectedCategories.includes(cat) ? 'var(--color-neon-green)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s'
                     }}>
                        {selectedCategories.includes(cat) && <div style={{ width: '8px', height: '8px', background: 'black' }} />}
                     </div>
                     <input 
                       type="checkbox" 
                       value={cat}
                       checked={selectedCategories.includes(cat)} 
                       onChange={() => toggleCategory(cat)}
                       style={{ display: 'none' }}
                     />
                     {cat}
                  </label>
                ))}
              </div>
           </div>

           {/* 2. Price Range */}
           <div style={{ marginBottom: '2.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Price (฿)</h4>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                 <input 
                    type="number" 
                    placeholder="Min" 
                    value={priceRange.min}
                    onChange={(e) => handlePriceChange(e, 'min')}
                    style={{ width: '100%', padding: '0.5rem', background: '#111', border: '1px solid #333', color: 'white', borderRadius: '4px' }}
                 />
                 <span style={{ color: '#666' }}>-</span>
                 <input 
                    type="number" 
                    placeholder="Max" 
                    value={priceRange.max}
                    onChange={(e) => handlePriceChange(e, 'max')}
                    style={{ width: '100%', padding: '0.5rem', background: '#111', border: '1px solid #333', color: 'white', borderRadius: '4px' }}
                 />
              </div>
           </div>

           {/* 3. Sizes */}
           <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Size</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                 {availableSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      style={{
                         padding: '0.5rem 0',
                         fontSize: '0.8rem',
                         background: selectedSizes.includes(size) ? 'white' : 'transparent',
                         color: selectedSizes.includes(size) ? 'black' : '#888',
                         border: selectedSizes.includes(size) ? '1px solid white' : '1px solid #333',
                         cursor: 'pointer',
                         transition: 'all 0.2s',
                         borderRadius: '2px'
                      }}
                    >
                       {size}
                    </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1 }}>
           
           {/* Top Bar (Desktop) */}
           <div className="desktop-sort-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', margin: 0, textTransform: 'uppercase' }}>
                 All Products <span style={{ color: '#666', fontSize: '1rem', marginLeft: '0.5rem' }}>{filteredProducts.length} items</span>
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>Sort By:</span>
                <select 
                  value={sortOrder} 
                  onChange={e => setSortOrder(e.target.value)}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    background: 'transparent', 
                    color: 'white', 
                    border: '1px solid #333', 
                    borderRadius: '4px',
                    cursor: 'pointer' 
                  }}
                >
                   <option value="newest" style={{color: 'black'}}>Newest Arrivals</option>
                   <option value="low-high" style={{color: 'black'}}>Price: Low - High</option>
                   <option value="high-low" style={{color: 'black'}}>Price: High - Low</option>
                </select>
              </div>
           </div>

           {/* Grid */}
           {loading ? (
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem' }}>
               {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
             </div>
           ) : filteredProducts.length === 0 ? (
             <div style={{ padding: '6rem', textAlign: 'center', border: '1px dashed #333', borderRadius: '8px' }}>
                <p style={{ fontSize: '1.2rem', color: '#888', marginBottom: '1rem' }}>No products match your filters.</p>
                <button 
                  onClick={() => { setSelectedCategories([]); setSelectedSizes([]); setPriceRange({min: '', max: ''}); }}
                  style={{ color: 'var(--color-neon-green)', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Clear all filters
                </button>
             </div>
           ) : (
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem' }}>
               {filteredProducts.map(product => (
                 <ProductCard key={product.id} product={product} />
               ))}
             </div>
           )}
        </div>

      </div>

      {/* CSS for Mobile Repsonsiveness */}
      <style>{`
        @media (max-width: 768px) {
           .shop-sidebar {
              display: none; /* Hidden by default on mobile */
              position: fixed;
              top: 0; left: 0;
              width: 100% !important;
              height: 100vh !important;
              background: black;
              z-index: 1000;
              padding: 2rem;
              padding-top: 6rem; /* Space for close button */
           }
           .shop-sidebar.open {
              display: block;
           }
           .mobile-close-btn {
              display: block !important;
           }
           .mobile-filter-bar {
              display: flex !important;
           }
           .desktop-sort-bar {
              display: none !important;
           }
        }
      `}</style>
    </div>
  );
};

export default Shop;
