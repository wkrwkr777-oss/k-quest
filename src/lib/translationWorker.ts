import { pipeline, env } from '@xenova/transformers'

// CDN에서 모델 다운로드 허용
env.allowLocalModels = false
env.useBrowserCache = true

class TranslationPipeline {
    static task = 'translation'
    static model = 'Xenova/nllb-200-distilled-600M' // 다국어 번역 모델 (무료)
    static instance: any = null

    static async getInstance(progressCallback: any = null) {
        if (this.instance === null) {
            // @ts-ignore - PipelineType issue
            this.instance = await pipeline(this.task as any, this.model, { progress_callback: progressCallback })
        }
        return this.instance
    }
}

self.addEventListener('message', async (event) => {
    const { text, src_lang, tgt_lang } = event.data

    try {
        // 모델 로드
        const translator = await TranslationPipeline.getInstance((x: any) => {
            self.postMessage(x)
        })

        // 번역 실행
        // NLLB 모델은 언어 코드가 필요함 (예: kor_Hang, eng_Latn)
        const output = await translator(text, {
            src_lang: mapLanguageCode(src_lang),
            tgt_lang: mapLanguageCode(tgt_lang),
        })

        self.postMessage({
            status: 'complete',
            output: output,
        })
    } catch (error: any) {
        self.postMessage({
            status: 'error',
            error: error.message,
        })
    }
})

// 언어 코드 매핑 (NLLB 모델용)
function mapLanguageCode(lang: string): string {
    const map: { [key: string]: string } = {
        'ko': 'kor_Hang',
        'en': 'eng_Latn',
        'ja': 'jpn_Jpan',
        'zh': 'zho_Hans',
        'ar': 'arb_Arab',
    }
    return map[lang] || 'eng_Latn'
}
