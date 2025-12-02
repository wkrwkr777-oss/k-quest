import { create } from 'zustand';
import { Language, translations } from './i18n';
import { supabase } from './supabase';

type UserType = 'foreigner' | 'local' | null;

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'info' | 'error';
}

export interface Application {
    id: string;
    questId: string;
    applicantId: string;
    applicantName: string; // Mock name for display
    message: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
}

interface AppState {
    // Language
    language: Language;
    setLanguage: (lang: Language) => void;
    t: typeof translations['en'];

    // Auth
    user: UserType;
    userId: string | null;
    userEmail: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, role: UserType) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;

    // Quests (Mock)
    userQuests: any[];
    fetchQuests: () => Promise<void>;
    addQuest: (quest: any) => void;

    // Application System
    applications: Application[];
    applyForQuest: (questId: string, message: string) => void;
    acceptApplicant: (questId: string, applicationId: string) => void;
    rejectApplicant: (applicationId: string) => void;

    // Wallet (Mock)
    balance: number;
    earnings: number;

    // Toast
    toasts: Toast[];
    addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
    removeToast: (id: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
    // Language
    language: 'en',
    t: translations['en'],
    setLanguage: (lang) => set({
        language: lang,
        t: translations[lang]
    }),

    // Auth
    user: null,
    userId: null,
    userEmail: null,

    login: async (email, password) => {
        try {
            // Real Supabase Login
            if (!supabase || !supabase.auth) {
                throw new Error('Database connection not configured.');
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                set({
                    user: data.user.user_metadata.role || 'foreigner',
                    userId: data.user.id,
                    userEmail: data.user.email,
                });
                get().addToast('Login successful!', 'success');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            get().addToast(error.message || 'Login failed', 'error');
            throw error;
        }
    },

    signup: async (email, password, role) => {
        try {
            // Real Supabase Signup
            if (!supabase || !supabase.auth) {
                throw new Error('Database connection not configured.');
            }

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        role,
                    },
                },
            });

            if (error) throw error;

            if (data.user) {
                set({
                    user: role,
                    userId: data.user.id,
                    userEmail: data.user.email,
                });
                get().addToast('Account created! Please check your email.', 'success');
            }
        } catch (error: any) {
            console.error('Signup error:', error);
            get().addToast(error.message || 'Signup failed', 'error');
            throw error;
        }
    },

    logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, userId: null, userEmail: null });
        get().addToast('Logged out', 'info');
    },

    checkAuth: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            set({
                user: session.user.user_metadata.role || 'foreigner',
                userId: session.user.id,
                userEmail: session.user.email,
            });
        }
    },

    // Quests
    userQuests: [],

    fetchQuests: async () => {
        try {
            const { data, error } = await supabase
                .from('quests')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                set({ userQuests: data });
            }
        } catch (error) {
            console.error('Error fetching quests:', error);
        }
    },

    addQuest: async (quest) => {
        const userId = get().userId;
        if (!userId) {
            get().addToast('Please login to post a quest', 'error');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('quests')
                .insert([
                    {
                        title: quest.title,
                        description: quest.description,
                        reward: quest.reward,
                        location: quest.location,
                        time: quest.time,
                        difficulty: quest.difficulty,
                        category: quest.category,
                        requester_id: userId,
                        status: 'open'
                    }
                ])
                .select();

            if (error) throw error;

            if (data) {
                // 목록 새로고침
                set((state) => ({ userQuests: [data[0], ...state.userQuests] }));
                get().addToast('Quest posted successfully!', 'success');
            }
        } catch (error: any) {
            console.error('Error posting quest:', error);
            get().addToast(error.message || 'Failed to post quest', 'error');
        }
    },

    // Application System
    applications: [],

    applyForQuest: (questId, message) => {
        const userId = get().userId;
        if (!userId) {
            get().addToast('Please login to apply', 'error');
            return;
        }

        const newApp: Application = {
            id: Math.random().toString(36).substring(7),
            questId,
            applicantId: userId,
            applicantName: 'My Profile', // In real app, fetch user name
            message,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        set((state) => ({ applications: [...state.applications, newApp] }));
        get().addToast('Application submitted! Waiting for requester approval.', 'success');
    },

    acceptApplicant: (questId, applicationId) => {
        // 1. Mark application as accepted
        set((state) => ({
            applications: state.applications.map(app =>
                app.id === applicationId ? { ...app, status: 'accepted' } :
                    app.questId === questId ? { ...app, status: 'rejected' } : app // Reject others for same quest
            )
        }));

        // 2. Update Quest Status
        set((state) => ({
            userQuests: state.userQuests.map(q =>
                q.id === questId ? { ...q, status: 'in_progress', performer_id: 'selected-user' } : q
            )
        }));

        get().addToast('Applicant accepted! Quest is now in progress.', 'success');
    },

    rejectApplicant: (applicationId) => {
        set((state) => ({
            applications: state.applications.map(app =>
                app.id === applicationId ? { ...app, status: 'rejected' } : app
            )
        }));
        get().addToast('Applicant rejected.', 'info');
    },

    // Wallet - MOCK
    balance: 0,
    earnings: 0,

    // Toast
    toasts: [],
    addToast: (message, type = 'info') => {
        const id = Math.random().toString(36).substring(7);
        set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
        setTimeout(() => {
            set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
        }, 3000);
    },
    removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
