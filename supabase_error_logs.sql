-- 에러 로그 테이블
CREATE TABLE IF NOT EXISTS error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  stack text,
  url text,
  user_id uuid REFERENCES profiles(id),
  severity text CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- 인덱스 (빠른 조회)
CREATE INDEX idx_error_logs_severity ON error_logs(severity);
CREATE INDEX idx_error_logs_created ON error_logs(created_at DESC);

-- RLS 비활성화 (관리자만 접근)
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- 관리자만 조회 가능 (실제로는 admin role 체크 필요)
CREATE POLICY "관리자만 에러 로그 조회" ON error_logs FOR SELECT USING (false);
