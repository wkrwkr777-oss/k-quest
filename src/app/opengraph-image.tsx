import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'K-Quest VIP Concierge';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    // Google Fonts에서 Poppins 폰트 로드 (부드러운 Q 모양)
    const fontData = await fetch(
        new URL('https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1JlFc-K.woff2', import.meta.url)
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #000000, #050505)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Poppins',
                }}
            >
                {/* Decorative Elements - Top Line */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #000000, #D4AF37, #000000)',
                        opacity: 0.8,
                    }}
                />

                {/* Main Title Area - Gold K-QUEST Text with Beautiful Q */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 20,
                        width: '100%',
                        height: '200px',
                    }}
                >
                    <div
                        style={{
                            fontSize: 110,
                            fontWeight: 700, // 두께 줄임 (900 → 700)
                            fontStyle: 'italic',
                            letterSpacing: '-0.02em',
                            lineHeight: 1.5,
                            padding: '0 40px',
                            backgroundImage: 'linear-gradient(to bottom, #FFD700, #B8860B)',
                            backgroundClip: 'text',
                            color: 'transparent',
                            textAlign: 'center',
                            fontFamily: 'Poppins',
                        }}
                    >
                        K-QUEST
                    </div>
                </div>

                {/* Subtitle */}
                <div
                    style={{
                        fontSize: 28,
                        color: '#D4AF37',
                        marginBottom: 20,
                        fontWeight: 600,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        fontFamily: 'Poppins',
                    }}
                >
                    Premium Local Concierge
                </div>

                {/* Description */}
                <div
                    style={{
                        fontSize: 24,
                        color: '#888888',
                        maxWidth: 800,
                        textAlign: 'center',
                        lineHeight: 1.5,
                        fontFamily: 'Poppins',
                    }}
                >
                    Connect with verified local experts for VIP experiences in Korea
                </div>

                {/* Tags */}
                <div
                    style={{
                        display: 'flex',
                        gap: 20,
                        marginTop: 60,
                    }}
                >
                    {['VIP Travel', 'Dining', 'Shopping', 'Business'].map((tag) => (
                        <div
                            key={tag}
                            style={{
                                padding: '8px 20px',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(212, 175, 55, 0.2)',
                                borderRadius: 100,
                                color: '#D4AF37',
                                fontSize: 16,
                                fontFamily: 'Poppins',
                            }}
                        >
                            {tag}
                        </div>
                    ))}
                </div>
            </div>
        ),
        {
            ...size,
            fonts: [
                {
                    name: 'Poppins',
                    data: fontData,
                    style: 'italic',
                    weight: 700, // 두께도 700으로 변경
                },
            ],
        }
    );
}
