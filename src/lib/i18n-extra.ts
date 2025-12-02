export type Language = 'en' | 'ko' | 'ja' | 'zh' | 'ar';

// 기존 translations 객체에 ja, zh, ar 추가
export const additionalTranslations = {
    ja: {
        nav: {
            collection: "クエスト",
            about: "会社紹介",
            portfolio: "ウォレット",
            signIn: "ログイン",
            postQuest: "クエスト登録",
        },
        hero: {
            requestService: "クエストを開始",
            exploreCollection: "クエストを見る",
        },
        footer: {
            rights: "All rights reserved.",
            privacy: "プライバシーポリシー",
            terms: "利用規約",
        }
    },
    zh: {
        nav: {
            collection: "任务",
            about: "关于我们",
            portfolio: "钱包",
            signIn: "登录",
            postQuest: "发布任务",
        },
        hero: {
            requestService: "开始任务",
            exploreCollection: "浏览任务",
        },
        footer: {
            rights: "All rights reserved.",
            privacy: "隐私政策",
            terms: "使用条款",
        }
    },
    ar: {
        nav: {
            collection: "المهام",
            about: "عن الشركة",
            portfolio: "المحفظة",
            signIn: "تسجيل الدخول",
            postQuest: "نشر مهمة",
        },
        hero: {
            requestService: "ابدأ المهمة",
            exploreCollection: "تصفح المهام",
        },
        footer: {
            rights: "All rights reserved.",
            privacy: "سياسة الخصوصية",
            terms: "شروط الاستخدام",
        }
    }
};
