"use client";

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadProfilePicture, uploadQuestImages } from '@/lib/imageUpload';
import { Button } from './ui/Button';

interface ImageUploadProps {
    type: 'profile' | 'quest';
    userId?: string;
    questId?: string;
    currentImages?: string[];
    onSuccess?: (urls: string[]) => void;
    maxFiles?: number;
}

export function ImageUpload({
    type,
    userId,
    questId,
    currentImages = [],
    onSuccess,
    maxFiles = type === 'profile' ? 1 : 5,
}: ImageUploadProps) {
    const [previews, setPreviews] = useState<string[]>(currentImages);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setError('');

        // 미리보기 생성
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setPreviews(type === 'profile' ? newPreviews : [...previews, ...newPreviews].slice(0, maxFiles));

        // 업로드
        setIsUploading(true);

        if (type === 'profile' && userId) {
            const result = await uploadProfilePicture(userId, files[0]);
            setIsUploading(false);

            if (result.success && result.url) {
                onSuccess?.([result.url]);
            } else {
                setError(result.error || '업로드에 실패했습니다.');
                setPreviews(currentImages);
            }
        } else if (type === 'quest' && questId) {
            const result = await uploadQuestImages(questId, files);
            setIsUploading(false);

            if (result.success && result.urls) {
                onSuccess?.(result.urls);
            } else {
                setError(result.error || '업로드에 실패했습니다.');
                setPreviews(currentImages);
            }
        }

        // 파일 입력 초기화
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removePreview = (index: number) => {
        const newPreviews = previews.filter((_, i) => i !== index);
        setPreviews(newPreviews);
    };

    return (
        <div className="space-y-4">
            {/* 미리보기 */}
            {previews.length > 0 && (
                <div className={`grid gap-4 ${type === 'profile' ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'}`}>
                    {previews.map((preview, index) => (
                        <div
                            key={index}
                            className="relative aspect-square bg-[#262626] border border-[#333] rounded-lg overflow-hidden group"
                        >
                            <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={() => removePreview(index)}
                                className="absolute top-2 right-2 p-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* 업로드 버튼 */}
            {previews.length < maxFiles && (
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        multiple={type === 'quest'}
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="w-full py-8 border-2 border-dashed border-[#333] rounded-lg hover:border-[#D4AF37] transition-colors flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUploading ? (
                            <>
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
                                <span className="text-sm">업로드 중...</span>
                            </>
                        ) : (
                            <>
                                <Upload className="w-8 h-8" />
                                <div className="text-center">
                                    <p className="text-sm font-medium">
                                        {type === 'profile' ? '프로필 사진 선택' : '이미지 선택'}
                                    </p>
                                    <p className="text-xs mt-1">
                                        JPG, PNG, WEBP (최대 5MB)
                                        {type === 'quest' && ` · 최대 ${maxFiles}장`}
                                    </p>
                                </div>
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* 에러 메시지 */}
            {error && (
                <div className="p-3 bg-red-900/20 border border-red-500 rounded text-red-400 text-sm">
                    {error}
                </div>
            )}
        </div>
    );
}

interface ImageGalleryProps {
    images: string[];
    onClose?: () => void;
}

export function ImageGallery({ images, onClose }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (images.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400">
                <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>이미지가 없습니다</p>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* 메인 이미지 */}
            <div className="aspect-video bg-[#111] rounded-lg overflow-hidden mb-4">
                <img
                    src={images[currentIndex]}
                    alt={`Image ${currentIndex + 1}`}
                    className="w-full h-full object-contain"
                />
            </div>

            {/* 썸네일 */}
            {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`aspect-square rounded overflow-hidden border-2 transition-colors ${index === currentIndex
                                    ? 'border-[#D4AF37]'
                                    : 'border-[#333] hover:border-[#666]'
                                }`}
                        >
                            <img
                                src={img}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
