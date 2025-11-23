'use client'

import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
    const { login, addToast } = useStore()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !password) {
            addToast('Please fill in all fields', 'error')
            return
        }

        setLoading(true)

        try {
            await login(email, password)
            addToast('Login successful!', 'success')
            setTimeout(() => {
                window.location.href = '/'
            }, 500)
        } catch (error) {
            addToast('Login failed', 'error')
        } finally {
            setLoading(false)
        }
    }

    // 소셜 로그인 (준비 중)
    const handleSocialLogin = (provider: string) => {
        addToast(`${provider} login coming soon. Use demo accounts: traveler@demo.com or local@demo.com`, 'info')
    }

    return (
        <main className="min-h-screen bg-[#1A1A1A] pt-32 px-6">
            <div className="max-w-md mx-auto">
                <div className="bg-[#262626] border border-[#333] p-8 md:p-12">
                    <h1 className="text-3xl font-serif text-white mb-2">Sign In</h1>
                    <p className="text-gray-400 mb-8">Welcome back to K-Quest</p>

                    {/* 소셜 로그인 버튼 - 수정됨 */}
                    <div className="flex flex-col gap-3 mb-6">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('Google')}
                            className="w-full bg-white text-gray-700 py-3 px-4 flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors font-medium text-sm"
                            style={{ minHeight: '48px' }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span>Continue with Google</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSocialLogin('Kakao')}
                            className="w-full bg-[#FEE500] text-[#000000] py-3 px-4 flex items-center justify-center gap-3 hover:bg-[#FDD835] transition-colors font-medium text-sm"
                            style={{ minHeight: '48px' }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                                <path d="M12 3C6.477 3 2 6.477 2 10.75c0 2.77 1.82 5.19 4.53 6.56-.21.76-.68 2.49-.78 2.89-.11.46.17.46.36.33.15-.1 2.5-1.67 2.9-2-1.31-.19-2.48-.54-3.48-1.03C3.02 16.33 2 14.03 2 11.75 2 7.88 6.477 4 12 4s10 3.88 10 7.75-4.477 7.75-10 7.75c-.83 0-1.64-.08-2.42-.23-.39.33-2.75 1.9-2.9 2-.19.13-.47.13-.36-.33.1-.4.57-2.13.78-2.89C4.82 15.94 3 13.52 3 10.75 3 6.477 6.477 3 12 3z" />
                            </svg>
                            <span>카카오 로그인</span>
                        </button>
                    </div>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#333]"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[#262626] text-gray-500">Or continue with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Email</label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ color: '#FFFFFF' }}
                                className="w-full bg-[#1A1A1A] border border-[#333] px-4 py-3 focus:border-[#D4AF37] focus:outline-none transition-colors"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ color: '#FFFFFF' }}
                                className="w-full bg-[#1A1A1A] border border-[#333] px-4 py-3 focus:border-[#D4AF37] focus:outline-none transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <Button type="submit" className="w-full py-4 text-lg" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            Don't have an account?{' '}
                            <Link href="/auth/signup" className="text-[#D4AF37] hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>

                    {/* 데모 계정 안내 */}
                    <div className="mt-8 p-4 bg-[#1A1A1A] border border-[#D4AF37]">
                        <p className="text-[#D4AF37] text-sm font-semibold mb-2">💡 Demo Accounts</p>
                        <p className="text-gray-400 text-xs mb-1">Traveler: <span className="text-white">traveler@demo.com</span></p>
                        <p className="text-gray-400 text-xs mb-1">Local Expert: <span className="text-white">local@demo.com</span></p>
                        <p className="text-gray-400 text-xs">Admin: <span className="text-white">admin</span></p>
                        <p className="text-gray-500 text-xs mt-2 italic">No password needed</p>
                    </div>
                </div>
            </div>
        </main>
    )
}
