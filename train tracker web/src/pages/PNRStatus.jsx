import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchPNRStatus } from '../services/api';

export default function PNRStatus() {
    const { no } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [pnrNo, setPnrNo] = useState(no || '');
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const search = useCallback(async (num) => {
        if (!num || num.length !== 10) return;
        setLoading(true); setError('');
        try {
            const data = await fetchPNRStatus(num);
            if (data.error) { setError(t('pnr_not_found')); setStatus(null); }
            else { setStatus(data); navigate(`/pnr/${num}`, { replace: true }); }
        } catch { setError(t('error_fetch')); }
        finally { setLoading(false); }
    }, [navigate, t]);

    useEffect(() => { if (no) search(no); }, [no, search]);

    return (
        <main style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 80px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 28 }}>{t('pnr_status_title')}</h1>

            {/* Input */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 36 }}>
                <input className="input" placeholder={t('search_pnr_placeholder')}
                    value={pnrNo} maxLength={10}
                    onChange={e => setPnrNo(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={e => e.key === 'Enter' && search(pnrNo)}
                    style={{ maxWidth: 280, letterSpacing: 2, fontWeight: 700 }} />
                <button className="btn btn-primary" onClick={() => search(pnrNo)} disabled={loading}>
                    {loading ? '⏳' : t('check_btn')}
                </button>
            </div>

            {error && <p className="text-error" style={{ marginBottom: 24 }}>{error}</p>}

            {status && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Header */}
                    <div className="card" style={{ padding: 28 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', letterSpacing: 1.2, marginBottom: 6 }}>PNR NUMBER</div>
                                <div style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: 3 }}>{status.pnrNo}</div>
                                <div style={{ color: 'var(--primary-light)', marginTop: 4, fontWeight: 600 }}>
                                    {status.trainNo} · {status.trainName}
                                </div>
                            </div>
                            <ChartBadge status={status.chartStatus} />
                        </div>

                        <div style={{ display: 'flex', gap: 20, marginTop: 24, flexWrap: 'wrap' }}>
                            <InfoPill icon="📅" label={t('journey_date')} value={status.journeyDate} />
                            <InfoPill icon="🚉" label={t('from')} value={status.from} />
                            <InfoPill icon="🏁" label={t('to')} value={status.to} />
                            <InfoPill icon="🪑" label={t('class')} value={status.travelClass || status.class} />
                        </div>
                    </div>

                    {/* Passengers */}
                    <div className="card" style={{ padding: 24 }}>
                        <h3 style={{ fontSize: '0.8rem', color: 'var(--text-dim)', letterSpacing: 1.3, marginBottom: 16 }}>
                            {t('passengers').toUpperCase()}
                        </h3>
                        {(status.passengers || []).map((p, i) => {
                            const isConfirmed = (p.currentStatus || '').startsWith('CNF');
                            const isRAC = (p.currentStatus || '').startsWith('RAC');
                            return (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: 16,
                                    padding: '14px 0', borderBottom: i < status.passengers.length - 1 ? '1px solid var(--border)' : 'none'
                                }}>
                                    <div style={{
                                        width: 44, height: 44, borderRadius: 14,
                                        background: isConfirmed ? 'rgba(76,175,80,0.12)' : isRAC ? 'rgba(33,150,243,0.12)' : 'rgba(255,152,0,0.12)',
                                        display: 'grid', placeItems: 'center', fontSize: '1.2rem', flexShrink: 0
                                    }}>👤</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700 }}>{p.name || `Passenger ${i + 1}`}</div>
                                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{p.bookingStatus}</div>
                                    </div>
                                    <span className={`badge ${isConfirmed ? 'badge-success' : isRAC ? 'badge-info' : 'badge-warning'}`}
                                        style={{ fontSize: '0.82rem' }}>
                                        {p.currentStatus}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </main>
    );
}

function InfoPill({ icon, label, value }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: 1 }}>{label}</span>
            <span style={{ fontWeight: 600 }}>{icon} {value}</span>
        </div>
    );
}

function ChartBadge({ status }) {
    const prepared = status?.toLowerCase().includes('prepared');
    return (
        <span className={`badge ${prepared ? 'badge-success' : 'badge-warning'}`}
            style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
            {prepared ? '✅' : '⏳'} {status}
        </span>
    );
}
