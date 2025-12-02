-- K-Quest 게이미피케이션 시스템 (Gamification)

-- 1. 사용자 포인트 테이블
CREATE TABLE IF NOT EXISTS user_points (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  current_points integer DEFAULT 0,
  total_earned_points integer DEFAULT 0,
  updated_at timestamp with time zone DEFAULT now()
);

-- 2. 포인트 내역 (로그)
CREATE TABLE IF NOT EXISTS point_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  amount integer NOT NULL, -- 획득(+) 또는 사용(-)
  reason text NOT NULL, -- 'daily_checkin', 'referral_bonus', 'quest_reward'
  description text,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. 일일 출석체크 (랜덤박스)
CREATE TABLE IF NOT EXISTS daily_checkins (
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  checkin_date date NOT NULL, -- YYYY-MM-DD
  reward_type text, -- 'point', 'coupon'
  reward_value integer,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (user_id, checkin_date)
);

-- 4. 추천인 시스템
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES profiles(id) NOT NULL, -- 추천한 사람
  referee_id uuid REFERENCES profiles(id) NOT NULL, -- 추천받은 사람 (가입자)
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed')), -- 가입 시 pending, 첫 퀘스트 완료 시 completed
  reward_paid boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(referee_id) -- 한 명은 한 번만 추천받을 수 있음
);

-- 5. 쿠폰함
CREATE TABLE IF NOT EXISTS user_coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  code text NOT NULL,
  discount_type text CHECK (discount_type IN ('percent', 'fixed')), -- 퍼센트 할인 or 정액 할인
  discount_value integer NOT NULL, -- 10(%) or 1000(원)
  is_used boolean DEFAULT false,
  expires_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- RLS 정책 (보안)
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_coupons ENABLE ROW LEVEL SECURITY;

-- 내 포인트만 조회 가능
CREATE POLICY "내 포인트 조회" ON user_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "내 포인트 로그 조회" ON point_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "내 쿠폰 조회" ON user_coupons FOR SELECT USING (auth.uid() = user_id);

-- 포인트 지급 함수 (안전한 트랜잭션)
CREATE OR REPLACE FUNCTION award_points(p_user_id uuid, p_amount integer, p_reason text)
RETURNS void AS $$
BEGIN
  -- 포인트 테이블 없으면 생성
  INSERT INTO user_points (user_id, current_points, total_earned_points)
  VALUES (p_user_id, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;

  -- 포인트 업데이트
  UPDATE user_points
  SET 
    current_points = current_points + p_amount,
    total_earned_points = total_earned_points + (CASE WHEN p_amount > 0 THEN p_amount ELSE 0 END),
    updated_at = now()
  WHERE user_id = p_user_id;

  -- 로그 기록
  INSERT INTO point_logs (user_id, amount, reason)
  VALUES (p_user_id, p_amount, p_reason);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
