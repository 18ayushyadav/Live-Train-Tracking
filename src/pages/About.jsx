import { useTranslation } from 'react-i18next';

export default function About() {
    const { t } = useTranslation();
    return (
        <main style={{ maxWidth: 860, margin: '0 auto', padding: '60px 24px 80px' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 12 }}>{t('about_title')}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: 48, lineHeight: 1.7 }}>
                {t('about_desc')}
            </p>

            <div style={{ display: 'grid', gap: 20 }}>
                {[
                    { icon: '📡', title: t('feat_offline_title'), desc: t('feat_offline_desc_long') },
                    { icon: '🗺️', title: t('feat_map_title'), desc: t('feat_map_desc_long') },
                    { icon: '🔒', title: t('privacy_title'), desc: t('privacy_desc_long') },
                    { icon: '🤝', title: t('feat_crowd_title'), desc: t('feat_crowd_desc_long') },
                ].map(f => (
                    <div key={f.title} className="card" style={{ padding: '24px 28px', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '2rem', flexShrink: 0 }}>{f.icon}</span>
                        <div>
                            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: 1.65, fontSize: '0.95rem' }}>{f.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card" style={{ padding: 28, marginTop: 40, borderColor: 'rgba(21,101,192,0.3)', background: 'rgba(21,101,192,0.08)' }}>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>⚡ {t('tech_stack')}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
                    {['Flutter 3', 'React + Vite', 'Node.js + Express', 'Firebase + Firestore',
                        'Socket.io', 'SQLite (offline)', 'Leaflet Maps', 'TelephonyManager API'].map(s => (
                            <span key={s} className="badge badge-info" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>{s}</span>
                        ))}
                </div>
            </div>

            <p style={{ color: 'var(--text-dim)', marginTop: 40, fontSize: '0.85rem', textAlign: 'center' }}>
                {t('disclaimer')}
            </p>
        </main>
    );
}
