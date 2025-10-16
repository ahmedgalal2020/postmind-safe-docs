import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useLocale } from '@/hooks/useLocale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const EU_COUNTRIES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
  'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO'
];

const Signup = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    companyName: '',
    vatId: '',
    street: '',
    zip: '',
    city: '',
    country: 'DE',
    businessEmail: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.companyName) newErrors.companyName = t('requiredField');
    if (!formData.street) newErrors.street = t('requiredField');
    if (!formData.zip) newErrors.zip = t('requiredField');
    if (!formData.city) newErrors.city = t('requiredField');
    if (!formData.country) newErrors.country = t('requiredField');
    if (!formData.businessEmail) newErrors.businessEmail = t('requiredField');
    if (!formData.password) newErrors.password = t('requiredField');
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('passwordMismatch');
    }
    if (!formData.acceptTerms) newErrors.acceptTerms = t('mustAcceptTerms');
    
    // EU country validation
    if (!EU_COUNTRIES.includes(formData.country)) {
      newErrors.country = t('nonEuCountry');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.businessEmail,
        password: formData.password,
      });
      
      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error('User creation failed');
      }
      
      // Calculate trial dates
      const trialStarted = new Date();
      const trialExpires = new Date();
      trialExpires.setDate(trialExpires.getDate() + 3);
      
      // Create company profile
      const { error: profileError } = await supabase
        .from('users_app')
        .insert({
          id: authData.user.id,
          company_name: formData.companyName,
          vat_id: formData.vatId || null,
          address_street: formData.street,
          address_zip: formData.zip,
          city: formData.city,
          country: formData.country,
          business_email: formData.businessEmail,
          language: locale,
          plan: 'trial',
          trial_started_at: trialStarted.toISOString(),
          trial_expires_at: trialExpires.toISOString()
        });
      
      if (profileError) throw profileError;
      
      toast({
        title: locale === 'de' ? 'Erfolgreich registriert!' : 'Successfully registered!',
        description: locale === 'de' 
          ? 'Ihr Konto wurde erstellt. Sie werden weitergeleitet...' 
          : 'Your account has been created. Redirecting...',
      });
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate(`/${locale}/dashboard`);
      }, 1000);
      
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
    <div className="flex items-center justify-center py-12 bg-muted/30 min-h-[calc(100vh-theme(spacing.32))]">
        <div className="container max-w-2xl mx-auto px-4">
          <div className="bg-card rounded-lg border p-8 shadow-sm">
            <h1 className="text-3xl font-bold mb-6 text-center">{t('signup')}</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="companyName">{t('companyName')} *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className={errors.companyName ? 'border-destructive' : ''}
                />
                {errors.companyName && <p className="text-sm text-destructive mt-1">{errors.companyName}</p>}
              </div>
              
              <div>
                <Label htmlFor="vatId">{t('vatId')}</Label>
                <Input
                  id="vatId"
                  value={formData.vatId}
                  onChange={(e) => setFormData({ ...formData, vatId: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="street">{t('street')} *</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className={errors.street ? 'border-destructive' : ''}
                  />
                  {errors.street && <p className="text-sm text-destructive mt-1">{errors.street}</p>}
                </div>
                
                <div>
                  <Label htmlFor="zip">{t('zip')} *</Label>
                  <Input
                    id="zip"
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className={errors.zip ? 'border-destructive' : ''}
                  />
                  {errors.zip && <p className="text-sm text-destructive mt-1">{errors.zip}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">{t('city')} *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={errors.city ? 'border-destructive' : ''}
                  />
                  {errors.city && <p className="text-sm text-destructive mt-1">{errors.city}</p>}
                </div>
                
                <div>
                  <Label htmlFor="country">{t('country')} *</Label>
                  <select
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {EU_COUNTRIES.map(code => (
                      <option key={code} value={code}>{code}</option>
                    ))}
                  </select>
                  {errors.country && <p className="text-sm text-destructive mt-1">{errors.country}</p>}
                </div>
              </div>
              
              <div>
                <Label htmlFor="businessEmail">{t('businessEmail')} *</Label>
                <Input
                  id="businessEmail"
                  type="email"
                  value={formData.businessEmail}
                  onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                  className={errors.businessEmail ? 'border-destructive' : ''}
                />
                {errors.businessEmail && <p className="text-sm text-destructive mt-1">{errors.businessEmail}</p>}
              </div>
              
              <div>
                <Label htmlFor="password">{t('password')} *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={errors.password ? 'border-destructive' : ''}
                />
                {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">{t('confirmPassword')} *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={errors.confirmPassword ? 'border-destructive' : ''}
                />
                {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>}
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, acceptTerms: checked as boolean })
                  }
                />
                <Label htmlFor="acceptTerms" className="text-sm font-normal cursor-pointer">
                  {t('acceptTerms')}
                </Label>
              </div>
              {errors.acceptTerms && <p className="text-sm text-destructive">{errors.acceptTerms}</p>}
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (locale === 'de' ? 'Wird erstellt...' : 'Creating...') : t('createAccount')}
              </Button>
              
              <p className="text-center text-sm text-muted-foreground">
                {t('alreadyHaveAccount')}{' '}
                <Link to={`/${locale}/auth/login`} className="text-primary hover:underline">
                  {t('login')}
                </Link>
              </p>
            </form>
          </div>
        </div>
    </div>
  );
};

export default Signup;
