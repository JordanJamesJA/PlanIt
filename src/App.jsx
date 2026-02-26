import { AppProvider } from '@/store/AppContext';
import { AppLayout }   from '@/components/layout/AppLayout';
import '@/styles/globals.css';

export default function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}
