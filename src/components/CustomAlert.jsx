import { X } from 'lucide-react';

const CustomAlert = ({ message, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        background: '#0a0a0a',
        border: '1px solid var(--color-neon-green)',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center',
        position: 'relative',
        boxShadow: '0 0 30px rgba(57, 255, 20, 0.2)',
        animation: 'scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
        <div style={{ marginBottom: '1.5rem', color: 'white', fontSize: '1.1rem', lineHeight: '1.5' }}>
          {message}
        </div>

        <button 
          onClick={onClose}
          className="btn-primary"
          style={{ 
            width: '100%', 
            padding: '0.8rem',
            fontSize: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '1px'
           }}
        >
          ACKNOWLEDGE
        </button>
      </div>
      
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleUp {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default CustomAlert;
