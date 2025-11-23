// 이미지 업로드 및 관리
import { supabase } from './supabase';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * 파일 검증
 */
function validateFile(file: File): { valid: boolean; error?: string } {
    if (!ALLOWED_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: '지원하지 않는 파일 형식입니다. (JPG, PNG, WEBP만 가능)',
        };
    }

    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: '파일 크기는 5MB 이하여야 합니다.',
        };
    }

    return { valid: true };
}

/**
 * 이미지 최적화 (클라이언트 사이드)
 */
async function optimizeImage(
    file: File,
    maxWidth: number = 1200
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('이미지 최적화에 실패했습니다.'));
                        }
                    },
                    'image/jpeg',
                    0.85
                );
            };
            img.onerror = () => reject(new Error('이미지 로드에 실패했습니다.'));
            img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error('파일 읽기에 실패했습니다.'));
        reader.readAsDataURL(file);
    });
}

/**
 * 프로필 사진 업로드
 */
export async function uploadProfilePicture(
    userId: string,
    file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
        // 파일 검증
        const validation = validateFile(file);
        if (!validation.valid) {
            return { success: false, error: validation.error };
        }

        // 이미지 최적화
        const optimizedBlob = await optimizeImage(file, 400);
        const optimizedFile = new File([optimizedBlob], file.name, {
            type: 'image/jpeg',
        });

        // 파일명 생성 (중복 방지)
        const fileExt = 'jpg';
        const fileName = `${userId}_${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        // Supabase Storage에 업로드
        const { error: uploadError } = await supabase.storage
            .from('profiles')
            .upload(filePath, optimizedFile, {
                cacheControl: '3600',
                upsert: false,
            });

        if (uploadError) throw uploadError;

        // 공개 URL 가져오기
        const {
            data: { publicUrl },
        } = supabase.storage.from('profiles').getPublicUrl(filePath);

        // 프로필 업데이트
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: publicUrl })
            .eq('id', userId);

        if (updateError) throw updateError;

        return { success: true, url: publicUrl };
    } catch (error) {
        console.error('Failed to upload profile picture:', error);
        return { success: false, error: '프로필 사진 업로드에 실패했습니다.' };
    }
}

/**
 * Quest 이미지 업로드 (여러 장)
 */
export async function uploadQuestImages(
    questId: string,
    files: File[]
): Promise<{ success: boolean; urls?: string[]; error?: string }> {
    try {
        if (files.length === 0) {
            return { success: false, error: '파일을 선택해주세요.' };
        }

        if (files.length > 5) {
            return { success: false, error: '최대 5장까지 업로드 가능합니다.' };
        }

        // 모든 파일 검증
        for (const file of files) {
            const validation = validateFile(file);
            if (!validation.valid) {
                return { success: false, error: validation.error };
            }
        }

        const urls: string[] = [];

        // 각 파일 업로드
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // 이미지 최적화
            const optimizedBlob = await optimizeImage(file, 1200);
            const optimizedFile = new File([optimizedBlob], file.name, {
                type: 'image/jpeg',
            });

            const fileExt = 'jpg';
            const fileName = `${questId}_${i}_${Date.now()}.${fileExt}`;
            const filePath = `quests/${fileName}`;

            // 업로드
            const { error: uploadError } = await supabase.storage
                .from('quests')
                .upload(filePath, optimizedFile, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (uploadError) throw uploadError;

            // 공개 URL
            const {
                data: { publicUrl },
            } = supabase.storage.from('quests').getPublicUrl(filePath);

            urls.push(publicUrl);
        }

        // Quest 테이블 업데이트
        const { error: updateError } = await supabase
            .from('quests')
            .update({ images: urls })
            .eq('id', questId);

        if (updateError) throw updateError;

        return { success: true, urls };
    } catch (error) {
        console.error('Failed to upload quest images:', error);
        return { success: false, error: 'Quest 이미지 업로드에 실패했습니다.' };
    }
}

/**
 * 이미지 삭제
 */
export async function deleteImage(
    bucket: 'profiles' | 'quests',
    filePath: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabase.storage.from(bucket).remove([filePath]);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error('Failed to delete image:', error);
        return { success: false, error: '이미지 삭제에 실패했습니다.' };
    }
}
