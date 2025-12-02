'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Locale } from '@/lib/i18n/dictionaries'

export default function LanguageSwitcher() {
    const { locale, setLocale } = useLanguage()

    const languages: { code: Locale, label: string, flag: string }[] = [
        { code: 'ko', label: '한국어', flag: '🇰🇷' },
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'ja', label: '日本語', flag: '🇯🇵' },
        { code: 'zh', label: '中文', flag: '🇨🇳' },
        { code: 'ar', label: 'العربية', flag: '🇦🇪' }, // UAE Flag
    ]

    return (
        <div className="relative group z-50">
            <button className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <span className="text-lg">{languages.find(l => l.code === locale)?.flag}</span>
                <span className="text-sm font-medium hidden md:block">
                    {languages.find(l => l.code === locale)?.label}
                </span>
                <span className="text-xs">▼</span>
            </button>

            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden hidden group-hover:block animate-in fade-in slide-in-from-top-2">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => setLocale(lang.code)}
                        className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${locale === lang.code ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : ''
                            }`}
                    >
                        <span className="text-xl">{lang.flag}</span>
                        <span className={`text-sm ${lang.code === 'ar' ? 'font-arabic' : ''}`}>
                            {lang.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    )
}
