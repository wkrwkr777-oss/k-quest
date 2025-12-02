import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * 지급명세서 생성 API
 * 매년 1월에 수행자들의 수익 내역을 CSV로 다운로드하여 국세청에 제출
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const year = searchParams.get('year') || new Date().getFullYear().toString()

    try {
        // 해당 연도의 모든 수행자 소득 내역 조회
        const { data: incomeData, error } = await supabaseAdmin
            .from('performer_annual_income')
            .select(`
                performer_id,
                total_income,
                quest_count,
                profiles (
                    name,
                    email,
                    phone
                )
            `)
            .eq('year', year)
            .order('total_income', { ascending: false })

        if (error) throw error

        // CSV 형식으로 변환
        const csvHeader = '수행자명,이메일,전화번호,연간 총 수익,퀘스트 수\n'
        const csvRows = incomeData.map(item => {
            const profile = item.profiles as any
            return [
                profile?.name || '정보없음',
                profile?.email || '',
                profile?.phone || '',
                item.total_income,
                item.quest_count
            ].join(',')
        }).join('\n')

        const csv = csvHeader + csvRows

        // CSV 파일로 응답
        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="payment_statement_${year}.csv"`
            }
        })
    } catch (error) {
        console.error('Payment statement generation error:', error)
        return NextResponse.json({ error: 'Failed to generate payment statement' }, { status: 500 })
    }
}
