import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  de: {
    common: {
      // Navigation
      home: 'Startseite',
      pricing: 'Preise',
      contact: 'Kontakt',
      privacy: 'Datenschutz',
      terms: 'AGB',
      impressum: 'Impressum',
      login: 'Anmelden',
      signup: 'Registrieren',
      logout: 'Abmelden',
      dashboard: 'Dashboard',
      company: 'Firma',
      
      // Landing page
      landingTitle: 'PostMind AI',
      landingSubtitle: 'DSGVO-konforme KI-gestützte Analyse Ihrer Geschäftspost',
      landingDescription: 'Automatische Analyse, Klassifizierung und Terminverwaltung für Ihre Geschäftspost – 100% EU-konform',
      startFreeTrial: 'Kostenlos testen',
      
      // Auth
      email: 'E-Mail',
      password: 'Passwort',
      confirmPassword: 'Passwort bestätigen',
      companyName: 'Firmenname',
      vatId: 'USt-IdNr. (optional)',
      street: 'Straße & Hausnummer',
      zip: 'PLZ',
      city: 'Stadt',
      country: 'Land',
      businessEmail: 'Geschäftliche E-Mail',
      acceptTerms: 'Ich akzeptiere die AGB, Datenschutzerklärung und AVV',
      createAccount: 'Konto erstellen',
      alreadyHaveAccount: 'Bereits registriert?',
      noAccount: 'Noch kein Konto?',
      
      // Errors
      requiredField: 'Pflichtfeld',
      invalidEmail: 'Ungültige E-Mail-Adresse',
      passwordMismatch: 'Passwörter stimmen nicht überein',
      nonEuCountry: 'Nur EU/EWR-Länder sind zugelassen',
      mustAcceptTerms: 'Sie müssen die Bedingungen akzeptieren',
      
      // Company Profile
      companyProfile: 'Firmenprofil',
      editProfile: 'Profil bearbeiten',
      saveChanges: 'Änderungen speichern',
      language: 'Sprache',
      german: 'Deutsch',
      english: 'English',
      profileUpdated: 'Profil erfolgreich aktualisiert',
      
      // Dashboard
      welcomeMessage: 'Willkommen bei PostMind AI',
      phase1Ready: 'Phase 1 ist bereit – Weitere Funktionen folgen bald!',
      
      // Footer
      about: 'Über uns',
      blog: 'Blog',
      help: 'Hilfe',
      faq: 'FAQ',
      support: 'Support',
      docs: 'Dokumentation',
    }
  },
  en: {
    common: {
      // Navigation
      home: 'Home',
      pricing: 'Pricing',
      contact: 'Contact',
      privacy: 'Privacy',
      terms: 'Terms',
      impressum: 'Imprint',
      login: 'Login',
      signup: 'Sign Up',
      logout: 'Logout',
      dashboard: 'Dashboard',
      company: 'Company',
      
      // Landing page
      landingTitle: 'PostMind AI',
      landingSubtitle: 'GDPR-compliant AI-powered analysis of your business mail',
      landingDescription: 'Automatic analysis, classification and appointment management for your business mail – 100% EU compliant',
      startFreeTrial: 'Start Free Trial',
      
      // Auth
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      companyName: 'Company Name',
      vatId: 'VAT ID (optional)',
      street: 'Street & Number',
      zip: 'ZIP Code',
      city: 'City',
      country: 'Country',
      businessEmail: 'Business Email',
      acceptTerms: 'I accept the Terms of Service, Privacy Policy and DPA',
      createAccount: 'Create Account',
      alreadyHaveAccount: 'Already have an account?',
      noAccount: "Don't have an account?",
      
      // Errors
      requiredField: 'Required field',
      invalidEmail: 'Invalid email address',
      passwordMismatch: 'Passwords do not match',
      nonEuCountry: 'Only EU/EEA countries are allowed',
      mustAcceptTerms: 'You must accept the terms',
      
      // Company Profile
      companyProfile: 'Company Profile',
      editProfile: 'Edit Profile',
      saveChanges: 'Save Changes',
      language: 'Language',
      german: 'Deutsch',
      english: 'English',
      profileUpdated: 'Profile updated successfully',
      
      // Dashboard
      welcomeMessage: 'Welcome to PostMind AI',
      phase1Ready: 'Phase 1 is ready – More features coming soon!',
      
      // Footer
      about: 'About',
      blog: 'Blog',
      help: 'Help',
      faq: 'FAQ',
      support: 'Support',
      docs: 'Documentation',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('locale') || 'de',
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false
    },
    ns: ['common'],
    defaultNS: 'common'
  });

export default i18n;
