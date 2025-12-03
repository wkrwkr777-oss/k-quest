"use client";

import { useState, useEffect } from 'react';
import { Ban, UserX, Trash2, Plus, AlertCircle } from 'lucide-react';

interface BlacklistUser {
    id: string;
    email: string;
    full_name: string | null;
    reason: string;
    notes: string | null;
    banned_at: string;
    is_active: boolean;
}

export function BlacklistManager() {
    const [blacklist, setBlacklist] = useState<BlacklistUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newBan, setNewBan] = useState({ email: '', reason: '', notes: '' });

    // 블랙리스트 조회
    const fetchBlacklist = async () => {
        setLoading(true);
        try {
            const { createClient } = await import('@supabase/supabase-js');
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            const { data, error } = await supabase
                .from('blacklist')
                .select('*')
                .order('banned_at', { ascending: false });

            if (error) throw error;
            setBlacklist(data || []);
        } catch (err) {
            console.error('블랙리스트 조회 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlacklist();
    }, []);

    // 블랙리스트 추가
    const handleAddToBlacklist = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const { createClient } = await import('@supabase/supabase-js');
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            // 사용자 찾기
            const { data: user } = await supabase
                .from('profiles')
                .select('id, full_name')
                .eq('email', newBan.email)
                .single();

            // 블랙리스트에 추가
            const { error } = await supabase
                .from('blacklist')
                .insert({
                    user_id: user?.id,
                    email: newBan.email,
                    full_name: user?.full_name || '알 수 없음',
                    reason: newBan.reason,
                    notes: newBan.notes || null,
                });

            if (error) throw error;

            alert('✅ 블랙리스트에 추가되었습니다.');
            setShowAddForm(false);
            setNewBan({ email: '', reason: '', notes: '' });
            fetchBlacklist();
        } catch (err: any) {
            alert('❌ 추가 실패: ' + err.message);
        }
    };

    // 블랙리스트 해제
    const handleRemoveFromBlacklist = async (id: string) => {
        if (!confirm('블랙리스트에서 해제하시겠습니까?')) return;

        try {
            const { createClient } = await import('@supabase/supabase-js');
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            const { error } = await supabase
                .from('blacklist')
                .update({ is_active: false })
                .eq('id', id);

            if (error) throw error;

            alert('✅ 블랙리스트에서 해제되었습니다.');
            fetchBlacklist();
        } catch (err: any) {
            alert('❌ 해제 실패: ' + err.message);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <UserX className="w-6 h-6 text-red-500" />
                    블랙리스트 관리
                </h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    사용자 차단
                </button>
            </div>

            {/* 차단 추가 폼 */}
            {showAddForm && (
                <form onSubmit={handleAddToBlacklist} className="bg-gray-900 p-6 rounded-lg mb-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">이메일</label>
                        <input
                            type="email"
                            value={newBan.email}
                            onChange={(e) => setNewBan({ ...newBan, email: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white"
                            placeholder="user@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">차단 사유</label>
                        <input
                            type="text"
                            value={newBan.reason}
                            onChange={(e) => setNewBan({ ...newBan, reason: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white"
                            placeholder="예: 부적절한 행위, 사기 시도 등"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">메모 (선택사항)</label>
                        <textarea
                            value={newBan.notes}
                            onChange={(e) => setNewBan({ ...newBan, notes: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white"
                            placeholder="상세 내역..."
                            rows={3}
                        />
                    </div>
                    <div className="flex gap-3">
                        <button type="submit" className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                            차단하기
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                        >
                            취소
                        </button>
                    </div>
                </form>
            )}

            {/* 블랙리스트 목록 */}
            {loading ? (
                <div className="text-center py-8 text-gray-400">로딩 중...</div>
            ) : blacklist.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <Ban className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>블랙리스트가 비어 있습니다.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {blacklist.map((user) => (
                        <div
                            key={user.id}
                            className={`p-4 rounded-lg border ${user.is_active
                                    ? 'bg-red-500/10 border-red-500/30'
                                    : 'bg-gray-900/50 border-gray-700 opacity-50'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-lg font-bold text-white">{user.full_name || '이름 없음'}</span>
                                        {user.is_active && (
                                            <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">차단됨</span>
                                        )}
                                        {!user.is_active && (
                                            <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded-full">해제됨</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-400 mb-1">📧 {user.email}</p>
                                    <p className="text-sm text-red-400 mb-1">🚫 사유: {user.reason}</p>
                                    {user.notes && (
                                        <p className="text-xs text-gray-500">📝 메모: {user.notes}</p>
                                    )}
                                    <p className="text-xs text-gray-600 mt-2">
                                        차단일: {new Date(user.banned_at).toLocaleDateString('ko-KR')}
                                    </p>
                                </div>
                                {user.is_active && (
                                    <button
                                        onClick={() => handleRemoveFromBlacklist(user.id)}
                                        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        해제
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 안내 메시지 */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-300">
                    <p className="font-bold mb-1">💡 블랙리스트 안내</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>차단된 사용자는 로그인이 불가능합니다.</li>
                        <li>기존 세션은 즉시 종료됩니다.</li>
                        <li>해제 시 다시 로그인 가능합니다.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
