import React, { createContext, useState, useContext } from 'react';

// Create a context with a default value
const ComponentNameContext = createContext();

// Create a provider component
export const ComponentNameProvider = ({ children }) => {
  const [componentName, setComponentName] = useState('Dashboard');

  return (
    <ComponentNameContext.Provider value={{ componentName, setComponentName }}>
      {children}
    </ComponentNameContext.Provider>
  );
};

// Custom hook to use the ComponentNameContext
export const useComponentName = () => {
  return useContext(ComponentNameContext);
};
