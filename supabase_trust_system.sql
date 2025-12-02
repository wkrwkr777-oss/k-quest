-- K-Quest 상호 신뢰도 시스템 (Trust Score System)
-- 수행자와 의뢰자 모두를 위한 투명한 신뢰도 관리

-- 1. 프로필 테이블에 신뢰도 점수 및 티어 추가
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS trust_score numeric DEFAULT 100, -- 기본 100점 시작
ADD COLUMN IF NOT EXISTS trust_tier text DEFAULT 'Newbie', -- Newbie, Bronze, Silver, Gold, Platinum, Diamond
ADD COLUMN IF NOT EXISTS is_blacklisted boolean DEFAULT false;

-- 2. 수행자 평판 상세 테이블 (Performer Reputation)
CREATE TABLE IF NOT EXISTS performer_reputation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  performer_id uuid REFERENCES profiles(id) UNIQUE NOT NULL,
  
  -- 통계
  total_assigned_quests integer DEFAULT 0, -- 맡은 퀘스트 수
  completed_quests integer DEFAULT 0, -- 성공적으로 완료한 수
  failed_quests integer DEFAULT 0, -- 실패/중도포기 수
  rejected_deliverables integer DEFAULT 0, -- 결과물 거부 횟수
  
  -- 시간 준수
  on_time_delivery_count integer DEFAULT 0,
  late_delivery_count integer DEFAULT 0,
  
  -- 평가 점수 (0-100)
  review_score numeric DEFAULT 100, -- 리뷰 평점 기반 환산 점수
  completion_score numeric DEFAULT 100, -- 완료율 기반 점수
  punctuality_score numeric DEFAULT 100, -- 시간 준수율 기반 점수
  
  updated_at timestamp with time zone DEFAULT now()
);

-- 3. 신뢰도 계산 및 티어 산정 함수
CREATE OR REPLACE FUNCTION calculate_trust_score()
RETURNS TRIGGER AS $$
DECLARE
  v_trust_score numeric;
  v_tier text;
  v_is_blacklisted boolean := false;
BEGIN
  -- 1. 점수 계산 로직 (가중치 적용)
  -- 리뷰 점수 50% + 완료율 30% + 시간 준수 20% - (거부 횟수 * 5점)
  v_trust_score := (
    (NEW.review_score * 0.5) + 
    (NEW.completion_score * 0.3) + 
    (NEW.punctuality_score * 0.2)
  ) - (NEW.rejected_deliverables * 5);
  
  -- 점수 범위 제한 (0 ~ 100)
  IF v_trust_score > 100 THEN v_trust_score := 100; END IF;
  IF v_trust_score < 0 THEN v_trust_score := 0; END IF;
  
  -- 2. 티어 산정
  IF v_trust_score >= 95 THEN v_tier := 'Diamond'; -- 상위 5%
  ELSIF v_trust_score >= 90 THEN v_tier := 'Platinum'; -- 우수
  ELSIF v_trust_score >= 80 THEN v_tier := 'Gold'; -- 좋음
  ELSIF v_trust_score >= 70 THEN v_tier := 'Silver'; -- 보통
  ELSIF v_trust_score >= 50 THEN v_tier := 'Bronze'; -- 노력 필요
  ELSE v_tier := 'Warning'; -- 위험
  END IF;
  
  -- 3. 블랙리스트 자동 처리 (30점 미만)
  IF v_trust_score < 30 THEN 
    v_is_blacklisted := true;
    v_tier := 'Blacklisted';
  END IF;
  
  -- 4. 프로필 테이블 업데이트
  UPDATE profiles
  SET 
    trust_score = ROUND(v_trust_score, 1),
    trust_tier = v_tier,
    is_blacklisted = v_is_blacklisted
  WHERE id = NEW.performer_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. 트리거 연결
DROP TRIGGER IF EXISTS update_performer_trust ON performer_reputation;
CREATE TRIGGER update_performer_trust
  AFTER UPDATE ON performer_reputation
  FOR EACH ROW
  EXECUTE FUNCTION calculate_trust_score();

-- 5. Quest 완료 시 수행자 평판 업데이트 함수
CREATE OR REPLACE FUNCTION update_performer_stats_on_completion()
RETURNS TRIGGER AS $$
DECLARE
  v_performer_id uuid;
  v_is_late boolean;
  v_rating numeric;
BEGIN
  -- Quest 완료 시에만 동작
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    v_performer_id := NEW.performer_id;
    
    -- 마감 기한 체크
    IF NEW.completed_at > NEW.expires_at THEN
      v_is_late := true;
    ELSE
      v_is_late := false;
    END IF;
    
    -- 레코드 없으면 생성
    INSERT INTO performer_reputation (performer_id)
    VALUES (v_performer_id)
    ON CONFLICT (performer_id) DO NOTHING;
    
    -- 통계 업데이트
    UPDATE performer_reputation
    SET
      total_assigned_quests = total_assigned_quests + 1,
      completed_quests = completed_quests + 1,
      on_time_delivery_count = on_time_delivery_count + (CASE WHEN v_is_late THEN 0 ELSE 1 END),
      late_delivery_count = late_delivery_count + (CASE WHEN v_is_late THEN 1 ELSE 0 END),
      
      -- 점수 재계산 (간소화된 로직)
      completion_score = (completed_quests::numeric / GREATEST(total_assigned_quests, 1)) * 100,
      punctuality_score = (on_time_delivery_count::numeric / GREATEST(completed_quests, 1)) * 100
    WHERE performer_id = v_performer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. 트리거: Quest 완료 시 통계 업데이트
DROP TRIGGER IF EXISTS update_stats_on_quest_complete ON quests;
CREATE TRIGGER update_stats_on_quest_complete
  AFTER UPDATE ON quests
  FOR EACH ROW
  EXECUTE FUNCTION update_performer_stats_on_completion();

-- 7. 리뷰 작성 시 평점 업데이트 함수
CREATE OR REPLACE FUNCTION update_performer_review_score()
RETURNS TRIGGER AS $$
DECLARE
  v_avg_rating numeric;
BEGIN
  -- 해당 수행자의 평균 평점 계산
  SELECT AVG(rating) INTO v_avg_rating
  FROM reviews
  WHERE reviewee_id = NEW.reviewee_id;
  
  -- 5점 만점을 100점 만점으로 환산
  UPDATE performer_reputation
  SET review_score = (v_avg_rating / 5.0) * 100
  WHERE performer_id = NEW.reviewee_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. 트리거: 리뷰 작성 시 점수 업데이트
DROP TRIGGER IF EXISTS update_score_on_review ON reviews;
CREATE TRIGGER update_score_on_review
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_performer_review_score();

-- 9. 의뢰자 신뢰도도 profiles 테이블에 동기화 (기존 client_reputation 테이블 활용)
CREATE OR REPLACE FUNCTION sync_client_trust_to_profile()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET 
    trust_score = NEW.trust_score,
    is_blacklisted = NEW.is_blacklisted,
    trust_tier = CASE
      WHEN NEW.is_blacklisted THEN 'Blacklisted'
      WHEN NEW.trust_score >= 95 THEN 'Diamond'
      WHEN NEW.trust_score >= 90 THEN 'Platinum'
      WHEN NEW.trust_score >= 80 THEN 'Gold'
      WHEN NEW.trust_score >= 70 THEN 'Silver'
      WHEN NEW.trust_score >= 50 THEN 'Bronze'
      ELSE 'Warning'
    END
  WHERE id = NEW.client_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sync_client_profile ON client_reputation;
CREATE TRIGGER sync_client_profile
  AFTER INSERT OR UPDATE ON client_reputation
  FOR EACH ROW
  EXECUTE FUNCTION sync_client_trust_to_profile();

-- 10. 유틸리티 뷰: 블랙리스트 유저 목록
CREATE OR REPLACE VIEW blacklist_users AS
SELECT 
  id, 
  email, 
  full_name, 
  user_type, 
  trust_score, 
  trust_tier
FROM profiles
WHERE is_blacklisted = true;

COMMENT ON COLUMN profiles.trust_score IS '사용자 신뢰도 점수 (0-100%)';
COMMENT ON COLUMN profiles.trust_tier IS '신뢰도 등급 (Diamond ~ Blacklisted)';
