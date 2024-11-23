import en from '../locales/en.json';
import fr from '../locales/fr.json';

type Locale = 'en' | 'fr';

const translations: Record<Locale, typeof en> = {
    en,
    fr,
};

// Détecte la langue depuis le cookie ou retourne une langue par défaut
function detectLocale(): Locale {
    const cookieMatch = document.cookie.match(/NEXT_LOCALE=(en|fr)/);
    return cookieMatch?.[1] as Locale || 'en'; // Retourne 'en' par défaut si aucun cookie
}

// Fonction pour accéder à des clés imbriquées
function getNestedValue(obj: any, key: string): string | undefined {
    return key.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export function useTranslation() {
    const locale = detectLocale(); // Détecte la langue automatiquement

    const t = (key: string): string => {
        const translation = getNestedValue(translations[locale], key);
        return translation || key; // Retourne la traduction ou la clé par défaut
    };

    return { t, locale };
}
