export type Language = 'en' | 'ko';

export const translations = {
    en: {
        common: {
            welcome: "Welcome",
            search: "Search",
            loading: "Loading...",
            error: "An error occurred",
            success: "Success",
            confirm: "Confirm",
            cancel: "Cancel",
            back: "Back",
            viewDetails: "View Details",
            accept: "Accept",
            share: "Share",
            manage: "Manage",
            withdraw: "Withdraw",
            settle: "Settle Revenue",
        },
        nav: {
            collection: "Collection",
            about: "About",
            portfolio: "Wallet",
            signIn: "Sign In",
            postQuest: "Post a Quest",
        },
        hero: {
            subtitle: "The Premium Global Concierge",
            title: "Experience True Korea",
            description: "Connect with local experts for exclusive tasks and experiences. From hidden gems to VIP services, K-Quest elevates your journey.",
            explore: "Explore Collection",
            philosophy: "Our Philosophy",
        },
        quest: {
            title: "Curated Quests",
            subtitle: "The Collection",
            description: "Discover exclusive opportunities and premium services tailored to your needs.",
            reward: "Reward",
            location: "Location",
            time: "Time",
            difficulty: "Difficulty",
            category: "Category",
            requester: "Requester",
            totalReward: "Total Reward",
            requestDetails: "Request Details",
            financialBreakdown: "Financial Breakdown",
            performerEarnings: "Performer Earnings",
            platformFee: "Platform Fee",
            safety: "Verified Request. This task is protected by K-Quest Secure Escrow. Payment is guaranteed upon successful completion.",
        },
        wallet: {
            title: "Financial Overview",
            subtitle: "My Portfolio",
            totalBalance: "Total Balance",
            availableWithdrawal: "Available for Withdrawal",
            adminAccess: "Admin Access",
            platformRevenue: "Platform Revenue",
            transactionHistory: "Transaction History",
            export: "Export Data",
            table: {
                date: "Date",
                type: "Type",
                description: "Description",
                amount: "Amount",
                status: "Status"
            },
            transactions: [
                { id: 1, type: "Deposit", title: "Quest Completed: Hongdae Guide", amount: "+ $15.00", date: "OCT 25, 2023", status: "Completed" },
                { id: 2, type: "Deposit", title: "Quest Completed: Haeundae Photo", amount: "+ $5.00", date: "OCT 24, 2023", status: "Completed" },
                { id: 3, type: "Withdrawal", title: "Transfer to Bank Account", amount: "- $10.00", date: "OCT 20, 2023", status: "Processing" }
            ]
        },
        auth: {
            loginTitle: "Select Access Mode",
            foreigner: "Global Traveler",
            local: "Korean Expert",
            loginSuccess: "Welcome back,",
            logout: "Sign Out",
        },
        toast: {
            langSwitched: "Language switched to English",
            loginForeigner: "Logged in as Global Traveler",
            loginLocal: "Logged in as Korean Expert",
            questPosted: "Quest submitted successfully",
        },
        ai: {
            title: "K-Quest Assistant",
            subtitle: "24/7 Automated Support",
            placeholder: "Ask for help...",
            welcome: "Hello! I am the K-Quest automated assistant. How can I help you today?",
            responses: [
                "I can help you find a quest.",
                "Please check the quest details page.",
                "You can contact support via email.",
                "Payment is secured by our platform.",
                "Please avoid sharing personal contact info."
            ]
        },
        filters: {
            all: "All Categories",
            dining: "Dining",
            transport: "Transport",
            mapTitle: "Interactive Map",
            mapDesc: "Explore quests by location. Hover over pins to preview details."
        },
        data: {
            quests: [
                {
                    id: "1",
                    title: "Seoul Hongdae Food Guide Video",
                    description: "I'm looking for a local's favorite restaurant near Hongdae. Please film a short video of the atmosphere and menu.",
                    reward: "$15.00",
                    location: "Seoul, Hongdae",
                    time: "30 mins",
                    difficulty: "Easy",
                    category: "Food",
                    requester: "Sarah J."
                },
                {
                    id: "2",
                    title: "Current Weather Photo in Haeundae",
                    description: "I'm curious about the current sea conditions in Haeundae. Please send 3 photos showing the waves and people's attire.",
                    reward: "$5.00",
                    location: "Busan, Haeundae",
                    time: "10 mins",
                    difficulty: "Easy",
                    category: "Lifestyle",
                    requester: "Mike T."
                },
                {
                    id: "3",
                    title: "Gangnam Station Underground Guide",
                    description: "Please film a video guide from Gangnam Station Exit 10 to the clothing store area in the underground shopping center.",
                    reward: "$10.00",
                    location: "Seoul, Gangnam",
                    time: "20 mins",
                    difficulty: "Medium",
                    category: "Guide",
                    requester: "Emily R."
                },
                {
                    id: "4",
                    title: "Convenience Store Snack Review",
                    description: "Please buy and taste the new 'Spicy Shrimp Crackers' from a Korean convenience store and describe the taste.",
                    reward: "$8.00",
                    location: "Anywhere",
                    time: "15 mins",
                    difficulty: "Easy",
                    category: "Food",
                    requester: "Tom H."
                },
                {
                    id: "5",
                    title: "Gyeongbokgung Night Ticket Booking",
                    description: "Please book 2 tickets for Gyeongbokgung Night Opening next Friday and send the QR code.",
                    reward: "$20.00",
                    location: "Online",
                    time: "1 hour",
                    difficulty: "Hard",
                    category: "Service",
                    requester: "Jessica K."
                }
            ]
        },
        demo: {
            quest: {
                title: "Exclusive Dining Reservation in Hongdae",
                description: "I need a reservation for 2 people at a high-end Omakase in Hongdae. The place is very popular and requires a Korean phone number to book. I also need recommendations for a nearby wine bar.",
                location: "Mapo-gu, Seoul",
                time: "Concierge Service",
                category: "Dining",
            },
            reviews: [
                {
                    comment: "Absolutely fantastic service. The reservation was secured within minutes.",
                    role: "Global Traveler"
                },
                {
                    comment: "Clear instructions and prompt payment. A pleasure to work with.",
                    role: "Korean Expert"
                }
            ]
        },
        footer: {
            rights: "All rights reserved.",
            privacy: "Privacy Policy",
            terms: "Terms of Service",
            company: "Potentaro (Jeong Yeon-ju)"
        }
    },
    ko: {
        common: {
            welcome: "환영합니다",
            search: "검색",
            loading: "로딩 중...",
            error: "오류가 발생했습니다",
            success: "성공",
            confirm: "확인",
            cancel: "취소",
            back: "뒤로",
            viewDetails: "상세 보기",
            accept: "수락하기",
            share: "공유하기",
            manage: "관리",
            withdraw: "출금하기",
            settle: "수익 정산",
        },
        nav: {
            collection: "컬렉션",
            about: "소개",
            portfolio: "지갑",
            signIn: "로그인",
            postQuest: "퀘스트 등록",
        },
        hero: {
            subtitle: "프리미엄 글로벌 컨시어지",
            title: "진정한 한국을 경험하세요",
            description: "현지 전문가와 연결되어 특별한 경험을 만드세요. 숨겨진 명소부터 VIP 서비스까지, K-Quest가 당신의 여정을 품격 있게 만듭니다.",
            explore: "컬렉션 탐색",
            philosophy: "서비스 철학",
        },
        quest: {
            title: "엄선된 퀘스트",
            subtitle: "더 컬렉션",
            description: "당신의 니즈에 맞춘 독점적인 기회와 프리미엄 서비스를 발견하세요.",
            reward: "보상금",
            location: "위치",
            time: "소요시간",
            difficulty: "난이도",
            category: "카테고리",
            requester: "요청자",
            totalReward: "총 보상금",
            requestDetails: "요청 상세",
            financialBreakdown: "수익 분석",
            performerEarnings: "수행자 수익",
            platformFee: "플랫폼 수수료",
            safety: "검증된 요청입니다. 이 태스크는 K-Quest 안전 에스크로에 의해 보호됩니다. 완료 시 지급이 보장됩니다.",
        },
        wallet: {
            title: "재무 현황",
            subtitle: "내 포트폴리오",
            totalBalance: "총 잔액",
            availableWithdrawal: "출금 가능 금액",
            adminAccess: "관리자 접근",
            platformRevenue: "플랫폼 수익",
            transactionHistory: "거래 내역",
            export: "데이터 내보내기",
            table: {
                date: "날짜",
                type: "유형",
                description: "내용",
                amount: "금액",
                status: "상태"
            },
            transactions: [
                { id: 1, type: "입금", title: "퀘스트 완료: 홍대 가이드", amount: "+ $15.00", date: "2023. 10. 25", status: "완료됨" },
                { id: 2, type: "입금", title: "퀘스트 완료: 해운대 사진", amount: "+ $5.00", date: "2023. 10. 24", status: "완료됨" },
                { id: 3, type: "출금", title: "은행 계좌로 이체", amount: "- $10.00", date: "2023. 10. 20", status: "처리중" }
            ]
        },
        auth: {
            loginTitle: "접속 모드 선택",
            foreigner: "글로벌 여행자",
            local: "한국 현지 전문가",
            loginSuccess: "환영합니다,",
            logout: "로그아웃",
        },
        toast: {
            langSwitched: "언어가 한국어로 변경되었습니다",
            loginForeigner: "글로벌 여행자로 로그인되었습니다",
            loginLocal: "한국 현지 전문가로 로그인되었습니다",
            questPosted: "퀘스트가 성공적으로 등록되었습니다",
        },
        ai: {
            title: "K-Quest 도우미",
            subtitle: "24시간 자동 응답",
            placeholder: "무엇을 도와드릴까요?",
            welcome: "안녕하세요! K-Quest 자동 응답 도우미입니다. 무엇을 도와드릴까요?",
            responses: [
                "퀘스트 찾기를 도와드릴 수 있습니다.",
                "퀘스트 상세 페이지를 확인해주세요.",
                "이메일로 문의하실 수 있습니다.",
                "결제는 안전하게 보호됩니다.",
                "개인 연락처 공유는 자제해주세요."
            ]
        },
        filters: {
            all: "전체 카테고리",
            dining: "다이닝",
            transport: "교통",
            mapTitle: "인터랙티브 맵",
            mapDesc: "위치별로 퀘스트를 탐색하세요. 핀 위에 마우스를 올리면 상세 내용을 볼 수 있습니다."
        },
        data: {
            quests: [
                {
                    id: "1",
                    title: "서울 홍대 맛집 추천 영상 찍어주세요",
                    description: "홍대 근처에서 현지인들이 자주 가는 맛집을 찾고 있습니다. 식당 분위기와 메뉴판, 그리고 음식 영상을 짧게 찍어서 보내주세요.",
                    reward: "$15.00",
                    location: "서울 마포구 홍대",
                    time: "30분",
                    difficulty: "쉬움",
                    category: "음식",
                    requester: "Sarah J."
                },
                {
                    id: "2",
                    title: "부산 해운대 현재 날씨 사진",
                    description: "지금 해운대 바다 상황이 궁금합니다. 파도 높이와 사람들의 옷차림을 알 수 있는 사진 3장을 부탁드려요.",
                    reward: "$5.00",
                    location: "부산 해운대",
                    time: "10분",
                    difficulty: "쉬움",
                    category: "라이프스타일",
                    requester: "Mike T."
                },
                {
                    id: "3",
                    title: "강남역 지하상가 가는 길 안내",
                    description: "강남역 10번 출구에서 지하상가 옷가게 구역까지 가는 길을 동영상으로 찍어주세요. 헷갈리지 않게 천천히 걸어가며 촬영 부탁드립니다.",
                    reward: "$10.00",
                    location: "서울 강남",
                    time: "20분",
                    difficulty: "보통",
                    category: "가이드",
                    requester: "Emily R."
                },
                {
                    id: "4",
                    title: "편의점 신상 과자 리뷰",
                    description: "한국 편의점에 새로 나온 '매운 새우깡'을 사서 먹어보고 맛을 설명해주세요. 영수증 인증 필수입니다.",
                    reward: "$8.00",
                    location: "어디서나",
                    time: "15분",
                    difficulty: "쉬움",
                    category: "음식",
                    requester: "Tom H."
                },
                {
                    id: "5",
                    title: "경복궁 야간 개장 티켓 구매 대행",
                    description: "다음 주 금요일 경복궁 야간 개장 티켓 2장을 대신 예매해서 QR코드를 보내주세요. 티켓 비용은 별도 지급합니다.",
                    reward: "$20.00",
                    location: "온라인",
                    time: "1시간",
                    difficulty: "어려움",
                    category: "서비스",
                    requester: "Jessica K."
                }
            ]
        },
        demo: {
            quest: {
                title: "홍대 프리미엄 오마카세 예약",
                description: "홍대에 있는 고급 오마카세 식당 2인 예약이 필요합니다. 인기가 많은 곳이라 한국 전화번호로 예약해야 합니다. 근처 와인바 추천도 부탁드립니다.",
                location: "서울 마포구",
                time: "컨시어지 서비스",
                category: "다이닝",
            },
            reviews: [
                {
                    comment: "정말 환상적인 서비스였습니다. 몇 분 만에 예약이 확정되었습니다.",
                    role: "글로벌 여행자"
                },
                {
                    comment: "지시 사항이 명확하고 입금도 빨랐습니다. 함께 일해서 즐거웠습니다.",
                    role: "한국 현지 전문가"
                }
            ]
        },
        footer: {
            rights: "All rights reserved.",
            privacy: "개인정보 처리방침",
            terms: "이용약관",
            company: "Potentaro (정연주)"
        }
    }
};
