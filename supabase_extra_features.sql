-- K-Quest 추가 기능 (마일스톤 & 영상 제안서)

-- 1. 마일스톤(단계별 결제) 테이블
CREATE TABLE IF NOT EXISTS quest_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_id uuid REFERENCES quests(id) ON DELETE CASCADE NOT NULL,
  
  title text NOT NULL, -- 단계명 (예: 착수금, 중간보고, 최종완료)
  description text,
  amount numeric NOT NULL, -- 해당 단계 금액
  order_index integer NOT NULL, -- 순서 (1, 2, 3...)
  
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'paid')),
  due_date timestamp with time zone,
  
  created_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone
);

-- 2. 영상 제안서 (Video Proposals)
-- quest_applications 테이블에 영상 URL 컬럼 추가
ALTER TABLE quest_applications
ADD COLUMN IF NOT EXISTS video_url text, -- 영상 파일 URL (Supabase Storage)
ADD COLUMN IF NOT EXISTS video_thumbnail_url text,
ADD COLUMN IF NOT EXISTS video_duration integer; -- 초 단위

-- 3. 실시간 위치 로그 (선택사항)
CREATE TABLE IF NOT EXISTS location_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_id uuid REFERENCES quests(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  timestamp timestamp with time zone DEFAULT now()
);

-- 인덱스
CREATE INDEX idx_milestones_quest ON quest_milestones(quest_id);
CREATE INDEX idx_location_quest ON location_logs(quest_id);

-- RLS 정책
ALTER TABLE quest_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "마일스톤은 당사자만 조회"
  ON quest_milestones FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quests 
      WHERE quests.id = quest_milestones.quest_id 
      AND (quests.client_id = auth.uid() OR quests.performer_id = auth.uid())
    )
  );
