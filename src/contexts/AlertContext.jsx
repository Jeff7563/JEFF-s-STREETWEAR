import { createContext, useContext, useState } from 'react';
import CustomAlert from '../components/CustomAlert';

const AlertContext = createContext();

export function useAlert() {
  return useContext(AlertContext);
}

export function AlertProvider({ children }) {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    message: ''
  });

  const showAlert = (message) => {
    setAlertState({ isOpen: true, message });
  };

  const hideAlert = () => {
    setAlertState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <CustomAlert 
        isOpen={alertState.isOpen} 
        message={alertState.message} 
        onClose={hideAlert} 
      />
    </AlertContext.Provider>
  );
}
