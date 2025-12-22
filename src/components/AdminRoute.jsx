import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const AdminRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    async function checkAdmin() {
      if (currentUser) {
        // Optimistic check if role is in auth token (custom claims) - simpler to check DB for now
        // Or if we stored role in AuthContext, we could use that.
        // Let's fetch local Firestore user doc to be safe
        try {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (userDoc.exists() && userDoc.data().role === 'admin') {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        } catch (e) {
            console.error(e);
            setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    }
    checkAdmin();
  }, [currentUser]);

  if (isAdmin === null) {
      return <div className="container" style={{ paddingTop: '100px' }}>Loading Access...</div>; 
  }

  if (!currentUser || !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
