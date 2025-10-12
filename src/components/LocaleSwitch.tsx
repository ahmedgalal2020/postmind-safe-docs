import { useLocale } from '@/hooks/useLocale';
import { Button } from '@/components/ui/button';

export const LocaleSwitch = () => {
  const { locale, switchLocale } = useLocale();

  return (
    <div className="flex gap-2">
      <Button
        variant={locale === 'de' ? 'default' : 'outline'}
        size="sm"
        onClick={() => switchLocale('de')}
      >
        🇩🇪 DE
      </Button>
      <Button
        variant={locale === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => switchLocale('en')}
      >
        🇬🇧 EN
      </Button>
    </div>
  );
};
