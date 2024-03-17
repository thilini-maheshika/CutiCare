import { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState(null);

    const showAlert = (message, severity = 'info') => {
        setAlert({ message, severity });

        // Automatically hide the alert after 30 seconds
        const timer = setTimeout(() => {
            hideAlert();
        }, 5000); // 30 seconds

        // Cleanup function to clear the timeout when component unmounts or when a new alert is shown
        return () => clearTimeout(timer);
    };

    const hideAlert = () => {
        setAlert(null);
    };

    return (
        <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
            {children}
        </AlertContext.Provider>
    );
};
