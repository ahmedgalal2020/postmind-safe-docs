import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Terms() {
  const { t, i18n } = useTranslation();
  const isDE = i18n.language === 'de';

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">
        {isDE ? 'Allgemeine Geschäftsbedingungen (AGB)' : 'Terms of Service'}
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {isDE ? '1. Geltungsbereich' : '1. Scope of Application'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {isDE
              ? 'Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen PostMind AI GmbH (im Folgenden "Anbieter") und Unternehmen (im Folgenden "Kunde") über die Nutzung der PostMind AI SaaS-Plattform.'
              : 'These General Terms and Conditions apply to all contracts between PostMind AI GmbH (hereinafter "Provider") and companies (hereinafter "Customer") for the use of the PostMind AI SaaS platform.'
            }
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {isDE ? '2. Vertragsgegenstand' : '2. Subject Matter'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {isDE
              ? 'Der Anbieter stellt dem Kunden eine cloudbasierte Plattform zur Verfügung, mit der Dokumente verschlüsselt hochgeladen, verwaltet und mittels KI analysiert werden können.'
              : 'The Provider makes available to the Customer a cloud-based platform with which documents can be uploaded, managed, and analyzed using AI in an encrypted manner.'
            }
          </p>
          <p className="text-muted-foreground">
            {isDE
              ? 'Die Leistungen umfassen:'
              : 'The services include:'
            }
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{isDE ? 'End-to-End verschlüsselten Dokumenten-Upload' : 'End-to-end encrypted document upload'}</li>
            <li>{isDE ? 'KI-gestützte Dokumentenanalyse' : 'AI-powered document analysis'}</li>
            <li>{isDE ? 'Automatische Priorisierung und Fristenerkennung' : 'Automatic prioritization and deadline detection'}</li>
            <li>{isDE ? 'Kalenderintegration' : 'Calendar integration'}</li>
            <li>{isDE ? 'DSGVO-konforme Datenverarbeitung' : 'GDPR-compliant data processing'}</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {isDE ? '3. Vertragsschluss und Laufzeit' : '3. Contract Formation and Duration'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">
              {isDE ? '3.1 Testphase' : '3.1 Trial Period'}
            </h3>
            <p className="text-muted-foreground">
              {isDE
                ? 'Neukunden erhalten eine 14-tägige kostenlose Testphase ohne Angabe von Zahlungsinformationen.'
                : 'New customers receive a 14-day free trial period without providing payment information.'
              }
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">
              {isDE ? '3.2 Bezahlte Pläne' : '3.2 Paid Plans'}
            </h3>
            <p className="text-muted-foreground">
              {isDE
                ? 'Nach der Testphase kann der Kunde einen kostenpflichtigen Plan wählen. Die Verträge werden monatlich geschlossen und verlängern sich automatisch um jeweils einen Monat, sofern nicht gekündigt wird.'
                : 'After the trial period, the customer can choose a paid plan. Contracts are concluded monthly and automatically renew for one month each time unless terminated.'
              }
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">
              {isDE ? '3.3 Kündigung' : '3.3 Termination'}
            </h3>
            <p className="text-muted-foreground">
              {isDE
                ? 'Beide Parteien können den Vertrag jederzeit zum Ende des laufenden Abrechnungszeitraums kündigen. Die Kündigung erfolgt über das Stripe-Kundenportal.'
                : 'Both parties can terminate the contract at any time at the end of the current billing period. Termination is done via the Stripe customer portal.'
              }
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {isDE ? '4. Preise und Zahlung' : '4. Prices and Payment'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-muted-foreground mb-2">
              {isDE ? 'Aktuelle Preise:' : 'Current prices:'}
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Starter: €19/Monat (100 {isDE ? 'Dateien' : 'files'})</li>
              <li>Pro: €49/Monat (300 {isDE ? 'Dateien' : 'files'})</li>
              <li>Business: €99/Monat (650 {isDE ? 'Dateien' : 'files'})</li>
            </ul>
          </div>

          <p className="text-muted-foreground">
            {isDE
              ? 'Alle Preise verstehen sich zzgl. der gesetzlichen Mehrwertsteuer. Die Abrechnung erfolgt monatlich im Voraus über Stripe.'
              : 'All prices are subject to statutory VAT. Billing is monthly in advance via Stripe.'
            }
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {isDE ? '5. Datenschutz und Sicherheit' : '5. Data Protection and Security'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {isDE
              ? 'Der Anbieter gewährleistet:'
              : 'The Provider guarantees:'
            }
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{isDE ? 'Ausschließliche Datenverarbeitung und -speicherung in der EU (Frankfurt)' : 'Exclusive data processing and storage in the EU (Frankfurt)'}</li>
            <li>{isDE ? 'Client-seitige End-to-End Verschlüsselung (AES-256-GCM)' : 'Client-side end-to-end encryption (AES-256-GCM)'}</li>
            <li>{isDE ? 'DSGVO-konforme Verarbeitung' : 'GDPR-compliant processing'}</li>
            <li>{isDE ? 'Kein Zugriff auf unverschlüsselte Kundeninhalte' : 'No access to unencrypted customer content'}</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {isDE ? '6. Haftung' : '6. Liability'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {isDE
              ? 'Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit. Für leichte Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten. Die Haftung ist in diesem Fall auf den vertragstypischen, vorhersehbaren Schaden begrenzt.'
              : 'The Provider is liable without limitation for intent and gross negligence. For slight negligence, the Provider is only liable for breach of essential contractual obligations. In this case, liability is limited to the typically foreseeable damage.'
            }
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {isDE ? '7. Schlussbestimmungen' : '7. Final Provisions'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {isDE
              ? 'Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist Frankfurt am Main.'
              : 'The law of the Federal Republic of Germany applies. The place of jurisdiction is Frankfurt am Main.'
            }
          </p>
          <p className="text-muted-foreground">
            {isDE
              ? 'Stand: Januar 2025'
              : 'Version: January 2025'
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
