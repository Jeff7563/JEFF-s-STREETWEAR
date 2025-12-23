import { createContext, useContext, useState } from 'react';
import CustomAlert from '../components/CustomAlert';

const AlertContext = createContext();

export function useAlert() {
  return useContext(AlertContext);
}

export function AlertProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showAlert = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <CustomAlert toasts={toasts} removeToast={removeToast} />
    </AlertContext.Provider>
  );
}
