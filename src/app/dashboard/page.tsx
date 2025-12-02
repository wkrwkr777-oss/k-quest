"use client";

import Link from 'next/link';
import {
    Plus, Settings, Wallet, ShieldCheck, Activity, Cpu, Database, Signal
} from 'lucide-react';
import { PremiumCard, GlassCard, StatCard, PremiumButton } from '@/components/PremiumComponents';

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-[#030305] pt-28 pb-12 px-6">
            <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-20" />
            <div className="max-w-7xl mx-auto relative z-10">
                {/* HUD Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-[#00F0FF]/20 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[#00F0FF] text-xs font-mono tracking-widest">SYSTEM ONLINE</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white font-mono">COMMAND CENTER</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/quests/create">
                            <PremiumButton icon={<Plus className="w-4 h-4" />}>
                                INIT_QUEST
                            </PremiumButton>
                        </Link>
                        <Link href="/settings">
                            <button className="p-3 bg-black/50 border border-[#00F0FF]/30 rounded-lg hover:bg-[#00F0FF]/10 transition-colors">
                                <Settings className="w-5 h-5 text-[#00F0FF]" />
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid md:grid-cols-12 gap-6 mb-8">

                    {/* Digital Vault (Wallet) - Col 4 */}
                    <div className="md:col-span-4">
                        <PremiumCard className="h-full bg-gradient-to-br from-black to-[#0a0a0a]">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2 text-[#00F0FF]">
                                    <Wallet className="w-5 h-5" />
                                    <span className="font-mono text-sm tracking-widest">DIGITAL VAULT</span>
                                </div>
                                <Signal className="w-4 h-4 text-green-500" />
                            </div>
                            <div className="text-4xl font-bold text-white mb-2 font-mono tracking-tighter">$0.00</div>
                            <p className="text-xs text-gray-500 font-mono mb-6">AVAILABLE ASSETS</p>

                            <div className="grid grid-cols-2 gap-3">
                                <button className="py-2 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-mono hover:bg-[#00F0FF]/10 transition-colors">
                                    DEPOSIT
                                </button>
                                <button className="py-2 border border-white/10 text-gray-400 text-xs font-mono hover:bg-white/5 transition-colors">
                                    WITHDRAW
                                </button>
                            </div>
                        </PremiumCard>
                    </div>

                    {/* Escrow Monitor - Col 4 */}
                    <div className="md:col-span-4">
                        <PremiumCard className="h-full">
                            <div className="flex items-center gap-2 text-[#7000FF] mb-6">
                                <ShieldCheck className="w-5 h-5" />
                                <span className="font-mono text-sm tracking-widest">ESCROW PROTOCOL</span>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-[#7000FF]/5 border border-[#7000FF]/20">
                                    <span className="text-gray-400 text-xs font-mono">LOCKED FUNDS</span>
                                    <span className="text-white font-bold font-mono">$500.00</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/5 border border-white/5">
                                    <span className="text-gray-400 text-xs font-mono">PENDING RELEASE</span>
                                    <span className="text-gray-500 font-bold font-mono">$0.00</span>
                                </div>
                            </div>
                        </PremiumCard>
                    </div>

                    {/* Active Operations - Col 4 */}
                    <div className="md:col-span-4">
                        <PremiumCard className="h-full">
                            <div className="flex items-center gap-2 text-green-400 mb-6">
                                <Cpu className="w-5 h-5" />
                                <span className="font-mono text-sm tracking-widest">ACTIVE OPERATIONS</span>
                            </div>
                            <div className="text-4xl font-bold text-white mb-2 font-mono">1</div>
                            <p className="text-xs text-gray-500 font-mono mb-6">PROCESSES RUNNING</p>
                            <div className="w-full bg-gray-800 h-1 mb-4">
                                <div className="bg-green-500 h-1 w-[60%] animate-pulse"></div>
                            </div>
                            <Link href="/quests">
                                <button className="w-full py-2 bg-white/5 text-xs font-mono text-gray-300 hover:text-white transition-colors">
                                    VIEW_DETAILS {">>"}
                                </button>
                            </Link>
                        </PremiumCard>
                    </div>
                </div>

                {/* AI vs Human Intelligence Analysis */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* AI Stats */}
                    <div className="border border-purple-500/30 bg-black/40 backdrop-blur-md p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Cpu className="w-24 h-24 text-purple-500" />
                        </div>
                        <h2 className="text-sm font-bold text-purple-400 font-mono mb-6 tracking-widest flex items-center gap-2">
                            <Database className="w-4 h-4" />
                            AI_INTELLIGENCE_METRICS
                        </h2>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <div className="text-xs text-gray-500 font-mono mb-1">AVG_RATING</div>
                                <div className="text-3xl font-bold text-purple-400 font-mono">4.8<span className="text-sm text-gray-600">/5.0</span></div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 font-mono mb-1">TOTAL_OPS</div>
                                <div className="text-3xl font-bold text-white font-mono">1,240</div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-2 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-mono">SPEED: INSTANT</span>
                            <span className="px-2 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-mono">COST: FREE</span>
                        </div>
                    </div>

                    {/* Human Stats */}
                    <div className="border border-[#D4AF37]/30 bg-black/40 backdrop-blur-md p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Activity className="w-24 h-24 text-[#D4AF37]" />
                        </div>
                        <h2 className="text-sm font-bold text-[#D4AF37] font-mono mb-6 tracking-widest flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" />
                            HUMAN_AGENT_METRICS
                        </h2>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <div className="text-xs text-gray-500 font-mono mb-1">AVG_RATING</div>
                                <div className="text-3xl font-bold text-[#D4AF37] font-mono">4.9<span className="text-sm text-gray-600">/5.0</span></div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 font-mono mb-1">TOTAL_OPS</div>
                                <div className="text-3xl font-bold text-white font-mono">856</div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-2 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-mono">QUALITY: PREMIUM</span>
                            <span className="px-2 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-mono">COMPLEXITY: HIGH</span>
                        </div>
                    </div>
                </div>

                {/* System Logs (Activity) */}
                <div className="border border-[#00F0FF]/20 bg-black/40 backdrop-blur-md p-6">
                    <h2 className="text-sm font-bold text-[#00F0FF] font-mono mb-6 tracking-widest flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        SYSTEM_LOGS
                    </h2>
                    <div className="space-y-1 font-mono text-xs">
                        {[
                            { time: "10:42:05", type: "INFO", msg: "Escrow deposit confirmed ($500.00)", color: "text-[#00F0FF]" },
                            { time: "09:15:33", type: "MSG", msg: "Encrypted message received from Agent Kim", color: "text-[#7000FF]" },
                            { time: "08:00:00", type: "SYS", msg: "Identity verification protocol completed", color: "text-green-400" },
                            { time: "07:55:12", type: "WARN", msg: "Login detected from new IP address", color: "text-yellow-500" },
                        ].map((log, i) => (
                            <div key={i} className="flex gap-4 p-2 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                                <span className="text-gray-500">[{log.time}]</span>
                                <span className={log.color}>{log.type}</span>
                                <span className="text-gray-300">{log.msg}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
