import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language } from './translations';
import { TranslationKeys } from './translations/en';

interface TranslationContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: TranslationKeys;
    translate: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const STORAGE_KEY = 'eduErp_language';

export function TranslationProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(() => {
        // Get saved language from localStorage or default to 'en'
        const saved = localStorage.getItem(STORAGE_KEY);
        return (saved as Language) || 'en';
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem(STORAGE_KEY, lang);
    };

    const t = translations[language];

    // Helper function to get nested translation by dot notation
    const translate = (key: string): string => {
        const keys = key.split('.');
        let value: any = t;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key; // Return key if translation not found
            }
        }

        return typeof value === 'string' ? value : key;
    };

    return (
        <TranslationContext.Provider value={{ language, setLanguage, t, translate }}>
            {children}
        </TranslationContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useTranslation must be used within TranslationProvider');
    }
    return context;
}
