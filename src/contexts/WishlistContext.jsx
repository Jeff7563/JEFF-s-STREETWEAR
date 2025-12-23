import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [wishlist, setWishlist] = useState([]); // Array of Product IDs
  const [loading, setLoading] = useState(true);

  // Sync with Firestore when User changes
  useEffect(() => {
    const fetchWishlist = async () => {
        setLoading(true);
        if (currentUser) {
            // Logged In: Fetch from Firestore
            try {
                const userRef = doc(db, 'users', currentUser.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists() && userSnap.data().wishlist) {
                    setWishlist(userSnap.data().wishlist);
                } else {
                    setWishlist([]);
                }
            } catch (error) {
                console.error("Error fetching wishlist:", error);
            }
        } else {
            // Guest: Fetch from LocalStorage
            const stored = localStorage.getItem('jeffs_wishlist');
            if (stored) setWishlist(JSON.parse(stored));
            else setWishlist([]);
        }
        setLoading(false);
    };

    fetchWishlist();
  }, [currentUser]);

  // Sync Local changes to LocalStorage (for guests)
  useEffect(() => {
      if (!currentUser) {
          localStorage.setItem('jeffs_wishlist', JSON.stringify(wishlist));
      }
  }, [wishlist, currentUser]);


  const addToWishlist = async (productId) => {
    if (!productId) return;
    
    // Optimistic Update
    setWishlist(prev => [...prev, productId]);

    if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        try {
            await updateDoc(userRef, {
                wishlist: arrayUnion(productId)
            }).catch(async (err) => {
                // If doc doesn't exist, create it (edge case, usually created on register)
                if (err.code === 'not-found') {
                   await setDoc(userRef, { wishlist: [productId] }, { merge: true });
                }
            });
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            // Revert on error? For now, keep simple.
        }
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!productId) return;

    // Optimistic Update
    setWishlist(prev => prev.filter(id => id !== productId));

    if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        try {
            await updateDoc(userRef, {
                wishlist: arrayRemove(productId)
            });
        } catch (error) {
            console.error("Error removing from wishlist:", error);
        }
    }
  };

  const toggleWishlist = (productId) => {
      if (wishlist.includes(productId)) {
          removeFromWishlist(productId);
      } else {
          addToWishlist(productId);
      }
  };

  const isInWishlist = (productId) => {
      return wishlist.includes(productId);
  };

  const value = {
      wishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      loading
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
