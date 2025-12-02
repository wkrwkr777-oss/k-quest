-- K-Quest 전문가 인증 시스템 (Expert Verification)

-- 1. 전문가 인증 요청 테이블
CREATE TABLE IF NOT EXISTS expert_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  
  category text NOT NULL, -- 'student' (대학생), 'professional' (전문직), 'language' (어학), 'local' (현지전문가)
  document_url text NOT NULL, -- 증빙서류 이미지 URL (비공개)
  description text, -- 자기소개/경력 기술
  
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_feedback text, -- 거절 사유 등
  
  created_at timestamp with time zone DEFAULT now(),
  reviewed_at timestamp with time zone
);

-- 2. 프로필에 전문가 필드 추가
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_verified_expert boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS expert_category text, -- 배지에 표시될 타이틀 (예: 'Seoul Univ.', 'Certified Guide')
ADD COLUMN IF NOT EXISTS expert_badges text[]; -- 보유한 전문 배지 목록

-- RLS 정책
ALTER TABLE expert_verifications ENABLE ROW LEVEL SECURITY;

-- 본인은 자기 요청 조회/생성 가능
CREATE POLICY "본인 인증 요청 조회" ON expert_verifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "본인 인증 요청 생성" ON expert_verifications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 관리자는 모든 요청 조회/수정 가능 (실제 운영 시 admin role 적용 필요)
-- CREATE POLICY "관리자 전체 조회" ON expert_verifications FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
