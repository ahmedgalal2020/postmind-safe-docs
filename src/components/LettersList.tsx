import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Calendar } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Letter {
  id: string;
  filename: string;
  file_size: number;
  status: string;
  created_at: string;
}

interface LettersListProps {
  refreshTrigger: number;
}

export function LettersList({ refreshTrigger }: LettersListProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLetters();
  }, [refreshTrigger]);

  const fetchLetters = async () => {
    try {
      const { data, error } = await supabase
        .from('letters')
        .select('id, filename, file_size, status, created_at')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLetters(data || []);
    } catch (error) {
      console.error('Error fetching letters:', error);
      toast({
        title: t('errorLoadingLetters'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t('loading')}</p>
      </div>
    );
  }

  if (letters.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">{t('noLetters')}</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('filename')}</TableHead>
            <TableHead>{t('size')}</TableHead>
            <TableHead>{t('status')}</TableHead>
            <TableHead>{t('uploadedAt')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {letters.map((letter) => (
            <TableRow key={letter.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  {letter.filename}
                </div>
              </TableCell>
              <TableCell>{formatFileSize(letter.file_size)}</TableCell>
              <TableCell>
                <Badge variant="secondary">{letter.status}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(letter.created_at).toLocaleDateString()}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
