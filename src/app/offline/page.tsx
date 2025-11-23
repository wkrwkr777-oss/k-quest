"use client";

export default function OfflinePage() {
    return (
        <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center px-6">
            <div className="text-center max-w-md">
                {/* Icon */}
                <div className="w-24 h-24 mx-auto mb-6 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                    <svg
                        className="w-12 h-12 text-[#D4AF37]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
                        />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-serif text-white mb-4">
                    오프라인 모드
                </h1>

                {/* Description */}
                <p className="text-gray-400 mb-8 leading-relaxed">
                    인터넷 연결이 필요합니다. 네트워크 상태를 확인하고 다시 시도해주세요.
                </p>

                {/* Features Available Offline */}
                <div className="bg-[#111] border border-[#333] rounded-lg p-6 mb-8 text-left">
                    <h3 className="text-white font-medium mb-3">오프라인에서도 가능:</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            이전에 본 Quest 목록
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            저장된 프로필 정보
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            이미 로드된 이미지
                        </li>
                    </ul>
                </div>

                {/* Retry Button */}
                <button
                    onClick={() => window.location.reload()}
                    className="w-full px-6 py-3 bg-[#D4AF37] text-black font-medium rounded hover:bg-[#C5A028] transition-colors"
                >
                    다시 연결 시도
                </button>

                {/* Status */}
                <p className="mt-6 text-xs text-gray-500">
                    네트워크가 연결되면 자동으로 동기화됩니다
                </p>
            </div>
        </div>
    );
}
