import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocale } from './useLocale';

export interface Breadcrumb {
  label: string;
  path: string;
  isActive: boolean;
}

export const useBreadcrumbs = (): Breadcrumb[] => {
  const location = useLocation();
  const { t } = useTranslation();
  const { locale } = useLocale();

  const pathSegments = location.pathname
    .split('/')
    .filter(segment => segment && segment !== locale);

  if (pathSegments.length === 0) {
    return [{
      label: t('breadcrumb.home'),
      path: `/${locale}/`,
      isActive: true
    }];
  }

  const breadcrumbs: Breadcrumb[] = [{
    label: t('breadcrumb.home'),
    path: `/${locale}/`,
    isActive: false
  }];

  let currentPath = `/${locale}`;

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === pathSegments.length - 1;

    let label = segment;

    // Map common routes to translations
    const routeTranslations: Record<string, string> = {
      'dashboard': t('dashboard'),
      'calendar': t('calendar'),
      'rules': t('rules'),
      'company': t('company'),
      'letters': t('breadcrumb.letters'),
      'billing': t('billing.title'),
      'auth': t('breadcrumb.auth'),
      'login': t('login'),
      'signup': t('signup'),
      'legal': t('breadcrumb.legal'),
      'privacy': t('breadcrumb.privacy'),
      'terms': t('breadcrumb.terms'),
      'impressum': t('breadcrumb.impressum'),
      'avv': t('breadcrumb.avv'),
    };

    if (routeTranslations[segment]) {
      label = routeTranslations[segment];
    } else if (/^[0-9a-f-]{36}$/.test(segment)) {
      // UUID format - likely an ID
      label = t('breadcrumb.detail');
    }

    breadcrumbs.push({
      label,
      path: currentPath,
      isActive: isLast
    });
  });

  return breadcrumbs;
};
