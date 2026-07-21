import React, { createContext, useContext } from 'react';

/**
 * NavigationContext – Provides section navigation for the single-URL architecture.
 * 
 * All pages share the same '/devops-management-ui' URL and are rendered based on activeSection state.
 * This context allows pages to request navigation to different sections.
 */
const NavigationContext = createContext();

export const NavigationProvider = ({ children, onNavigate }) => {
  return (
    <NavigationContext.Provider value={{ onNavigate }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};
