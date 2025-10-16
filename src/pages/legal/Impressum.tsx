import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Impressum() {
  const { t, i18n } = useTranslation();
  const isDE = i18n.language === 'de';

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">
        {isDE ? 'Impressum' : 'Legal Notice'}
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{isDE ? 'Angaben gemäß § 5 TMG' : 'Information pursuant to § 5 TMG'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-semibold">PostMind AI GmbH</p>
            <p>Musterstraße 123</p>
            <p>60311 Frankfurt am Main</p>
            <p>{isDE ? 'Deutschland' : 'Germany'}</p>
          </div>

          <div>
            <p><strong>{isDE ? 'Handelsregister' : 'Commercial Register'}:</strong> HRB 12345</p>
            <p><strong>{isDE ? 'Registergericht' : 'Register Court'}:</strong> {isDE ? 'Amtsgericht Frankfurt am Main' : 'Local Court Frankfurt am Main'}</p>
          </div>

          <div>
            <p><strong>{isDE ? 'Vertreten durch' : 'Represented by'}:</strong></p>
            <p>Max Mustermann ({isDE ? 'Geschäftsführer' : 'Managing Director'})</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{isDE ? 'Kontakt' : 'Contact'}</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>{isDE ? 'Telefon' : 'Phone'}:</strong> +49 (0) 69 1234 5678</p>
          <p><strong>E-Mail:</strong> info@postmind.ai</p>
          <p><strong>{isDE ? 'Website' : 'Website'}:</strong> www.postmind.ai</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{isDE ? 'Umsatzsteuer-ID' : 'VAT ID'}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {isDE 
              ? 'Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:'
              : 'VAT identification number according to §27 a German VAT Act:'
            }
          </p>
          <p className="font-mono">DE123456789</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {isDE 
              ? 'Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV'
              : 'Responsible for content according to § 55 Abs. 2 RStV'
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Max Mustermann</p>
          <p>Musterstraße 123</p>
          <p>60311 Frankfurt am Main</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {isDE ? 'Haftungsausschluss' : 'Liability Disclaimer'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">
              {isDE ? 'Haftung für Inhalte' : 'Liability for Content'}
            </h3>
            <p className="text-muted-foreground">
              {isDE
                ? 'Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.'
                : 'As a service provider, we are responsible for our own content on these pages in accordance with general legislation pursuant to Section 7 (1) of the German Telemedia Act (TMG). However, according to Sections 8 to 10 TMG, we are not obligated to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.'
              }
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">
              {isDE ? 'Haftung für Links' : 'Liability for Links'}
            </h3>
            <p className="text-muted-foreground">
              {isDE
                ? 'Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.'
                : 'Our website contains links to external third-party websites over whose content we have no influence. Therefore, we cannot assume any liability for this third-party content. The respective provider or operator of the pages is always responsible for the content of the linked pages.'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
