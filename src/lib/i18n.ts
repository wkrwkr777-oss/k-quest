export type Language = 'en' | 'ko' | 'ja' | 'zh' | 'ar';

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
            collection: "Quests",
            about: "About",
            portfolio: "Wallet",
            signIn: "Sign In",
            postQuest: "Post a Quest",
        },
        hero: {
            subtitle: "Global Quest Platform",
            title: "Connect via",
            titleHighlight: "Daily Quests",
            description: "Simple tasks, global connections. Experience the healthy quest culture of Korea.\nConnect with people, solve problems, and share experiences.",
            requestService: "Start a Quest",
            exploreCollection: "Browse Quests",
        },
        features: {
            curated: {
                title: "Simple & Easy",
                desc: "Anyone can easily request help or solve quests in their daily life."
            },
            escrow: {
                title: "Safe Connection",
                desc: "We ensure a secure environment for everyone to interact and transact."
            },
            global: {
                title: "Global Culture",
                desc: "Experience Korea through the eyes of locals, one quest at a time."
            }
        },
        philosophy: {
            label: "Our Vision",
            title: "Simple is",
            titleHighlight: "Best",
            desc: "We believe in the power of simple connections. K-Quest builds a healthy culture where small daily tasks bridge the gap between people across the globe.",
            readMore: "Our Story"
        },
        quest: {
            title: "Daily Quests",
            subtitle: "Explore",
            description: "Find simple tasks and meaningful connections.",
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
            safety: "Verified Request. Protected by K-Quest Safe Pay.",
        },
        wallet: {
            title: "My Wallet",
            subtitle: "Overview",
            totalBalance: "Total Balance",
            availableWithdrawal: "Available",
            adminAccess: "Admin Access",
            platformRevenue: "Platform Revenue",
            transactionHistory: "History",
            export: "Export",
            table: {
                date: "Date",
                type: "Type",
                description: "Description",
                amount: "Amount",
                status: "Status"
            },
            transactions: [
                { id: 1, type: "Deposit", title: "Quest: Hongdae Guide", amount: "+ $15.00", date: "OCT 25, 2023", status: "Completed" },
                { id: 2, type: "Deposit", title: "Quest: Haeundae Photo", amount: "+ $5.00", date: "OCT 24, 2023", status: "Completed" },
                { id: 3, type: "Withdrawal", title: "Bank Transfer", amount: "- $10.00", date: "OCT 20, 2023", status: "Processing" }
            ]
        },
        auth: {
            loginTitle: "Welcome to K-Quest",
            foreigner: "Global User",
            local: "Local Expert",
            loginSuccess: "Welcome,",
            logout: "Sign Out",
        },
        toast: {
            langSwitched: "Language switched to English",
            loginForeigner: "Logged in as Global User",
            loginLocal: "Logged in as Local Expert",
            questPosted: "Quest posted successfully",
        },
        ai: {
            title: "K-Quest Helper",
            subtitle: "Automated Support",
            placeholder: "How can we help?",
            welcome: "Hi! I'm the K-Quest helper. How can I assist you?",
            responses: [
                "I can help you find a quest.",
                "Check the quest details.",
                "Contact support for help.",
                "Payments are secure.",
                "Keep personal info private."
            ]
        },
        filters: {
            all: "All",
            dining: "Food",
            transport: "Travel",
            mapTitle: "Quest Map",
            mapDesc: "Find quests near you."
        },
        data: {
            quests: []
        },
        demo: {
            quest: {
                title: "Local Restaurant Reservation",
                description: "I need help booking a table at a popular BBQ place in Hongdae. They only speak Korean.",
                location: "Seoul, Mapo-gu",
                time: "Service",
                category: "Dining",
            },
            reviews: [
                {
                    comment: "Simple and fast. Thanks for the help!",
                    role: "Global User"
                },
                {
                    comment: "Happy to help a traveler enjoy good food.",
                    role: "Local Expert"
                }
            ]
        },
        footer: {
            rights: "All rights reserved.",
            privacy: "Privacy",
            terms: "Terms",
            company: "Potentaro"
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
            collection: "퀘스트 둘러보기",
            about: "소개",
            portfolio: "내 지갑",
            signIn: "로그인",
            postQuest: "퀘스트 등록",
        },
        hero: {
            subtitle: "글로벌 퀘스트 플랫폼",
            title: "일상의 퀘스트로",
            titleHighlight: "세상을 잇다",
            description: "쉽고 간단하지만, 건강한 퀘스트 문화.\n한국의 새로운 퀘스트 문화를 통해 전 세계 사람들과 연결되세요.",
            requestService: "퀘스트 시작하기",
            exploreCollection: "퀘스트 찾아보기",
        },
        features: {
            curated: {
                title: "쉽고 간단하게",
                desc: "누구나 일상 속에서 도움을 요청하고, 퀘스트를 수행할 수 있습니다."
            },
            escrow: {
                title: "안전한 연결",
                desc: "서로 신뢰할 수 있는 안전한 환경에서 퀘스트를 주고받으세요."
            },
            global: {
                title: "글로벌 문화",
                desc: "퀘스트를 통해 한국의 건강한 문화를 전 세계와 나눕니다."
            }
        },
        philosophy: {
            label: "우리의 비전",
            title: "Simple is",
            titleHighlight: "Best",
            desc: "우리는 단순함의 힘을 믿습니다. K-Quest는 거창한 것이 아닌, 일상의 사소한 도움과 교류가 모여 만드는 건강한 퀘스트 문화를 지향합니다.",
            readMore: "우리의 이야기"
        },
        quest: {
            title: "오늘의 퀘스트",
            subtitle: "둘러보기",
            description: "일상의 소소한 퀘스트들을 발견해보세요.",
            reward: "보상",
            location: "위치",
            time: "시간",
            difficulty: "난이도",
            category: "카테고리",
            requester: "요청자",
            totalReward: "총 보상",
            requestDetails: "요청 내용",
            financialBreakdown: "정산 내역",
            performerEarnings: "수익금",
            platformFee: "수수료",
            safety: "안전 결제로 보호되는 퀘스트입니다.",
        },
        wallet: {
            title: "내 지갑",
            subtitle: "현황",
            totalBalance: "총 잔액",
            availableWithdrawal: "출금 가능",
            adminAccess: "관리자",
            platformRevenue: "플랫폼 수익",
            transactionHistory: "내역",
            export: "내보내기",
            table: {
                date: "날짜",
                type: "유형",
                description: "내용",
                amount: "금액",
                status: "상태"
            },
            transactions: [
                { id: 1, type: "입금", title: "퀘스트: 홍대 맛집 추천", amount: "+ $15.00", date: "2023. 10. 25", status: "완료" },
                { id: 2, type: "입금", title: "퀘스트: 날씨 사진", amount: "+ $5.00", date: "2023. 10. 24", status: "완료" },
                { id: 3, type: "출금", title: "계좌 이체", amount: "- $10.00", date: "2023. 10. 20", status: "처리중" }
            ]
        },
        auth: {
            loginTitle: "K-Quest 시작하기",
            foreigner: "글로벌 유저",
            local: "현지 유저",
            loginSuccess: "반갑습니다,",
            logout: "로그아웃",
        },
        toast: {
            langSwitched: "언어가 한국어로 변경되었습니다",
            loginForeigner: "글로벌 유저로 로그인되었습니다",
            loginLocal: "현지 유저로 로그인되었습니다",
            questPosted: "퀘스트가 등록되었습니다",
        },
        ai: {
            title: "K-Quest 도우미",
            subtitle: "자동 응답",
            placeholder: "무엇을 도와드릴까요?",
            welcome: "안녕하세요! K-Quest 도우미입니다. 궁금한 점이 있으신가요?",
            responses: [
                "퀘스트 찾기를 도와드릴까요?",
                "상세 내용을 확인해보세요.",
                "고객센터에 문의하실 수 있어요.",
                "결제는 안전합니다.",
                "개인정보는 소중히 다뤄주세요."
            ]
        },
        filters: {
            all: "전체",
            dining: "음식",
            transport: "이동",
            mapTitle: "지도 보기",
            mapDesc: "내 주변 퀘스트를 찾아보세요."
        },
        data: {
            quests: []
        },
        demo: {
            quest: {
                title: "식당 예약 도와주세요",
                description: "홍대에 있는 고깃집을 예약하고 싶은데 한국말을 못해요. 대신 전화 예약 좀 부탁드립니다.",
                location: "서울 마포구",
                time: "서비스",
                category: "음식",
            },
            reviews: [
                {
                    comment: "빠르고 친절하게 도와주셔서 감사합니다!",
                    role: "글로벌 유저"
                },
                {
                    comment: "맛있는 식사 되세요! 도움이 되어 기쁩니다.",
                    role: "현지 유저"
                }
            ]
        },
        footer: {
            rights: "All rights reserved.",
            privacy: "개인정보처리방침",
            terms: "이용약관",
            company: "Potentaro"
        }
    },
    ja: {
        common: { welcome: "ようこそ", search: "検索", loading: "読み込み中...", error: "エラー", success: "成功", confirm: "確認", cancel: "キャンセル", back: "戻る", viewDetails: "詳細を見る", accept: "受け入れる", share: "共有", manage: "管理", withdraw: "出金", settle: "収益精算" },
        nav: { collection: "クエスト", about: "会社紹介", portfolio: "ウォレット", signIn: "ログイン", postQuest: "クエスト登録" },
        hero: { subtitle: "グローバルクエストプラットフォーム", title: "日常のクエストで", titleHighlight: "世界を繋ぐ", description: "シンプルなタスク、グローバルな繋がり。韓国の健康的なクエスト文化を体験してください。", requestService: "クエストを開始", exploreCollection: "クエストを見る" },
        features: { curated: { title: "シンプル＆簡単", desc: "誰でも簡単に日常のタスクを依頼したり実行できます。" }, escrow: { title: "安全な接続", desc: "安全な環境で取引できます。" }, global: { title: "グローバル文化", desc: "クエストを通じて韓国を体験してください。" } },
        philosophy: { label: "私たちのビジョン", title: "Simple is", titleHighlight: "Best", desc: "シンプルな繋がりの力を信じています。", readMore: "私たちの物語" },
        quest: { title: "今日のクエスト", subtitle: "探索", description: "シンプルなタスクと意味のある繋がりを見つけてください。", reward: "報酬", location: "場所", time: "時間", difficulty: "難易度", category: "カテゴリー", requester: "依頼者", totalReward: "総報酬", requestDetails: "依頼内容", financialBreakdown: "財務内訳", performerEarnings: "実行者収益", platformFee: "プラットフォーム手数料", safety: "K-Quest安全決済で保護されています。" },
        wallet: { title: "マイウォレット", subtitle: "概要", totalBalance: "総残高", availableWithdrawal: "出金可能", adminAccess: "管理者", platformRevenue: "プラットフォーム収益", transactionHistory: "履歴", export: "エクスポート", table: { date: "日付", type: "タイプ", description: "説明", amount: "金額", status: "ステータス" }, transactions: [] },
        auth: { loginTitle: "K-Questへようこそ", foreigner: "グローバルユーザー", local: "現地エキスパート", loginSuccess: "ようこそ、", logout: "ログアウト" },
        toast: { langSwitched: "言語が日本語に変更されました", loginForeigner: "グローバルユーザーとしてログイン", loginLocal: "現地エキスパートとしてログイン", questPosted: "クエストが投稿されました" },
        ai: { title: "K-Questヘルパー", subtitle: "自動サポート", placeholder: "どのようにお手伝いできますか？", welcome: "こんにちは！K-Questヘルパーです。", responses: [] },
        filters: { all: "全て", dining: "食べ物", transport: "交通", mapTitle: "クエストマップ", mapDesc: "近くのクエストを見つける。" },
        data: { quests: [] },
        demo: { quest: { title: "レストラン予約", description: "弘大の人気焼肉店を予約したいです。韓国語のみです。", location: "ソウル、麻浦区", time: "サービス", category: "飲食" }, reviews: [] },
        footer: { rights: "All rights reserved.", privacy: "プライバシーポリシー", terms: "利用規約", company: "Potentaro" }
    },
    zh: {
        common: { welcome: "欢迎", search: "搜索", loading: "加载中...", error: "错误", success: "成功", confirm: "确认", cancel: "取消", back: "返回", viewDetails: "查看详情", accept: "接受", share: "分享", manage: "管理", withdraw: "提款", settle: "结算收益" },
        nav: { collection: "任务", about: "关于我们", portfolio: "钱包", signIn: "登录", postQuest: "发布任务" },
        hero: { subtitle: "全球任务平台", title: "通过日常任务", titleHighlight: "连接世界", description: "简单的任务，全球的联系。体验韩国健康的任务文化。", requestService: "开始任务", exploreCollection: "浏览任务" },
        features: { curated: { title: "简单易用", desc: "任何人都可以轻松请求帮助或完成任务。" }, escrow: { title: "安全连接", desc: "在安全的环境中进行交易。" }, global: { title: "全球文化", desc: "通过任务体验韩国。" } },
        philosophy: { label: "我们的愿景", title: "Simple is", titleHighlight: "Best", desc: "我们相信简单连接的力量。", readMore: "我们的故事" },
        quest: { title: "今日任务", subtitle: "探索", description: "寻找简单的任务和有意义的联系。", reward: "奖励", location: "位置", time: "时间", difficulty: "难度", category: "类别", requester: "委托人", totalReward: "总奖励", requestDetails: "请求详情", financialBreakdown: "财务明细", performerEarnings: "执行者收益", platformFee: "平台费用", safety: "受K-Quest安全支付保护。" },
        wallet: { title: "我的钱包", subtitle: "概览", totalBalance: "总余额", availableWithdrawal: "可提款", adminAccess: "管理员", platformRevenue: "平台收益", transactionHistory: "历史记录", export: "导出", table: { date: "日期", type: "类型", description: "描述", amount: "金额", status: "状态" }, transactions: [] },
        auth: { loginTitle: "欢迎来到K-Quest", foreigner: "全球用户", local: "本地专家", loginSuccess: "欢迎，", logout: "登出" },
        toast: { langSwitched: "语言已切换为中文", loginForeigner: "作为全球用户登录", loginLocal: "作为本地专家登录", questPosted: "任务已发布" },
        ai: { title: "K-Quest助手", subtitle: "自动支持", placeholder: "我能帮您什么？", welcome: "你好！我是K-Quest助手。", responses: [] },
        filters: { all: "全部", dining: "美食", transport: "交通", mapTitle: "任务地图", mapDesc: "寻找附近的任务。" },
        data: { quests: [] },
        demo: { quest: { title: "餐厅预订", description: "我想预订弘大的烤肉店。只有韩语。", location: "首尔，麻浦区", time: "服务", category: "餐饮" }, reviews: [] },
        footer: { rights: "All rights reserved.", privacy: "隐私政策", terms: "使用条款", company: "Potentaro" }
    },
    ar: {
        common: { welcome: "مرحباً", search: "بحث", loading: "جار التحميل...", error: "خطأ", success: "نجاح", confirm: "تأكيد", cancel: "إلغاء", back: "رجوع", viewDetails: "عرض التفاصيل", accept: "قبول", share: "مشاركة", manage: "إدارة", withdraw: "سحب", settle: "تسوية الإيرادات" },
        nav: { collection: "المهام", about: "عن الشركة", portfolio: "المحفظة", signIn: "تسجيل الدخول", postQuest: "نشر مهمة" },
        hero: { subtitle: "منصة مهام عالمية", title: "التواصل عبر", titleHighlight: "المهام اليومية", description: "مهام بسيطة، روابط عالمية. جرب ثقافة المهام الصحية في كوریا.", requestService: "ابدأ المهمة", exploreCollection: "تصفح المهام" },
        features: { curated: { title: "بسيط وسهل", desc: "يمكن لأي شخص طلب المساعدة أو إكمال المهام بسهولة." }, escrow: { title: "اتصال آمن", desc: "معاملات آمنة في بيئة موثوقة." }, global: { title: "ثقافة عالمية", desc: "اختبر كوريا من خلال المهام." } },
        philosophy: { label: "رؤيتنا", title: "Simple is", titleHighlight: "Best", desc: "نؤمن بقوة الاتصالات البسيطة.", readMore: "قصتنا" },
        quest: { title: "مهام اليوم", subtitle: "استكشاف", description: "اعثر على مهام بسيطة واتصالات ذات مغزى.", reward: "مكافأة", location: "موقع", time: "وقت", difficulty: "صعوبة", category: "فئة", requester: "الطالب", totalReward: "إجمالي المكافأة", requestDetails: "تفاصيل الطلب", financialBreakdown: "التفصيل المالي", performerEarnings: "أرباح المنفذ", platformFee: "رسوم المنصة", safety: "محمي بواسطة K-Quest الدفع الآمن." },
        wallet: { title: "محفظتي", subtitle: "نظرة عامة", totalBalance: "الرصيد الإجمالي", availableWithdrawal: "متاح للسحب", adminAccess: "وصول المسؤول", platformRevenue: "إيرادات المنصة", transactionHistory: "السجل", export: "تصدير", table: { date: "التاريخ", type: "النوع", description: "الوصف", amount: "المبلغ", status: "الحالة" }, transactions: [] },
        auth: { loginTitle: "مرحباً بك في K-Quest", foreigner: "مستخدم عالمي", local: "خبير محلي", loginSuccess: "مرحباً،", logout: "تسجيل الخروج" },
        toast: { langSwitched: "تم تبديل اللغة إلى العربية", loginForeigner: "تم تسجيل الدخول كمستخدم عالمي", loginLocal: "تم تسجيل الدخول كخبير محلي", questPosted: "تم نشر المهمة" },
        ai: { title: "مساعد K-Quest", subtitle: "دعم تلقائي", placeholder: "كيف يمكنني مساعدتك؟", welcome: "مرحباً! أنا مساعد K-Quest.", responses: [] },
        filters: { all: "الكل", dining: "طعام", transport: "نقل", mapTitle: "خريطة المهام", mapDesc: "اعثر على المهام القريبة منك." },
        data: { quests: [] },
        demo: { quest: { title: "حجز مطعم", description: "أريد حجز مطعم شواء في هونغداي. الكورية فقط.", location: "سيول، مابو-جو", time: "خدمة", category: "طعام" }, reviews: [] },
        footer: { rights: "All rights reserved.", privacy: "سياسة الخصوصية", terms: "شروط الاستخدام", company: "Potentaro" }
    }
};
