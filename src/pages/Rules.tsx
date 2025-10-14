import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Trash2, Plus, RefreshCw } from 'lucide-react';
import { recomputeLetterPriority } from '@/lib/priorityEngine';

interface Rule {
  id: string;
  keyword: string;
  weight_int: number;
  severity_int: number;
  tag: string;
}

export default function Rules() {
  const { t } = useTranslation();
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [recomputing, setRecomputing] = useState(false);
  const [newRule, setNewRule] = useState({
    keyword: '',
    weight_int: 0,
    severity_int: 0,
    tag: '',
  });

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      const { data, error } = await supabase
        .from('rules')
        .select('*')
        .order('weight_int', { ascending: false });

      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      console.error('Error loading rules:', error);
      toast.error(t('errorLoadingRules'));
    } finally {
      setLoading(false);
    }
  };

  const addRule = async () => {
    if (!newRule.keyword.trim()) {
      toast.error(t('keywordRequired'));
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('rules').insert({
        ...newRule,
        user_id: user.id,
      });

      if (error) throw error;

      toast.success(t('ruleAdded'));
      setNewRule({ keyword: '', weight_int: 0, severity_int: 0, tag: '' });
      loadRules();
    } catch (error) {
      console.error('Error adding rule:', error);
      toast.error(t('errorAddingRule'));
    }
  };

  const deleteRule = async (id: string) => {
    try {
      const { error } = await supabase.from('rules').delete().eq('id', id);
      if (error) throw error;

      toast.success(t('ruleDeleted'));
      loadRules();
    } catch (error) {
      console.error('Error deleting rule:', error);
      toast.error(t('errorDeletingRule'));
    }
  };

  const recomputePriorities = async () => {
    setRecomputing(true);
    try {
      const { data: letters, error } = await supabase
        .from('letters')
        .select('id')
        .eq('status', 'processed');

      if (error) throw error;

      let successCount = 0;
      for (const letter of letters || []) {
        try {
          await recomputeLetterPriority(letter.id);
          successCount++;
        } catch (err) {
          console.error(`Error recomputing priority for ${letter.id}:`, err);
        }
      }

      toast.success(t('prioritiesRecomputed', { count: successCount }));
    } catch (error) {
      console.error('Error recomputing priorities:', error);
      toast.error(t('errorRecomputingPriorities'));
    } finally {
      setRecomputing(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-8">{t('loading')}</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t('rules')}</h1>
          <p className="text-muted-foreground">{t('rulesDescription')}</p>
        </div>
        <Button onClick={recomputePriorities} disabled={recomputing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${recomputing ? 'animate-spin' : ''}`} />
          {t('recomputePriorities')}
        </Button>
      </div>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{t('addNewRule')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Input
            placeholder={t('keyword')}
            value={newRule.keyword}
            onChange={(e) => setNewRule({ ...newRule, keyword: e.target.value })}
          />
          <Input
            type="number"
            placeholder={t('weight')}
            value={newRule.weight_int}
            onChange={(e) => setNewRule({ ...newRule, weight_int: parseInt(e.target.value) || 0 })}
          />
          <Input
            type="number"
            placeholder={t('severity')}
            value={newRule.severity_int}
            onChange={(e) => setNewRule({ ...newRule, severity_int: parseInt(e.target.value) || 0 })}
          />
          <Input
            placeholder={t('tag')}
            value={newRule.tag}
            onChange={(e) => setNewRule({ ...newRule, tag: e.target.value })}
          />
          <Button onClick={addRule}>
            <Plus className="mr-2 h-4 w-4" />
            {t('add')}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('keyword')}</TableHead>
              <TableHead>{t('weight')}</TableHead>
              <TableHead>{t('severity')}</TableHead>
              <TableHead>{t('tag')}</TableHead>
              <TableHead className="w-[100px]">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className="font-medium">{rule.keyword}</TableCell>
                <TableCell>{rule.weight_int}</TableCell>
                <TableCell>{rule.severity_int}</TableCell>
                <TableCell>{rule.tag || '-'}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteRule(rule.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {rules.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  {t('noRules')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
