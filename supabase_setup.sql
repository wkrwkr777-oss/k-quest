-- K-Quest Database Schema (FULL HIGH PRIORITY VERSION)
-- Run this in Supabase SQL Editor

-- Drop existing tables if needed (in correct order due to dependencies)
DROP TABLE IF EXISTS chat_violations CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS quest_applications CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS admin_actions CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS quests CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- User Profiles
CREATE TABLE profiles (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  phone text,
  user_type text DEFAULT 'user' CHECK (user_type IN ('user', 'admin', 'banned')),
  balance numeric DEFAULT 0,
  total_earnings numeric DEFAULT 0,
  pending_balance numeric DEFAULT 0,
  rating numeric DEFAULT 0,
  completed_quests integer DEFAULT 0,
  verification_status text DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'verified', 'rejected')),
  warning_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  last_active_at timestamp with time zone DEFAULT now()
);

-- Quests
CREATE TABLE quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  reward numeric NOT NULL,
  location text NOT NULL,
  category text NOT NULL,
  difficulty text CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  status text DEFAULT 'pending_approval' CHECK (status IN ('pending_approval', 'open', 'in_progress', 'completed', 'cancelled', 'rejected')),
  client_id uuid REFERENCES profiles(id) NOT NULL,
  performer_id uuid REFERENCES profiles(id),
  approved_by uuid REFERENCES profiles(id),
  application_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  images text[], -- Array of image URLs
  created_at timestamp with time zone DEFAULT now(),
  approved_at timestamp with time zone,
  expires_at timestamp with time zone,
  started_at timestamp with time zone,
  completed_at timestamp with time zone
);

-- Quest Applications (수행자가 Quest에 지원)
CREATE TABLE quest_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_id uuid REFERENCES quests(id) ON DELETE CASCADE NOT NULL,
  applicant_id uuid REFERENCES profiles(id) NOT NULL,
  message text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at timestamp with time zone DEFAULT now(),
  responded_at timestamp with time zone,
  UNIQUE(quest_id, applicant_id)
);

-- Chat Messages (직거래 방지 시스템 포함)
CREATE TABLE chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_id uuid REFERENCES quests(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES profiles(id) NOT NULL,
  receiver_id uuid REFERENCES profiles(id) NOT NULL,
  message text NOT NULL,
  filtered_message text, -- 필터링된 메시지 (연락처 등이 ***로 대체됨)
  is_flagged boolean DEFAULT false, -- 의심스러운 메시지
  flagged_reason text,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Chat Violations (위반 기록)
CREATE TABLE chat_violations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES chat_messages(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) NOT NULL,
  violation_type text NOT NULL, -- 'contact_info', 'price_negotiation', 'offensive', etc.
  matched_pattern text,
  severity text CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  admin_reviewed boolean DEFAULT false,
  action_taken text, -- 'warning', 'temp_ban', 'permanent_ban'
  created_at timestamp with time zone DEFAULT now()
);

-- Notifications
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL, -- 'quest_accepted', 'new_message', 'payment_received', 'warning', etc.
  title text NOT NULL,
  message text NOT NULL,
  link text, -- URL to navigate to
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Reviews
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_id uuid REFERENCES quests(id) ON DELETE CASCADE NOT NULL,
  reviewer_id uuid REFERENCES profiles(id) NOT NULL,
  reviewee_id uuid REFERENCES profiles(id) NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment text,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(quest_id, reviewer_id, reviewee_id)
);

-- Transactions
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_id uuid REFERENCES quests(id),
  payer_id uuid REFERENCES profiles(id),
  payee_id uuid REFERENCES profiles(id),
  amount numeric NOT NULL,
  fee numeric NOT NULL,
  net_amount numeric NOT NULL,
  payment_method text NOT NULL,
  payment_id text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'held')),
  type text CHECK (type IN ('payment', 'withdrawal', 'refund')),
  created_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone
);

-- Admin Actions (관리자 활동 로그)
CREATE TABLE admin_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES profiles(id) NOT NULL,
  action_type text NOT NULL, -- 'approve_quest', 'ban_user', 'review_chat', etc.
  target_type text, -- 'quest', 'user', 'message', etc.
  target_id uuid,
  details jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policies for quests
CREATE POLICY "Approved quests are viewable by everyone"
  ON quests FOR SELECT
  USING (status != 'pending_approval' OR client_id = auth.uid());

CREATE POLICY "Users can create quests"
  ON quests FOR INSERT
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Quest owners can update their quests"
  ON quests FOR UPDATE
  USING (auth.uid() = client_id OR auth.uid() = performer_id);

-- Policies for quest_applications
CREATE POLICY "Users can view applications for their quests"
  ON quest_applications FOR SELECT
  USING (
    applicant_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM quests WHERE quests.id = quest_id AND quests.client_id = auth.uid())
  );

CREATE POLICY "Users can create applications"
  ON quest_applications FOR INSERT
  WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Applicants can update own applications"
  ON quest_applications FOR UPDATE
  USING (applicant_id = auth.uid());

-- Policies for chat_messages
CREATE POLICY "Users can view messages where they are sender or receiver"
  ON chat_messages FOR SELECT
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can send messages"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Policies for notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for reviews
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

-- Policies for transactions
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = payer_id OR auth.uid() = payee_id);

-- Policies for admin_actions (Admin only)
CREATE POLICY "Admins can view all actions"
  ON admin_actions FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'admin'));

CREATE POLICY "Admins can create actions"
  ON admin_actions FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'admin'));

-- Indexes for performance
CREATE INDEX idx_quests_status ON quests(status);
CREATE INDEX idx_quests_client ON quests(client_id);
CREATE INDEX idx_quests_performer ON quests(performer_id);
CREATE INDEX idx_applications_quest ON quest_applications(quest_id);
CREATE INDEX idx_applications_applicant ON quest_applications(applicant_id);
CREATE INDEX idx_chat_quest ON chat_messages(quest_id);
CREATE INDEX idx_chat_sender ON chat_messages(sender_id);
CREATE INDEX idx_chat_receiver ON chat_messages(receiver_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_transactions_user ON transactions(payer_id, payee_id);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to update quest application count
CREATE OR REPLACE FUNCTION update_quest_application_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE quests SET application_count = application_count + 1 WHERE id = NEW.quest_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE quests SET application_count = application_count - 1 WHERE id = OLD.quest_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_application_count
  AFTER INSERT OR DELETE ON quest_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_quest_application_count();

-- Function to update user rating when review is added
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET rating = (
    SELECT AVG(rating)::numeric(3,2)
    FROM reviews
    WHERE reviewee_id = NEW.reviewee_id
  )
  WHERE id = NEW.reviewee_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_on_review
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_user_rating();
