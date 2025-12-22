import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

const ProductContext = createContext();

export function useProducts() {
  return useContext(ProductContext);
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchProducts() {
    setLoading(true);
    try {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const productList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productList);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  }

  // Create a specialized function to fetch a single product
  async function getProductById(id) {
    // Ideally use doc(db, 'products', id) and getDoc
    // But for now finding in local state is faster if state exists
    // We will implement direct fetch in the page or here if needed
    // For simplicity, let's just find it in the already fetched array or fetch list if empty
    if (products.length === 0) {
        // Fallback or force fetch
        // For MVP, simplistic approach:
        return null;
    }
    return products.find(p => p.id === id);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const value = {
    products,
    loading,
    getProductById,
    refreshProducts: fetchProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}
