import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useLocale } from '@/hooks/useLocale';

const Dashboard = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate(`/${locale}/auth/login`);
      } else {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate, locale]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">{t('welcomeMessage')}</h1>
          <p className="text-xl text-muted-foreground mb-8">{t('phase1Ready')}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="p-6 rounded-lg border bg-card">
              <div className="text-5xl mb-4">📧</div>
              <h3 className="text-xl font-semibold mb-2">
                {locale === 'de' ? 'Upload-Funktion' : 'Upload Feature'}
              </h3>
              <p className="text-muted-foreground">
                {locale === 'de' ? 'Kommt in Phase 2' : 'Coming in Phase 2'}
              </p>
            </div>
            
            <div className="p-6 rounded-lg border bg-card">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">
                {locale === 'de' ? 'KI-Analyse' : 'AI Analysis'}
              </h3>
              <p className="text-muted-foreground">
                {locale === 'de' ? 'Kommt in Phase 3' : 'Coming in Phase 3'}
              </p>
            </div>
            
            <div className="p-6 rounded-lg border bg-card">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">
                {locale === 'de' ? 'Kalender-Integration' : 'Calendar Integration'}
              </h3>
              <p className="text-muted-foreground">
                {locale === 'de' ? 'Kommt in Phase 4' : 'Coming in Phase 4'}
              </p>
            </div>
            
            <div className="p-6 rounded-lg border bg-card">
              <div className="text-5xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2">
                {locale === 'de' ? 'Abrechnung' : 'Billing'}
              </h3>
              <p className="text-muted-foreground">
                {locale === 'de' ? 'Kommt in Phase 5' : 'Coming in Phase 5'}
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
