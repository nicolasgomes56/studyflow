import { QueryClientProvider } from '@tanstack/react-query';
import { I18nProvider } from 'react-aria-components';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/queryClient';
import App from './App';
import { ThemeProvider } from './components/ui/theme-provider';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider locale='pt-BR'>
      <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
        <QueryClientProvider client={queryClient}>
          <Toaster richColors />
          <App />
        </QueryClientProvider>
      </ThemeProvider>
    </I18nProvider>
  </StrictMode>
);
