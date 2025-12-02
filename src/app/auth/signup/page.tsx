"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Crown, Mail, Lock, User, ArrowRight, Chrome, Github } from 'lucide-react';
import { PremiumButton, GlassCard, PremiumAlert } from '@/components/PremiumComponents';

export default function SignUp() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            setLoading(false);
            return;
        }

        // Mock signup
        setTimeout(() => {
            router.push('/dashboard');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#C5A028] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Crown className="w-6 h-6 text-black" />
                        </div>
                        <span className="text-2xl font-bold text-white">K-QUEST</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-gray-400">Join the exclusive community of VIPs</p>
                </div>

                <GlassCard className="border-t border-[#D4AF37]/20">
                    <form onSubmit={handleSignUp} className="space-y-6">
                        {error && (
                            <PremiumAlert type="error" message={error} />
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl py-3 pl-12 pr-4 text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all outline-none"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl py-3 pl-12 pr-4 text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all outline-none"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl py-3 pl-12 pr-4 text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all outline-none"
                                    placeholder="Create a strong password"
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Must be at least 8 characters long</p>
                        </div>

                        <PremiumButton
                            loading={loading}
                            className="w-full"
                            icon={<ArrowRight className="w-5 h-5" />}
                        >
                            Create Account
                        </PremiumButton>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[#333]"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-[#1A1A1A] text-gray-500">Or sign up with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-[#262626] border border-[#333] rounded-xl text-white hover:bg-[#333] transition-colors">
                                <Chrome className="w-5 h-5" />
                                <span>Google</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-[#FEE500] border border-[#FEE500] rounded-xl text-[#000000] hover:bg-[#FDD835] transition-colors font-bold">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 3C6.477 3 2 6.477 2 10.75c0 2.77 1.82 5.19 4.53 6.56-.21.76-.68 2.49-.78 2.89-.11.46.17.46.36.33.15-.1 2.5-1.67 2.9-2-1.31-.19-2.48-.54-3.48-1.03C3.02 16.33 2 14.03 2 11.75 2 7.88 6.477 4 12 4s10 3.88 10 7.75-4.477 7.75-10 7.75c-.83 0-1.64-.08-2.42-.23-.39.33-2.75 1.9-2.9 2-.19.13-.47.13-.36-.33.1-.4.57-2.13.78-2.89C4.82 15.94 3 13.52 3 10.75 3 6.477 6.477 3 12 3z" />
                                </svg>
                                <span>Kakao</span>
                            </button>
                        </div>
                    </div>
                </GlassCard>

                <p className="text-center mt-8 text-gray-400">
                    Already have an account?{' '}
                    <Link href="/auth/signin" className="text-[#D4AF37] font-bold hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
