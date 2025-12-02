'use client'

import { useState } from 'react'

// 재미있는 한국 이름 데이터베이스
const K_NAMES = [
    { name: '김철수', romaja: 'Kim Cheol-su', meaning: 'Iron Water (Strong & Clear)', type: 'strong' },
    { name: '이영희', romaja: 'Lee Young-hee', meaning: 'Eternal Joy', type: 'cheerful' },
    { name: '박지성', romaja: 'Park Ji-sung', meaning: 'Wisdom & Star', type: 'smart' },
    { name: '최강', romaja: 'Choi Kang', meaning: 'The Strongest', type: 'strong' },
    { name: '송하나', romaja: 'Song Ha-na', meaning: 'Number One', type: 'cheerful' },
    { name: '정하늘', romaja: 'Jeong Ha-neul', meaning: 'Sky (Pure & Vast)', type: 'pure' },
    { name: '강호랑', romaja: 'Kang Ho-rang', meaning: 'Tiger (Brave)', type: 'brave' },
    { name: '윤슬', romaja: 'Yoon Seul', meaning: 'Sparkling Water', type: 'pure' },
]

export default function KNameGenerator() {
    const [step, setStep] = useState(0)
    const [answers, setAnswers] = useState<string[]>([])
    const [result, setResult] = useState<any>(null)

    const questions = [
        {
            q: "What's your favorite vibe?",
            options: [
                { text: "🔥 Powerful & Strong", type: 'strong' },
                { text: "✨ Sparkling & Pure", type: 'pure' },
                { text: "🎉 Cheerful & Fun", type: 'cheerful' },
                { text: "🧠 Smart & Wise", type: 'smart' },
            ]
        },
        {
            q: "Pick a Korean food:",
            options: [
                { text: "🥩 BBQ (Bulgogi)", type: 'strong' },
                { text: "🍜 Cold Noodles (Naengmyeon)", type: 'pure' },
                { text: "🥘 Spicy Stew (Kimchi-jjigae)", type: 'brave' },
                { text: "🍚 Bibimbap", type: 'cheerful' },
            ]
        }
    ]

    const handleAnswer = (type: string) => {
        const newAnswers = [...answers, type]
        setAnswers(newAnswers)

        if (step < questions.length - 1) {
            setStep(step + 1)
        } else {
            // 결과 도출 (간단한 로직)
            const finalType = newAnswers[0] // 첫 번째 답변 기준
            const candidates = K_NAMES.filter(n => n.type === finalType || n.type === newAnswers[1])
            const picked = candidates.length > 0
                ? candidates[Math.floor(Math.random() * candidates.length)]
                : K_NAMES[Math.floor(Math.random() * K_NAMES.length)]

            setResult(picked)
        }
    }

    const reset = () => {
        setStep(0)
        setAnswers([])
        setResult(null)
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center border border-gray-100 dark:border-gray-700">
            {!result ? (
                <>
                    <h3 className="text-2xl font-black mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        🇰🇷 Get Your Korean Name
                    </h3>
                    <div className="mb-8">
                        <p className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
                            {questions[step].q}
                        </p>
                        <div className="grid gap-3">
                            {questions[step].options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(opt.type)}
                                    className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all font-medium text-left"
                                >
                                    {opt.text}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-center gap-1">
                        {questions.map((_, i) => (
                            <div key={i} className={`h-1 w-8 rounded-full ${i === step ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="animate-in zoom-in duration-500">
                    <div className="text-sm text-gray-500 uppercase tracking-widest mb-2">Your Korean Identity</div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-1">
                        {result.name}
                    </h2>
                    <p className="text-xl text-purple-600 font-serif italic mb-6">
                        "{result.romaja}"
                    </p>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mb-6">
                        <p className="text-sm text-gray-500 mb-1">Meaning</p>
                        <p className="text-lg font-medium">{result.meaning}</p>
                    </div>

                    <button
                        className="w-full bg-black text-white font-bold py-4 rounded-xl shadow-lg hover:bg-gray-900 transition-transform hover:scale-[1.02] mb-3"
                        onClick={() => alert('Feature coming soon: Order a Name Tag!')}
                    >
                        📛 Order a Name Tag with this name
                    </button>

                    <button
                        onClick={reset}
                        className="text-gray-400 hover:text-gray-600 text-sm underline"
                    >
                        Try again
                    </button>
                </div>
            )}
        </div>
    )
}
