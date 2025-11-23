-- 국적 구분 필드 추가
-- 한국인만 성인 인증 필요!

-- profiles 테이블에 is_korean 필드 추가
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_korean boolean DEFAULT false;

-- 인덱스 추가 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_profiles_is_korean ON profiles(is_korean);
CREATE INDEX IF NOT EXISTS idx_profiles_age_verified ON profiles(age_verified);

-- 기본값 설정 함수
CREATE OR REPLACE FUNCTION set_default_nationality()
RETURNS TRIGGER AS $$
BEGIN
  -- 이메일 도메인으로 국적 추정 (선택적)
  -- 예: @naver.com, @daum.net, @kakao.com → 한국인
  IF NEW.email LIKE '%@naver.com' OR 
     NEW.email LIKE '%@daum.net' OR 
     NEW.email LIKE '%@kakao.com' OR
     NEW.email LIKE '%@nate.com' THEN
    NEW.is_korean := true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성 (선택적)
DROP TRIGGER IF EXISTS set_nationality_trigger ON profiles;
CREATE TRIGGER set_nationality_trigger
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_default_nationality();

-- 코멘트 추가
COMMENT ON COLUMN profiles.is_korean IS '한국인 여부 (true=한국인, false=외국인). 한국인만 성인 인증 필수.';

-- 뷰 생성: 성인 인증이 필요한 사용자
CREATE OR REPLACE VIEW users_needing_verification AS
SELECT 
  id,
  email,
  full_name,
  is_korean,
  age_verified,
  verification_status,
  created_at
FROM profiles
WHERE is_korean = true 
  AND age_verified = false
  AND user_type NOT IN ('banned', 'suspended')
ORDER BY created_at DESC;

-- 통계 뷰
CREATE OR REPLACE VIEW verification_stats AS
SELECT 
  COUNT(*) FILTER (WHERE is_korean = true) as total_koreans,
  COUNT(*) FILTER (WHERE is_korean = false) as total_foreigners,
  COUNT(*) FILTER (WHERE is_korean = true AND age_verified = true) as verified_koreans,
  COUNT(*) FILTER (WHERE is_korean = true AND age_verified = false) as unverified_koreans,
  COUNT(*) FILTER (WHERE is_korean = true AND verification_status = 'pending') as pending_koreans
FROM profiles
WHERE user_type NOT IN ('banned', 'suspended');
