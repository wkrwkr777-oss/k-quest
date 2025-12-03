"use client";

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export function InstallAppButton() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [showIOSGuide, setShowIOSGuide] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // 이미 앱으로 실행 중인지 확인
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsStandalone(true);
        }

        // 안드로이드/PC 설치 이벤트 감지
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        });

        // iOS 감지
        const userAgent = window.navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(userAgent)) {
            setIsIOS(true);
        }
    }, []);

    const handleInstallClick = () => {
        if (isIOS) {
            setShowIOSGuide(true);
        } else if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult: any) => {
                if (choiceResult.outcome === 'accepted') {
                    setDeferredPrompt(null);
                }
            });
        } else {
            // 개발 환경이거나 PWA 조건이 안 맞을 때
            alert("✅ 배포 후 실제 사이트에서는 '홈 화면에 추가' 기능이 작동합니다!\n\n(지금은 localhost라서 테스트용 버튼만 보입니다)");
        }
    };

    // 이미 앱으로 실행 중이면 숨김
    if (isStandalone) return null;

    return (
        <>
            <button
                onClick={handleInstallClick}
                className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black font-bold rounded-full hover:bg-[#F4CF57] transition-all shadow-[0_0_15px_rgba(212,175,55,0.4)] animate-pulse"
            >
                <Download className="w-4 h-4" />
                <span className="text-xs uppercase tracking-widest">Install App</span>
            </button>

            {/* iOS 설치 가이드 모달 */}
            {showIOSGuide && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowIOSGuide(false)}>
                    <div className="bg-[#1a1a1a] border border-[#D4AF37]/30 p-6 rounded-2xl max-w-sm w-full relative" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setShowIOSGuide(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h3 className="text-xl font-bold text-[#D4AF37] mb-4 text-center">Install K-QUEST App</h3>

                        <div className="space-y-4 text-white text-sm">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-gray-800 rounded-lg">
                                    <span className="text-2xl">1</span>
                                </div>
                                <p>Tap the <span className="text-blue-400 font-bold">Share</span> button below.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-gray-800 rounded-lg">
                                    <span className="text-2xl">2</span>
                                </div>
                                <p>Select <span className="font-bold">Add to Home Screen</span>.</p>
                            </div>
                        </div>

                        <div className="mt-6 text-center text-xs text-gray-500">
                            Tap anywhere to close
                        </div>

                        {/* 화살표 애니메이션 (하단 가리킴) */}
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white animate-bounce">
                            ⬇️
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
