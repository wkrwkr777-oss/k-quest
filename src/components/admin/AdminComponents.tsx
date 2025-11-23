// Admin Dashboard Components
import { DollarSign, Users, FileText, AlertTriangle, TrendingUp, CheckCircle, XCircle, Ban } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface StatCardProps {
    icon: any;
    label: string;
    value: string | number;
    badge?: string;
    color: 'blue' | 'purple' | 'green' | 'red';
}

export function StatCard({ icon: Icon, label, value, badge, color }: StatCardProps) {
    const colors = {
        blue: 'bg-blue-900/20 text-blue-400',
        purple: 'bg-purple-900/20 text-purple-400',
        green: 'bg-green-900/20 text-green-400',
        red: 'bg-red-900/20 text-red-400',
    };

    return (
        <div className="bg-[#111] border border-[#333] p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colors[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {badge && (
                    <span className="text-xs bg-[#D4AF37] text-black px-2 py-1 rounded-full font-medium">
                        {badge}
                    </span>
                )}
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
            <p className="text-gray-400 text-sm">{label}</p>
        </div>
    );
}

interface QuickStatsProps {
    stats: {
        totalUsers: number;
        totalQuests: number;
        pendingQuests: number;
        totalRevenue: number;
        pendingWithdrawals: number;
        flaggedMessages: number;
        bannedUsers: number;
    };
}

export function QuickStats({ stats }: QuickStatsProps) {
    return (
        <div className="bg-[#111] border border-[#333] p-6 rounded-lg">
            <h2 className="text-xl font-serif text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
                빠른 통계
            </h2>
            <div className="space-y-4">
                <QuickStatRow label="대기 중인 출금" value={stats.pendingWithdrawals} />
                <QuickStatRow label="차단된 사용자" value={stats.bannedUsers} alert />
                <QuickStatRow label="승인 대기 퀘스트" value={stats.pendingQuests} />
                <QuickStatRow label="신고된 메시지" value={stats.flaggedMessages} alert />
            </div>
        </div>
    );
}

function QuickStatRow({ label, value, alert }: { label: string; value: number; alert?: boolean }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-[#333] last:border-0">
            <span className="text-gray-400 text-sm">{label}</span>
            <span className={`font-bold text-lg ${alert && value > 0 ? 'text-red-400' : 'text-white'}`}>
                {value}
            </span>
        </div>
    );
}

export function RecentActivity() {
    return (
        <div className="bg-[#111] border border-[#333] p-6 rounded-lg">
            <h2 className="text-xl font-serif text-white mb-6">최근 활동</h2>
            <div className="space-y-3 text-sm">
                <ActivityItem icon="✅" text="새 퀘스트 승인됨" time="5분 전" />
                <ActivityItem icon="💰" text="출금 요청 승인" time="1시간 전" />
                <ActivityItem icon="⚠️" text="메시지 신고 처리" time="2시간 전" alert />
                <ActivityItem icon="👤" text="새 사용자 가입" time="3시간 전" />
            </div>
        </div>
    );
}

function ActivityItem({ icon, text, time, alert }: { icon: string; text: string; time: string; alert?: boolean }) {
    return (
        <div className={`flex items-center gap-3 p-3 rounded ${alert ? 'bg-red-900/10' : 'bg-[#1A1A1A]'}`}>
            <span className="text-2xl">{icon}</span>
            <div className="flex-1">
                <p className="text-white">{text}</p>
                <p className="text-gray-500 text-xs">{time}</p>
            </div>
        </div>
    );
}

interface PendingQuestsPanelProps {
    quests: Array<{
        id: string;
        title: string;
        reward: number;
        client_name: string;
        created_at: string;
    }>;
    onApprove: (questId: string, clientId: string) => void;
    onReject: (questId: string, clientId: string) => void;
}

export function PendingQuestsPanel({ quests, onApprove, onReject }: PendingQuestsPanelProps) {
    return (
        <div className="bg-[#111] border border-[#333] rounded-lg overflow-hidden">
            <div className="p-6 border-b border-[#333]">
                <h2 className="text-xl font-serif text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#D4AF37]" />
                    승인 대기 중인 퀘스트 ({quests.length})
                </h2>
            </div>
            <div className="divide-y divide-[#333]">
                {quests.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>승인 대기 중인 퀘스트가 없습니다</p>
                    </div>
                ) : (
                    quests.map((quest) => (
                        <div key={quest.id} className="p-6 hover:bg-[#1A1A1A] transition-colors">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <Link
                                        href={`/quests/${quest.id}`}
                                        className="text-lg font-medium text-white hover:text-[#D4AF37] transition-colors"
                                    >
                                        {quest.title}
                                    </Link>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                                        <span>의뢰자: {quest.client_name}</span>
                                        <span>•</span>
                                        <span>보상: ${quest.reward}</span>
                                        <span>•</span>
                                        <span>{new Date(quest.created_at).toLocaleDateString('ko-KR')}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => onApprove(quest.id, quest.client_name)}
                                        className="flex items-center gap-1"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        승인
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onReject(quest.id, quest.client_name)}
                                        className="flex items-center gap-1 border border-red-500 text-red-400 hover:bg-red-900/20"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        거절
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

interface FlaggedMessagesPanelProps {
    messages: Array<{
        id: string;
        user_id: string;
        user_name: string;
        message: string;
        violation_type: string;
        severity: string;
        created_at: string;
    }>;
    onReview: (violationId: string, action: 'dismiss' | 'warn' | 'ban') => void;
}

export function FlaggedMessagesPanel({ messages, onReview }: FlaggedMessagesPanelProps) {
    const getSeverityColor = (severity: string) => {
        const colors = {
            low: 'text-yellow-400',
            medium: 'text-orange-400',
            high: 'text-red-400',
            critical: 'text-red-600',
        };
        return colors[severity as keyof typeof colors] || 'text-gray-400';
    };

    return (
        <div className="bg-[#111] border border-[#333] rounded-lg overflow-hidden">
            <div className="p-6 border-b border-[#333]">
                <h2 className="text-xl font-serif text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-[#D4AF37]" />
                    신고된 메시지 ({messages.length})
                </h2>
            </div>
            <div className="divide-y divide-[#333]">
                {messages.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>검토할 메시지가 없습니다</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className="p-6 hover:bg-[#1A1A1A] transition-colors">
                            <div className="mb-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-white font-medium">{msg.user_name}</span>
                                    <span className={`text-xs px-2 py-1 rounded ${getSeverityColor(msg.severity)} bg-opacity-10`}>
                                        {msg.severity.toUpperCase()}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {msg.violation_type.replace('_', ' ')}
                                    </span>
                                </div>
                                <p className="text-gray-300 bg-[#262626] p-3 rounded border border-red-500/30">
                                    "{msg.message}"
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                    {new Date(msg.created_at).toLocaleString('ko-KR')}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onReview(msg.id, 'dismiss')}
                                    className="text-gray-400"
                                >
                                    무시
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onReview(msg.id, 'warn')}
                                    className="text-yellow-400 border border-yellow-500/30"
                                >
                                    경고
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onReview(msg.id, 'ban')}
                                    className="text-red-400 border border-red-500/30"
                                >
                                    <Ban className="w-4 h-4 mr-1" />
                                    차단
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export function UsersPanel() {
    return (
        <div className="bg-[#111] border border-[#333] p-6 rounded-lg">
            <h2 className="text-xl font-serif text-white mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#D4AF37]" />
                사용자 관리
            </h2>
            <p className="text-gray-400">사용자 관리 기능 (추후 구현)</p>
        </div>
    );
}
