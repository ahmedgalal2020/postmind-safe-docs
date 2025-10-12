import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useLocale } from '@/hooks/useLocale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: locale === 'de' ? 'Erfolgreich angemeldet!' : 'Successfully logged in!',
        description: locale === 'de' 
          ? 'Willkommen zurück!' 
          : 'Welcome back!',
      });
      
      navigate(`/${locale}/dashboard`);
      
    } catch (error: any) {
      toast({
        title: locale === 'de' ? 'Fehler' : 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 bg-muted/30">
        <div className="container max-w-md mx-auto px-4">
          <div className="bg-card rounded-lg border p-8 shadow-sm">
            <h1 className="text-3xl font-bold mb-6 text-center">{t('login')}</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">{t('password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (locale === 'de' ? 'Wird angemeldet...' : 'Logging in...') : t('login')}
              </Button>
              
              <p className="text-center text-sm text-muted-foreground">
                {t('noAccount')}{' '}
                <Link to={`/${locale}/auth/signup`} className="text-primary hover:underline">
                  {t('signup')}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
