import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function LiveFeed() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [trains, setTrains] = useState([]);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        // Try WebSocket first
        let socket;
        try {
            socket = io(API_URL, { transports: ['websocket', 'polling'], timeout: 5000 });
            socket.on('connect', () => setConnected(true));
            socket.on('disconnect', () => setConnected(false));
            socket.on('live_feed', (data) => { if (Array.isArray(data)) setTrains(data); });
        } catch (_) { /* Socket.io not available — fall back to mock */ }

        // Always seed with mock data immediately for great UX
        setTrains(MOCK_FEED);

        return () => socket?.disconnect();
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span className={connected ? 'live-dot' : ''} style={!connected ? {
                    width: 8, height: 8, borderRadius: '50%', background: '#888', display: 'inline-block'
                } : {}} />
                <span className="text-muted" style={{ fontSize: '0.82rem' }}>
                    {connected ? t('ws_connected') : t('ws_polling')}
                </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {trains.map(train => (
                    <div key={train.trainNo} className="card"
                        style={{ padding: 20, cursor: 'pointer', transition: 'transform 0.2s' }}
                        onClick={() => navigate(`/train/${train.trainNo}`)}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{train.trainNo}</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{train.trainName}</div>
                            </div>
                            <span className={`badge ${(train.delay || 0) > 0 ? 'badge-warning' : 'badge-success'}`}>
                                {(train.delay || 0) > 0 ? `+${train.delay}m` : 'On Time'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>📍 {train.currentStation}</span>
                            <span style={{ color: '#60a5fa', fontWeight: 600 }}>{Math.round(train.speed || 0)} km/h</span>
                        </div>
                        <div style={{
                            marginTop: 12, height: 3, borderRadius: 2,
                            background: 'var(--border)',
                            position: 'relative', overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute', left: 0, top: 0, height: '100%',
                                width: `${Math.min(100, (train.speed / 160) * 100)}%`,
                                background: 'linear-gradient(to right, #1565c0, #42a5f5)',
                                borderRadius: 2, transition: 'width 1s ease',
                            }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const MOCK_FEED = [
    { trainNo: '12951', trainName: 'Mumbai Rajdhani', currentStation: 'Vadodara Jn', speed: 115, delay: 5 },
    { trainNo: '12302', trainName: 'Howrah Rajdhani', currentStation: 'Gaya Junction', speed: 130, delay: 0 },
    { trainNo: '12163', trainName: 'Chennai Dadar Exp', currentStation: 'Pune Junction', speed: 85, delay: 12 },
    { trainNo: '12622', trainName: 'Tamil Nadu Express', currentStation: 'Vijayawada', speed: 98, delay: 0 },
    { trainNo: '12009', trainName: 'Shatabdi Express', currentStation: 'Surat', speed: 140, delay: 0 },
    { trainNo: '12431', trainName: 'Rajdhani Express', currentStation: 'Kanpur Central', speed: 120, delay: 8 },
];
