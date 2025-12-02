-- 수행자 연간 소득 내역 (지급명세서 발급용)
CREATE TABLE IF NOT EXISTS performer_annual_income (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  performer_id uuid REFERENCES profiles(id),
  year integer NOT NULL,
  total_income numeric DEFAULT 0, -- 연간 총 수익
  quest_count integer DEFAULT 0, -- 총 퀘스트 수
  platform_fee_paid numeric DEFAULT 0, -- 플랫폼에 지불한 수수료
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(performer_id, year)
);

-- 수행자 소득 자동 집계 함수
CREATE OR REPLACE FUNCTION update_annual_income()
RETURNS TRIGGER AS $$
BEGIN
  -- 퀘스트 완료 시 수행자의 연간 소득 업데이트
  IF NEW.status = 'completed' THEN
    INSERT INTO performer_annual_income (performer_id, year, total_income, quest_count, platform_fee_paid)
    VALUES (
      NEW.performer_id,
      EXTRACT(YEAR FROM NEW.completed_at),
      NEW.performer_earning,
      1,
      NEW.platform_fee
    )
    ON CONFLICT (performer_id, year) 
    DO UPDATE SET
      total_income = performer_annual_income.total_income + NEW.performer_earning,
      quest_count = performer_annual_income.quest_count + 1,
      platform_fee_paid = performer_annual_income.platform_fee_paid + NEW.platform_fee,
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거: 거래 완료 시 자동으로 소득 집계
CREATE TRIGGER trigger_update_annual_income
AFTER INSERT OR UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_annual_income();
