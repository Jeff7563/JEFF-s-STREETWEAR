import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const CustomAlert = ({ toasts, removeToast }) => {
  return createPortal(
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      maxWidth: '400px',
      pointerEvents: 'none' // Allow clicking through empty space
    }}>
      {toasts.map(toast => (
        <div 
          key={toast.id} 
          style={{
            background: '#111',
            border: `1px solid ${toast.type === 'error' ? '#ef4444' : 'var(--color-neon-green)'}`,
            borderRadius: '8px',
            padding: '1rem',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            animation: 'slideIn 0.3s ease-out',
            pointerEvents: 'auto', // Re-enable clicks
            minWidth: '300px'
          }}
        >
          {toast.type === 'error' ? (
             <AlertCircle color="#ef4444" size={24} />
          ) : (
             <CheckCircle color="var(--color-neon-green)" size={24} />
          )}
          
          <div style={{ flex: 1, fontSize: '0.95rem' }}>{toast.message}</div>
          
          <button 
            onClick={() => removeToast(toast.id)}
            style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>
      ))}

      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}
      </style>
    </div>,
    document.body
  );
};

export default CustomAlert;
