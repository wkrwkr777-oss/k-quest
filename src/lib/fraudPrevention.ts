// 신고 및 사기 방지 시스템
import { supabase } from './supabase';
import { createNotification } from './notifications';

export type ReportType =
    | 'spam'
    | 'scam'
    | 'inappropriate_content'
    | 'harassment'
    | 'fake_profile'
    | 'payment_fraud'
    | 'other';

export type ReportTarget = 'user' | 'quest' | 'message' | 'review';

interface Report {
    id: string;
    reporter_id: string;
    target_type: ReportTarget;
    target_id: string;
    report_type: ReportType;
    description: string;
    created_at: string;
    status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
}

/**
 * 신고 제출
 */
export async function submitReport(
    reporterId: string,
    targetType: ReportTarget,
    targetId: string,
    reportType: ReportType,
    description: string
): Promise<{ success: boolean; error?: string }> {
    try {
        // 검증
        if (!description || description.length < 10) {
            return { success: false, error: '신고 사유를 10자 이상 입력해주세요.' };
        }

        // 중복 신고 확인 (24시간 이내)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { data: existing } = await supabase
            .from('reports')
            .select('id')
            .eq('reporter_id', reporterId)
            .eq('target_type', targetType)
            .eq('target_id', targetId)
            .gte('created_at', oneDayAgo)
            .single();

        if (existing) {
            return { success: false, error: '이미 신고하셨습니다. (24시간 내 중복 신고 불가)' };
        }

        // 신고 생성
        const { error } = await supabase.from('reports').insert({
            reporter_id: reporterId,
            target_type: targetType,
            target_id: targetId,
            report_type: reportType,
            description,
            status: 'pending',
        });

        if (error) throw error;

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
                    '새 신고 접수',
                    `${targetType}에 대한 신고가 접수되었습니다.`,
                    `/admin/reports`
                );
            }
        }

        // 자동 조치 (심각한 신고일 경우)
        if (reportType === 'scam' || reportType === 'payment_fraud') {
            await handleCriticalReport(targetType, targetId);
        }

        return { success: true };
    } catch (error) {
        console.error('Failed to submit report:', error);
        return { success: false, error: '신고 제출에 실패했습니다.' };
    }
}

/**
 * 심각한 신고 자동 처리
 */
async function handleCriticalReport(
    targetType: ReportTarget,
    targetId: string
): Promise<void> {
    try {
        // Quest인 경우 비공개 처리
        if (targetType === 'quest') {
            await supabase
                .from('quests')
                .update({ status: 'under_review' })
                .eq('id', targetId);
        }

        // User인 경우 경고 증가
        if (targetType === 'user') {
            const { data: profile } = await supabase
                .from('profiles')
                .select('warning_count')
                .eq('id', targetId)
                .single();

            if (profile) {
                const newCount = (profile.warning_count || 0) + 1;
                await supabase
                    .from('profiles')
                    .update({ warning_count: newCount })
                    .eq('id', targetId);

                // 3회 이상 경고 시 계정 정지
                if (newCount >= 3) {
                    await supabase
                        .from('profiles')
                        .update({ user_type: 'banned' })
                        .eq('id', targetId);

                    await createNotification(
                        targetId,
                        'ban',
                        '계정 정지',
                        '다수의 신고로 인해 계정이 정지되었습니다.'
                    );
                }
            }
        }
    } catch (error) {
        console.error('Failed to handle critical report:', error);
    }
}

/**
 * 사용자 검증 시스템
 */
export async function verifyUser(
    userId: string,
    verificationType: 'email' | 'phone' | 'identity'
): Promise<{ success: boolean; error?: string }> {
    try {
        // 이메일 검증
        if (verificationType === 'email') {
            // Supabase Auth의 이메일 검증 사용
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: '', // 실제 이메일 필요
            });

            if (error) throw error;
        }

        // 전화번호 검증
        if (verificationType === 'phone') {
            // SMS 인증 로직 (외부 서비스 필요)
            console.log('Phone verification for:', userId);
        }

        // 신분증 검증
        if (verificationType === 'identity') {
            // 신분증 업로드 및 검증 (수동 검증 필요)
            await supabase
                .from('profiles')
                .update({ verification_status: 'pending' })
                .eq('id', userId);
        }

        return { success: true };
    } catch (error) {
        console.error('Failed to verify user:', error);
        return { success: false, error: '검증에 실패했습니다.' };
    }
}

/**
 * 의심스러운 패턴 감지
 */
export async function detectSuspiciousPatterns(
    userId: string
): Promise<{
    suspicious: boolean;
    reasons: string[];
}> {
    const reasons: string[] = [];

    try {
        // 1. 단기간 다수의 Quest 생성
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        const { count: recentQuests } = await supabase
            .from('quests')
            .select('*', { count: 'exact', head: true })
            .eq('client_id', userId)
            .gte('created_at', oneHourAgo);

        if ((recentQuests || 0) > 5) {
            reasons.push('단기간 과도한 Quest 생성');
        }

        // 2. 비정상적인 금액 패턴
        const { data: quests } = await supabase
            .from('quests')
            .select('reward')
            .eq('client_id', userId)
            .order('created_at', { ascending: false })
            .limit(10);

        if (quests) {
            const avgReward = quests.reduce((sum, q) => sum + q.reward, 0) / quests.length;
            const hasAbnormalPrices = quests.some(
                (q) => q.reward < 1 || q.reward > avgReward * 10
            );

            if (hasAbnormalPrices) {
                reasons.push('비정상적인 금액 패턴');
            }
        }

        // 3. 다수의 신고 받음
        const { count: reportCount } = await supabase
            .from('reports')
            .select('*', { count: 'exact', head: true })
            .eq('target_type', 'user')
            .eq('target_id', userId)
            .eq('status', 'pending');

        if ((reportCount || 0) >= 3) {
            reasons.push('다수의 신고 접수됨');
        }

        // 4. 계정 생성 후 즉시 활동
        const { data: profile } = await supabase
            .from('profiles')
            .select('created_at')
            .eq('id', userId)
            .single();

        if (profile) {
            const accountAge = Date.now() - new Date(profile.created_at).getTime();
            const oneDayInMs = 24 * 60 * 60 * 1000;

            if (accountAge < oneDayInMs && (recentQuests || 0) > 2) {
                reasons.push('신규 계정의 과도한 활동');
            }
        }

        return {
            suspicious: reasons.length > 0,
            reasons,
        };
    } catch (error) {
        console.error('Failed to detect suspicious patterns:', error);
        return { suspicious: false, reasons: [] };
    }
}

/**
 * 자동 조치 시스템
 */
export async function takeAutomatedAction(
    userId: string,
    reason: string
): Promise<void> {
    try {
        // 경고 증가
        const { data: profile } = await supabase
            .from('profiles')
            .select('warning_count')
            .eq('id', userId)
            .single();

        if (profile) {
            const newCount = (profile.warning_count || 0) + 1;
            await supabase
                .from('profiles')
                .update({ warning_count: newCount })
                .eq('id', userId);

            // 알림 발송
            await createNotification(
                userId,
                'warning',
                '의심스러운 활동 감지',
                `시스템이 의심스러운 활동을 감지했습니다: ${reason}`
            );

            // 3회 이상 경고 시  일시 정지
            if (newCount >= 3) {
                await supabase
                    .from('profiles')
                    .update({ user_type: 'suspended' })
                    .eq('id', userId);

                await createNotification(
                    userId,
                    'ban',
                    '계정 일시 정지',
                    '의심스러운 활동으로 인해 계정이 일시 정지되었습니다. 고객센터에 문의하세요.'
                );
            }
        }
    } catch (error) {
        console.error('Failed to take automated action:', error);
    }
}

/**
 * 신고 타입별 라벨
 */
export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
    spam: '스팸',
    scam: '사기',
    inappropriate_content: '부적절한 콘텐츠',
    harassment: '괴롭힘',
    fake_profile: '가짜 프로필',
    payment_fraud: '결제 사기',
    other: '기타',
};
