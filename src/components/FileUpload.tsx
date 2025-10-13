import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { encryptFile, getOrCreateKey } from '@/lib/encryption';

interface FileUploadProps {
  onUploadComplete: () => void;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'encrypting' | 'uploading' | 'complete' | 'error';
  error?: string;
}

export function FileUpload({ onUploadComplete }: FileUploadProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;

    // Initialize uploading state
    const newFiles = files.map(file => ({
      file,
      progress: 0,
      status: 'encrypting' as const,
    }));
    setUploadingFiles(newFiles);

    try {
      // Get user session
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create batch
      const batchName = `Upload ${new Date().toLocaleString()}`;
      const { data: batch, error: batchError } = await supabase
        .from('batches')
        .insert({
          user_id: user.id,
          name: batchName,
          files_count: files.length,
        })
        .select()
        .single();

      if (batchError) throw batchError;

      // Get encryption key
      const encryptionKey = await getOrCreateKey();

      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        try {
          // Update status: encrypting
          setUploadingFiles(prev => 
            prev.map((f, idx) => 
              idx === i ? { ...f, status: 'encrypting', progress: 10 } : f
            )
          );

          // Encrypt file
          const encrypted = await encryptFile(file, encryptionKey);
          
          // Update status: uploading
          setUploadingFiles(prev => 
            prev.map((f, idx) => 
              idx === i ? { ...f, status: 'uploading', progress: 30 } : f
            )
          );

          // Create blob with ciphertext + IV prepended
          const ivAndCiphertext = new Uint8Array(encrypted.iv.length + encrypted.ciphertext.byteLength);
          ivAndCiphertext.set(encrypted.iv, 0);
          ivAndCiphertext.set(new Uint8Array(encrypted.ciphertext), encrypted.iv.length);
          const blob = new Blob([ivAndCiphertext]);

          // Upload to storage
          const filePath = `${user.id}/${batch.id}/${crypto.randomUUID()}.bin`;
          const { error: uploadError } = await supabase.storage
            .from('letters')
            .upload(filePath, blob);

          if (uploadError) throw uploadError;

          setUploadingFiles(prev => 
            prev.map((f, idx) => 
              idx === i ? { ...f, progress: 70 } : f
            )
          );

          // Save letter metadata
          const { error: letterError } = await supabase
            .from('letters')
            .insert({
              user_id: user.id,
              batch_id: batch.id,
              filename: file.name,
              file_url: filePath,
              file_size: file.size,
              status: 'uploaded',
            });

          if (letterError) throw letterError;

          // Update status: complete
          setUploadingFiles(prev => 
            prev.map((f, idx) => 
              idx === i ? { ...f, status: 'complete', progress: 100 } : f
            )
          );
        } catch (fileError) {
          console.error('File upload error:', fileError);
          setUploadingFiles(prev => 
            prev.map((f, idx) => 
              idx === i ? { 
                ...f, 
                status: 'error', 
                error: fileError instanceof Error ? fileError.message : 'Upload failed' 
              } : f
            )
          );
        }
      }

      // Update usage counter
      const periodMonth = new Date().toISOString().slice(0, 7);
      
      // Try to get existing counter
      const { data: existingCounter } = await supabase
        .from('usage_counters')
        .select('uploaded_count')
        .eq('user_id', user.id)
        .eq('period_month', periodMonth)
        .single();

      if (existingCounter) {
        // Update existing
        await supabase
          .from('usage_counters')
          .update({ uploaded_count: existingCounter.uploaded_count + files.length })
          .eq('user_id', user.id)
          .eq('period_month', periodMonth);
      } else {
        // Insert new
        await supabase
          .from('usage_counters')
          .insert({
            user_id: user.id,
            period_month: periodMonth,
            uploaded_count: files.length,
          });
      }

      toast({
        title: t('uploadComplete'),
        description: t('uploadCompleteDesc', { count: files.length }),
      });

      onUploadComplete();

      // Clear after delay
      setTimeout(() => {
        setUploadingFiles([]);
      }, 2000);

    } catch (error) {
      console.error('Batch upload error:', error);
      toast({
        title: t('uploadError'),
        description: error instanceof Error ? error.message : t('uploadErrorDesc'),
        variant: 'destructive',
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setUploadingFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border'
        }`}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-2">{t('dragDropFiles')}</p>
        <p className="text-sm text-muted-foreground mb-4">{t('orClickToSelect')}</p>
        <input
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <Button asChild>
          <label htmlFor="file-upload" className="cursor-pointer">
            {t('selectFiles')}
          </label>
        </Button>
      </div>

      {/* Uploading Files List */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((uploadFile, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">{uploadFile.file.name}</span>
                  {uploadFile.status === 'encrypting' && <Loader2 className="h-3 w-3 animate-spin" />}
                  {uploadFile.status === 'uploading' && <Loader2 className="h-3 w-3 animate-spin" />}
                </div>
                {uploadFile.status !== 'complete' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {uploadFile.status !== 'error' ? (
                <div className="space-y-1">
                  <Progress value={uploadFile.progress} />
                  <p className="text-xs text-muted-foreground">
                    {uploadFile.status === 'encrypting' && t('encrypting')}
                    {uploadFile.status === 'uploading' && t('uploading')}
                    {uploadFile.status === 'complete' && t('uploadComplete')}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-destructive">{uploadFile.error}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
