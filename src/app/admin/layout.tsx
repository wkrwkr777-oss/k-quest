"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Lock } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { userEmail } = useStore();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        // 🦊 개발 모드: 로그인 체크 임시 비활성화
        // 배포 시 아래 주석을 해제하세요!

        /*
        const checkAdmin = async () => {
            if (!userEmail) {
                router.push('/auth/signin');
                return;
            }

            const ADMIN_EMAILS = ['admin@kquest.com', 'wkrwkr777@gmail.com'];

            if (ADMIN_EMAILS.includes(userEmail)) {
                setIsAuthorized(true);
            } else {
                router.push('/');
            }
            setChecking(false);
        };

        checkAdmin();
        */

        // 개발 모드: 즉시 허용
        setIsAuthorized(true);
        setChecking(false);
    }, [userEmail, router]);

    if (checking) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#050505]">
            {/* Admin Header */}
            <div className="bg-[#111] border-b border-[#333] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                    <Lock className="w-5 h-5" />
                    <span className="font-bold">K-Quest Admin Security</span>
                </div>
                <div className="text-xs text-gray-500">
                    Secure Connection • {new Date().toLocaleTimeString()}
                </div>
            </div>
            {children}
        </div>
    );
}
