import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SUPPORTED_LOCALES = ['de', 'en'] as const;
type Locale = typeof SUPPORTED_LOCALES[number];

export const useLocale = () => {
  const { locale } = useParams<{ locale: string }>();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const storedLocale = typeof window !== 'undefined' ? (localStorage.getItem('pm_lang') as Locale | null) : null;
  const currentLocale: Locale =
    locale && SUPPORTED_LOCALES.includes(locale as Locale)
      ? (locale as Locale)
      : storedLocale && SUPPORTED_LOCALES.includes(storedLocale as Locale)
        ? (storedLocale as Locale)
        : 'de';

  useEffect(() => {
    if (i18n.language !== currentLocale) {
      i18n.changeLanguage(currentLocale);
      try {
        localStorage.setItem('pm_lang', currentLocale);
      } catch {}
    }
  }, [currentLocale, i18n]);
  useEffect(() => {
    // Ensure URL always includes the locale prefix
    const hasLocaleInUrl = /^\/(de|en)(\/|$)/.test(window.location.pathname);
    if (!hasLocaleInUrl) {
      const pathWithoutLocale = window.location.pathname.replace(/^\/(de|en)/, '');
      navigate(`/${currentLocale}${pathWithoutLocale || '/'}`, { replace: true });
    }
  }, [currentLocale, navigate]);

  const switchLocale = (newLocale: Locale) => {
    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.replace(/^\/(de|en)/, '');
    try {
      localStorage.setItem('pm_lang', newLocale);
    } catch {}
    navigate(`/${newLocale}${pathWithoutLocale || '/'}`);
  };

  return {
    locale: currentLocale,
    switchLocale,
    supportedLocales: SUPPORTED_LOCALES
  };
};
