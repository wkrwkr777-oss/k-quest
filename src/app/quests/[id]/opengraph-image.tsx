import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'K-Quest Premium Service';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
    // In a real app, fetch quest details using params.id
    // const quest = await fetchQuest(params.id);

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #000000, #1a1a1a)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                    border: '20px solid #D4AF37',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
                    <div style={{
                        fontSize: 60,
                        fontWeight: 'bold',
                        color: '#D4AF37',
                        marginRight: 20
                    }}>
                        K-QUEST
                    </div>
                    <div style={{
                        padding: '10px 20px',
                        background: '#D4AF37',
                        color: 'black',
                        borderRadius: 50,
                        fontSize: 24,
                        fontWeight: 'bold'
                    }}>
                        PREMIUM
                    </div>
                </div>

                <div style={{
                    fontSize: 70,
                    fontWeight: 'bold',
                    color: 'white',
                    textAlign: 'center',
                    maxWidth: '80%',
                    marginBottom: 40,
                    lineHeight: 1.2
                }}>
                    Premium Concierge Service
                </div>

                <div style={{
                    display: 'flex',
                    gap: 40,
                    marginTop: 20
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        background: 'rgba(212, 175, 55, 0.1)',
                        padding: '20px 40px',
                        borderRadius: 20,
                        border: '2px solid #D4AF37'
                    }}>
                        <span style={{ color: '#888', fontSize: 24, marginBottom: 10 }}>Reward</span>
                        <span style={{ color: '#D4AF37', fontSize: 48, fontWeight: 'bold' }}>$ High</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '20px 40px',
                        borderRadius: 20,
                        border: '1px solid #333'
                    }}>
                        <span style={{ color: '#888', fontSize: 24, marginBottom: 10 }}>Location</span>
                        <span style={{ color: 'white', fontSize: 48, fontWeight: 'bold' }}>Korea</span>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
