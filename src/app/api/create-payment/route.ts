import { NextRequest, NextResponse } from 'next/server'

const PAYPAL_API_URL = process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'

async function getPayPalAccessToken() {
    const auth = Buffer.from(
        `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString('base64')

    const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${auth}`,
        },
        body: 'grant_type=client_credentials',
    })

    const data = await response.json()
    return data.access_token
}

export async function POST(req: NextRequest) {
    try {
        const { questId, amount } = await req.json()

        // 수익 분배 계산 (수행자 70%, 플랫폼 30%)
        const PLATFORM_FEE_RATE = 0.30
        const PERFORMER_EARNING_RATE = 0.70

        const platformFee = amount * PLATFORM_FEE_RATE
        const performerEarning = amount * PERFORMER_EARNING_RATE

        const accessToken = await getPayPalAccessToken()

        // PayPal Order 생성
        const orderResponse = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: 'USD',
                        value: amount.toFixed(2),
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: amount.toFixed(2),
                            },
                        },
                    },
                    description: `K-Quest: Quest #${questId}`,
                    items: [{
                        name: 'Quest Payment',
                        quantity: '1',
                        unit_amount: {
                            currency_code: 'USD',
                            value: amount.toFixed(2),
                        },
                    }],
                }],
                application_context: {
                    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/quests/${questId}?payment=success`,
                    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/quests/${questId}?payment=cancelled`,
                },
            }),
        })

        const orderData = await orderResponse.json()

        return NextResponse.json({
            orderId: orderData.id,
            platformFee,
            performerEarning,
        })
    } catch (error) {
        console.error('PayPal error:', error)
        return NextResponse.json(
            { error: 'Payment creation failed' },
            { status: 500 }
        )
    }
}
