import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AVAILABLE_LANGUAGES, type Language } from '@/i18n/i18n';
import './LanguageSwitcher.css';

const FLAGS: Record<Language, string> = {
    en: '🇬🇧',
    be: '🇧🇾',
    ru: '🇷🇺',
};

const LanguageSwitcher = () => {
    const { t, i18n } = useTranslation();
    const language = i18n.language as Language;

    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const close = useCallback(() => setIsOpen(false), []);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                close();
            }
        };

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [isOpen, close]);

    const handleSelect = (lang: Language) => {
        void i18n.changeLanguage(lang);
        close();
        triggerRef.current?.focus();
    };

    return (
        <div className="lang-switcher" ref={containerRef} data-testid="language-switcher">
            <button
                ref={triggerRef}
                className="lang-switcher__trigger"
                onClick={() => setIsOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label={t('a11y.selectLanguage')}
                title={t('common.language')}
                type="button"
            >
                <svg
                    className="lang-switcher__globe"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span className="lang-switcher__code">{language}</span>
                <svg
                    className={`lang-switcher__chevron ${isOpen ? 'lang-switcher__chevron--open' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {isOpen && (
                <div
                    className="lang-switcher__dropdown lang-dropdown-enter"
                    role="listbox"
                    aria-label={t('a11y.selectLanguage')}
                >
                    {AVAILABLE_LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            role="option"
                            aria-selected={language === lang.code}
                            className={`lang-switcher__option ${language === lang.code ? 'lang-switcher__option--active' : ''}`}
                            onClick={() => handleSelect(lang.code)}
                            type="button"
                        >
                            <span className="lang-switcher__option-flag" aria-hidden="true">
                                {FLAGS[lang.code]}
                            </span>
                            <span className="lang-switcher__option-labels">
                                <span className="lang-switcher__option-label">{lang.label}</span>
                                <span className="lang-switcher__option-native">
                                    {lang.nativeLabel}
                                </span>
                            </span>
                            {language === lang.code && (
                                <span className="lang-switcher__tick" aria-hidden="true">
                                    ✓
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
