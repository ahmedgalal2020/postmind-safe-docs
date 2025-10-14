import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocale } from '@/hooks/useLocale';

export const Footer = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();

  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-3">{t('about')}</h3>
            <ul className="space-y-2">
              <li><Link to={`/${locale}/pricing`} className="text-muted-foreground hover:text-foreground">{t('pricing')}</Link></li>
              <li><Link to={`/${locale}/contact`} className="text-muted-foreground hover:text-foreground">{t('contact')}</Link></li>
              <li><Link to={`/${locale}/blog`} className="text-muted-foreground hover:text-foreground">{t('blog')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">{t('support')}</h3>
            <ul className="space-y-2">
              <li><Link to={`/${locale}/faq`} className="text-muted-foreground hover:text-foreground">{t('faq')}</Link></li>
              <li><Link to={`/${locale}/support`} className="text-muted-foreground hover:text-foreground">{t('support')}</Link></li>
              <li><Link to={`/${locale}/docs`} className="text-muted-foreground hover:text-foreground">{t('docs')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">{t('privacy')}</h3>
            <ul className="space-y-2">
              <li><Link to={`/${locale}/legal/privacy`} className="text-muted-foreground hover:text-foreground">{t('privacy')}</Link></li>
              <li><Link to={`/${locale}/legal/terms`} className="text-muted-foreground hover:text-foreground">{t('terms')}</Link></li>
              <li><Link to={`/${locale}/legal/impressum`} className="text-muted-foreground hover:text-foreground">{t('impressum')}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
          <p>&copy; 2025 PostMind AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
