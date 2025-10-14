import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLocale } from '@/hooks/useLocale';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const Landing = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t('landingTitle')}
          </h1>
          
          <p className="text-xl md:text-2xl mb-4 text-muted-foreground max-w-3xl mx-auto">
            {t('landingSubtitle')}
          </p>
          
          <p className="text-lg mb-8 text-muted-foreground max-w-2xl mx-auto">
            {t('landingDescription')}
          </p>
          
          <Link to={`/${locale}/auth/signup`}>
            <Button size="lg" className="text-lg px-8 py-6">
              {t('startFreeTrial')} →
            </Button>
          </Link>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6 rounded-lg border bg-card">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-semibold mb-2">{t('feature.gdpr.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('feature.gdpr.desc')}
              </p>
            </div>
            
            <div className="p-6 rounded-lg border bg-card">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="font-semibold mb-2">{t('feature.ai.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('feature.ai.desc')}
              </p>
            </div>
            
            <div className="p-6 rounded-lg border bg-card">
              <div className="text-4xl mb-3">📅</div>
              <h3 className="font-semibold mb-2">{t('feature.calendar.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('feature.calendar.desc')}
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Landing;
