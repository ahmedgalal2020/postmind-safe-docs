import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AVV() {
  const { t, i18n } = useTranslation();
  const isDE = i18n.language === 'de';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">
        {isDE ? 'Auftragsverarbeitungsvertrag (AVV)' : 'Data Processing Agreement (DPA)'}
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {isDE ? 'Präambel' : 'Preamble'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {isDE
              ? 'Dieser Auftragsverarbeitungsvertrag (AVV) regelt die Verarbeitung personenbezogener Daten im Rahmen der Nutzung der PostMind AI Plattform gemäß Art. 28 DSGVO.'
              : 'This Data Processing Agreement (DPA) regulates the processing of personal data in the context of using the PostMind AI platform in accordance with Art. 28 GDPR.'
            }
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {isDE ? '1. Vertragsparteien' : '1. Contracting Parties'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">
              {isDE ? 'Auftraggeber (Verantwortlicher)' : 'Controller'}
            </h3>
            <p className="text-muted-foreground">
              {isDE
                ? 'Das Unternehmen, das sich für die Nutzung von PostMind AI registriert.'
                : 'The company that registers to use PostMind AI.'
              }
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">
              {isDE ? 'Auftragnehmer (Auftragsverarbeiter)' : 'Processor'}
            </h3>
            <p className="text-muted-foreground">PostMind AI GmbH</p>
            <p className="text-muted-foreground">Musterstraße 123</p>
            <p className="text-muted-foreground">60311 Frankfurt am Main</p>
            <p className="text-muted-foreground">{isDE ? 'Deutschland' : 'Germany'}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {isDE ? '2. Gegenstand und Dauer' : '2. Subject Matter and Duration'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {isDE
              ? 'Der Auftragnehmer verarbeitet personenbezogene Daten im Auftrag des Auftraggebers zur Bereitstellung der PostMind AI Plattform. Die Dauer entspricht der Laufzeit des Hauptvertrags.'
              : 'The Processor processes personal data on behalf of the Controller to provide the PostMind AI platform. The duration corresponds to the term of the main contract.'
            }
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {isDE ? '3. Art und Zweck der Datenverarbeitung' : '3. Nature and Purpose of Data Processing'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">
              {isDE ? 'Zweck' : 'Purpose'}
            </h3>
            <p className="text-muted-foreground">
              {isDE
                ? 'Bereitstellung der PostMind AI SaaS-Plattform zur verschlüsselten Dokumentenverwaltung und KI-gestützten Analyse.'
                : 'Provision of the PostMind AI SaaS platform for encrypted document management and AI-powered analysis.'
              }
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">
              {isDE ? 'Art der Daten' : 'Types of Data'}
            </h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>{isDE ? 'Stammdaten (Firmenname, Adresse, Kontaktdaten)' : 'Master data (company name, address, contact details)'}</li>
              <li>{isDE ? 'Verschlüsselte Dokumentinhalte' : 'Encrypted document contents'}</li>
              <li>{isDE ? 'Metadaten (Dateinamen, Upload-Zeitpunkt)' : 'Metadata (filenames, upload time)'}</li>
              <li>{isDE ? 'Nutzungsdaten (Anzahl Uploads, Funktionsnutzung)' : 'Usage data (number of uploads, feature usage)'}</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">
              {isDE ? 'Betroffene Personen' : 'Data Subjects'}
            </h3>
            <p className="text-muted-foreground">
              {isDE
                ? 'Mitarbeiter des Auftraggebers, Geschäftspartner, Kunden, Absender von Briefen.'
                : 'Employees of the Controller, business partners, customers, senders of letters.'
              }
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {isDE ? '4. Technische und organisatorische Maßnahmen' : '4. Technical and Organizational Measures'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              <strong>{isDE ? 'Verschlüsselung' : 'Encryption'}:</strong> {isDE ? 'Client-seitige End-to-End Verschlüsselung mit AES-256-GCM' : 'Client-side end-to-end encryption with AES-256-GCM'}
            </li>
            <li>
              <strong>{isDE ? 'Zugriffskontrolle' : 'Access Control'}:</strong> {isDE ? 'Rollenbasierte Zugriffsverwaltung, Zwei-Faktor-Authentifizierung' : 'Role-based access management, two-factor authentication'}
            </li>
            <li>
              <strong>{isDE ? 'Datenstandort' : 'Data Location'}:</strong> {isDE ? 'Ausschließliche Speicherung in EU-Rechenzentren (Frankfurt)' : 'Exclusive storage in EU data centers (Frankfurt)'}
            </li>
            <li>
              <strong>{isDE ? 'Backup' : 'Backup'}:</strong> {isDE ? 'Tägliche verschlüsselte Backups mit 30-tägiger Aufbewahrung' : 'Daily encrypted backups with 30-day retention'}
            </li>
            <li>
              <strong>{isDE ? 'Monitoring' : 'Monitoring'}:</strong> {isDE ? '24/7 Sicherheitsüberwachung und Incident Response' : '24/7 security monitoring and incident response'}
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {isDE ? '5. Subunternehmer' : '5. Subprocessors'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {isDE
              ? 'Der Auftragnehmer setzt folgende Subunternehmer ein:'
              : 'The Processor engages the following subprocessors:'
            }
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              <strong>Supabase, Inc.</strong> - {isDE ? 'Datenbank- und Authentifizierungsdienste (EU-Region)' : 'Database and authentication services (EU region)'}
            </li>
            <li>
              <strong>Stripe, Inc.</strong> - {isDE ? 'Zahlungsabwicklung (DSGVO-konform)' : 'Payment processing (GDPR-compliant)'}
            </li>
          </ul>
          <p className="text-muted-foreground mt-4">
            {isDE
              ? 'Alle Subunternehmer sind vertraglich zur Einhaltung der DSGVO verpflichtet und verarbeiten Daten ausschließlich in der EU.'
              : 'All subprocessors are contractually obligated to comply with the GDPR and process data exclusively in the EU.'
            }
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {isDE ? '6. Rechte und Pflichten des Auftraggebers' : '6. Rights and Obligations of the Controller'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{isDE ? 'Recht auf Auskunft über die Verarbeitung' : 'Right to information about processing'}</li>
            <li>{isDE ? 'Recht auf Löschung und Berichtigung' : 'Right to deletion and rectification'}</li>
            <li>{isDE ? 'Recht auf Datenübertragbarkeit' : 'Right to data portability'}</li>
            <li>{isDE ? 'Kontrollrecht bezüglich der TOM' : 'Right to control regarding technical and organizational measures'}</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {isDE ? '7. Pflichten des Auftragnehmers' : '7. Obligations of the Processor'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{isDE ? 'Verarbeitung nur nach dokumentierter Weisung' : 'Processing only according to documented instructions'}</li>
            <li>{isDE ? 'Sicherstellung der Vertraulichkeit' : 'Ensuring confidentiality'}</li>
            <li>{isDE ? 'Unterstützung bei Betroffenenrechten' : 'Support with data subject rights'}</li>
            <li>{isDE ? 'Meldung von Datenschutzverletzungen innerhalb von 24 Stunden' : 'Notification of data breaches within 24 hours'}</li>
            <li>{isDE ? 'Löschung oder Rückgabe der Daten nach Vertragsende' : 'Deletion or return of data after contract termination'}</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {isDE ? '8. Datenschutz-Kontakt' : '8. Data Protection Contact'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {isDE
              ? 'Für Fragen zur Auftragsverarbeitung wenden Sie sich bitte an:'
              : 'For questions regarding data processing, please contact:'
            }
          </p>
          <p className="mt-2">
            <strong>E-Mail:</strong> dpo@postmind.ai
          </p>
          <p><strong>{isDE ? 'Telefon' : 'Phone'}:</strong> +49 (0) 69 1234 5678</p>
        </CardContent>
      </Card>
    </div>
  );
}
