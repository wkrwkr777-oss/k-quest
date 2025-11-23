"use client";

import { useState } from 'react';
import { AlertTriangle, Flag } from 'lucide-react';
import { submitReport, ReportType, ReportTarget, REPORT_TYPE_LABELS } from '@/lib/fraudPrevention';
import { Button } from './ui/Button';

interface ReportButtonProps {
    targetType: ReportTarget;
    targetId: string;
    reporterId: string;
}

export function ReportButton({ targetType, targetId, reporterId }: ReportButtonProps) {
    const [showDialog, setShowDialog] = useState(false);
    const [reportType, setReportType] = useState<ReportType>('spam');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const result = await submitReport(
            reporterId,
            targetType,
            targetId,
            reportType,
            description
        );

        setIsSubmitting(false);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                setShowDialog(false);
                setSuccess(false);
                setDescription('');
            }, 2000);
        } else {
            setError(result.error || '신고 제출에 실패했습니다.');
        }
    };

    return (
        <>
            <button
                onClick={() => setShowDialog(true)}
                className="text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1 text-sm"
            >
                <Flag className="w-4 h-4" />
                신고
            </button>

            {showDialog && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/80 z-50"
                        onClick={() => setShowDialog(false)}
                    ></div>

                    {/* Dialog */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg max-w-md w-full p-6">
                            {success ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Flag className="w-8 h-8 text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">
                                        신고가 접수되었습니다
                                    </h3>
                                    <p className="text-gray-400 text-sm">
                                        관리자가 검토 후 적절한 조치를 취하겠습니다.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <AlertTriangle className="w-6 h-6 text-red-400" />
                                        <h3 className="text-xl font-semibold text-white">신고하기</h3>
                                    </div>

                                    {/* Report Type */}
                                    <div className="mb-4">
                                        <label className="text-gray-400 text-sm mb-2 block">
                                            신고 유형
                                        </label>
                                        <select
                                            value={reportType}
                                            onChange={(e) => setReportType(e.target.value as ReportType)}
                                            className="w-full bg-[#262626] border border-[#333] text-white px-4 py-2 rounded focus:outline-none focus:border-[#D4AF37]"
                                        >
                                            {Object.entries(REPORT_TYPE_LABELS).map(([value, label]) => (
                                                <option key={value} value={value}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Description */}
                                    <div className="mb-6">
                                        <label className="text-gray-400 text-sm mb-2 block">
                                            상세 설명 (최소 10자)
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="신고 사유를 자세히 알려주세요..."
                                            className="w-full bg-[#262626] border border-[#333] text-white px-4 py-3 rounded focus:outline-none focus:border-[#D4AF37] transition-colors placeholder:text-gray-600 min-h-[100px] resize-none"
                                            required
                                        />
                                    </div>

                                    {/* Error */}
                                    {error && (
                                        <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded text-red-400 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    {/* Buttons */}
                                    <div className="flex gap-3 justify-end">
                                        <button
                                            type="button"
                                            onClick={() => setShowDialog(false)}
                                            className="px-4 py-2 bg-[#262626] text-white rounded hover:bg-[#333] transition-colors"
                                            disabled={isSubmitting}
                                        >
                                            취소
                                        </button>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={isSubmitting || description.length < 10}
                                            className="bg-red-500 hover:bg-red-600"
                                        >
                                            {isSubmitting ? '제출 중...' : '신고 제출'}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
