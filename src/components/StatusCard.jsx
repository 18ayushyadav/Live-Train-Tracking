import { useTranslation } from 'react-i18next';

export default function StatusCard({ train }) {
    const { t } = useTranslation();
    const delay = train.delayMinutes ?? train.delay ?? 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Header card */}
            <div className="card" style={{
                padding: 28,
                background: 'linear-gradient(135deg, rgba(21,101,192,0.5) 0%, rgba(13,71,161,0.3) 100%)',
                borderColor: 'rgba(21,101,192,0.4)',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', letterSpacing: 1, marginBottom: 6 }}>
                            {t('train_number')}
                        </div>
                        <h2 style={{ fontSize: '1.7rem', fontWeight: 800 }}>{train.trainNo}</h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: 4, fontSize: '1.05rem' }}>{train.trainName}</p>
                    </div>
                    <span className={`badge ${delay > 0 ? 'badge-warning' : 'badge-success'}`}
                        style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                        {delay > 0 ? `⏰ ${delay}m late` : '✅ On Time'}
                    </span>
                </div>

                {/* Route */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24 }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{train.from}</div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{train.departure}</div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '100%', height: 2, background: 'linear-gradient(to right, rgba(255,255,255,0.6), rgba(255,255,255,0.2))', borderRadius: 1 }} />
                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>→</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{train.to}</div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{train.arrival}</div>
                    </div>
                </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
                <StatBox label={t('current_station')} value={train.currentStation || '—'} icon="📍" />
                <StatBox label={t('speed')} value={`${Math.round(train.speed || 0)} km/h`} icon="⚡" />
                <StatBox label={t('eta')} value={computeETA(train)} icon="⏱️"
                    accent={delay > 0 ? '#ff9800' : '#4caf50'} />
                {train.nextStation && (
                    <StatBox label={t('next_station')} value={train.nextStation} icon="🛤️" />
                )}
            </div>

            {/* Meta */}
            <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textAlign: 'right' }}>
                {t('last_updated')}: {new Date(train.lastUpdated).toLocaleTimeString()}
                {train.isOffline && <span className="badge badge-warning" style={{ marginLeft: 10 }}>Offline cache</span>}
            </p>
        </div>
    );
}

function StatBox({ label, value, icon, accent }) {
    return (
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: '1.4rem' }}>{icon}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', letterSpacing: 1, textTransform: 'uppercase' }}>{label}</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 700, color: accent || '#fff' }}>{value}</span>
        </div>
    );
}

function computeETA(train) {
    if (!train.arrival || train.arrival === '--') return '--';
    const [h, m] = train.arrival.split(':').map(Number);
    const delay = train.delayMinutes ?? train.delay ?? 0;
    const total = h * 60 + m + delay;
    const hh = String(Math.floor(total / 60) % 24).padStart(2, '0');
    const mm = String(total % 60).padStart(2, '0');
    return delay > 0 ? `${hh}:${mm} (+${delay}m)` : `${hh}:${mm}`;
}
