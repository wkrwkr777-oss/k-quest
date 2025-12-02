'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeliverableReviewProps {
    questId: string
    clientId: string
    deliverable: {
        id: string
        preview_title: string
        preview_description: string
        preview_images?: string[]
        full_content?: string // 승인 전에는 undefined 또는 잠김 메시지
        is_paid: boolean
        status: string
        submitted_at: string
    }
}

export default function DeliverableReview({
    questId,
    clientId,
    deliverable,
}: DeliverableReviewProps) {
    const router = useRouter()
    const [isProcessing, setIsProcessing] = useState(false)
    const [showRejectForm, setShowRejectForm] = useState(false)
    const [rejectionReason, setRejectionReason] = useState('')

    const handleApprove = async () => {
        if (!confirm('승인하시겠습니까? 승인 즉시 수행자에게 수익이 지급되며, 전체 결과물이 공개됩니다.')) return

        setIsProcessing(true)
        try {
            const response = await fetch('/api/approve-deliverable', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    deliverableId: deliverable.id,
                    questId,
                    clientId,
                    approved: true,
                }),
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.error)

            alert('승인되었습니다! 전체 결과물이 공개되었습니다.')
            router.refresh()
        } catch (error: any) {
            alert(error.message)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            alert('거부 사유를 입력해주세요.')
            return
        }

        if (!confirm('정말 거부하시겠습니까? 수행자에게 재작업 요청이 전송됩니다.')) return

        setIsProcessing(true)
        try {
            const response = await fetch('/api/approve-deliverable', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    deliverableId: deliverable.id,
                    questId,
                    clientId,
                    approved: false,
                    rejectionReason,
                }),
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.error)

            alert('거부 처리되었습니다. 수행자에게 알림이 전송되었습니다.')
            setShowRejectForm(false)
            router.refresh()
        } catch (error: any) {
            alert(error.message)
        } finally {
            setIsProcessing(false)
        }
    }

    // 이미 승인된 경우 (전체 내용 표시)
    if (deliverable.is_paid) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-green-200 dark:border-green-800">
                <div className="bg-green-600 p-4 text-white flex justify-between items-center">
                    <h3 className="font-bold flex items-center gap-2">
                        ✅ 승인 완료 (Unlocked)
                    </h3>
                    <span className="text-xs bg-green-700 px-2 py-1 rounded">
                        {new Date(deliverable.submitted_at).toLocaleDateString()}
                    </span>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">제목</h4>
                        <p className="text-lg font-bold">{deliverable.preview_title}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-2">
                            🔓 전체 결과물 내용
                        </h4>
                        <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                            {deliverable.full_content}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // 승인 대기 중 (미리보기 + 잠금 화면)
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 text-white flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2">
                    📦 제출된 결과물 검토
                </h3>
                <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                    {new Date(deliverable.submitted_at).toLocaleDateString()}
                </span>
            </div>

            <div className="p-6 space-y-6">
                {/* Preview Section */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded font-medium">Preview</span>
                        <h4 className="text-lg font-bold">{deliverable.preview_title}</h4>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {deliverable.preview_description}
                    </div>
                </div>

                {/* Locked Section */}
                <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 p-8 text-center">
                    <div className="absolute inset-0 bg-gray-100/50 dark:bg-gray-900/50 backdrop-blur-[2px] flex flex-col items-center justify-center z-10">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 shadow-inner">
                            <span className="text-3xl">🔒</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                            전체 내용은 잠겨있습니다
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm">
                            미리보기를 확인하시고 결과물이 만족스러우시면 승인해주세요.<br />
                            승인 즉시 전체 내용이 공개됩니다.
                        </p>
                    </div>
                    {/* Fake Content Background */}
                    <div className="opacity-20 blur-sm select-none pointer-events-none text-left space-y-2">
                        <div className="h-4 bg-gray-400 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-400 rounded w-full"></div>
                        <div className="h-4 bg-gray-400 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-400 rounded w-4/5"></div>
                    </div>
                </div>

                {/* Actions */}
                {!showRejectForm ? (
                    <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setShowRejectForm(true)}
                            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
                        >
                            수정 요청 / 거부
                        </button>
                        <button
                            onClick={handleApprove}
                            disabled={isProcessing}
                            className="flex-[2] py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-bold shadow-md transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                        >
                            {isProcessing ? '처리 중...' : '✅ 승인하고 전체 보기 (Unlock)'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800 animate-in fade-in slide-in-from-top-2">
                        <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">거부 / 수정 요청 사유</h4>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full p-3 rounded border border-red-300 dark:border-red-700 bg-white dark:bg-gray-800 mb-3 focus:ring-2 focus:ring-red-500"
                            placeholder="수행자가 수정해야 할 부분을 구체적으로 적어주세요."
                            rows={3}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowRejectForm(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={isProcessing}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium"
                            >
                                거부 확정
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
