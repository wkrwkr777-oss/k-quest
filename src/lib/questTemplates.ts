export interface QuestTemplate {
    id: string
    icon: string
    title: string
    description: string
    defaultTitle: string
    questions: string[] // 의뢰자가 채워야 할 내용 가이드
}

export const QUEST_TEMPLATES: QuestTemplate[] = [
    {
        id: 'restaurant',
        icon: '🍽️',
        title: '식당 예약/웨이팅',
        description: '인기 맛집 예약이나 줄서기가 필요할 때',
        defaultTitle: '[식당예약] OO식당 예약 부탁드립니다',
        questions: [
            '1. 식당 이름 및 지점:',
            '2. 희망 날짜 및 시간:',
            '3. 인원 수:',
            '4. 알러지/못 먹는 음식:',
            '5. 예약 실패 시 대안 (다른 식당 or 날짜 변경):'
        ]
    },
    {
        id: 'kpop',
        icon: '🎫',
        title: 'K-POP 티켓팅/굿즈',
        description: '콘서트 티켓팅이나 한정판 굿즈 구매 대행',
        defaultTitle: '[구매대행] OO 콘서트 티켓팅 도와주세요',
        questions: [
            '1. 공연/이벤트 이름:',
            '2. 희망 좌석 등급:',
            '3. 예매처 (인터파크, 예스24 등):',
            '4. 계정 정보 필요 여부:',
            '5. 성공 보수 (프리미엄):'
        ]
    },
    {
        id: 'guide',
        icon: 'walking', // FontAwesome class or emoji
        title: '로컬 투어 가이드',
        description: '현지인만 아는 핫플레이스 투어',
        defaultTitle: '[가이드] 서울 핫플 투어 가이드 구합니다',
        questions: [
            '1. 여행 날짜 및 시간:',
            '2. 인원 수:',
            '3. 선호하는 스타일 (쇼핑, 먹방, 힐링):',
            '4. 이동 수단 (대중교통, 택시, 렌트):',
            '5. 예산 범위:'
        ]
    },
    {
        id: 'delivery',
        icon: '📦',
        title: '배달/심부름',
        description: '급한 물건 배달이나 간단한 심부름',
        defaultTitle: '[심부름] 급하게 약 좀 사다주세요',
        questions: [
            '1. 심부름 내용:',
            '2. 픽업 장소:',
            '3. 배달 장소:',
            '4. 희망 완료 시간:',
            '5. 물품 구매 비용 (예상):'
        ]
    }
]
