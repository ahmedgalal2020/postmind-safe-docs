import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Menu, X } from 'lucide-react';
import { LocaleSwitch } from './LocaleSwitch';
import { Breadcrumbs } from './Breadcrumbs';
import { useLocale } from '@/hooks/useLocale';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export const NavBar = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    setMobileMenuOpen(false);
    navigate(`/${locale}/`);
  };

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1 && window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      // Fallback to locale home
      navigate(`/${locale}/`);
    }
  };

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => {
    const linkClass = isMobile
      ? 'block px-4 py-2 text-lg hover:bg-accent rounded-md transition-colors'
      : '';

    const handleLinkClick = () => {
      if (isMobile) {
        setMobileMenuOpen(false);
      }
    };

    return (
      <>
        {isAuthenticated ? (
          <>
            <Link to={`/${locale}/dashboard`} onClick={handleLinkClick}>
              <Button variant="ghost" className={linkClass}>{t('dashboard')}</Button>
            </Link>
            <Link to={`/${locale}/rules`} onClick={handleLinkClick}>
              <Button variant="ghost" className={linkClass}>{t('rules')}</Button>
            </Link>
            <Link to={`/${locale}/calendar`} onClick={handleLinkClick}>
              <Button variant="ghost" className={linkClass}>{t('calendar')}</Button>
            </Link>
            <Link to={`/${locale}/dashboard/billing`} onClick={handleLinkClick}>
              <Button variant="ghost" className={linkClass}>{t('billing.title')}</Button>
            </Link>
            <Link to={`/${locale}/company`} onClick={handleLinkClick}>
              <Button variant="ghost" className={linkClass}>{t('company')}</Button>
            </Link>
            <Button variant="outline" onClick={handleLogout} className={linkClass}>
              {t('logout')}
            </Button>
          </>
        ) : (
          <>
            <Link to={`/${locale}/auth/login`} onClick={handleLinkClick}>
              <Button variant="ghost" className={linkClass}>{t('login')}</Button>
            </Link>
            <Link to={`/${locale}/auth/signup`} onClick={handleLinkClick}>
              <Button className={linkClass}>{t('signup')}</Button>
            </Link>
          </>
        )}
      </>
    );
  };

  return (
    <nav className="border-b bg-background sticky top-0 z-50" role="navigation" aria-label={t('nav.main')}>
      {/* Top bar with logo, links, and controls */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo and back button */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="hidden sm:flex"
              aria-label={t('nav.back')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">{t('nav.back')}</span>
            </Button>
            
            <Link to={`/${locale}/`} className="text-xl font-bold text-primary hover:opacity-80 transition-opacity">
              {t('brand')}
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-2 flex-1 justify-end">
            <NavLinks />
            <LocaleSwitch />
          </div>

          {/* Mobile menu */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="sm:hidden"
              aria-label={t('nav.back')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <LocaleSwitch />
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" aria-label={t('nav.menu')}>
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-4 mt-8">
                  <NavLinks isMobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Breadcrumb bar */}
      <div className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-2">
          <Breadcrumbs />
        </div>
      </div>
    </nav>
  );
};
