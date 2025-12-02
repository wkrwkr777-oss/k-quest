-- K-Quest 의뢰자 먹튀 방지 시스템
-- 수행자 보호를 위한 강력한 에스크로 및 단계별 공개 시스템

-- 1. Quest 결과물 제출 테이블 (단계별 공개 시스템)
CREATE TABLE IF NOT EXISTS quest_deliverables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_id uuid REFERENCES quests(id) ON DELETE CASCADE NOT NULL,
  performer_id uuid REFERENCES profiles(id) NOT NULL,
  
  -- 미리보기 (의뢰자가 볼 수 있는 제한된 정보)
  preview_title text NOT NULL,
  preview_description text, -- 200자 제한
  preview_images text[], -- 워터마크 적용된 이미지 URL
  
  -- 실제 결과물 (결제 완료 후에만 공개)
  full_content text, -- 암호화 또는 접근 제어
  full_images text[], -- 원본 이미지
  attachments text[], -- 파일 URL (결제 후 접근 가능)
  
  -- 보호 메커니즘
  is_preview_mode boolean DEFAULT true, -- true면 미리보기만 공개
  is_paid boolean DEFAULT false, -- 결제 완료 여부
  unlock_password text, -- 결제 완료 시 생성되는 언락 코드
  
  -- 상태 관리
  status text DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected', 'disputed')),
  
  -- 타임스탬프
  submitted_at timestamp with time zone DEFAULT now(),
  reviewed_at timestamp with time zone,
  unlocked_at timestamp with time zone,
  
  -- 메타데이터
  metadata jsonb DEFAULT '{}'::jsonb
);

-- 2. 에스크로 락 시스템 (결제 보호)
CREATE TABLE IF NOT EXISTS escrow_locks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_id uuid REFERENCES quests(id) ON DELETE CASCADE UNIQUE NOT NULL,
  transaction_id uuid REFERENCES transactions(id),
  
  -- 에스크로 금액
  locked_amount numeric NOT NULL,
  
  -- 상태
  status text DEFAULT 'locked' CHECK (status IN ('locked', 'released_to_performer', 'refunded_to_client', 'disputed')),
  
  -- 자동 릴리즈 설정
  auto_release_at timestamp with time zone, -- 이 시간 이후 자동으로 수행자에게 지급
  auto_release_days integer DEFAULT 7, -- 기본 7일 후 자동 승인
  
  -- 릴리즈 조건
  client_approved boolean DEFAULT false,
  performer_submitted boolean DEFAULT false,
  admin_override boolean DEFAULT false,
  
  -- 타임스탬프
  locked_at timestamp with time zone DEFAULT now(),
  released_at timestamp with time zone,
  
  -- 메타데이터
  notes text
);

-- 3. 의뢰자 신뢰도 및 블랙리스트
CREATE TABLE IF NOT EXISTS client_reputation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) UNIQUE NOT NULL,
  
  -- 신뢰도 점수
  trust_score numeric DEFAULT 100, -- 0-100
  total_quests integer DEFAULT 0,
  approved_quests integer DEFAULT 0,
  rejected_quests integer DEFAULT 0,
  disputed_quests integer DEFAULT 0,
  
  -- 평균 승인 시간
  avg_approval_time_hours numeric DEFAULT 0,
  
  -- 위험 플래그
  is_blacklisted boolean DEFAULT false,
  blacklist_reason text,
  warning_count integer DEFAULT 0,
  
  -- 패턴 감지
  suspicious_pattern_count integer DEFAULT 0, -- 의심스러운 패턴 (ex: 항상 거부)
  last_suspicious_activity timestamp with time zone,
  
  -- 타임스탬프
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 4. 분쟁 처리 시스템
CREATE TABLE IF NOT EXISTS disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_id uuid REFERENCES quests(id) NOT NULL,
  deliverable_id uuid REFERENCES quest_deliverables(id),
  escrow_lock_id uuid REFERENCES escrow_locks(id),
  
  -- 당사자
  filed_by uuid REFERENCES profiles(id) NOT NULL, -- 분쟁 제기자
  filed_against uuid REFERENCES profiles(id) NOT NULL, -- 피신고자
  
  -- 분쟁 내용
  dispute_type text NOT NULL CHECK (dispute_type IN ('non_payment', 'quality_issue', 'scope_creep', 'other')),
  description text NOT NULL,
  evidence_urls text[], -- 증거 자료
  
  -- 상태
  status text DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  resolution text,
  
  -- 결정
  winner uuid REFERENCES profiles(id), -- 승소자
  amount_awarded numeric, -- 지급 금액
  decided_by uuid REFERENCES profiles(id), -- 관리자
  
  -- 타임스탬프
  filed_at timestamp with time zone DEFAULT now(),
  resolved_at timestamp with time zone,
  
  -- 우선순위
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent'))
);

-- 5. Quest 결과물 접근 로그 (의심스러운 활동 추적)
CREATE TABLE IF NOT EXISTS deliverable_access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deliverable_id uuid REFERENCES quest_deliverables(id) NOT NULL,
  accessed_by uuid REFERENCES profiles(id) NOT NULL,
  access_type text NOT NULL CHECK (access_type IN ('preview', 'full_view', 'download')),
  ip_address text,
  user_agent text,
  accessed_at timestamp with time zone DEFAULT now()
);

-- 6. 자동 에스크로 릴리즈 함수
CREATE OR REPLACE FUNCTION auto_release_escrow()
RETURNS void AS $$
DECLARE
  lock_record record;
BEGIN
  -- 자동 릴리즈 시간이 지난 에스크로를 찾아서 수행자에게 지급
  FOR lock_record IN
    SELECT el.*, q.performer_id, q.id as quest_id
    FROM escrow_locks el
    JOIN quests q ON q.id = el.quest_id
    WHERE el.status = 'locked'
      AND el.auto_release_at <= now()
      AND q.status = 'in_progress'
  LOOP
    -- 에스크로 상태 변경
    UPDATE escrow_locks
    SET 
      status = 'released_to_performer',
      released_at = now()
    WHERE id = lock_record.id;
    
    -- Quest 완료 처리
    UPDATE quests
    SET 
      status = 'completed',
      completed_at = now()
    WHERE id = lock_record.quest_id;
    
    -- 수행자에게 지급 (기존 complete-quest API와 동일)
    -- Transaction 업데이트는 API에서 처리
    
    -- 알림 발송
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (
      lock_record.performer_id,
      'auto_payment_released',
      '🎉 자동 승인으로 수익이 지급되었습니다',
      format('의뢰자의 승인 기한이 지나 자동으로 Quest가 완료되었습니다. ₩%s가 지급되었습니다.', lock_record.locked_amount * 0.7),
      format('/quests/%s', lock_record.quest_id)
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 7. 의뢰자 신뢰도 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_client_reputation()
RETURNS TRIGGER AS $$
DECLARE
  client_id_var uuid;
  approval_ratio numeric;
BEGIN
  -- Quest의 의뢰자 찾기
  SELECT client_id INTO client_id_var
  FROM quests
  WHERE id = NEW.quest_id;
  
  -- 신뢰도 레코드가 없으면 생성
  INSERT INTO client_reputation (client_id)
  VALUES (client_id_var)
  ON CONFLICT (client_id) DO NOTHING;
  
  -- 통계 업데이트
  UPDATE client_reputation cr
  SET
    total_quests = (SELECT COUNT(*) FROM quests WHERE client_id = client_id_var AND status IN ('completed', 'cancelled')),
    approved_quests = (SELECT COUNT(*) FROM escrow_locks el JOIN quests q ON q.id = el.quest_id WHERE q.client_id = client_id_var AND el.client_approved = true),
    disputed_quests = (SELECT COUNT(*) FROM disputes WHERE filed_against = client_id_var),
    updated_at = now()
  WHERE client_id = client_id_var;
  
  -- 신뢰도 점수 재계산
  SELECT 
    CASE 
      WHEN total_quests > 0 THEN (approved_quests::numeric / total_quests * 100)
      ELSE 100
    END INTO approval_ratio
  FROM client_reputation
  WHERE client_id = client_id_var;
  
  UPDATE client_reputation
  SET trust_score = GREATEST(0, approval_ratio - (disputed_quests * 10))
  WHERE client_id = client_id_var;
  
  -- 신뢰도가 30 이하면 경고
  IF approval_ratio < 30 THEN
    UPDATE client_reputation
    SET 
      warning_count = warning_count + 1,
      suspicious_pattern_count = suspicious_pattern_count + 1,
      last_suspicious_activity = now()
    WHERE client_id = client_id_var;
  END IF;
  
  -- 신뢰도가 20 이하면 블랙리스트
  IF approval_ratio < 20 THEN
    UPDATE client_reputation
    SET 
      is_blacklisted = true,
      blacklist_reason = '낮은 승인율로 인한 자동 블랙리스트'
    WHERE client_id = client_id_var;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. 트리거: 에스크로 상태 변경 시 신뢰도 업데이트
CREATE TRIGGER update_reputation_on_escrow_change
  AFTER UPDATE ON escrow_locks
  FOR EACH ROW
  WHEN (OLD.status != NEW.status)
  EXECUTE FUNCTION update_client_reputation();

-- 9. 인덱스 생성
CREATE INDEX idx_deliverables_quest ON quest_deliverables(quest_id);
CREATE INDEX idx_deliverables_performer ON quest_deliverables(performer_id);
CREATE INDEX idx_deliverables_status ON quest_deliverables(status);
CREATE INDEX idx_escrow_quest ON escrow_locks(quest_id);
CREATE INDEX idx_escrow_status ON escrow_locks(status);
CREATE INDEX idx_escrow_auto_release ON escrow_locks(auto_release_at) WHERE status = 'locked';
CREATE INDEX idx_disputes_quest ON disputes(quest_id);
CREATE INDEX idx_disputes_status ON disputes(status);
CREATE INDEX idx_reputation_client ON client_reputation(client_id);
CREATE INDEX idx_reputation_blacklist ON client_reputation(is_blacklisted);
CREATE INDEX idx_access_logs_deliverable ON deliverable_access_logs(deliverable_id);

-- 10. Row Level Security
ALTER TABLE quest_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_reputation ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverable_access_logs ENABLE ROW LEVEL SECURITY;

-- Policies for quest_deliverables
CREATE POLICY "수행자는 자신의 결과물 관리 가능"
  ON quest_deliverables FOR ALL
  USING (performer_id = auth.uid());

CREATE POLICY "의뢰자는 미리보기만 볼 수 있음"
  ON quest_deliverables FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quests 
      WHERE quests.id = quest_deliverables.quest_id 
      AND quests.client_id = auth.uid()
      AND (quest_deliverables.is_preview_mode = true OR quest_deliverables.is_paid = true)
    )
  );

-- Policies for escrow_locks
CREATE POLICY "에스크로는 관련 당사자만 조회"
  ON escrow_locks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quests 
      WHERE quests.id = escrow_locks.quest_id 
      AND (quests.client_id = auth.uid() OR quests.performer_id = auth.uid())
    )
  );

-- Policies for disputes
CREATE POLICY "분쟁 당사자만 조회 가능"
  ON disputes FOR SELECT
  USING (filed_by = auth.uid() OR filed_against = auth.uid());

CREATE POLICY "분쟁은 당사자만 제기 가능"
  ON disputes FOR INSERT
  WITH CHECK (filed_by = auth.uid());

-- 11. 크론잡 스케줄 (Supabase에서 설정 필요)
-- 매 시간마다 자동 에스크로 릴리즈 실행
-- SELECT cron.schedule('auto-release-escrow', '0 * * * *', 'SELECT auto_release_escrow()');

-- 12. 유틸리티 뷰
CREATE OR REPLACE VIEW risky_clients AS
SELECT 
  cr.*,
  p.email,
  p.full_name
FROM client_reputation cr
JOIN profiles p ON p.id = cr.client_id
WHERE cr.trust_score < 50 OR cr.is_blacklisted = true
ORDER BY cr.trust_score ASC;

COMMENT ON TABLE quest_deliverables IS '수행자의 Quest 결과물 제출 - 단계별 공개 시스템';
COMMENT ON COLUMN quest_deliverables.is_preview_mode IS 'true면 미리보기만 공개, false면 전체 공개';
COMMENT ON COLUMN quest_deliverables.is_paid IS '결제 완료 시 true, 이때 전체 내용 공개';
COMMENT ON TABLE escrow_locks IS '에스크로 시스템 - 결제 보호 및 자동 릴리즈';
COMMENT ON COLUMN escrow_locks.auto_release_at IS '이 시간 이후 자동으로 수행자에게 지급';
COMMENT ON TABLE client_reputation IS '의뢰자 신뢰도 및 블랙리스트';
COMMENT ON TABLE disputes IS '분쟁 처리 시스템';
