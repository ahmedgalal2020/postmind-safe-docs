import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLocale } from '@/hooks/useLocale';
import { decryptFile, getOrCreateKey } from '@/lib/encryption';
import { extractTextLocal } from '@/lib/ocr';
import { extractLocal, extractWithAI, ExtractionResult } from '@/lib/aiExtraction';
import { computePriority } from '@/lib/priorityEngine';
import { FileText, Loader2, Save, RefreshCw, Zap, Calendar as CalendarIcon } from 'lucide-react';
import { addDays, setHours, setMinutes, parseISO } from 'date-fns';

const LetterDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { locale } = useLocale();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [letter, setLetter] = useState<any>(null);
  const [decryptedBlob, setDecryptedBlob] = useState<Blob | null>(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null);
  const [aiMode, setAiMode] = useState<'local' | 'ai'>('local');
  const [aiConsent, setAiConsent] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchLetterAndSettings();
  }, [id]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate(`/${locale}/auth/login`);
    }
  };

  const fetchLetterAndSettings = async () => {
    if (!id) return;

    try {
      // Fetch letter
      const { data: letterData, error: letterError } = await supabase
        .from('letters')
        .select('*')
        .eq('id', id)
        .single();

      if (letterError) throw letterError;
      setLetter(letterData);

      // Fetch user settings
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: settings } = await supabase
          .from('users_app')
          .select('ai_mode, ai_consent')
          .eq('id', user.id)
          .single();

        if (settings) {
          setAiMode((settings.ai_mode as 'local' | 'ai') || 'local');
          setAiConsent(settings.ai_consent || false);
        }
      }

      // Decrypt file if exists
      if (letterData.file_url) {
        await decryptAndPreview(letterData.file_url);
      }

      // Load existing extraction if available
      if (letterData.summary_enc) {
        // Decrypt and parse existing data
        const key = await getOrCreateKey();
        // For now, assume data is not encrypted yet
        // In production, you'd decrypt here
      }
    } catch (error) {
      console.error('Error fetching letter:', error);
      toast({
        title: t('errorLoadingLetter'),
        variant: 'destructive',
      });
    }
  };

  const decryptAndPreview = async (fileUrl: string) => {
    try {
      // Download encrypted file
      const { data, error } = await supabase.storage
        .from('letters')
        .download(fileUrl);

      if (error) throw error;

      // Get encryption key
      const key = await getOrCreateKey();

      // Read IV and ciphertext
      const arrayBuffer = await data.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const iv = bytes.slice(0, 12);
      const ciphertext = bytes.slice(12);

      // Decrypt
      const plaintext = await decryptFile(ciphertext.buffer, iv, key);
      
      // Create blob for preview
      const blob = new Blob([plaintext], { type: 'application/pdf' });
      setDecryptedBlob(blob);
    } catch (error) {
      console.error('Decryption error:', error);
      toast({
        title: t('decryptionError'),
        variant: 'destructive',
      });
    }
  };

  const handleExtract = async () => {
    if (!decryptedBlob) {
      toast({
        title: t('noFileToProcess'),
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setOcrProgress(0);

    try {
      // Step 1: OCR (local)
      toast({
        title: t('runningOCR'),
        description: t('thisWillTakeAMoment'),
      });

      const ocrResult = await extractTextLocal(decryptedBlob, (progress) => {
        setOcrProgress(progress * 100);
      });

      // Step 2: Extract structured data
      let extraction: ExtractionResult;
      
      if (aiMode === 'ai' && aiConsent) {
        toast({
          title: t('extractingWithAI'),
          description: t('usingEULLM'),
        });
        extraction = await extractWithAI(ocrResult.text);
      } else {
        extraction = extractLocal(ocrResult.text);
      }

      setExtractionResult(extraction);

      // Step 3: Compute priority
      const { score, riskLevel } = await computePriority(
        ocrResult.text,
        extraction.sender.type,
        extraction.letter_type,
        extraction.due_date
      );

      // Update extraction with computed priority
      extraction.risk_level = riskLevel;

      toast({
        title: t('extractionComplete'),
        description: t('reviewAndSave'),
      });
    } catch (error) {
      console.error('Extraction error:', error);
      toast({
        title: t('extractionError'),
        description: error instanceof Error ? error.message : t('extractionErrorDesc'),
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const addToCalendar = async () => {
    if (!extractionResult?.due_date) {
      toast({
        title: t('noDueDate'),
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const dueDate = parseISO(extractionResult.due_date);
      
      // Create preparation block 2 days before at 10:00 (45 min default)
      const prepStart = setMinutes(setHours(addDays(dueDate, -2), 10), 0);
      const prepEnd = setMinutes(setHours(addDays(dueDate, -2), 10), 45);

      const { error } = await supabase.from('events').insert({
        user_id: user.id,
        letter_id: id,
        title: t('preparationFor') + ': ' + (extractionResult.subject || letter.filename),
        start_time: prepStart.toISOString(),
        end_time: prepEnd.toISOString(),
        status: 'tentative',
        risk_level: extractionResult.risk_level,
        priority_int: letter.priority_int || 0,
      });

      if (error) throw error;

      toast({
        title: t('addedToCalendar'),
      });
    } catch (error) {
      console.error('Error adding to calendar:', error);
      toast({
        title: t('errorAddingToCalendar'),
        variant: 'destructive',
      });
    }
  };

  const handleSave = async () => {
    if (!extractionResult || !id) return;

    setIsProcessing(true);

    try {
      // Encrypt sensitive fields before saving
      const key = await getOrCreateKey();
      
      // For now, store as plaintext (in production, encrypt)
      // In production: encrypt sender, summary, tags, raw_text

      const { score, riskLevel } = await computePriority(
        '', // Would be OCR text
        extractionResult.sender.type,
        extractionResult.letter_type,
        extractionResult.due_date
      );

      await supabase
        .from('letters')
        .update({
          sender_name: extractionResult.sender.name,
          letter_type: extractionResult.letter_type,
          subject: extractionResult.subject,
          due_date: extractionResult.due_date,
          priority_int: score,
          risk_level: riskLevel,
          summary_enc: JSON.stringify(extractionResult.summary),
          sender_enc: JSON.stringify(extractionResult.sender),
          tags_enc: JSON.stringify(extractionResult.tags),
        })
        .eq('id', id);

      toast({
        title: t('saveSuccess'),
        description: t('letterUpdated'),
      });

      navigate(`/${locale}/dashboard`);
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: t('saveError'),
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!letter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{letter.filename}</h1>
            <p className="text-muted-foreground">{t('letterDetail')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Preview Column */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">{t('preview')}</h2>
              
              {decryptedBlob ? (
                <div className="border rounded-lg overflow-hidden" style={{ height: '600px' }}>
                  <iframe
                    src={URL.createObjectURL(decryptedBlob)}
                    className="w-full h-full"
                    title="Letter preview"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-96 border rounded-lg">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              )}

              <div className="mt-4 space-y-2">
                <Button
                  onClick={handleExtract}
                  disabled={isProcessing || !decryptedBlob}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('processing')}
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      {t('extractData')}
                    </>
                  )}
                </Button>

                {ocrProgress > 0 && ocrProgress < 100 && (
                  <div className="space-y-1">
                    <Progress value={ocrProgress} />
                    <p className="text-xs text-muted-foreground text-center">
                      {t('ocrProgress')}: {Math.round(ocrProgress)}%
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Extraction Results Column */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{t('extractedData')}</h2>
                {extractionResult && (
                  <Badge variant={extractionResult.risk_level === 'high' ? 'destructive' : 'secondary'}>
                    {extractionResult.risk_level}
                  </Badge>
                )}
              </div>

              {extractionResult ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">{t('sender')}</label>
                    <p className="text-sm">{extractionResult.sender.name}</p>
                    <Badge variant="outline" className="mt-1">
                      {extractionResult.sender.type}
                    </Badge>
                  </div>

                  <div>
                    <label className="text-sm font-medium">{t('letterType')}</label>
                    <p className="text-sm">{extractionResult.letter_type}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium">{t('subject')}</label>
                    <Textarea
                      value={extractionResult.subject}
                      onChange={(e) =>
                        setExtractionResult({ ...extractionResult, subject: e.target.value })
                      }
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">{t('summary')}</label>
                    <Textarea
                      value={extractionResult.summary}
                      onChange={(e) =>
                        setExtractionResult({ ...extractionResult, summary: e.target.value })
                      }
                      rows={4}
                    />
                  </div>

                  {extractionResult.due_date && (
                    <div>
                      <label className="text-sm font-medium">{t('dueDate')}</label>
                      <p className="text-sm">{extractionResult.due_date}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium">{t('tags')}</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {extractionResult.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button onClick={handleSave} disabled={isProcessing} className="w-full">
                      <Save className="mr-2 h-4 w-4" />
                      {t('saveChanges')}
                    </Button>
                    {extractionResult.due_date && (
                      <Button onClick={addToCalendar} variant="outline" className="w-full">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {t('addToCalendar')}
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                  <Zap className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">{t('clickExtractToStart')}</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LetterDetail;
