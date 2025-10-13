import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  de: {
    translation: {
      // Navigation
      home: 'Startseite',
      login: 'Anmelden',
      logout: 'Abmelden',
      signup: 'Registrieren',
      dashboard: 'Dashboard',
      company: 'Unternehmen',
      pricing: 'Preise',
      contact: 'Kontakt',
      about: 'Über uns',
      blog: 'Blog',
      faq: 'FAQ',
      support: 'Support',
      docs: 'Dokumentation',
      legal: 'Rechtliches',
      privacy: 'Datenschutz',
      terms: 'AGB',
      impressum: 'Impressum',
      avv: 'AVV',
      
      // Dashboard
      welcomeMessage: 'Willkommen bei PostMind AI',
      phase1Ready: 'Phase 1 ist bereit',
      dashboardDesc: 'Verwalten Sie Ihre verschlüsselten Briefe und Dokumente',
      
      // Upload
      upload: 'Hochladen',
      batches: 'Batches',
      letters: 'Briefe',
      dragDropFiles: 'Dateien hierher ziehen & ablegen',
      orClickToSelect: 'oder klicken Sie, um Dateien auszuwählen',
      selectFiles: 'Dateien auswählen',
      encrypting: 'Verschlüsseln...',
      uploading: 'Hochladen...',
      uploadComplete: 'Upload abgeschlossen',
      uploadCompleteDesc: '{{count}} Dateien erfolgreich hochgeladen',
      uploadError: 'Upload-Fehler',
      uploadErrorDesc: 'Beim Hochladen ist ein Fehler aufgetreten',
      
      // Batches & Letters
      noBatches: 'Noch keine Batches vorhanden',
      noLetters: 'Noch keine Briefe vorhanden',
      files: 'Dateien',
      downloadZip: 'ZIP herunterladen',
      preparingDownload: 'Download vorbereiten',
      pleaseWait: 'Bitte warten...',
      downloadReady: 'Download bereit',
      downloadError: 'Download-Fehler',
      downloadErrorDesc: 'Beim Download ist ein Fehler aufgetreten',
      errorLoadingBatches: 'Fehler beim Laden der Batches',
      errorLoadingLetters: 'Fehler beim Laden der Briefe',
      filename: 'Dateiname',
      size: 'Größe',
      status: 'Status',
      uploadedAt: 'Hochgeladen am',
      loading: 'Laden...',
      
      // Landing
      hero: {
        title: 'PostMind AI',
        subtitle: 'DSGVO-konforme KI für Ihre Briefe',
        description: 'Analysieren Sie Ihre Post mit künstlicher Intelligenz. 100% verschlüsselt, 100% DSGVO-konform, 100% in der EU.',
        cta: 'Kostenlos testen',
      },
      
      // Auth
      auth: {
        signupTitle: 'Unternehmens-Account erstellen',
        loginTitle: 'Anmelden',
        companyName: 'Firmenname',
        vatId: 'USt-IdNr. (optional)',
        street: 'Straße & Hausnummer',
        zip: 'PLZ',
        city: 'Stadt',
        country: 'Land',
        businessEmail: 'Geschäftliche E-Mail',
        password: 'Passwort',
        confirmPassword: 'Passwort bestätigen',
        acceptTerms: 'Ich akzeptiere die AGB, Datenschutzerklärung und AVV',
        createAccount: 'Account erstellen',
        alreadyHaveAccount: 'Bereits registriert?',
        noAccount: 'Noch kein Account?',
        signIn: 'Anmelden',
        signUp: 'Registrieren',
        euOnly: 'Nur EU/EWR-Unternehmen',
        invalidCountry: 'Leider ist PostMind AI nur für Unternehmen in der EU/EWR verfügbar',
      },
      
      // Company Profile
      companyProfile: {
        title: 'Unternehmensprofil',
        description: 'Verwalten Sie Ihre Unternehmensdaten',
        save: 'Speichern',
        saveSuccess: 'Profil erfolgreich gespeichert',
        saveError: 'Fehler beim Speichern',
        language: 'Sprache',
        german: 'Deutsch',
        english: 'Englisch',
      },
    },
  },
  en: {
    translation: {
      // Navigation
      home: 'Home',
      login: 'Login',
      logout: 'Logout',
      signup: 'Sign up',
      dashboard: 'Dashboard',
      company: 'Company',
      pricing: 'Pricing',
      contact: 'Contact',
      about: 'About',
      blog: 'Blog',
      faq: 'FAQ',
      support: 'Support',
      docs: 'Documentation',
      legal: 'Legal',
      privacy: 'Privacy',
      terms: 'Terms',
      impressum: 'Imprint',
      avv: 'DPA',
      
      // Dashboard
      welcomeMessage: 'Welcome to PostMind AI',
      phase1Ready: 'Phase 1 is ready',
      dashboardDesc: 'Manage your encrypted letters and documents',
      
      // Upload
      upload: 'Upload',
      batches: 'Batches',
      letters: 'Letters',
      dragDropFiles: 'Drag & drop files here',
      orClickToSelect: 'or click to select files',
      selectFiles: 'Select Files',
      encrypting: 'Encrypting...',
      uploading: 'Uploading...',
      uploadComplete: 'Upload complete',
      uploadCompleteDesc: '{{count}} files uploaded successfully',
      uploadError: 'Upload error',
      uploadErrorDesc: 'An error occurred during upload',
      
      // Batches & Letters
      noBatches: 'No batches yet',
      noLetters: 'No letters yet',
      files: 'Files',
      downloadZip: 'Download ZIP',
      preparingDownload: 'Preparing download',
      pleaseWait: 'Please wait...',
      downloadReady: 'Download ready',
      downloadError: 'Download error',
      downloadErrorDesc: 'An error occurred during download',
      errorLoadingBatches: 'Error loading batches',
      errorLoadingLetters: 'Error loading letters',
      filename: 'Filename',
      size: 'Size',
      status: 'Status',
      uploadedAt: 'Uploaded at',
      loading: 'Loading...',
      
      // Landing
      hero: {
        title: 'PostMind AI',
        subtitle: 'GDPR-compliant AI for your letters',
        description: 'Analyze your mail with artificial intelligence. 100% encrypted, 100% GDPR-compliant, 100% in the EU.',
        cta: 'Start free trial',
      },
      
      // Auth
      auth: {
        signupTitle: 'Create Company Account',
        loginTitle: 'Login',
        companyName: 'Company Name',
        vatId: 'VAT ID (optional)',
        street: 'Street & Number',
        zip: 'ZIP Code',
        city: 'City',
        country: 'Country',
        businessEmail: 'Business Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        acceptTerms: 'I accept the Terms, Privacy Policy and DPA',
        createAccount: 'Create Account',
        alreadyHaveAccount: 'Already have an account?',
        noAccount: 'No account yet?',
        signIn: 'Sign In',
        signUp: 'Sign Up',
        euOnly: 'EU/EEA companies only',
        invalidCountry: 'Sorry, PostMind AI is only available for companies in the EU/EEA',
      },
      
      // Company Profile
      companyProfile: {
        title: 'Company Profile',
        description: 'Manage your company information',
        save: 'Save',
        saveSuccess: 'Profile saved successfully',
        saveError: 'Error saving profile',
        language: 'Language',
        german: 'German',
        english: 'English',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('locale') || 'de',
  fallbackLng: 'de',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
