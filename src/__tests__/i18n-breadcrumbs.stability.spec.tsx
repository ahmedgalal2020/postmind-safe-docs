import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
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
    const { findByText, getByText } = render(<App />);
    expect(await findByText('EN')).toBeInTheDocument();
    expect(getByText('DE')).toBeInTheDocument();
  });

  it('switches language to DE, updates URL prefix, and keeps it on re-render', async () => {
    localStorage.setItem('pm_lang', 'en');
    setPath('/en/dashboard');
    const { findByText } = render(<App />);
    const deButton = await findByText('DE');
    await userEvent.click(deButton);
    expect(window.location.pathname.startsWith('/de')).toBe(true);
    cleanup();
    const { findByText: findByText2 } = render(<App />);
    expect(window.location.pathname.startsWith('/de')).toBe(true);
    expect(await findByText2('EN')).toBeInTheDocument();
  });

  it('shows breadcrumbs on deep route without locale segment', async () => {
    localStorage.setItem('pm_lang', 'de');
    setPath('/de/dashboard/letters/1234567890abcdef');
    const { findByText } = render(<App />);
    expect(await findByText(/Dashboard/i)).toBeInTheDocument();
  });
});
