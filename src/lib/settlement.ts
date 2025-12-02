// 정산 시스템 (수행자 출금 요청 및 관리자 승인)
import { supabase } from './supabase';
import { createNotification } from './notifications';

export type WithdrawalStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface WithdrawalRequest {
    id: string;
    user_id: string;
    amount: number;
    bank_name?: string;
    account_number?: string;
    account_holder?: string;
    status: WithdrawalStatus;
    created_at: string;
    processed_at?: string;
    processed_by?: string;
    rejection_reason?: string;
}

/**
 * 출금 가능 금액 확인
 */
export async function getAvailableBalance(userId: string): Promise<number> {
    try {
        const { data: profile } = await supabase
            .from('profiles')
            .select('balance, pending_balance')
            .eq('id', userId)
            .single();

        if (!profile) return 0;

        // 사용 가능 잔액 = 전체 잔액 - 출금 대기 중인 금액
        return profile.balance - (profile.pending_balance || 0);
    } catch (error) {
        console.error('Failed to get available balance:', error);
        return 0;
    }
}

/**
 * 출금 요청
 */
export async function requestWithdrawal(
    userId: string,
    amount: number,
    bankInfo: {
        bank_name: string;
        account_number: string;
        account_holder: string;
    }
): Promise<{ success: boolean; error?: string }> {
    try {
        // 최소 출금 금액 체크
        if (amount < 10) {
            return { success: false, error: '최소 출금 금액은 $10입니다.' };
        }

        // 잔액 확인
        const availableBalance = await getAvailableBalance(userId);
        if (amount > availableBalance) {
            return {
                success: false,
                error: `출금 가능 금액이 부족합니다. (사용 가능: $${availableBalance.toFixed(2)})`,
            };
        }

        // 계좌 정보 검증
        if (!bankInfo.bank_name || !bankInfo.account_number || !bankInfo.account_holder) {
            return { success: false, error: '계좌 정보를 모두 입력해주세요.' };
        }

        // 트랜잭션 생성
        const { data: transaction, error: transactionError } = await supabase
            .from('transactions')
            .insert({
                payer_id: userId,
                payee_id: userId,
                amount: amount,
                fee: 0, // 출금 수수료
                net_amount: amount,
                payment_method: 'bank_transfer',
                status: 'pending',
                type: 'withdrawal',
            })
            .select()
            .single();

        if (transactionError) throw transactionError;

        // pending_balance 증가
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                pending_balance: supabase.rpc('increment', { x: amount }),
            })
            .eq('id', userId);

        if (updateError) throw updateError;

        // 관리자에게 알림
        const { data: admins } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_type', 'admin');

        if (admins) {
            for (const admin of admins) {
                await createNotification(
                    admin.id,
                    'warning',
                    '출금 요청',
                    `$${amount.toFixed(2)} 출금 요청이 접수되었습니다.`,
                    '/admin/withdrawals'
                );
            }
        }

        // 사용자에게 알림
        await createNotification(
            userId,
            'payment_sent',
            '출금 요청 접수',
            `$${amount.toFixed(2)} 출금 요청이 접수되었습니다. 관리자 승인 후 처리됩니다.`
        );

        return { success: true };
    } catch (error) {
        console.error('Failed to request withdrawal:', error);
        return { success: false, error: '출금 요청에 실패했습니다.' };
    }
}

/**
 * 출금 요청 목록 (관리자용)
 */
export async function getPendingWithdrawals(): Promise<WithdrawalRequest[]> {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .select(
                `
        id,
        payer_id,
        amount,
        status,
        created_at,
        profiles:payer_id(full_name, email)
      `
            )
            .eq('type', 'withdrawal')
            .eq('status', 'pending')
            .order('created_at', { ascending: true });

        if (error) throw error;

        return (data || []).map((item: any) => ({
            id: item.id,
            user_id: item.payer_id,
            amount: item.amount,
            status: item.status,
            created_at: item.created_at,
            user_name: item.profiles?.full_name,
            user_email: item.profiles?.email,
        })) as WithdrawalRequest[];
    } catch (error) {
        console.error('Failed to get pending withdrawals:', error);
        return [];
    }
}

/**
 * 출금 승인 (관리자)
 */
export async function approveWithdrawal(
    withdrawalId: string,
    adminId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        // 트랜잭션 조회
        const { data: transaction, error: fetchError } = await supabase
            .from('transactions')
            .select('*')
            .eq('id', withdrawalId)
            .single();

        if (fetchError) throw fetchError;
        if (!transaction) {
            return { success: false, error: '출금 요청을 찾을 수 없습니다.' };
        }

        // 트랜잭션 업데이트
        const { error: updateError } = await supabase
            .from('transactions')
            .update({
                status: 'completed',
                completed_at: new Date().toISOString(),
            })
            .eq('id', withdrawalId);

        if (updateError) throw updateError;

        // 사용자 잔액 업데이트
        const { error: balanceError } = await supabase.rpc('process_withdrawal', {
            p_user_id: transaction.payer_id,
            p_amount: transaction.amount,
        });

        if (balanceError) throw balanceError;

        // 사용자에게 알림
        await createNotification(
            transaction.payer_id,
            'withdrawal_completed',
            '출금 완료',
            `$${transaction.amount.toFixed(2)} 출금이 승인되어 처리되었습니다.`
        );

        return { success: true };
    } catch (error) {
        console.error('Failed to approve withdrawal:', error);
        return { success: false, error: '출금 승인에 실패했습니다.' };
    }
}

/**
 * 출금 거절 (관리자)
 */
export async function rejectWithdrawal(
    withdrawalId: string,
    adminId: string,
    reason: string
): Promise<{ success: boolean; error?: string }> {
    try {
        // 트랜잭션 조회
        const { data: transaction } = await supabase
            .from('transactions')
            .select('*')
            .eq('id', withdrawalId)
            .single();

        if (!transaction) {
            return { success: false, error: '출금 요청을 찾을 수 없습니다.' };
        }

        // 트랜잭션 업데이트
        await supabase
            .from('transactions')
            .update({
                status: 'failed',
                completed_at: new Date().toISOString(),
            })
            .eq('id', withdrawalId);

        // pending_balance 감소
        await supabase
            .from('profiles')
            .update({
                pending_balance: supabase.rpc('decrement', { x: transaction.amount }),
            })
            .eq('id', transaction.payer_id);

        // 사용자에게 알림
        await createNotification(
            transaction.payer_id,
            'warning',
            '출금 거절',
            `출금 요청이 거절되었습니다. 사유: ${reason}`
        );

        return { success: true };
    } catch (error) {
        console.error('Failed to reject withdrawal:', error);
        return { success: false, error: '출금 거절에 실패했습니다.' };
    }
}

/**
 * 내 출금 내역
 */
export async function getMyWithdrawals(userId: string): Promise<WithdrawalRequest[]> {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('payer_id', userId)
            .eq('type', 'withdrawal')
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;

        return data || [];
    } catch (error) {
        console.error('Failed to get my withdrawals:', error);
        return [];
    }
}

// Supabase Function 필요 (SQL)
/*
CREATE OR REPLACE FUNCTION process_withdrawal(p_user_id uuid, p_amount numeric)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET 
    balance = balance - p_amount,
    pending_balance = pending_balance - p_amount
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;
*/
