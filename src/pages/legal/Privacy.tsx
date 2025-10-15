import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Privacy() {
  const { t, i18n } = useTranslation();
  const isDE = i18n.language === 'de';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">
        {isDE ? 'Datenschutzerklärung' : 'Privacy Policy'}
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {isDE ? '1. Datenschutz auf einen Blick' : '1. Data Protection at a Glance'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">
              {isDE ? 'Allgemeine Hinweise' : 'General Information'}
            </h3>
            <p className="text-muted-foreground">
              {isDE
                ? 'Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.'
                : 'The following notes provide a simple overview of what happens to your personal data when you visit this website. Personal data is any data that can be used to personally identify you.'
              }
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">
              {isDE ? 'Datenerfassung auf dieser Website' : 'Data Collection on this Website'}
            </h3>
            <p className="text-muted-foreground">
              {isDE
                ? 'Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.'
                : 'Data processing on this website is carried out by the website operator. You can find the operator\'s contact details in the legal notice of this website.'
              }
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {isDE ? '2. EU-Datenhoheit' : '2. EU Data Residency'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {isDE
              ? 'Alle Ihre Daten werden ausschließlich in der EU verarbeitet und gespeichert. Unsere Server befinden sich in Frankfurt am Main, Deutschland. Es erfolgt keine Datenübermittlung außerhalb der Europäischen Union.'
              : 'All your data is processed and stored exclusively in the EU. Our servers are located in Frankfurt am Main, Germany. There is no data transmission outside the European Union.'
            }
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {isDE ? '3. End-to-End Verschlüsselung' : '3. End-to-End Encryption'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {isDE
              ? 'Wir setzen modernste Verschlüsselungstechnologie ein, um Ihre Dokumente zu schützen:'
              : 'We use state-of-the-art encryption technology to protect your documents:'
            }
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{isDE ? 'Client-seitige AES-256-GCM Verschlüsselung' : 'Client-side AES-256-GCM encryption'}</li>
            <li>{isDE ? 'Verschlüsselung erfolgt in Ihrem Browser, bevor Daten übertragen werden' : 'Encryption takes place in your browser before data is transmitted'}</li>
            <li>{isDE ? 'Wir haben keinen Zugriff auf unverschlüsselte Inhalte' : 'We have no access to unencrypted content'}</li>
            <li>{isDE ? 'Sichere Schlüsselverwaltung' : 'Secure key management'}</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {isDE ? '4. Welche Daten erfassen wir?' : '4. What Data Do We Collect?'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">
              {isDE ? 'Account-Daten' : 'Account Data'}
            </h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>{isDE ? 'Firmenname' : 'Company name'}</li>
              <li>{isDE ? 'Geschäftliche E-Mail-Adresse' : 'Business email address'}</li>
              <li>{isDE ? 'Firmenadresse' : 'Company address'}</li>
              <li>{isDE ? 'USt-IdNr. (optional)' : 'VAT ID (optional)'}</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">
              {isDE ? 'Nutzungsdaten' : 'Usage Data'}
            </h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>{isDE ? 'Anzahl hochgeladener Dokumente' : 'Number of uploaded documents'}</li>
              <li>{isDE ? 'Metadaten (Dateinamen, Upload-Zeitpunkt)' : 'Metadata (filenames, upload time)'}</li>
              <li>{isDE ? 'Nutzungsstatistiken für Abrechnungszwecke' : 'Usage statistics for billing purposes'}</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {isDE ? '5. Ihre Rechte' : '5. Your Rights'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {isDE
              ? 'Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:'
              : 'You have the following rights regarding your personal data:'
            }
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>{isDE ? 'Auskunftsrecht' : 'Right of access'}:</strong> {isDE ? 'Sie können Auskunft über Ihre gespeicherten Daten verlangen' : 'You can request information about your stored data'}</li>
            <li><strong>{isDE ? 'Recht auf Berichtigung' : 'Right to rectification'}:</strong> {isDE ? 'Sie können die Korrektur unrichtiger Daten verlangen' : 'You can request the correction of incorrect data'}</li>
            <li><strong>{isDE ? 'Recht auf Löschung' : 'Right to erasure'}:</strong> {isDE ? 'Sie können die Löschung Ihrer Daten verlangen' : 'You can request the deletion of your data'}</li>
            <li><strong>{isDE ? 'Recht auf Datenübertragbarkeit' : 'Right to data portability'}:</strong> {isDE ? 'Sie können Ihre Daten in einem strukturierten Format erhalten' : 'You can receive your data in a structured format'}</li>
            <li><strong>{isDE ? 'Widerspruchsrecht' : 'Right to object'}:</strong> {isDE ? 'Sie können der Verarbeitung Ihrer Daten widersprechen' : 'You can object to the processing of your data'}</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {isDE ? '6. Kontakt' : '6. Contact'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {isDE
              ? 'Bei Fragen zum Datenschutz können Sie uns jederzeit kontaktieren:'
              : 'If you have any questions about data protection, you can contact us at any time:'
            }
          </p>
          <p className="mt-2">
            <strong>E-Mail:</strong> datenschutz@postmind.ai
          </p>
          <p><strong>{isDE ? 'Telefon' : 'Phone'}:</strong> +49 (0) 69 1234 5678</p>
        </CardContent>
      </Card>
    </div>
  );
}
