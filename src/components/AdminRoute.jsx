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
        console.log("Checking admin role for user:", currentUser.uid);
        try {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                console.log("User Data:", userData);
                if (userData.role === 'admin') {
                    console.log("User is admin");
                    setIsAdmin(true);
                } else {
                    console.log("User is NOT admin (role: " + userData.role + ")");
                    setIsAdmin(false);
                }
            } else {
                console.log("User document does not exist");
                setIsAdmin(false);
            }
        } catch (e) {
            console.error("Error checking permissions:", e);
            setIsAdmin(false);
        }
      } else {
        console.log("No current user");
        setIsAdmin(false);
      }
    }
    checkAdmin();
  }, [currentUser]);

  if (isAdmin === null) {
      return (
        <div className="container" style={{ paddingTop: '100px', display: 'flex', justifyContent: 'center', color: 'white' }}>
            <h2>Checking Permissions...</h2>
        </div>
      ); 
  }

  if (!currentUser) {
      console.log("Redirecting to login: No user");
      return <Navigate to="/login" />;
  }

  if (!isAdmin) {
      console.log("Redirecting to home: Not admin");
      return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
