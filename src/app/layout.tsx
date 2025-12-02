import type { Metadata, Viewport } from "next";
import { Outfit, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "@/components/ToastContainer";
import { MarketingPixel } from "./marketing-pixel";
import { LanguageProvider } from "@/contexts/LanguageContext";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const notoSansKr = Noto_Sans_KR({ subsets: ["latin"], weight: ["100", "300", "400", "500", "700"], variable: "--font-noto" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#050505",
};

export const metadata: Metadata = {
  metadataBase: new URL('https://quest-k.com'),
  title: {
    default: "K-Quest | VIP Concierge & Local Assistant Korea",
    template: "%s | K-Quest"
  },
  description: "The #1 Premium Concierge Platform in Korea. Connect with verified local experts for VIP shopping, dining reservations, medical tourism, and personal assistance. Safe, reliable, and exclusive.",
  keywords: [
    "VIP concierge Korea", "luxury concierge Seoul", "personal assistant Korea",
    "rent a local friend Korea", "Korean translator", "Seoul travel helper",
    "Michelin restaurant reservations Seoul", "K-Pop concert tickets",
    "plastic surgery concierge", "business interpreter Seoul",
    "safe travel Korea", "verified local guide"
  ],
  authors: [{ name: "K-Quest Team" }],
  creator: "K-Quest",
  publisher: "K-Quest Platform",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://quest-k.com',
    title: 'K-Quest | Your Premium Local Assistant in Korea',
    description: 'Need help in Korea? Hire a verified local expert for reservations, translation, shopping, and more. Experience Korea like a VIP.',
    siteName: 'K-Quest',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'K-Quest Premium Concierge Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'K-Quest | Premium Local Assistant Korea',
    description: 'Your verified local partner in Korea. Reservations, Translation, VIP Services.',
    creator: '@kquest_official',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://quest-k.com',
    languages: {
      'en-US': 'https://quest-k.com/en',
      'zh-CN': 'https://quest-k.com/zh',
      'ja-JP': 'https://quest-k.com/ja',
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${notoSansKr.variable}`}>
      <head>
        {/* 🔥 FACEBOOK PIXEL (리타겟팅 광고의 핵심!) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', 'YOUR_FACEBOOK_PIXEL_ID');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img height="1" width="1" style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=YOUR_FACEBOOK_PIXEL_ID&ev=PageView&noscript=1"
          />
        </noscript>

        {/* 🎯 GOOGLE ADS CONVERSION TRACKING */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX', {
                'send_page_view': true,
                'anonymize_ip': false,
                'allow_ad_personalization_signals': true
              });
              gtag('config', 'AW-CONVERSION_ID');
            `,
          }}
        />

        {/* 🌟 NAVER ANALYTICS (한국 시장용) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if(!wcs_add) var wcs_add = {};
              wcs_add["wa"] = "YOUR_NAVER_ANALYTICS_ID";
              if (!_nasa) var _nasa={};
              if(window.wcs){
                wcs.inflow("quest-k.com");
                wcs_do(_nasa);
              }
            `,
          }}
        />

        {/* SEO & Social Sharing (Fox Strategy: Be Everywhere) */}
        <meta name="keywords" content="Korea Travel, K-Pop Experience, Korean Guide, Seoul Tour, K-Quest, Concierge Korea" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="K-Quest" />
        <meta name="twitter:card" content="summary_large_image" />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    registration.unregister();
                  }
                });
              }
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-[#050505] text-white min-h-screen selection:bg-[#D4AF37] selection:text-black">
        <LanguageProvider>
          {children}
          <ToastContainer />
          <MarketingPixel />
        </LanguageProvider>
      </body>
    </html>
  );
}
