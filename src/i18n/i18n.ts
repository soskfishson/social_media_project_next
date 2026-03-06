import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import be from './locales/be';
import ru from './locales/ru';

const STORAGE_KEY = 'app_language';

export enum Language {
    RU = 'ru',
    EN = 'en',
    BE = 'be',
}

export const AVAILABLE_LANGUAGES = [
    { code: Language.EN, label: 'English', nativeLabel: 'English' },
    { code: Language.BE, label: 'Belarusian', nativeLabel: 'Беларуская' },
    { code: Language.RU, label: 'Russian', nativeLabel: 'Русский' },
];

const getInitialLanguage = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(STORAGE_KEY) ?? 'en';
    }
    return 'en';
};

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        be: { translation: be },
        ru: { translation: ru },
    },
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});

i18n.on('languageChanged', (lng: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, lng);
        document.documentElement.setAttribute('lang', lng);
    }
});

export default i18n;
