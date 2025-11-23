-- 보안 및 신고 시스템 추가 스키마
-- 기존 supabase_setup.sql에 추가로 실행

-- Reports 테이블 (신고)
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES profiles(id) NOT NULL,
  target_type text NOT NULL CHECK (target_type IN ('user', 'quest', 'message', 'review')),
  target_id uuid NOT NULL,
  report_type text NOT NULL CHECK (report_type IN ('spam', 'scam', 'inappropriate_content', 'harassment', 'fake_profile', 'payment_fraud', 'other')),
  description text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  admin_notes text,
  reviewed_by uuid REFERENCES profiles(id),
  created_at timestamp with time zone DEFAULT now(),
  reviewed_at timestamp with time zone
);

-- Security Logs 테이블 (보안 로그)
CREATE TABLE IF NOT EXISTS security_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  event_type text NOT NULL, -- 'login_attempt', 'rate_limit', 'suspicious_activity', etc.
  ip_address inet,
  user_agent text,
  details jsonb,
  severity text CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  created_at timestamp with time zone DEFAULT now()
);

-- Session 테이블 (세션 관리)
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  token text UNIQUE NOT NULL,
  ip_address inet,
  user_agent text,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  last_activity timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Policies for reports
CREATE POLICY "Users can create reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  USING (auth.uid() = reporter_id);

CREATE POLICY "Admins can view all reports"
  ON reports FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'admin'));

CREATE POLICY "Admins can update reports"
  ON reports FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'admin'));

-- Policies for security_logs
CREATE POLICY "Admins can view security logs"
  ON security_logs FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'admin'));

CREATE POLICY "System can create security logs"
  ON security_logs FOR INSERT
  WITH CHECK (true);

-- Policies for sessions
CREATE POLICY "Users can view own sessions"
  ON sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_reports_reporter ON reports(reporter_id);
CREATE INDEX idx_reports_target ON reports(target_type, target_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_security_logs_user ON security_logs(user_id);
CREATE INDEX idx_security_logs_severity ON security_logs(severity);
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM sessions WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- Function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
  p_user_id uuid,
  p_event_type text,
  p_severity text,
  p_details jsonb DEFAULT '{}'::jsonb
)
RETURNS void AS $$
BEGIN
  INSERT INTO security_logs (user_id, event_type, severity, details)
  VALUES (p_user_id, p_event_type, p_severity, p_details);
END;
$$ LANGUAGE plpgsql;

-- Add verification fields to profiles (if not exists)
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS phone_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS identity_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS trust_score numeric DEFAULT 0 CHECK (trust_score >= 0 AND trust_score <= 100);

-- Function to update trust score
CREATE OR REPLACE FUNCTION update_trust_score()
RETURNS TRIGGER AS $$
DECLARE
  score numeric := 50; -- Base score
BEGIN
  -- Email verified: +10
  IF NEW.email_verified THEN
    score := score + 10;
  END IF;
  
  -- Phone verified: +10
  IF NEW.phone_verified THEN
    score := score + 10;
  END IF;
  
  -- Identity verified: +20
  IF NEW.identity_verified THEN
    score := score + 20;
  END IF;
  
  -- Good rating: +0 to +10
  IF NEW.rating > 0 THEN
    score := score + (NEW.rating * 2);
  END IF;
  
  -- Warnings: -10 per warning
  score := score - (NEW.warning_count * 10);
  
  -- Ensure score is between 0 and 100
  NEW.trust_score := GREATEST(0, LEAST(100, score));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profile_trust_score
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_trust_score();

-- Add Supabase Storage buckets (Run in SQL Editor or via Dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('profiles', 'profiles', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('quests', 'quests', true);

-- Storage policies (if buckets exist)
-- CREATE POLICY "Public read access for profiles"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'profiles');

-- CREATE POLICY "Users can upload own profile picture"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]);
