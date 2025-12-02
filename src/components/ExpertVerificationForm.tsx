'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { analyzeDocument } from '@/lib/documentAnalyzer'
import { calculatePassionScore } from '@/lib/passionCalculator'

export default function ExpertVerificationForm({ userId }: { userId: string }) {
    const [category, setCategory] = useState('student')
    const [description, setDescription] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    // AI 분석 상태
    const [aiAnalysis, setAiAnalysis] = useState<string | null>(null)
    const [passionResult, setPassionResult] = useState<{ score: number, level: string, feedback: string } | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    // 자기소개 입력 시 실시간 열정 점수 계산
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value
        setDescription(text)
        if (text.length > 10) {
            setPassionResult(calculatePassionScore(text))
        } else {
            setPassionResult(null)
        }
    }

    // 파일 업로드 및 AI 분석
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIsAnalyzing(true)
            const file = e.target.files[0]

            // AI 분석 실행
            const result = await analyzeDocument(file)
            setAiAnalysis(result.summary)
            setIsAnalyzing(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // 실제로는 여기서 파일 업로드 로직이 필요함 (Storage)
            const mockDocUrl = 'https://example.com/doc.jpg'

            const { error } = await supabase
                .from('expert_verifications')
                .insert({
                    user_id: userId,
                    category,
                    description,
                    document_url: mockDocUrl,
                    // AI 분석 결과도 함께 저장 (관리자 참고용)
                    admin_feedback: `[AI 1차 분석]\n문서: ${aiAnalysis}\n열정점수: ${passionResult?.score}점 (${passionResult?.level})`
                })

            if (error) throw error
            setIsSuccess(true)
        } catch (error) {
            alert('신청 중 오류가 발생했습니다.')
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="bg-green-50 dark:bg-green-900/20 p-8 rounded-xl text-center border border-green-200 dark:border-green-800">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
                    신청이 완료되었습니다!
                </h3>
                <p className="text-green-700 dark:text-green-300">
                    관리자 검토 후 24시간 이내에<br />
                    <strong>[Verified Pro]</strong> 배지가 부여됩니다.
                </p>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white text-center">
                <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                    🎓 K-Quest 전문가 인증
                </h2>
                <p className="text-slate-300 mt-2 text-sm">
                    당신의 전문성을 증명하고 <strong>상위 1% 고액 퀘스트</strong>를 독점하세요.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        인증 분야 선택
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { id: 'student', label: '🎓 명문대 재학생', desc: 'SKY/In-Seoul 학생증' },
                            { id: 'professional', label: '💼 전문직/직장인', desc: '명함/재직증명서' },
                            { id: 'language', label: '🗣️ 어학 능력자', desc: 'TOEIC/OPIC/JLPT' },
                            { id: 'local', label: '🗺️ 로컬 가이드', desc: '가이드 자격증/경력' },
                        ].map((type) => (
                            <button
                                key={type.id}
                                type="button"
                                onClick={() => setCategory(type.id)}
                                className={`p-4 rounded-lg border-2 text-left transition-all ${category === type.id
                                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-600'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                                    }`}
                            >
                                <div className="font-bold text-gray-900 dark:text-white">{type.label}</div>
                                <div className="text-xs text-gray-500 mt-1">{type.desc}</div>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        자기소개 및 경력
                    </label>
                    <textarea
                        value={description}
                        onChange={handleDescriptionChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 h-32"
                        placeholder="당신의 열정과 경험을 구체적으로 적어주세요. AI가 열정 점수를 분석합니다!"
                        required
                    />
                    {passionResult && (
                        <div className={`mt-2 text-sm p-3 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-1 ${passionResult.score >= 70 ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                            }`}>
                            <span className="text-xl">{passionResult.score >= 90 ? '🔥' : passionResult.score >= 70 ? '✨' : '🥚'}</span>
                            <div>
                                <span className="font-bold">열정 점수: {passionResult.score}점 ({passionResult.level})</span>
                                <p className="text-xs opacity-80">{passionResult.feedback}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        증빙 서류 업로드 (AI 자동 분석)
                    </label>
                    <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {isAnalyzing ? (
                            <div className="flex flex-col items-center text-blue-600">
                                <span className="animate-spin text-2xl mb-2">🔄</span>
                                <span>AI가 문서를 분석하고 있습니다...</span>
                            </div>
                        ) : aiAnalysis ? (
                            <div className="text-left bg-blue-50 p-3 rounded text-sm text-blue-800">
                                {aiAnalysis}
                            </div>
                        ) : (
                            <>
                                <span className="text-4xl block mb-2">📂</span>
                                <span className="text-sm text-gray-500">
                                    클릭하여 학생증, 자격증 등을 업로드하세요.<br />
                                    <strong>AI가 자동으로 문서를 분석하여 관리자에게 전달합니다.</strong>
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-lg shadow-lg transform hover:scale-[1.01] transition-all disabled:opacity-50"
                >
                    {isSubmitting ? '제출 중...' : '인증 신청하고 Pro 배지 받기'}
                </button>
            </form>
        </div>
    )
}
