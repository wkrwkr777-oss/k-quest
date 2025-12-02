-- 관리자 지원 채팅 테이블
CREATE TABLE IF NOT EXISTS admin_support_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  quest_id uuid REFERENCES quests(id), -- 특정 퀘스트 관련 문의일 경우
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  created_at timestamp with time zone DEFAULT now(),
  resolved_at timestamp with time zone
);

-- 관리자 채팅 메시지 테이블
CREATE TABLE IF NOT EXISTS admin_support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid REFERENCES admin_support_chats(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id),
  is_admin boolean DEFAULT false,
  message text NOT NULL,
  attachments jsonb, -- 파일 URL 배열
  created_at timestamp with time zone DEFAULT now()
);

-- 인덱스
CREATE INDEX idx_support_chats_user ON admin_support_chats(user_id);
CREATE INDEX idx_support_chats_status ON admin_support_chats(status);
CREATE INDEX idx_support_messages_chat ON admin_support_messages(chat_id);

-- RLS
ALTER TABLE admin_support_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_support_messages ENABLE ROW LEVEL SECURITY;

-- 본인이 연 채팅만 조회 가능
CREATE POLICY "본인 채팅 조회" ON admin_support_chats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "본인 메시지 조회" ON admin_support_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM admin_support_chats 
    WHERE admin_support_chats.id = admin_support_messages.chat_id 
    AND admin_support_chats.user_id = auth.uid()
  )
);
