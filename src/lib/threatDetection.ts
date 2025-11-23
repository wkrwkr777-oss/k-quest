// AI 기반 범죄/악의적 행위 감지 시스템
import { supabase } from './supabase';
import { createNotification } from './notifications';

export type ThreatLevel = 'low' | 'medium' | 'high' | 'critical';
export type ThreatType =
    | 'sex_trafficking'
    | 'drug_dealing'
    | 'money_laundering'
    | 'scam'
    | 'harassment'
    | 'exploitation'
    | 'illegal_service'
    | 'violence_threat'
    | 'hate_speech';

interface ThreatDetection {
    type: ThreatType;
    level: ThreatLevel;
    patterns: string[];
    confidence: number; // 0-100
}

/**
 * 범죄/악의적 키워드 데이터베이스
 */
const THREAT_PATTERNS = {
    // 성매매/인신매매
    sex_trafficking: {
        keywords: [
            // 영어
            'escort', 'massage', 'adult service', '성인 서비스', 'happy ending',
            'companion', 'private party', 'vip room', 'special service',
            // 한국어
            '원조', '조건', '성매매', '성인 마사지', '성인 모임', '애인대행', '모텔',
            '호텔 놀이', '사창', '티켓다방', '보도', '성인업소'
        ],
        level: 'critical' as ThreatLevel,
    },

    // 마약
    drug_dealing: {
        keywords: [
            // 영어
            'weed', 'marijuana', 'cannabis', 'cocaine', 'mdma', 'ecstasy',
            'pills', 'substance', 'party favor', 'special candy',
            // 한국어
            '마약', '대마', '필로폰', '히로뽕', '엑스터시', '떨', '떨이',
            '아이스', 'ice', 'candy', '환약', '약', '똥'
        ],
        level: 'critical' as ThreatLevel,
    },

    // 자금 세탁
    money_laundering: {
        keywords: [
            'cash only', 'no trace', 'clean money', 'untraceable',
            '현금 only', '현금만', '추적 불가', '깨끗한 돈', '익명 송금',
            'bitcoin exchange', 'cryptocurrency', '가상화폐 현금화',
            '차명 계좌', '대포통장'
        ],
        level: 'critical' as ThreatLevel,
    },

    // 사기
    scam: {
        keywords: [
            'guaranteed profit', 'easy money', 'get rich quick',
            'investment opportunity', '100% return', 'risk-free',
            '보장 수익', '쉬운 돈', '빠른 부자', '투자 기회', '리스크 제로',
            '다단계', '피라미드', '폰지', '먹튀', '사기',
            '피싱', 'phishing', '보이스피싱'
        ],
        level: 'high' as ThreatLevel,
    },

    // 성희롱/괴롭힘
    harassment: {
        keywords: [
            'sexy', 'hot', 'beautiful body', 'age?', 'single?',
            '몸매', '섹시', '나이', '미혼', '싱글', '만남', '데이트',
            '외모', '사진 보내', '만날래', '혼자', '집 주소'
        ],
        level: 'high' as ThreatLevel,
    },

    // 착취
    exploitation: {
        keywords: [
            'work for free', 'unpaid', 'exposure payment',
            '무급', '공짜', '무료', '봉사', '경력 쌓기',
            'free labor', '노예', '강제',
            '최저임금 미만', 'below minimum wage'
        ],
        level: 'medium' as ThreatLevel,
    },

    // 불법 서비스
    illegal_service: {
        keywords: [
            'fake id', 'fake document', 'passport', 'visa fraud',
            '가짜 신분증', '위조', '서류', '비자 사기',
            'illegal immigration', 'smuggling',
            '밀입국', '밀수', '밀반입', '불법 체류'
        ],
        level: 'critical' as ThreatLevel,
    },

    // 폭력 협박
    violence_threat: {
        keywords: [
            'hurt', 'kill', 'beat', 'weapon', 'knife', 'gun',
            '죽이', '때리', '패', '칼', '총', '무기',
            '협박', '공갈', '폭행', '살해', '위협'
        ],
        level: 'critical' as ThreatLevel,
    },

    // 혐오 발언
    hate_speech: {
        keywords: [
            // 인종차별
            'racial slur', 'racist', '흑인', '백인', 'chink', 'gook',
            // 성차별
            'sexist', '여자는', '남자는',
            // 기타 혐오
            '장애인', 'retard', '병신'
        ],
        level: 'medium' as ThreatLevel,
    },
};

/**
 * 텍스트 분석 - 위협 감지
 */
export function detectThreats(text: string): ThreatDetection[] {
    const detections: ThreatDetection[] = [];
    const lowerText = text.toLowerCase();

    for (const [type, config] of Object.entries(THREAT_PATTERNS)) {
        const matchedPatterns: string[] = [];
        let matchCount = 0;

        for (const keyword of config.keywords) {
            if (lowerText.includes(keyword.toLowerCase())) {
                matchedPatterns.push(keyword);
                matchCount++;
            }
        }

        if (matchCount > 0) {
            // 신뢰도 계산 (매치된 키워드 수에 비례)
            const confidence = Math.min(100, matchCount * 30);

            detections.push({
                type: type as ThreatType,
                level: config.level,
                patterns: matchedPatterns,
                confidence,
            });
        }
    }

    return detections;
}

/**
 * Quest 내용 검증
 */
export async function validateQuestContent(
    questId: string,
    userId: string,
    title: string,
    description: string
): Promise<{ safe: boolean; threats?: ThreatDetection[] }> {
    try {
        const fullText = `${title} ${description}`;
        const threats = detectThreats(fullText);

        if (threats.length > 0) {
            // 위협 로깅
            await supabase.from('threat_detections').insert({
                user_id: userId,
                content_type: 'quest',
                content_id: questId,
                threats: threats.map(t => ({
                    type: t.type,
                    level: t.level,
                    confidence: t.confidence,
                })),
                content_sample: fullText.slice(0, 500),
            });

            // Critical 수준이 있으면 즉시 차단
            const hasCritical = threats.some(t => t.level === 'critical');
            if (hasCritical) {
                // 자동 정지
                await applyAutomatedRestriction(userId, 'quest_creation_blocked', threats);

                return { safe: false, threats };
            }

            // High 수준 2개 이상이면 경고
            const highCount = threats.filter(t => t.level === 'high').length;
            if (highCount >= 2) {
                await issueWarning(userId, threats);
            }
        }

        return { safe: threats.length === 0 || threats.every(t => t.level === 'low') };
    } catch (error) {
        console.error('Failed to validate quest content:', error);
        return { safe: false };
    }
}

/**
 * 메시지 검증
 */
export async function validateMessage(
    userId: string,
    message: string
): Promise<{ safe: boolean; threats?: ThreatDetection[] }> {
    const threats = detectThreats(message);

    if (threats.length > 0) {
        // Critical은 즉시 차단
        const hasCritical = threats.some(t => t.level === 'critical');
        if (hasCritical) {
            await applyAutomatedRestriction(userId, 'messaging_blocked', threats);
            return { safe: false, threats };
        }
    }

    return { safe: true };
}

/**
 * 단계별 제재 적용
 */
export async function applyAutomatedRestriction(
    userId: string,
    restrictionType: string,
    threats: ThreatDetection[]
): Promise<void> {
    try {
        // 현재 경고 수 확인
        const { data: profile } = await supabase
            .from('profiles')
            .select('warning_count, user_type')
            .eq('id', userId)
            .single();

        if (!profile) return;

        const newWarningCount = (profile.warning_count || 0) + 1;
        const threatLevel = threats[0]?.level || 'medium';

        // 제재 단계 결정
        let newUserType = profile.user_type;
        let restrictionLevel = '';

        if (threatLevel === 'critical') {
            // Critical: 즉시 영구 정지
            newUserType = 'banned';
            restrictionLevel = 'permanent_ban';
        } else if (newWarningCount >= 5) {
            // 5회 경고: 영구 정지
            newUserType = 'banned';
            restrictionLevel = 'permanent_ban';
        } else if (newWarningCount >= 3) {
            // 3-4회 경고: 30일 정지
            newUserType = 'suspended';
            restrictionLevel = '30_day_suspension';
        } else if (newWarningCount >= 2) {
            // 2회 경고: 7일 정지
            newUserType = 'suspended';
            restrictionLevel = '7_day_suspension';
        } else {
            // 1회 경고: 기능 제한
            restrictionLevel = 'feature_restriction';
        }

        // 프로필 업데이트
        await supabase
            .from('profiles')
            .update({
                warning_count: newWarningCount,
                user_type: newUserType,
                restriction_type: restrictionType,
                restriction_level: restrictionLevel,
                restricted_at: new Date().toISOString(),
            })
            .eq('id', userId);

        // 제재 기록
        await supabase.from('user_restrictions').insert({
            user_id: userId,
            restriction_type: restrictionType,
            restriction_level: restrictionLevel,
            reason: threats.map(t => `${t.type}: ${t.patterns.join(', ')}`).join('; '),
            threats: threats,
        });

        // 사용자 알림
        let notificationTitle = '';
        let notificationMessage = '';

        switch (restrictionLevel) {
            case 'permanent_ban':
                notificationTitle = '계정 영구 정지';
                notificationMessage = '심각한 위반 행위로 인해 계정이 영구 정지되었습니다.';
                break;
            case '30_day_suspension':
                notificationTitle = '계정 30일 정지';
                notificationMessage = '반복된 위반으로 30일간 계정이 정지됩니다.';
                break;
            case '7_day_suspension':
                notificationTitle = '계정 7일 정지';
                notificationMessage = '정책 위반으로 7일간 계정이 정지됩니다.';
                break;
            default:
                notificationTitle = '경고';
                notificationMessage = `정책 위반이 감지되었습니다. (${newWarningCount}/5)`;
        }

        await createNotification(
            userId,
            'ban',
            notificationTitle,
            notificationMessage
        );

        // 관리자 알림
        const { data: admins } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_type', 'admin');

        if (admins) {
            for (const admin of admins) {
                await createNotification(
                    admin.id,
                    'warning',
                    '자동 제재 발생',
                    `사용자가 ${restrictionLevel} 제재를 받았습니다.`,
                    `/admin/restrictions`
                );
            }
        }
    } catch (error) {
        console.error('Failed to apply automated restriction:', error);
    }
}

/**
 * 경고 발행
 */
async function issueWarning(userId: string, threats: ThreatDetection[]): Promise<void> {
    try {
        const { data: profile } = await supabase
            .from('profiles')
            .select('warning_count')
            .eq('id', userId)
            .single();

        if (!profile) return;

        const newCount = (profile.warning_count || 0) + 1;

        await supabase
            .from('profiles')
            .update({ warning_count: newCount })
            .eq('id', userId);

        await createNotification(
            userId,
            'warning',
            '정책 위반 경고',
            `의심스러운 내용이 감지되었습니다. 경고 ${newCount}/5`
        );
    } catch (error) {
        console.error('Failed to issue warning:', error);
    }
}

// Supabase 테이블:
/*
CREATE TABLE threat_detections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  content_type text NOT NULL,
  content_id uuid,
  threats jsonb NOT NULL,
  content_sample text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE user_restrictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  restriction_type text NOT NULL,
  restriction_level text NOT NULL,
  reason text NOT NULL,
  threats jsonb,
  created_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone
);

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS restriction_type text,
  ADD COLUMN IF NOT EXISTS restriction_level text,
  ADD COLUMN IF NOT EXISTS restricted_at timestamp with time zone;
*/
