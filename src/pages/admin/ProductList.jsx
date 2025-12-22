import { Link } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import { getImageUrl } from '../../services/cloudinary';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useAlert } from '../../contexts/AlertContext';

const ProductList = () => {
  const { products, loading, refreshProducts } = useProducts();
  const { showAlert } = useAlert();

  async function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
        refreshProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        showAlert("Failed to delete product");
      }
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>PRODUCTS</h1>
        <Link to="/admin/products/new">
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} /> NEW PRODUCT
            </button>
        </Link>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-grey-light)' }}>
                <th style={{ padding: '1rem' }}>IMAGE</th>
                <th style={{ padding: '1rem' }}>NAME</th>
                <th style={{ padding: '1rem' }}>PRICE</th>
                <th style={{ padding: '1rem' }}>CATEGORY</th>
                <th style={{ padding: '1rem' }}>ACTIONS</th>
            </tr>
        </thead>
        <tbody>
            {products.map(product => (
                <tr key={product.id} style={{ borderBottom: '1px solid var(--color-grey-light)' }}>
                    <td style={{ padding: '1rem', width: '80px' }}>
                        <img 
                            src={product.images && product.images[0] ? getImageUrl(product.images[0]) : 'https://placehold.co/50'} 
                            alt="" 
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{product.name}</td>
                    <td style={{ padding: '1rem' }}>฿{product.price.toLocaleString()}</td>
                    <td style={{ padding: '1rem' }}>{product.category}</td>
                    <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link to={`/admin/products/edit/${product.id}`}>
                                <Edit size={18} color="var(--color-black)" />
                            </Link>
                            <button onClick={() => handleDelete(product.id)} style={{ background: 'transparent' }}>
                                <Trash2 size={18} color="var(--color-error)" />
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
