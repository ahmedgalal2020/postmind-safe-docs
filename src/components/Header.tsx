import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LocaleSwitch } from './LocaleSwitch';
import { useLocale } from '@/hooks/useLocale';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

export const Header = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate(`/${locale}/`);
  };

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to={`/${locale}/`} className="text-2xl font-bold text-primary">
          {t('brand')}
        </Link>
        
        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to={`/${locale}/dashboard`}>
                <Button variant="ghost">{t('dashboard')}</Button>
              </Link>
              <Link to={`/${locale}/rules`}>
                <Button variant="ghost">{t('rules')}</Button>
              </Link>
              <Link to={`/${locale}/calendar`}>
                <Button variant="ghost">{t('calendar')}</Button>
              </Link>
              <Link to={`/${locale}/dashboard/billing`}>
                <Button variant="ghost">{t('billing.title')}</Button>
              </Link>
              <Link to={`/${locale}/company`}>
                <Button variant="ghost">{t('company')}</Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                {t('logout')}
              </Button>
            </>
          ) : (
            <>
              <Link to={`/${locale}/auth/login`}>
                <Button variant="ghost">{t('login')}</Button>
              </Link>
              <Link to={`/${locale}/auth/signup`}>
                <Button>{t('signup')}</Button>
              </Link>
            </>
          )}
          <LocaleSwitch />
        </nav>
      </div>
    </header>
  );
};
