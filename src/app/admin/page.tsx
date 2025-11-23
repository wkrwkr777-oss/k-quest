"use client";
totalRevenue: number;
pendingWithdrawals: number;
flaggedMessages: number;
bannedUsers: number;
}

interface PendingQuest {
    id: string;
    title: string;
    reward: number;
    client_name: string;
    created_at: string;
}

interface FlaggedMessage {
    id: string;
    user_id: string;
    user_name: string;
    message: string;
    violation_type: string;
    severity: string;
    created_at: string;
}

export default function AdminDashboard() {
    const { user } = useStore();
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalQuests: 0,
        pendingQuests: 0,
        totalRevenue: 0,
        pendingWithdrawals: 0,
        flaggedMessages: 0,
        bannedUsers: 0,
    });
    const [pendingQuests, setPendingQuests] = useState<PendingQuest[]>([]);
    const [flaggedMessages, setFlaggedMessages] = useState<FlaggedMessage[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'quests' | 'messages' | 'users'>('overview');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user?.user_type === 'admin') {
            loadDashboardData();
        }
    }, [user]);

    const loadDashboardData = async () => {
        setIsLoading(true);
        try {
            // 통계 로딩
            const [usersCount, questsCount, pendingCount, revenue, withdrawals, flagged, banned] =
                await Promise.all([
                    supabase.from('profiles').select('*', { count: 'exact', head: true }),
                    supabase.from('quests').select('*', { count: 'exact', head: true }),
                    supabase
                        .from('quests')
                        .select('*', { count: 'exact', head: true })
                        .eq('status', 'pending_approval'),
                    supabase.from('transactions').select('fee').eq('status', 'completed'),
                    supabase
                        .from('transactions')
                        .select('net_amount', { count: 'exact', head: true })
                        .eq('type', 'withdrawal')
                        .eq('status', 'pending'),
                    supabase
                        .from('chat_messages')
                        .select('*', { count: 'exact', head: true })
                        .eq('is_flagged', true),
                    supabase
                        .from('profiles')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_type', 'banned'),
                ]);

            const totalRevenue = revenue.data?.reduce((sum, t) => sum + (Number(t.fee) || 0), 0) || 0;

            setStats({
                totalUsers: usersCount.count || 0,
                totalQuests: questsCount.count || 0,
                pendingQuests: pendingCount.count || 0,
                totalRevenue,
                pendingWithdrawals: withdrawals.count || 0,
                flaggedMessages: flagged.count || 0,
                bannedUsers: banned.count || 0,
            });

            // 대기 중인 퀘스트 로드
            const { data: pendingQuestsData } = await supabase
                .from('quests')
                .select('id, title, reward, created_at, profiles:client_id(full_name)')
                .eq('status', 'pending_approval')
                .order('created_at', { ascending: false })
                .limit(10);

            setPendingQuests(
                pendingQuestsData?.map((q: any) => ({
                    id: q.id,
                    title: q.title,
                    reward: q.reward,
                    client_name: q.profiles?.full_name || 'Unknown',
                    created_at: q.created_at,
                })) || []
            );

            // 신고된 메시지 로드
            const { data: flaggedData } = await supabase
                .from('chat_violations')
                .select(
                    `
          id,
          user_id,
          violation_type,
          severity,
          created_at,
          message_id,
          chat_messages(message),
          profiles(full_name)
        `
                )
                .eq('admin_reviewed', false)
                .order('created_at', { ascending: false })
                .limit(10);

            setFlaggedMessages(
                flaggedData?.map((v: any) => ({
                    id: v.id,
                    user_id: v.user_id,
                    user_name: v.profiles?.full_name || 'Unknown',
                    message: v.chat_messages?.message || '',
                    violation_type: v.violation_type,
                    severity: v.severity,
                    created_at: v.created_at,
                })) || []
            );
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApproveQuest = async (questId: string, clientId: string) => {
        try {
            await supabase
                .from('quests')
                .update({
                    status: 'open',
                    approved_by: user?.id,
                    approved_at: new Date().toISOString(),
                })
                .eq('id', questId);

            await createNotification(
                clientId,
                'quest_approved',
                'Quest 승인됨',
                '귀하의 Quest가 승인되어 공개되었습니다!',
                `/quests/${questId}`
            );

            await recordAdminAction('approve_quest', 'quest', questId);
            loadDashboardData();
        } catch (error) {
            console.error('Failed to approve quest:', error);
        }
    };

    const handleRejectQuest = async (questId: string, clientId: string) => {
        try {
            await supabase.from('quests').update({ status: 'rejected' }).eq('id', questId);

            await createNotification(
                clientId,
                'quest_rejected',
                'Quest 거절됨',
                '귀하의 Quest가 거절되었습니다. 내용을 확인하고 다시 시도해주세요.',
                `/quests/${questId}`
            );

            await recordAdminAction('reject_quest', 'quest', questId);
            loadDashboardData();
        } catch (error) {
            console.error('Failed to reject quest:', error);
        }
    };

    const handleReviewMessage = async (violationId: string, action: 'dismiss' | 'warn' | 'ban') => {
        try {
            await supabase
                .from('chat_violations')
                .update({
                    admin_reviewed: true,
                    action_taken: action,
                })
                .eq('id', violationId);

            if (action === 'warn' || action === 'ban') {
                const violation = flaggedMessages.find((m) => m.id === violationId);
                if (violation) {
                    await createNotification(
                        violation.user_id,
                        action === 'ban' ? 'ban' : 'warning',
                        action === 'ban' ? '계정 정지' : '경고',
                        action === 'ban'
                            ? '플랫폼 정책 위반으로 계정이 정지되었습니다.'
                            : '플랫폼 정책 위반이 감지되었습니다. 추가 위반 시 계정이 정지될 수 있습니다.'
                    );

                    if (action === 'ban') {
                        await supabase
                            .from('profiles')
                            .update({ user_type: 'banned' })
                            .eq('id', violation.user_id);
                    }
                }
            }

            await recordAdminAction(`review_message_${action}`, 'violation', violationId);
            loadDashboardData();
        } catch (error) {
            console.error('Failed to review message:', error);
        }
    };

    const recordAdminAction = async (actionType: string, targetType: string, targetId: string) => {
        try {
            await supabase.from('admin_actions').insert({
                admin_id: user?.id,
                action_type: actionType,
                target_type: targetType,
                target_id: targetId,
            });
        } catch (error) {
            console.error('Failed to record admin action:', error);
        }
    };

    if (user?.user_type !== 'admin') {
        return (
            <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
                <div className="text-center">
                    <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl text-white font-bold mb-2">접근 권한 없음</h1>
                    <p className="text-gray-400">관리자만 접근할 수 있습니다.</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#1A1A1A] pt-24 pb-20">
            <div className="container mx-auto px-6 max-w-[1400px]">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-serif text-white mb-2 flex items-center gap-3">
                        <Shield className="w-10 h-10 text-[#D4AF37]" />
                        관리자 대시보드
                    </h1>
                    <p className="text-gray-400">플랫폼 전체 현황 및 관리</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={Users}
                        label="전체 사용자"
                        value={stats.totalUsers}
                        color="blue"
                    />
                    <StatCard
                        icon={FileText}
                        label="전체 퀘스트"
                        value={stats.totalQuests}
                        badge={stats.pendingQuests > 0 ? `${stats.pendingQuests} 대기` : undefined}
                        color="purple"
                    />
                    <StatCard
                        icon={DollarSign}
                        label="총 수익"
                        value={`$${stats.totalRevenue.toFixed(2)}`}
                        color="green"
                    />
                    <StatCard
                        icon={AlertTriangle}
                        label="신고된 메시지"
                        value={stats.flaggedMessages}
                        color="red"
                    />
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-[#333]">
                    {(['overview', 'quests', 'messages', 'users'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 px-4 font-medium transition-colors border-b-2 ${activeTab === tab
                                ? 'text-[#D4AF37] border-[#D4AF37]'
                                : 'text-gray-400 border-transparent hover:text-white'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto"></div>
                    </div>
                ) : (
                    <>
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <QuickStats stats={stats} />
                                <RecentActivity />
                            </div>
                        )}

                        {activeTab === 'quests' && (
                            <PendingQuestsPanel
                                quests={pendingQuests}
                                onApprove={handleApproveQuest}
                                onReject={handleRejectQuest}
                            />
                        )}

                        {activeTab === 'messages' && (
                            <FlaggedMessagesPanel
                                messages={flaggedMessages}
                                onReview={handleReviewMessage}
                            />
                        )}

                        {activeTab === 'users' && <UsersPanel />}
                    </>
                )}
            </div>
        </main>
    );
}

// 나머지 컴포넌트들은 다음 파일에서 계속...
