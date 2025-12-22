import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('jeffs_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('jeffs_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(product, size, quantity = 1) {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.id === product.id && item.size === size
      );

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        return [...prevItems, { 
          id: product.id, 
          name: product.name,
          price: product.price,
          image: product.images && product.images[0],
          size, 
          quantity 
        }];
      }
    });
  }

  function removeFromCart(id, size) {
    setCartItems(prevItems => 
      prevItems.filter(item => !(item.id === id && item.size === size))
    );
  }

  function updateQuantity(id, size, newQuantity) {
    if (newQuantity < 1) {
      removeFromCart(id, size);
      return;
    }
    setCartItems(prevItems => 
      prevItems.map(item => 
        (item.id === id && item.size === size) 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  const [discount, setDiscount] = useState({ code: '', amount: 0 });

  function applyCoupon(coupon) {
    if (!coupon) {
      setDiscount({ code: '', amount: 0 });
      return { success: true };
    }
    
    // Validate min purchase
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    if (subtotal < coupon.minPurchaseAmount) {
      return { success: false, message: `Minimum purchase of ฿${coupon.minPurchaseAmount} required.` };
    }

    setDiscount({ code: coupon.code, amount: coupon.discountAmount });
    return { success: true, message: 'Coupon applied successfully!' };
  }

  // Check validty on cart change
  useEffect(() => {
    if (discount.amount > 0) {
       const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
       // We won't auto-remove, but we could validation logic here if needed.
       // For now, let's keep it simple.
    }
  }, [cartItems, discount]);


  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartTotal = Math.max(0, subtotal - discount.amount);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    subtotal,
    cartCount,
    applyCoupon,
    discount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
