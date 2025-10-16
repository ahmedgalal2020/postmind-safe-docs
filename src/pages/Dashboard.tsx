import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FileUpload } from '@/components/FileUpload';
import { BatchList } from '@/components/BatchList';
import { LettersList } from '@/components/LettersList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useLocale } from '@/hooks/useLocale';

const Dashboard = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
    <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{t('dashboard')}</h1>
            <p className="text-muted-foreground">{t('dashboardDesc')}</p>
          </div>

          <Tabs defaultValue="upload" className="space-y-6">
            <TabsList>
              <TabsTrigger value="upload">{t('upload')}</TabsTrigger>
              <TabsTrigger value="batches">{t('batches')}</TabsTrigger>
              <TabsTrigger value="letters">{t('letters')}</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              <FileUpload onUploadComplete={() => setRefreshTrigger(prev => prev + 1)} />
            </TabsContent>

            <TabsContent value="batches" className="space-y-6">
              <BatchList refreshTrigger={refreshTrigger} />
            </TabsContent>

            <TabsContent value="letters" className="space-y-6">
              <LettersList refreshTrigger={refreshTrigger} />
            </TabsContent>
          </Tabs>
        </div>
    </div>
  );
};

export default Dashboard;
