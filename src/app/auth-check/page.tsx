"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCheckPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch('/api/auth-check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });

        if (response.ok) {
            // 인증 성공 - 쿠키 설정됨
            router.push(redirect);
        } else {
            setError('비밀번호가 틀렸습니다.');
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* 로고 */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-serif text-[#D4AF37] mb-2">K-Quest</h1>
                    <p className="text-gray-400">프라이빗 액세스</p>
                </div>

                {/* 카드 */}
                <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-8">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-white text-center mb-2">
                            🔒 비공개 사이트
                        </h2>
                        <p className="text-gray-400 text-center text-sm">
                            이 사이트는 현재 비공개 상태입니다.<br />
                            테스트용 비밀번호를 입력하세요.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-medium mb-2">
                                비밀번호
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError('');
                                }}
                                placeholder="테스트용 비밀번호 입력"
                                className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] rounded text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
                                autoFocus
                            />
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full px-6 py-3 bg-[#D4AF37] text-black font-medium rounded hover:bg-[#C5A028] transition-colors"
                        >
                            접속하기
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-[#333]">
                        <p className="text-xs text-gray-500 text-center">
                            🔐 승인된 사용자만 접근 가능합니다
                        </p>
                    </div>
                </div>

                {/* 정보 */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-600">
                        K-Quest는 현재 개발 및 테스트 단계입니다.
                    </p>
                </div>
            </div>
        </div>
    );
}
