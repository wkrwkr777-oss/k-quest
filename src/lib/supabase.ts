import { createClient } from '@supabase/supabase-js';

// 세희님의 Supabase 키 (환경변수 우선, 없으면 하드코딩 값 사용)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://spzsyuawxiyszxwusibg.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwenN5dWF3eGl5c3p4d3VzaWJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMjQyMjksImV4cCI6MjA3OTkwMDIyOX0._5wbiboDtUXWnRPIKuNfk04DAWxmVb6M53y9hY-rqgs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client (server-side only) - Service Role Key 필요
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
    : supabase; // Fallback to regular client (will fail for admin tasks but fixes build import)
