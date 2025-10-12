import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SUPPORTED_LOCALES = ['de', 'en'] as const;
type Locale = typeof SUPPORTED_LOCALES[number];

export const useLocale = () => {
  const { locale } = useParams<{ locale: string }>();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const currentLocale: Locale = 
    locale && SUPPORTED_LOCALES.includes(locale as Locale) 
      ? (locale as Locale) 
      : 'de';

  useEffect(() => {
    if (i18n.language !== currentLocale) {
      i18n.changeLanguage(currentLocale);
      localStorage.setItem('locale', currentLocale);
    }
  }, [currentLocale, i18n]);

  const switchLocale = (newLocale: Locale) => {
    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.replace(/^\/(de|en)/, '');
    navigate(`/${newLocale}${pathWithoutLocale || '/'}`);
  };

  return {
    locale: currentLocale,
    switchLocale,
    supportedLocales: SUPPORTED_LOCALES
  };
};
