// ============================================
// 프로필 이미지 필수 체크
// ============================================

import { supabase } from './supabase';

/**
 * 프로필 이미지 필수 체크
 */
export async function checkProfileImageRequired(userId: string): Promise<{
    hasImage: boolean;
    imageUrl: string | null;
    needsUpload: boolean;
}> {
    try {
        const { data } = await supabase
            .from('profiles')
            .select('avatar_url')
            .eq('id', userId)
            .single();

        const hasImage = !!data?.avatar_url;

        return {
            hasImage,
            imageUrl: data?.avatar_url || null,
            needsUpload: !hasImage
        };
    } catch (error) {
        return {
            hasImage: false,
            imageUrl: null,
            needsUpload: true
        };
    }
}

/**
 * 프로필 이미지 업데이트
 */
export async function updateProfileImage(
    userId: string,
    imageUrl: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabase
            .from('profiles')
            .update({ avatar_url: imageUrl })
            .eq('id', userId);

        if (error) throw error;

        // 'verified' 뱃지 부여
        await supabase
            .from('user_badges')
            .upsert({
                user_id: userId,
                badge_type: 'verified'
            }, {
                onConflict: 'user_id,badge_type'
            });

        return { success: true };
    } catch (error) {
        console.error('Failed to update profile image:', error);
        return {
            success: false,
            error: '프로필 이미지 업데이트에 실패했습니다.'
        };
    }
}

/**
 * Quest 생성 전 프로필 체크
 */
export async function canCreateQuest(userId: string): Promise<{
    allowed: boolean;
    reason?: string;
}> {
    const profileCheck = await checkProfileImageRequired(userId);

    if (profileCheck.needsUpload) {
        return {
            allowed: false,
            reason: 'Quest를 생성하려면 프로필 사진이 필요합니다.'
        };
    }

    return { allowed: true };
}
