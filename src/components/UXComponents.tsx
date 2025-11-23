// UX 개선 컴포넌트들
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

/**
 * 로딩 스피너
 */
export function LoadingSpinner({ size = 'md', message }: {
    size?: 'sm' | 'md' | 'lg';
    message?: string;
}) {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div
                className={`animate-spin rounded-full border-b-2 border-[#D4AF37] ${sizes[size]}`}
            ></div>
            {message && <p className="text-gray-400 text-sm">{message}</p>}
        </div>
    );
}

/**
 * 스켈레톤 로딩
 */
export function SkeletonCard() {
    return (
        <div className="bg-[#111] border border-[#333] p-6 rounded-lg animate-pulse">
            <div className="h-6 bg-[#262626] rounded mb-4"></div>
            <div className="h-4 bg-[#262626] rounded mb-2"></div>
            <div className="h-4 bg-[#262626] rounded w-2/3"></div>
        </div>
    );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}

/**
 * 빈 상태 UI
 */
interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="text-center py-16 px-6">
            {icon && <div className="mx-auto mb-4 opacity-30">{icon}</div>}
            <h3 className="text-xl text-white font-semibold mb-2">{title}</h3>
            {description && <p className="text-gray-400 mb-6 max-w-md mx-auto">{description}</p>}
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-6 py-3 bg-[#D4AF37] text-black font-medium rounded hover:bg-[#C5A028] transition-colors"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}

/**
 * 에러 메시지
 */
interface ErrorMessageProps {
    title?: string;
    message: string;
    retry?: () => void;
}

export function ErrorMessage({ title = '오류', message, retry }: ErrorMessageProps) {
    return (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
            <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h3 className="text-red-400 font-semibold mb-1">{title}</h3>
                    <p className="text-red-300 text-sm">{message}</p>
                    {retry && (
                        <button
                            onClick={retry}
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium"
                        >
                            다시 시도
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * 성공 메시지
 */
export function SuccessMessage({ message }: { message: string }) {
    return (
        <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
            <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="text-green-300 text-sm">{message}</p>
            </div>
        </div>
    );
}

/**
 * 정보 메시지
 */
export function InfoMessage({ message }: { message: string }) {
    return (
        <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
            <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-blue-400" />
                <p className="text-blue-300 text-sm">{message}</p>
            </div>
        </div>
    );
}

/**
 * 경고 메시지
 */
export function WarningMessage({ message }: { message: string }) {
    return (
        <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
            <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <p className="text-yellow-300 text-sm">{message}</p>
            </div>
        </div>
    );
}

/**
 * 확인 다이얼로그
 */
interface ConfirmDialogProps {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
    title,
    message,
    confirmLabel = '확인',
    cancelLabel = '취소',
    onConfirm,
    onCancel,
    variant = 'info',
}: ConfirmDialogProps) {
    const colors = {
        danger: 'bg-red-500 hover:bg-red-600',
        warning: 'bg-yellow-500 hover:bg-yellow-600',
        info: 'bg-[#D4AF37] hover:bg-[#C5A028]',
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/80 z-50"
                onClick={onCancel}
            ></div>

            {/* Dialog */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-[#1A1A1A] border border-[#333] rounded-lg max-w-md w-full p-6">
                    <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
                    <p className="text-gray-300 mb-6">{message}</p>
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 bg-[#262626] text-white rounded hover:bg-[#333] transition-colors"
                        >
                            {cancelLabel}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`px-4 py-2 text-white rounded transition-colors ${colors[variant]}`}
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

/**
 * 프로그레스 바
 */
export function ProgressBar({ progress }: { progress: number }) {
    return (
        <div className="w-full bg-[#262626] rounded-full h-2 overflow-hidden">
            <div
                className="bg-[#D4AF37] h-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            ></div>
        </div>
    );
}
