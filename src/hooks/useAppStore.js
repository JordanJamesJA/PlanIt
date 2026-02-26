import { useContext } from 'react';
import { AppContext } from '@/store/AppContext';

/**
 * Access the global app store.
 * Must be used inside <AppProvider />.
 */
export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be used inside <AppProvider>');
  return ctx;
}
