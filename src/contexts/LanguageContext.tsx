'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { dictionaries, dir, Locale } from '@/lib/i18n/dictionaries'

interface LanguageContextType {
    locale: Locale
    t: (key: keyof typeof dictionaries['en']) => string
    setLocale: (locale: Locale) => void
    isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocale] = useState<Locale>('ko')

    useEffect(() => {
        // 브라우저 언어 감지 (첫 접속 시)
        const browserLang = navigator.language.split('-')[0] as Locale
        if (['ko', 'en', 'ja', 'zh', 'ar'].includes(browserLang)) {
            setLocale(browserLang)
        } else {
            setLocale('en') // 기본값 영어
        }
    }, [])

    useEffect(() => {
        // 언어가 바뀌면 HTML 태그의 dir 속성 변경 (RTL 지원)
        document.documentElement.lang = locale
        document.documentElement.dir = dir[locale]

        // 아랍어 폰트 적용
        if (locale === 'ar') {
            document.body.classList.add('font-arabic')
        } else {
            document.body.classList.remove('font-arabic')
        }
    }, [locale])

    const t = (key: keyof typeof dictionaries['en']) => {
        return dictionaries[locale][key] || dictionaries['en'][key]
    }

    return (
        <LanguageContext.Provider value={{ locale, t, setLocale, isRTL: dir[locale] === 'rtl' }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
