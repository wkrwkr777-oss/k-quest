'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface DisputeFormProps {
    questId: string
    userId: string
    onClose: () => void
}

export default function DisputeForm({ questId, userId, onClose }: DisputeFormProps) {
    const [reason, setReason] = useState('')
    const [description, setDescription] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const { error } = await supabase
                .from('disputes')
                .insert({
                    quest_id: questId,
                    reporter_id: userId,
                    reason,
                    description,
                    status: 'pending'
                })

            if (error) throw error

            alert('분쟁 신청이 접수되었습니다. 관리자가 검토 후 연락드리겠습니다.')
            onClose()
        } catch (error) {
            console.error('Dispute submission error:', error)
            alert('분쟁 신청 중 오류가 발생했습니다.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    ⚖️ 분쟁 신청하기
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    관리자가 중재하여 공정하게 해결하겠습니다.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            분쟁 사유 선택
                        </label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                            required
                        >
                            <option value="">선택하세요</option>
                            <option value="quality">결과물 품질 불만</option>
                            <option value="incomplete">작업 미완료</option>
                            <option value="deadline">약속 시간 미준수</option>
                            <option value="communication">연락 두절</option>
                            <option value="fraud">사기 의심</option>
                            <option value="other">기타</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            상세 설명
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 h-32"
                            placeholder="무엇이 문제였는지 구체적으로 설명해주세요."
                            required
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? '제출 중...' : '분쟁 신청'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
