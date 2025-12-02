import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
    // 1. IP 주소 가져오기
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'

    // 2. Rate Limit 체크
    const { allowed, remaining } = rateLimit(ip, {
        maxRequests: 10, // 1분에 10번만 허용
        windowMs: 60 * 1000
    })

    if (!allowed) {
        return NextResponse.json(
            { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
            {
                status: 429, // Too Many Requests
                headers: {
                    'X-RateLimit-Remaining': '0',
                    'Retry-After': '60'
                }
            }
        )
    }

    // 3. 정상 처리
    try {
        // 실제 API 로직...
        return NextResponse.json({
            success: true,
            // Rate Limit 정보를 응답 헤더에 포함
        }, {
            headers: {
                'X-RateLimit-Remaining': remaining.toString()
            }
        })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
