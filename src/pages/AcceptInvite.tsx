import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocale } from '@/hooks/useLocale';

export default function AcceptInvite() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const { locale } = useLocale();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    acceptInvitation();
  }, []);

  const acceptInvitation = async () => {
    const token = searchParams.get('token');
    
    if (!token) {
      setError(t('team.invalidInviteLink'));
      setLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Redirect to login with return URL
        navigate(`/${locale}/auth/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      const { data, error: inviteError } = await supabase.functions.invoke('accept-team-invitation', {
        body: { invitation_token: token },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (inviteError) throw inviteError;

      setSuccess(true);
      toast.success(t('team.inviteAccepted'));
      
      // Redirect to team page after 2 seconds
      setTimeout(() => {
        navigate(`/${locale}/dashboard/team`);
      }, 2000);
    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      setError(error.message || t('team.errorAccepting'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-16 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('team.acceptInvite')}</CardTitle>
          <CardDescription>{t('team.acceptInviteDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {loading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>{t('team.processing')}</p>
            </div>
          )}
          
          {success && (
            <>
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <div className="text-center">
                <h3 className="text-lg font-semibold">{t('team.inviteAcceptedTitle')}</h3>
                <p className="text-muted-foreground">{t('team.redirecting')}</p>
              </div>
            </>
          )}
          
          {error && (
            <>
              <XCircle className="h-16 w-16 text-destructive" />
              <div className="text-center">
                <h3 className="text-lg font-semibold">{t('error')}</h3>
                <p className="text-muted-foreground">{error}</p>
              </div>
              <Button onClick={() => navigate(`/${locale}/dashboard`)}>
                {t('team.goToDashboard')}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}