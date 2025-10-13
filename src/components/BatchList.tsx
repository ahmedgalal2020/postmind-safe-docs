import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Package, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Batch {
  id: string;
  name: string;
  files_count: number;
  created_at: string;
  zip_url: string | null;
}

interface BatchListProps {
  refreshTrigger: number;
}

export function BatchList({ refreshTrigger }: BatchListProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBatches();
  }, [refreshTrigger]);

  const fetchBatches = async () => {
    try {
      const { data, error } = await supabase
        .from('batches')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBatches(data || []);
    } catch (error) {
      console.error('Error fetching batches:', error);
      toast({
        title: t('errorLoadingBatches'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadZip = async (batchId: string) => {
    try {
      toast({
        title: t('preparingDownload'),
        description: t('pleaseWait'),
      });

      // Call edge function to generate ZIP
      const { data, error } = await supabase.functions.invoke('generate-batch-zip', {
        body: { batchId },
      });

      if (error) throw error;

      if (data.zipUrl) {
        // Download the ZIP
        window.open(data.zipUrl, '_blank');
        toast({
          title: t('downloadReady'),
        });
      }
    } catch (error) {
      console.error('Error downloading ZIP:', error);
      toast({
        title: t('downloadError'),
        description: error instanceof Error ? error.message : t('downloadErrorDesc'),
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t('loading')}</p>
      </div>
    );
  }

  if (batches.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">{t('noBatches')}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {batches.map((batch) => (
        <Card key={batch.id} className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">{batch.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(batch.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{batch.files_count}</p>
                <p className="text-xs text-muted-foreground">{t('files')}</p>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadZip(batch.id)}
              >
                <Download className="h-4 w-4 mr-2" />
                {t('downloadZip')}
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
