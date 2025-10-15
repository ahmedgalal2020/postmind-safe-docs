import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Check, CreditCard, Download, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const PLANS = {
  trial: { name: 'Trial', limit: 20, price: 0, priceId: null },
  starter: { name: 'Starter', limit: 100, price: 19, priceId: 'price_1SIcbPDBYfDbSC5Lut9ScFi0' },
  pro: { name: 'Pro', limit: 300, price: 49, priceId: 'price_1SIcbeDBYfDbSC5LJeQaqm0G' },
  business: { name: 'Business', limit: 650, price: 99, priceId: 'price_1SIcbrDBYfDbSC5LpeMvGAIP' },
};

export default function Billing() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<keyof typeof PLANS>('trial');
  const [filesUploaded, setFilesUploaded] = useState(0);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [processingCheckout, setProcessingCheckout] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchSubscriptionStatus();
    fetchUsage();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/de/auth/login');
    }
  };

  const fetchSubscriptionStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.plan) {
        setCurrentPlan(data.plan);
      }
      if (data?.subscription_end) {
        setSubscriptionEnd(data.subscription_end);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsage = async () => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const { data, error } = await supabase
        .from('usage_counters')
        .select('uploaded_count')
        .eq('period_month', currentMonth)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setFilesUploaded(data?.uploaded_count || 0);
    } catch (error) {
      console.error('Error fetching usage:', error);
    }
  };

  const handleCheckout = async (priceId: string) => {
    setProcessingCheckout(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: t('error'),
        description: t('billing.checkoutError'),
        variant: 'destructive',
      });
    } finally {
      setProcessingCheckout(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening portal:', error);
      toast({
        title: t('error'),
        description: t('billing.portalError'),
        variant: 'destructive',
      });
    }
  };

  const handleExportData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('export-data', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `postmind-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: t('billing.exportSuccess'),
        description: t('billing.exportSuccessDesc'),
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: t('error'),
        description: t('billing.exportError'),
        variant: 'destructive',
      });
    }
  };

  const handleDeleteData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('delete-data', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      toast({
        title: t('billing.deleteSuccess'),
        description: t('billing.deleteSuccessDesc'),
      });

      // Sign out user
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error deleting data:', error);
      toast({
        title: t('error'),
        description: t('billing.deleteError'),
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <p>{t('loading')}</p>
        </div>
      </div>
    );
  }

  const usagePercentage = (filesUploaded / PLANS[currentPlan].limit) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">{t('billing.title')}</h1>
      <p className="text-muted-foreground mb-8">{t('billing.description')}</p>

      {/* Current Plan & Usage */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t('billing.currentPlan')}</CardTitle>
          <CardDescription>{t('billing.currentPlanDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{PLANS[currentPlan].name}</p>
              {subscriptionEnd && (
                <p className="text-sm text-muted-foreground">
                  {t('billing.renewsOn')} {new Date(subscriptionEnd).toLocaleDateString()}
                </p>
              )}
            </div>
            {currentPlan !== 'trial' && (
              <Button variant="outline" onClick={handleManageSubscription}>
                <CreditCard className="mr-2 h-4 w-4" />
                {t('billing.manageSubscription')}
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t('billing.filesUsed')}</span>
              <span className="font-medium">
                {filesUploaded} / {PLANS[currentPlan].limit}
              </span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <h2 className="text-2xl font-bold mb-4">{t('billing.availablePlans')}</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {Object.entries(PLANS).filter(([key]) => key !== 'trial').map(([key, plan]) => (
          <Card key={key} className={currentPlan === key ? 'border-primary border-2' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                {currentPlan === key && <Badge>{t('billing.current')}</Badge>}
              </div>
              <CardDescription>
                <span className="text-3xl font-bold">€{plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  {plan.limit} {t('billing.filesPerMonth')}
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  {t('billing.aiExtraction')}
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  {t('billing.encryption')}
                </li>
                {key !== 'starter' && (
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    {t('billing.prioritySupport')}
                  </li>
                )}
              </ul>
              {currentPlan === key ? (
                <Button className="w-full" disabled>
                  {t('billing.currentPlan')}
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => handleCheckout(plan.priceId!)}
                  disabled={processingCheckout}
                >
                  {processingCheckout ? t('loading') : t('billing.selectPlan')}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* GDPR Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t('billing.gdprTitle')}</CardTitle>
          <CardDescription>{t('billing.gdprDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t('billing.exportData')}</p>
              <p className="text-sm text-muted-foreground">{t('billing.exportDataDesc')}</p>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              {t('billing.export')}
            </Button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <p className="font-medium text-destructive">{t('billing.deleteData')}</p>
              <p className="text-sm text-muted-foreground">{t('billing.deleteDataDesc')}</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('billing.delete')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('billing.deleteConfirmTitle')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('billing.deleteConfirmDesc')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteData} className="bg-destructive">
                    {t('billing.deleteConfirm')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
