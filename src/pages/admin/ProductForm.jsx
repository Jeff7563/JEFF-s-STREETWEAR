import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import { doc, getDoc, addDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { uploadImage } from '../../services/cloudinary';
import { Upload } from 'lucide-react';
import { useAlert } from '../../contexts/AlertContext';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshProducts } = useProducts();
  const { showAlert } = useAlert();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: '', // Comma separated string
    sizes: 'S,M,L,XL' // Comma separated
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      async function fetchProduct() {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            name: data.name,
            description: data.description,
            price: data.price,
            category: data.category,
            images: data.images ? data.images.join(',') : '',
            sizes: data.sizes ? data.sizes.map(s => s.size).join(',') : 'S,M,L,XL'
          });
        }
      }
      fetchProduct();
    }
  }, [id]);



// ... inside ProductForm ...

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      // Upload to Cloudinary
      const uploadPromises = files.map(file => uploadImage(file));
      const publicIds = await Promise.all(uploadPromises);
      
      // Append new Public IDs to existing images string
      const currentImages = formData.images ? formData.images.split(',').map(s => s.trim()).filter(s => s) : [];
      const newImages = [...currentImages, ...publicIds].join(',');
      
      setFormData(prev => ({ ...prev, images: newImages }));
      
    } catch (error) {
      console.error("Upload failed:", error);
      showAlert("Failed to upload image: " + error.message);
    }
    setUploading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        images: formData.images.split(',').map(s => s.trim()).filter(s => s),
        sizes: formData.sizes.split(',').map(s => ({ size: s.trim(), stock: 10 })), 
        updatedAt: serverTimestamp()
      };

      if (id) {
        await updateDoc(doc(db, 'products', id), productData);
      } else {
        productData.createdAt = serverTimestamp();
        await addDoc(collection(db, 'products'), productData);
      }
      
      refreshProducts();
      navigate('/admin/products');
    } catch (error) {
       console.error("Error saving product:", error);
       showAlert("Failed to save product");
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>{id ? 'EDIT PRODUCT' : 'NEW PRODUCT'}</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
           <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>NAME</label>
           <input 
             type="text" 
             required 
             style={{ width: '100%' }}
             value={formData.name}
             onChange={e => setFormData({...formData, name: e.target.value})}
           />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>PRICE</label>
                <input 
                    type="number" 
                    required 
                    style={{ width: '100%' }}
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                />
            </div>
            <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>CATEGORY</label>
                <select 
                    required 
                    style={{ width: '100%' }}
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                >
                    <option value="">Select Category</option>
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Hoodies">Hoodies</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Pants">Pants</option>
                </select>
            </div>
        </div>

        <div>
           <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>DESCRIPTION</label>
           <textarea 
             rows="4"
             style={{ width: '100%', padding: '0.8rem', fontFamily: 'var(--font-body)', border: '1px solid var(--color-grey-light)', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'white' }}
             value={formData.description}
             onChange={e => setFormData({...formData, description: e.target.value})}
           />
        </div>

        <div>
           <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>IMAGES</label>
           
           {/* File Upload Button */}
           <div style={{ marginBottom: '1rem' }}>
              <label 
                className="btn-secondary" 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  padding: '0.8rem 1.5rem'
                }}
              >
                <Upload size={16} /> 
                {uploading ? 'UPLOADING...' : 'UPLOAD FROM COMPUTER'}
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  style={{ display: 'none' }} 
                  disabled={uploading}
                />
              </label>
           </div>

           <input 
             type="text" 
             placeholder="Or enter Image URLs..."
             style={{ width: '100%' }}
             value={formData.images}
             onChange={e => setFormData({...formData, images: e.target.value})}
           />
           <p className="text-xs text-grey" style={{ marginTop: '0.5rem' }}>Uploads will append their URLs here automatically.</p>
        </div>

        <div>
           <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>SIZES (Comma separated)</label>
           <input 
             type="text" 
             style={{ width: '100%' }}
             value={formData.sizes}
             onChange={e => setFormData({...formData, sizes: e.target.value})}
           />
        </div>

        <button type="submit" disabled={loading || uploading} className="btn-primary" style={{ alignSelf: 'flex-start' }}>
            {loading ? 'SAVING...' : 'SAVE PRODUCT'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
