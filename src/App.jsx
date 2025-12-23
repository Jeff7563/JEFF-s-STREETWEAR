import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { CartProvider } from './contexts/CartContext';
import { AlertProvider } from './contexts/AlertContext';
import { WishlistProvider } from './contexts/WishlistContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Shop from './pages/Shop';
import Wishlist from './pages/Wishlist';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

import AdminRoute from './components/AdminRoute';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/ProductList';
import ProductForm from './pages/admin/ProductForm';

import OrderList from './pages/admin/OrderList';
import CouponList from './pages/admin/CouponList';
import CouponForm from './pages/admin/CouponForm';

function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <ProductProvider>
          <WishlistProvider>
          <CartProvider>
            <BrowserRouter>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<ProductList />} />
                  <Route path="products/new" element={<ProductForm />} />
                  <Route path="products/edit/:id" element={<ProductForm />} />
                  <Route path="orders" element={<OrderList />} />
                  <Route path="coupons" element={<CouponList />} />
                  <Route path="coupons/new" element={<CouponForm />} />
                  <Route path="coupons/edit/:id" element={<CouponForm />} />
                </Route>
              </Routes>
              <Footer />
            </BrowserRouter>
          </CartProvider>
          </WishlistProvider>
        </ProductProvider>
      </AlertProvider>
    </AuthProvider>
  );
}

export default App;
