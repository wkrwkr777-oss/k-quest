-- Supabase Function: 회원가입 시 연령 체크 (서버 사이드)
-- 위치: Supabase Dashboard > SQL Editor 에서 실행

-- 회원 프로필 테이블에 국적 및 생년월일 컬럼 추가
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS nationality TEXT DEFAULT 'foreign',
ADD COLUMN IF NOT EXISTS birthdate DATE;

-- 한국인 미성년자 가입 차단 함수
CREATE OR REPLACE FUNCTION check_age_restriction()
RETURNS TRIGGER AS $$
BEGIN
    -- 한국인인 경우에만 연령 체크
    IF NEW.nationality = 'korean' THEN
        -- 생년월일이 없으면 차단
        IF NEW.birthdate IS NULL THEN
            RAISE EXCEPTION '한국인은 생년월일 입력이 필수입니다.';
        END IF;

        -- 만 18세 미만이면 차단 (2025년 성인 기준)
        IF EXTRACT(YEAR FROM AGE(NEW.birthdate)) < 18 THEN
            RAISE EXCEPTION '한국인은 만 18세 이상만 가입 가능합니다. (2025년부터 성인 기준 변경)';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성: INSERT 시 자동으로 연령 체크
DROP TRIGGER IF EXISTS trigger_check_age ON public.profiles;
CREATE TRIGGER trigger_check_age
    BEFORE INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION check_age_restriction();

-- 기존 회원도 UPDATE 시 체크 (선택사항)
DROP TRIGGER IF EXISTS trigger_check_age_update ON public.profiles;
CREATE TRIGGER trigger_check_age_update
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    WHEN (OLD.nationality IS DISTINCT FROM NEW.nationality OR OLD.birthdate IS DISTINCT FROM NEW.birthdate)
    EXECUTE FUNCTION check_age_restriction();

-- 테스트 (선택사항)
-- 미성년자 가입 시도 (차단되어야 함)
-- INSERT INTO public.profiles (id, email, nationality, birthdate) 
-- VALUES (gen_random_uuid(), 'test@test.com', 'korean', '2010-01-01');
-- → 에러: "한국인은 만 18세 이상만 가입 가능합니다."

-- 성인 가입 시도 (성공해야 함)
-- INSERT INTO public.profiles (id, email, nationality, birthdate) 
-- VALUES (gen_random_uuid(), 'adult@test.com', 'korean', '2000-01-01');
-- → 성공!
