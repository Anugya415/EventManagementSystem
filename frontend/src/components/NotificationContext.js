'use client';

import { createContext, useContext, useCallback } from 'react';
import { useToast } from "../hooks/use-toast";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { toast } = useToast();

  const showNotification = useCallback((message, type = 'success', duration = 3000) => {
    toast({
      title: type.toUpperCase(),
      description: message,
      variant: type === 'error' ? 'destructive' : 'default',
      duration: duration,
    });
  }, [toast]);

  const removeNotification = useCallback(() => {
    // Shadcn toast handles its own removal, but we keep the method for compatibility
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
