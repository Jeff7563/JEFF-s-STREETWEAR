import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signup(email, password, name);
      navigate('/');
    } catch (err) {
      setError('Failed to create account: ' + err.message);
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(-45deg, var(--color-black) 50%, #1a1a1a 50%)`,
      padding: '2rem'
    }}>
      <div style={{
        background: 'rgba(0,0,0,0.8)',
        border: '2px solid var(--color-neon-orange)',
        boxShadow: '-10px 10px 0px var(--color-grey)',
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
        }}>JOIN US</h2>
        
        {error && <div style={{ color: 'red', marginBottom: '1rem', fontFamily: 'monospace' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>NICKNAME</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
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
          
          <button disabled={loading} className="btn-primary" type="submit" style={{ marginTop: '1rem', background: 'var(--color-neon-orange)' }}>
            CREATE ACCOUNT
          </button>
        </form>
        
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--color-neon-orange)', textDecoration: 'underline' }}>LOGIN HERE</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
