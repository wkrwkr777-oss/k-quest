import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2024-06-20' as any,
});

export const dynamic = 'force-dynamic';

/**
 * Stripe 결제 인텐트 생성 API
 * 70:30 수익 분배 시스템 적용
 */
export async function POST(request: Request) {
    try {
        const { amount, currency = 'usd', questId, userId } = await request.json();

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: 'Invalid amount' },
                { status: 400 }
            );
        }

        // 수익 분배 계산 (수행자 70%, 플랫폼 30%)
        const PLATFORM_FEE_RATE = 0.30;
        const PERFORMER_EARNING_RATE = 0.70;

        const platformFee = amount * PLATFORM_FEE_RATE;
        const performerEarning = amount * PERFORMER_EARNING_RATE;

        // Stripe PaymentIntent 생성
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amount in cents
            currency: currency,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                questId: questId || '',
                userId: userId || '',
                platformFee: platformFee.toFixed(2),
                performerEarning: performerEarning.toFixed(2),
                revenueSplitRatio: '70:30',
            },
            description: `K-Quest Payment - Quest #${questId || 'N/A'}`,
        });

        // DB에 pending 거래 기록 생성
        if (questId && userId) {
            try {
                await supabaseAdmin
                    .from('transactions')
                    .insert({
                        quest_id: questId,
                        payer_id: userId,
                        amount: amount,
                        platform_fee: platformFee,
                        performer_earning: performerEarning,
                        revenue_split_ratio: PERFORMER_EARNING_RATE,
                        payment_method: 'stripe',
                        payment_id: paymentIntent.id,
                        status: 'pending',
                        type: 'payment',
                    });
            } catch (dbError) {
                console.error('DB insert error:', dbError);
                // DB 에러는 무시하고 결제는 진행
            }
        }

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            amount: amount,
            platformFee: platformFee,
            performerEarning: performerEarning,
            revenueSplit: {
                performer: '70%',
                platform: '30%',
            },
        });
    } catch (error: any) {
        console.error('Stripe error:', error);
        return NextResponse.json(
            { error: error.message || 'Payment creation failed' },
            { status: 500 }
        );
    }
}
