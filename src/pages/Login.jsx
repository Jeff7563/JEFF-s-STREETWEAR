import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const userCredential = await login(email, password);
      const user = userCredential.user;
      
      // Check user role
      const { doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('../firebase');
      
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists() && docSnap.data().role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to log in: ' + err.message);
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(45deg, var(--color-black) 50%, #1a1a1a 50%)`,
      padding: '2rem'
    }}>
      <div style={{
        background: 'rgba(0,0,0,0.8)',
        border: '2px solid var(--color-neon-green)',
        boxShadow: '10px 10px 0px var(--color-grey)',
        padding: '3rem',
        maxWidth: '500px',
        width: '100%',
        position: 'relative'
      }}>
        <h2 className="glitch-text" style={{ 
          fontSize: '3rem', 
          marginBottom: '2rem',
          textAlign: 'center',
          color: 'var(--color-white)' 
        }}>LOGIN</h2>
        
        {error && <div style={{ color: 'red', marginBottom: '1rem', fontFamily: 'monospace' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>EMAIL</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              style={{
                width: '100%',
                padding: '1rem',
                background: 'transparent',
                border: '1px solid var(--color-white)',
                color: 'white',
                fontFamily: 'var(--font-body)'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>PASSWORD</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              style={{
                width: '100%',
                padding: '1rem',
                background: 'transparent',
                border: '1px solid var(--color-white)',
                color: 'white',
                fontFamily: 'var(--font-body)'
              }}
            />
          </div>
          
          <button disabled={loading} className="btn-primary" type="submit" style={{ marginTop: '1rem' }}>
            ENTER THE VOID
          </button>
        </form>
        
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Need an account? <Link to="/register" style={{ color: 'var(--color-neon-green)', textDecoration: 'underline' }}>REGISTER HERE</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
