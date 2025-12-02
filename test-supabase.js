
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://spzsyuawxiyszxwusibg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwenN5dWF3eGl5c3p4d3VzaWJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMjQyMjksImV4cCI6MjA3OTkwMDIyOX0._5wbiboDtUXWnRPIKuNfk04DAWxmVb6M53y9hY-rqgs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabase() {
    console.log("🚀 Supabase 테스트 시작...");

    const email = `test_${Date.now()}@kquest.com`;
    const password = 'password123';

    // 1. 회원가입
    console.log(`\n1. 회원가입 시도: ${email}`);
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { role: 'foreigner' }
        }
    });

    if (signUpError) {
        console.error("❌ 회원가입 실패:", signUpError.message);
        return;
    }
    console.log("✅ 회원가입 성공! ID:", signUpData.user.id);

    // 2. 퀘스트 등록 (로그인 없이 바로 등록 시도 - RLS 확인)
    // 주의: 이메일 인증이 안 되어 있어서 로그인이 안 될 수 있음.
    // 하지만 회원가입 직후에는 세션이 있을 수 있음.

    if (!signUpData.session) {
        console.log("⚠️ 이메일 인증이 필요하여 자동 로그인이 안 되었습니다.");
        console.log("   (하지만 회원가입이 성공했으므로 DB 연결은 100% 성공입니다!)");
        return;
    }

    console.log("\n2. 퀘스트 등록 시도...");
    const { data: questData, error: questError } = await supabase
        .from('quests')
        .insert([
            {
                title: 'Test Quest',
                description: 'Testing connection',
                reward: '$10',
                location: 'Seoul',
                requester_id: signUpData.user.id,
                status: 'open'
            }
        ])
        .select();

    if (questError) {
        console.error("❌ 퀘스트 등록 실패:", questError.message);
        return;
    }
    console.log("✅ 퀘스트 등록 성공!", questData);

    console.log("\n🎉 모든 테스트 완료! 시스템이 정상 작동합니다.");
}

testSupabase();
