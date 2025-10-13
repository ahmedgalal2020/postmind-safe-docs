import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useLocale } from '@/hooks/useLocale';
import { useToast } from '@/hooks/use-toast';

const Company = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    vatId: '',
    street: '',
    zip: '',
    city: '',
    country: '',
    businessEmail: '',
    language: 'de',
    aiConsent: false,
    aiMode: 'local' as 'local' | 'ai',
  });

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate(`/${locale}/auth/login`);
        return;
      }
      
      const { data, error } = await supabase
        .from('users_app')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        console.error('Error loading profile:', error);
        toast({
          title: locale === 'de' ? 'Fehler' : 'Error',
          description: error.message,
          variant: 'destructive'
        });
      } else if (data) {
        setFormData({
          companyName: data.company_name,
          vatId: data.vat_id || '',
          street: data.address_street,
          zip: data.address_zip,
          city: data.city,
          country: data.country,
          businessEmail: data.business_email,
          language: data.language,
          aiConsent: data.ai_consent || false,
          aiMode: (data.ai_mode as 'local' | 'ai') || 'local',
        });
      }
      
      setIsLoading(false);
    };
    
    loadProfile();
  }, [navigate, locale, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Not authenticated');
      }
      
      const { error } = await supabase
        .from('users_app')
        .update({
          company_name: formData.companyName,
          vat_id: formData.vatId || null,
          address_street: formData.street,
          address_zip: formData.zip,
          city: formData.city,
          country: formData.country,
          business_email: formData.businessEmail,
          language: formData.language,
          ai_consent: formData.aiConsent,
          ai_mode: formData.aiMode,
        })
        .eq('id', session.user.id);
      
      if (error) throw error;
      
      toast({
        title: locale === 'de' ? 'Gespeichert!' : 'Saved!',
        description: t('profileUpdated'),
      });
      
    } catch (error: any) {
      toast({
        title: locale === 'de' ? 'Fehler' : 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

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
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">{t('companyProfile')}</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6 bg-card rounded-lg border p-6">
            <div>
              <Label htmlFor="companyName">{t('companyName')}</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="vatId">{t('vatId')}</Label>
              <Input
                id="vatId"
                value={formData.vatId}
                onChange={(e) => setFormData({ ...formData, vatId: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="street">{t('street')}</Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zip">{t('zip')}</Label>
                <Input
                  id="zip"
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="city">{t('city')}</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="country">{t('country')}</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
                disabled
              />
            </div>
            
            <div>
              <Label htmlFor="businessEmail">{t('businessEmail')}</Label>
              <Input
                id="businessEmail"
                type="email"
                value={formData.businessEmail}
                onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="language">{t('language')}</Label>
              <select
                id="language"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="de">{t('german')}</option>
                <option value="en">{t('english')}</option>
              </select>
            </div>
            
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold">
                {locale === 'de' ? 'KI-Einstellungen' : 'AI Settings'}
              </h3>
              
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="aiConsent"
                  checked={formData.aiConsent}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, aiConsent: checked as boolean })
                  }
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="aiConsent" className="cursor-pointer">
                    {locale === 'de' 
                      ? 'EU-KI-Modus aktivieren (optional)' 
                      : 'Enable EU AI Mode (optional)'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'de'
                      ? 'Erlaubt KI-basierte Extraktion mit EU-Servern. Ohne Zustimmung läuft nur lokale Verarbeitung im Browser.'
                      : 'Allows AI-powered extraction with EU servers. Without consent, only local browser processing runs.'}
                  </p>
                </div>
              </div>

              {formData.aiConsent && (
                <div className="space-y-2 pl-6">
                  <Label>
                    {locale === 'de' ? 'KI-Modus' : 'AI Mode'}
                  </Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="local-mode"
                        name="aiMode"
                        value="local"
                        checked={formData.aiMode === 'local'}
                        onChange={(e) => setFormData({ ...formData, aiMode: 'local' })}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="local-mode" className="cursor-pointer font-normal">
                        {locale === 'de' ? 'Nur lokal (Standard)' : 'Local Only (Default)'}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="ai-mode"
                        name="aiMode"
                        value="ai"
                        checked={formData.aiMode === 'ai'}
                        onChange={(e) => setFormData({ ...formData, aiMode: 'ai' })}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="ai-mode" className="cursor-pointer font-normal">
                        {locale === 'de' ? 'EU-KI (Google Gemini)' : 'EU AI (Google Gemini)'}
                      </Label>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? (locale === 'de' ? 'Wird gespeichert...' : 'Saving...') : t('saveChanges')}
            </Button>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Company;
