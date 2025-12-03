"use client";

import { useState } from 'react';
import { Shield, CheckCircle } from 'lucide-react';

interface PassVerificationProps {
    onVerified: (data: { name: string; birthdate: string; phoneNumber: string }) => void;
}

export function PassVerification({ onVerified }: PassVerificationProps) {
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);

    const handleVerify = async () => {
        setLoading(true);

        // PASS 인증 팝업 열기
        const width = 420;
        const height = 640;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;

        const popup = window.open(
            '/api/pass-auth/start',
            'pass_verification',
            `width=${width},height=${height},left=${left},top=${top}`
        );

        // 팝업에서 결과 수신
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'PASS_VERIFIED') {
                const { name, birthdate, phoneNumber } = event.data;
                setVerified(true);
                setLoading(false);
                onVerified({ name, birthdate, phoneNumber });
                popup?.close();
                window.removeEventListener('message', handleMessage);
            } else if (event.data.type === 'PASS_ERROR') {
                alert(event.data.message);
                setLoading(false);
                popup?.close();
                window.removeEventListener('message', handleMessage);
            }
        };

        window.addEventListener('message', handleMessage);

        // 팝업이 닫히면 loading 해제
        const checkPopup = setInterval(() => {
            if (popup?.closed) {
                setLoading(false);
                clearInterval(checkPopup);
                window.removeEventListener('message', handleMessage);
            }
        }, 500);
    };

    if (verified) {
        return (
            <div className="py-4 px-6 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className="text-green-400 font-bold">본인인증 완료</span>
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={handleVerify}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[#00C73C] to-[#00A830] text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,199,60,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Shield className="w-5 h-5" />
            {loading ? '인증 중...' : '📱 PASS로 본인인증 (SKT/KT/LG U+)'}
        </button>
    );
}
