import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        navbar: {
          home: 'Home',
          lawyers: 'Find Lawyers',
          about: 'About',
          blog: 'Blog',
          contact: 'Contact',
          login: 'Login',
          register: 'Register',
          portal: 'Client Portal'
        },
        home: {
          title: 'Find Your Perfect Legal Solution',
          subtitle: 'Connect with experienced lawyers for all your legal needs',
          cta: 'Book a Consultation',
          features: {
            expert: 'Expert Lawyers',
            secure: 'Secure Process',
            affordable: 'Affordable Pricing'
          }
        },
        lawyers: {
          title: 'Our Network of Expert Lawyers',
          filter: 'Filter by Specialization',
          noResults: 'No lawyers found'
        },
        consultation: {
          title: 'Book a Consultation',
          selectLawyer: 'Select Lawyer',
          selectService: 'Select Service',
          selectDate: 'Select Date & Time',
          selectMode: 'Select Mode',
          submit: 'Book Consultation'
        }
      }
    },
    hi: {
      translation: {
        navbar: {
          home: 'होम',
          lawyers: 'वकील खोजें',
          about: 'परिचय',
          blog: 'ब्लॉग',
          contact: 'संपर्क करें',
          login: 'लॉगिन',
          register: 'पंजीकरण',
          portal: 'क्लाइंट पोर्टल'
        },
        home: {
          title: 'अपना सही कानूनी समाधान खोजें',
          subtitle: 'अपनी सभी कानूनी जरूरतों के लिए अनुभवी वकीलों से जुड़ें',
          cta: 'परामर्श बुक करें',
          features: {
            expert: 'विशेषज्ञ वकील',
            secure: 'सुरक्षित प्रक्रिया',
            affordable: 'किफायती मूल्य'
          }
        },
        lawyers: {
          title: 'हमारे विशेषज्ञ वकीलों का नेटवर्क',
          filter: 'विशेषज्ञता से फ़िल्टर करें',
          noResults: 'कोई वकील नहीं मिला'
        },
        consultation: {
          title: 'परामर्श बुक करें',
          selectLawyer: 'वकील चुनें',
          selectService: 'सेवा चुनें',
          selectDate: 'तारीख और समय चुनें',
          selectMode: 'मोड चुनें',
          submit: 'परामर्श बुक करें'
        }
      }
    }
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
