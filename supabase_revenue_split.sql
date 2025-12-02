-- K-Quest 수익 분배 시스템 업데이트
-- 이 파일을 Supabase SQL Editor에서 실행하세요

-- 1. transactions 테이블에 수익 분배 컬럼 추가
ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS platform_fee numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS performer_earning numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS revenue_split_ratio numeric DEFAULT 0.7; -- 수행자 비율 (70%)

-- 2. 기존 데이터 업데이트 (이미 있는 거래에 대해)
UPDATE transactions
SET 
  platform_fee = amount * 0.30,
  performer_earning = amount * 0.70,
  revenue_split_ratio = 0.7
WHERE platform_fee IS NULL OR platform_fee = 0;

-- 3. 수익 분배 자동 계산 함수
CREATE OR REPLACE FUNCTION calculate_revenue_split()
RETURNS TRIGGER AS $$
BEGIN
  -- 수행자 70%, 플랫폼 30% 자동 계산
  NEW.performer_earning := NEW.amount * COALESCE(NEW.revenue_split_ratio, 0.7);
  NEW.platform_fee := NEW.amount * (1 - COALESCE(NEW.revenue_split_ratio, 0.7));
  NEW.net_amount := NEW.performer_earning;
  NEW.fee := NEW.platform_fee;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. 트리거 생성 (INSERT 시 자동 계산)
DROP TRIGGER IF EXISTS auto_calculate_revenue_split ON transactions;
CREATE TRIGGER auto_calculate_revenue_split
  BEFORE INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION calculate_revenue_split();

-- 5. Quest 완료 시 자동 정산을 위한 함수
CREATE OR REPLACE FUNCTION process_quest_completion(
  p_quest_id uuid,
  p_transaction_id uuid
)
RETURNS jsonb AS $$
DECLARE
  v_quest record;
  v_transaction record;
  v_performer_id uuid;
  v_amount numeric;
  v_performer_earning numeric;
  v_platform_fee numeric;
BEGIN
  -- Quest 정보 가져오기
  SELECT * INTO v_quest FROM quests WHERE id = p_quest_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Quest not found';
  END IF;
  
  -- Transaction 정보 가져오기
  SELECT * INTO v_transaction FROM transactions WHERE id = p_transaction_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transaction not found';
  END IF;
  
  v_performer_id := v_quest.performer_id;
  v_amount := v_transaction.amount;
  v_performer_earning := v_transaction.performer_earning;
  v_platform_fee := v_transaction.platform_fee;
  
  -- 수행자 잔액 업데이트 (70%)
  UPDATE profiles
  SET 
    balance = balance + v_performer_earning,
    total_earnings = total_earnings + v_performer_earning,
    completed_quests = completed_quests + 1
  WHERE id = v_performer_id;
  
  -- Quest 상태 업데이트
  UPDATE quests
  SET 
    status = 'completed',
    completed_at = now()
  WHERE id = p_quest_id;
  
  -- Transaction 상태 업데이트
  UPDATE transactions
  SET 
    status = 'completed',
    completed_at = now(),
    payee_id = v_performer_id
  WHERE id = p_transaction_id;
  
  -- 알림 생성
  INSERT INTO notifications (user_id, type, title, message, link)
  VALUES (
    v_performer_id,
    'payment_received',
    '수익이 지급되었습니다',
    format('Quest 완료로 ₩%s를 받았습니다 (플랫폼 수수료 30%% 차감 후)', v_performer_earning),
    format('/quests/%s', p_quest_id)
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'quest_id', p_quest_id,
    'performer_id', v_performer_id,
    'total_amount', v_amount,
    'performer_earning', v_performer_earning,
    'platform_fee', v_platform_fee,
    'split_ratio', '70:30'
  );
END;
$$ LANGUAGE plpgsql;

-- 6. 관리자용 수익 통계 뷰
CREATE OR REPLACE VIEW revenue_statistics AS
SELECT
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as transaction_count,
  SUM(amount) as total_revenue,
  SUM(platform_fee) as platform_revenue,
  SUM(performer_earning) as performer_revenue,
  ROUND(AVG(platform_fee / NULLIF(amount, 0) * 100), 2) as avg_platform_fee_percentage
FROM transactions
WHERE status = 'completed'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- 7. 수행자별 수익 통계 뷰
CREATE OR REPLACE VIEW performer_earnings_summary AS
SELECT
  p.id,
  p.email,
  p.full_name,
  p.total_earnings,
  p.balance,
  p.completed_quests,
  COUNT(t.id) as total_transactions,
  SUM(t.performer_earning) as total_earned_from_transactions,
  SUM(t.platform_fee) as total_platform_fees_paid
FROM profiles p
LEFT JOIN transactions t ON t.payee_id = p.id AND t.status = 'completed'
GROUP BY p.id, p.email, p.full_name, p.total_earnings, p.balance, p.completed_quests
ORDER BY p.total_earnings DESC;

COMMENT ON TABLE transactions IS '거래 내역 - 자동으로 70:30 수익 분배 계산';
COMMENT ON COLUMN transactions.platform_fee IS '플랫폼 수수료 (30%)';
COMMENT ON COLUMN transactions.performer_earning IS '수행자 수익 (70%)';
COMMENT ON COLUMN transactions.revenue_split_ratio IS '수익 분배 비율 (기본값: 0.7 = 70%)';
