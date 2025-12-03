-- 블랙리스트 관리 테이블 생성
-- Supabase Dashboard > SQL Editor 에서 실행

-- 1. 블랙리스트 테이블
CREATE TABLE IF NOT EXISTS public.blacklist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    reason TEXT NOT NULL,
    banned_by UUID REFERENCES public.profiles(id), -- 차단한 관리자
    banned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- 2. 인덱스 생성 (빠른 조회)
CREATE INDEX IF NOT EXISTS idx_blacklist_user_id ON public.blacklist(user_id);
CREATE INDEX IF NOT EXISTS idx_blacklist_email ON public.blacklist(email);
CREATE INDEX IF NOT EXISTS idx_blacklist_is_active ON public.blacklist(is_active);

-- 3. RLS (Row Level Security) 활성화
ALTER TABLE public.blacklist ENABLE ROW LEVEL SECURITY;

-- 4. 정책: 관리자만 조회/수정 가능
CREATE POLICY "Only admins can view blacklist" ON public.blacklist
    FOR SELECT
    USING (auth.uid() IN (
        SELECT id FROM public.profiles WHERE role = 'admin'
    ));

CREATE POLICY "Only admins can insert blacklist" ON public.blacklist
    FOR INSERT
    WITH CHECK (auth.uid() IN (
        SELECT id FROM public.profiles WHERE role = 'admin'
    ));

CREATE POLICY "Only admins can update blacklist" ON public.blacklist
    FOR UPDATE
    USING (auth.uid() IN (
        SELECT id FROM public.profiles WHERE role = 'admin'
    ));

CREATE POLICY "Only admins can delete blacklist" ON public.blacklist
    FOR DELETE
    USING (auth.uid() IN (
        SELECT id FROM public.profiles WHERE role = 'admin'
    ));

-- 5. 로그인 차단 함수 (트리거)
CREATE OR REPLACE FUNCTION check_blacklist()
RETURNS TRIGGER AS $$
BEGIN
    -- 블랙리스트에 있는 사용자인지 확인
    IF EXISTS (
        SELECT 1 FROM public.blacklist 
        WHERE user_id = NEW.id 
        AND is_active = TRUE
    ) THEN
        RAISE EXCEPTION '차단된 사용자입니다. 고객센터(wkrwkr777@gmail.com)로 문의하세요.';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. 트리거 생성: 로그인 시 블랙리스트 체크
DROP TRIGGER IF EXISTS trigger_check_blacklist ON public.profiles;
CREATE TRIGGER trigger_check_blacklist
    BEFORE INSERT OR UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION check_blacklist();

-- 7. 샘플 데이터 (테스트용, 나중에 삭제)
-- INSERT INTO public.blacklist (user_id, email, full_name, reason, notes)
-- VALUES (
--     gen_random_uuid(), 
--     'test_banned@test.com', 
--     '테스트 차단 사용자', 
--     '테스트 목적', 
--     '이 계정은 테스트용입니다'
-- );

COMMENT ON TABLE public.blacklist IS '차단된 사용자 관리 (관리자 전용)';
