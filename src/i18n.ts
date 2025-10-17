import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import deCommon from './locales/de/common.json';
import enCommon from './locales/en/common.json';

const pathLocaleMatch = typeof window !== 'undefined' ? window.location.pathname.match(/^\/(de|en)(\/|$)/) : null;
const urlLng = pathLocaleMatch ? pathLocaleMatch[1] : null;
const stored = typeof window !== 'undefined' ? localStorage.getItem('pm_lang') : null;
const initialLng = urlLng === 'en' || urlLng === 'de' ? urlLng : stored === 'en' ? 'en' : 'de';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      de: { common: deCommon },
      en: { common: enCommon }
    },
    lng: initialLng,
    fallbackLng: 'de',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    react: { useSuspense: false }, // prevent key flash
    // helpful diagnostics:
    missingKeyHandler: (lng, ns, key) => {
      console.warn(`[i18n] Missing key "${key}" in ns "${ns}" for lng "${lng}"`);
    }
  });

export default i18n;
