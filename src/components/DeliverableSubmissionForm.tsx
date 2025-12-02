'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeliverableSubmissionFormProps {
    questId: string
    performerId: string
    onSubmitSuccess?: () => void
}

export default function DeliverableSubmissionForm({
    questId,
    performerId,
    onSubmitSuccess,
}: DeliverableSubmissionFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [step, setStep] = useState(1) // 1: Preview, 2: Full Content

    // Form States
    const [previewTitle, setPreviewTitle] = useState('')
    const [previewDescription, setPreviewDescription] = useState('')
    const [fullContent, setFullContent] = useState('')

    // TODO: 이미지 업로드 로직은 별도 컴포넌트로 구현 필요 (여기서는 URL 입력으로 대체)
    const [previewImages, setPreviewImages] = useState<string[]>([])
    const [fullImages, setFullImages] = useState<string[]>([])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/submit-deliverable', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questId,
                    performerId,
                    previewTitle,
                    previewDescription,
                    previewImages,
                    fullContent,
                    fullImages,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit')
            }

            alert('결과물이 안전하게 제출되었습니다! 의뢰자가 승인하면 정산이 완료됩니다.')
            if (onSubmitSuccess) onSubmitSuccess()
            router.refresh()
        } catch (error: any) {
            alert(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    🛡️ 안전 결과물 제출
                </h2>
                <p className="text-purple-100 text-sm mt-1">
                    먹튀 방지를 위해 미리보기와 전체 내용을 분리하여 제출합니다.
                </p>
            </div>

            {/* Steps */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setStep(1)}
                    className={`flex-1 py-3 text-sm font-medium ${step === 1
                            ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    1. 공개 미리보기 (Preview)
                </button>
                <button
                    onClick={() => setStep(2)}
                    className={`flex-1 py-3 text-sm font-medium ${step === 2
                            ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    2. 전체 결과물 (Locked)
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 text-sm text-yellow-800 dark:text-yellow-200">
                            👁️ <strong>이 내용은 의뢰자에게 즉시 공개됩니다.</strong><br />
                            결과물의 핵심 내용이나 중요 정보는 제외하고, 작업이 완료되었음을 증명하는 스크린샷이나 요약만 입력하세요.
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                미리보기 제목
                            </label>
                            <input
                                type="text"
                                value={previewTitle}
                                onChange={(e) => setPreviewTitle(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500"
                                placeholder="예: [완료] 서울 홍대 맛집 리스트 조사 완료 (요약본)"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                미리보기 설명 (요약)
                            </label>
                            <textarea
                                value={previewDescription}
                                onChange={(e) => setPreviewDescription(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 h-32"
                                placeholder="작업 완료 사실을 증명할 수 있는 간단한 설명을 적어주세요. (중요 정보 제외)"
                                required
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                            >
                                다음: 전체 내용 입력 →
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 text-sm text-green-800 dark:text-green-200 flex items-start gap-2">
                            🔒 <strong>이 내용은 안전하게 잠깁니다.</strong><br />
                            의뢰자가 결제를 승인하기 전까지는 절대 공개되지 않습니다. 안심하고 모든 결과물을 입력하세요.
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                전체 결과물 내용
                            </label>
                            <textarea
                                value={fullContent}
                                onChange={(e) => setFullContent(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 h-64 font-mono text-sm"
                                placeholder="여기에 실제 조사한 모든 내용, 링크, 계정 정보 등을 입력하세요."
                                required
                            />
                        </div>

                        <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-gray-500 hover:text-gray-700 font-medium"
                            >
                                ← 이전으로
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-bold shadow-md transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting ? '제출 중...' : '🔒 안전하게 제출하기'}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}
