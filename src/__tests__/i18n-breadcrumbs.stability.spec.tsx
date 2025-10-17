import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import App from '@/App';
import '../i18n';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signOut: () => Promise.resolve(),
    },
  },
}));

const setPath = (path: string) => {
  window.history.pushState({}, '', path);
};

describe('Global NavBar i18n & breadcrumbs stability', () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('renders NavBar on public landing (EN) and shows locale switch', async () => {
    localStorage.setItem('pm_lang', 'en');
    setPath('/en/');
    render(<App />);
    expect(await screen.findByText('EN')).toBeInTheDocument();
    expect(screen.getByText('DE')).toBeInTheDocument();
  });

  it('switches language to DE, updates URL prefix, and keeps it on re-render', async () => {
    localStorage.setItem('pm_lang', 'en');
    setPath('/en/dashboard');
    render(<App />);
    fireEvent.click(await screen.findByText('DE'));
    expect(window.location.pathname.startsWith('/de')).toBe(true);
    cleanup();
    render(<App />);
    expect(window.location.pathname.startsWith('/de')).toBe(true);
    expect(await screen.findByText('EN')).toBeInTheDocument();
  });

  it('shows breadcrumbs on deep route without locale segment', async () => {
    localStorage.setItem('pm_lang', 'de');
    setPath('/de/dashboard/letters/1234567890abcdef');
    render(<App />);
    expect(await screen.findByText(/Dashboard/i)).toBeInTheDocument();
  });
});
