// 성인 인증 시스템 - 한국인만 필수!
// 외국인은 누구나 퀘스트 등록 가능
import { supabase } from './supabase';
import { createNotification } from './notifications';

export type UserRole = 'client' | 'performer';
export type VerificationMethod = 'passport' | 'id_card' | 'drivers_license';
export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'not_submitted';

/**
 * 나이 계산
 */
function calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}

/**
 * 성인 여부 확인
 */
export function isAdult(birthDate: string): boolean {
    return calculateAge(birthDate) >= 19; // 한국 성인 기준
}

/**
 * 퀘스트 수행 가능 여부 확인
 * 중요: 한국인만 성인 인증 필요!
 */
export async function canPerformQuests(userId: string): Promise<{
    allowed: boolean;
    reason?: string;
}> {
    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('birth_date, age_verified, user_type, is_korean')
            .eq('id', userId)
            .single();

        if (error) throw error;

        // 차단된 사용자
        if (profile.user_type === 'banned' || profile.user_type === 'suspended') {
            return {
                allowed: false,
                reason: '계정이 정지되었습니다.',
            };
        }

        // ⭐ 외국인은 성인 인증 불필요 (Quest 등록만 가능)
        // ⭐ 한국인만 성인 인증 필요 (Quest 수행)

        // 한국인이 아니면 인증 불필요
        if (!profile.is_korean) {
            return { allowed: true };
        }

        // 한국인인 경우 검증 필요
        if (!profile.age_verified) {
            return {
                allowed: false,
                reason: '한국인 퀘스트 수행자는 성인 인증이 필요합니다. (만 19세+)',
            };
        }

        if (!profile.birth_date) {
            return {
                allowed: false,
                reason: '생년월일 정보가 필요합니다.',
            };
        }

        if (!isAdult(profile.birth_date)) {
            return {
                allowed: false,
                reason: '퀘스트 수행은 만 19세 이상만 가능합니다.',
            };
        }

        return { allowed: true };
    } catch (error) {
        console.error('Failed to check quest permission:', error);
        return {
            allowed: false,
            reason: '권한 확인에 실패했습니다.',
        };
    }
}

/**
 * 퀘스트 등록 가능 여부 확인
 * 외국인: 누구나 가능!
 * 한국인: 성인 인증 필요
 */
export async function canCreateQuest(userId: string): Promise<{
    allowed: boolean;
    reason?: string;
}> {
    try {
        const { data: profile } = await supabase
            .from('profiles')
            .select('user_type, is_korean, age_verified')
            .eq('id', userId)
            .single();

        if (!profile) {
            return { allowed: false, reason: '프로필을 찾을 수 없습니다.' };
        }

        // 차단된 사용자
        if (profile.user_type === 'banned' || profile.user_type === 'suspended') {
            return {
                allowed: false,
                reason: '계정이 정지되었습니다.',
            };
        }

        // ⭐ 외국인은 누구나 퀘스트 등록 가능!
        if (!profile.is_korean) {
            return { allowed: true };
        }

        // 한국인도 퀘스트 등록은 가능 (성인 인증은 수행 시에만 필요)
        return { allowed: true };
    } catch (error) {
        console.error('Failed to check create quest permission:', error);
        return {
            allowed: false,
            reason: '권한 확인에 실패했습니다.',
        };
    }
}

/**
 * 성인 인증 제출 (한국인만)
 */
export async function submitAgeVerification(
    userId: string,
    birthDate: string,
    verificationMethod: VerificationMethod,
    documentFile: File
): Promise<{ success: boolean; error?: string }> {
    try {
        // 한국인 여부 확인
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_korean')
            .eq('id', userId)
            .single();

        if (!profile?.is_korean) {
            return {
                success: false,
                error: '외국인은 성인 인증이 필요하지 않습니다.',
            };
        }

        // 나이 체크
        if (!isAdult(birthDate)) {
            return {
                success: false,
                error: '죄송합니다. 퀘스트 수행은 만 19세 이상만 가능합니다.',
            };
        }

        // 문서 파일 검증
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (documentFile.size > maxSize) {
            return {
                success: false,
                error: '파일 크기는 10MB 이하여야 합니다.',
            };
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(documentFile.type)) {
            return {
                success: false,
                error: '지원하는 파일 형식: JPG, PNG, PDF',
            };
        }

        // 파일 업로드
        const fileName = `${userId}_${Date.now()}_${verificationMethod}.${documentFile.type.split('/')[1]}`;
        const filePath = `age-verification/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('verifications')
            .upload(filePath, documentFile);

        if (uploadError) throw uploadError;

        // 공개 URL 가져오기
        const { data: { publicUrl } } = supabase.storage
            .from('verifications')
            .getPublicUrl(filePath);

        // age_verifications 테이블에 저장
        const { error: insertError } = await supabase
            .from('age_verifications')
            .insert({
                user_id: userId,
                birth_date: birthDate,
                verification_method: verificationMethod,
                document_url: publicUrl,
                status: 'pending',
            });

        if (insertError) throw insertError;

        // 프로필 업데이트
        await supabase
            .from('profiles')
            .update({
                birth_date: birthDate,
                verification_status: 'pending',
            })
            .eq('id', userId);

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
                    '성인 인증 검토 필요',
                    '새로운 성인 인증 요청이 있습니다.',
                    '/admin/verifications'
                );
            }
        }

        // 사용자에게 알림
        await createNotification(
            userId,
            'info',
            '성인 인증 제출 완료',
            '관리자 검토 후 24시간 이내에 결과를 알려드립니다.'
        );

        return { success: true };
    } catch (error) {
        console.error('Failed to submit age verification:', error);
        return {
            success: false,
            error: '성인 인증 제출에 실패했습니다.',
        };
    }
}

/**
 * 관리자: 성인 인증 승인
 */
export async function approveAgeVerification(
    verificationId: string,
    adminId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const { data: verification } = await supabase
            .from('age_verifications')
            .select('*')
            .eq('id', verificationId)
            .single();

        if (!verification) {
            return { success: false, error: '검증 정보를 찾을 수 없습니다.' };
        }

        // 검증 상태 업데이트
        await supabase
            .from('age_verifications')
            .update({
                status: 'verified',
                verified_at: new Date().toISOString(),
            })
            .eq('id', verificationId);

        // 프로필 업데이트
        await supabase
            .from('profiles')
            .update({
                age_verified: true,
                verification_status: 'verified',
            })
            .eq('id', verification.user_id);

        // 사용자에게 알림
        await createNotification(
            verification.user_id,
            'success',
            '성인 인증 승인',
            '축하합니다! 이제 퀘스트를 수행하실 수 있습니다.',
            '/quests'
        );

        // 관리자 액션 로그
        await supabase.from('admin_actions').insert({
            admin_id: adminId,
            action_type: 'approve_age_verification',
            target_type: 'user',
            target_id: verification.user_id,
        });

        return { success: true };
    } catch (error) {
        console.error('Failed to approve age verification:', error);
        return { success: false, error: '승인 처리에 실패했습니다.' };
    }
}

/**
 * 관리자: 성인 인증 거절
 */
export async function rejectAgeVerification(
    verificationId: string,
    adminId: string,
    reason: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const { data: verification } = await supabase
            .from('age_verifications')
            .select('*')
            .eq('id', verificationId)
            .single();

        if (!verification) {
            return { success: false, error: '검증 정보를 찾을 수 없습니다.' };
        }

        await supabase
            .from('age_verifications')
            .update({
                status: 'rejected',
                rejection_reason: reason,
            })
            .eq('id', verificationId);

        await supabase
            .from('profiles')
            .update({
                verification_status: 'rejected',
            })
            .eq('id', verification.user_id);

        await createNotification(
            verification.user_id,
            'warning',
            '성인 인증 거절',
            `인증이 거절되었습니다. 사유: ${reason}`,
            '/profile/verification'
        );

        await supabase.from('admin_actions').insert({
            admin_id: adminId,
            action_type: 'reject_age_verification',
            target_type: 'user',
            target_id: verification.user_id,
            details: { reason },
        });

        return { success: true };
    } catch (error) {
        console.error('Failed to reject age verification:', error);
        return { success: false, error: '거절 처리에 실패했습니다.' };
    }
}

/**
 * 사용자 국적 설정
 */
export async function setUserNationality(
    userId: string,
    isKorean: boolean
): Promise<{ success: boolean; error?: string }> {
    try {
        await supabase
            .from('profiles')
            .update({ is_korean: isKorean })
            .eq('id', userId);

        return { success: true };
    } catch (error) {
        console.error('Failed to set user nationality:', error);
        return { success: false, error: '국적 설정에 실패했습니다.' };
    }
}

// profiles 테이블에 is_korean 필드 추가 필요:
/*
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_korean boolean DEFAULT false;
*/
