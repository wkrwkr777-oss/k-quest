import { useState, useEffect, useRef, useCallback } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

// Transformers.js는 서버 사이드 렌더링에서 제외해야 함
let pipeline: any = null

export function useTranslator() {
    const { locale } = useLanguage() // 현재 앱 언어 가져오기
    const [isReady, setIsReady] = useState(false)
    const [progress, setProgress] = useState(0)
    const worker = useRef<Worker | null>(null)

    useEffect(() => {
        if (!worker.current) {
            // Web Worker를 생성하여 메인 스레드 차단 방지
            worker.current = new Worker(new URL('../lib/translationWorker.ts', import.meta.url))

            worker.current.onmessage = (event) => {
                const { status, output, progress: loadProgress } = event.data

                if (status === 'ready') {
                    setIsReady(true)
                } else if (status === 'progress') {
                    setProgress(loadProgress)
                }
            }
        }

        return () => {
            if (worker.current) {
                worker.current.terminate()
            }
        }
    }, [])

    const translate = useCallback((text: string, src_lang: string, tgt_lang: string) => {
        return new Promise<string>((resolve, reject) => {
            if (!worker.current) {
                reject('Translator not initialized')
                return
            }

            // 언어 코드 매핑 (Transformers.js 모델용)
            // ko -> kor_Hang, en -> eng_Latn, ja -> jpn_Jpan, zh -> zho_Hans, ar -> arb_Arab
            const langMap: { [key: string]: string } = {
                'ko': 'kor_Hang',
                'en': 'eng_Latn',
                'ja': 'jpn_Jpan',
                'zh': 'zho_Hans',
                'ar': 'arb_Arab'
            }

            const src = langMap[src_lang] || 'eng_Latn'
            const tgt = langMap[tgt_lang] || 'kor_Hang'

            const handleMessage = (event: MessageEvent) => {
                const { status, output, error } = event.data
                if (status === 'complete') {
                    worker.current?.removeEventListener('message', handleMessage)
                    resolve(output[0].translation_text)
                } else if (status === 'error') {
                    worker.current?.removeEventListener('message', handleMessage)
                    reject(error)
                }
            }

            worker.current.addEventListener('message', handleMessage)

            worker.current.postMessage({
                text,
                src_lang: src,
                tgt_lang: tgt
            })
        })
    }, [])

    return { isReady, progress, translate, currentLocale: locale }
}
