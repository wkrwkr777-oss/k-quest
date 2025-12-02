export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string | null
                    full_name: string | null
                    avatar_url: string | null
                    role: 'user' | 'expert' | 'admin'
                    is_verified: boolean
                    verification_level: 'none' | 'basic' | 'id' | 'video'
                    tier: 'bronze' | 'silver' | 'gold' | 'platinum'
                    bio: string | null
                    languages: string[] | null
                    skills: string[] | null
                    rating: number
                    review_count: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: 'user' | 'expert' | 'admin'
                    is_verified?: boolean
                    verification_level?: 'none' | 'basic' | 'id' | 'video'
                    tier?: 'bronze' | 'silver' | 'gold' | 'platinum'
                    bio?: string | null
                    languages?: string[] | null
                    skills?: string[] | null
                    rating?: number
                    review_count?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: 'user' | 'expert' | 'admin'
                    is_verified?: boolean
                    verification_level?: 'none' | 'basic' | 'id' | 'video'
                    tier?: 'bronze' | 'silver' | 'gold' | 'platinum'
                    bio?: string | null
                    languages?: string[] | null
                    skills?: string[] | null
                    rating?: number
                    review_count?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            quests: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    description: string
                    category: string
                    location: string | null
                    budget_min: number | null
                    budget_max: number | null
                    currency: string
                    status: 'open' | 'in_progress' | 'completed' | 'cancelled' | 'dispute'
                    images: string[] | null
                    deadline: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    description: string
                    category: string
                    location?: string | null
                    budget_min?: number | null
                    budget_max?: number | null
                    currency?: string
                    status?: 'open' | 'in_progress' | 'completed' | 'cancelled' | 'dispute'
                    images?: string[] | null
                    deadline?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    description?: string
                    category?: string
                    location?: string | null
                    budget_min?: number | null
                    budget_max?: number | null
                    currency?: string
                    status?: 'open' | 'in_progress' | 'completed' | 'cancelled' | 'dispute'
                    images?: string[] | null
                    deadline?: string | null
                    created_at?: string
                }
            }
            // ... (다른 테이블들도 동일한 패턴으로 추가 가능)
        }
    }
}
