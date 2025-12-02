'use client'

import { useState, useEffect } from 'react'

interface CurrencyDisplayProps {
    amountKRW: number
    targetCurrency?: 'USD' | 'JPY' | 'CNY' | 'EUR'
}

export default function CurrencyDisplay({ amountKRW, targetCurrency = 'USD' }: CurrencyDisplayProps) {
    const [convertedAmount, setConvertedAmount] = useState<number | null>(null)
    const [rate, setRate] = useState<number | null>(null)

    useEffect(() => {
        // 무료 환율 API 사용 (캐싱하여 호출 최소화)
        const fetchRate = async () => {
            try {
                // 실제로는 로컬 스토리지에 캐싱된 값을 먼저 확인하는 것이 좋음
                const res = await fetch('https://api.exchangerate-api.com/v4/latest/KRW')
                const data = await res.json()
                const currentRate = data.rates[targetCurrency]
                setRate(currentRate)
                setConvertedAmount(amountKRW * currentRate)
            } catch (error) {
                console.error('Failed to fetch exchange rate', error)
                // API 실패 시 대략적인 고정 환율 사용 (Fallback)
                const fallbackRates = { USD: 0.00075, JPY: 0.11, CNY: 0.0054, EUR: 0.00069 }
                setRate(fallbackRates[targetCurrency])
                setConvertedAmount(amountKRW * fallbackRates[targetCurrency])
            }
        }

        fetchRate()
    }, [amountKRW, targetCurrency])

    if (convertedAmount === null) return <span>{amountKRW.toLocaleString()}원</span>

    const symbol = { USD: '$', JPY: '¥', CNY: '¥', EUR: '€' }[targetCurrency]

    return (
        <div className="inline-flex flex-col items-end">
            <span className="font-bold text-gray-900 dark:text-white">
                {amountKRW.toLocaleString()}원
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                ≈ {symbol}{convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} {targetCurrency}
            </span>
        </div>
    )
}
