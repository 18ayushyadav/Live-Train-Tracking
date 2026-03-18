import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TrainMap from '../components/TrainMap';
import StatusCard from '../components/StatusCard';
import { fetchTrainStatus, fetchSchedule } from '../services/api';

export default function TrainStatus() {
    const { no } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [inputNo, setInputNo] = useState(no || '');
    const [train, setTrain] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tab, setTab] = useState('status');

    const search = useCallback(async (num) => {
        if (!num || num.length !== 5) return;
        setLoading(true); setError('');
        try {
            const data = await fetchTrainStatus(num);
            setTrain(data);
            const sched = await fetchSchedule(num);
            setSchedule(sched);
            navigate(`/train/${num}`, { replace: true });
        } catch (e) {
            setError(t('error_fetch'));
        } finally {
            setLoading(false);
        }
    }, [navigate, t]);

    // Auto-search if route param given
    useEffect(() => { if (no) search(no); }, [no, search]);

    // Auto-poll every 30s
    useEffect(() => {
        if (!train) return;
        const id = setInterval(() => fetchTrainStatus(inputNo).then(setTrain).catch(() => { }), 30000);
        return () => clearInterval(id);
    }, [train, inputNo]);

    return (
        <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 80px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 28 }}>{t('train_status_title')}</h1>

            {/* Search bar */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 36 }}>
                <input className="input" placeholder={t('search_train_placeholder')}
                    value={inputNo} maxLength={5}
                    onChange={e => setInputNo(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={e => e.key === 'Enter' && search(inputNo)}
                    style={{ maxWidth: 240, letterSpacing: 3, fontWeight: 700 }} />
                <button className="btn btn-primary" onClick={() => search(inputNo)} disabled={loading}>
                    {loading ? '⏳' : t('search_btn')}
                </button>
            </div>

            {error && <p className="text-error" style={{ marginBottom: 24 }}>{error}</p>}

            {loading && !train && <LoadingSkeleton />}

            {train && (
                <>
                    {/* Tab switcher */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                        {['status', 'map', 'schedule'].map(t2 => (
                            <button key={t2} onClick={() => setTab(t2)}
                                className="btn"
                                style={{
                                    background: tab === t2 ? 'var(--primary)' : 'var(--bg-card)',
                                    color: tab === t2 ? '#fff' : 'var(--text-muted)',
                                    border: '1px solid var(--border)',
                                    padding: '9px 20px', fontSize: '0.88rem',
                                }}>
                                {t(t2)}
                            </button>
                        ))}
                    </div>

                    {tab === 'status' && <StatusCard train={train} />}
                    {tab === 'map' && train.lat && <TrainMap train={train} />}
                    {tab === 'map' && !train.lat && (
                        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                            {t('no_location')}
                        </div>
                    )}
                    {tab === 'schedule' && <ScheduleTable rows={schedule} t={t} />}
                </>
            )}
        </main>
    );
}

function ScheduleTable({ rows, t }) {
    if (!rows.length) return null;
    return (
        <div className="card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        {['station', 'arrival', 'departure', 'day', 'km'].map(h => (
                            <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: 600 }}>
                                {t(h)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td style={{ padding: '12px 16px', fontWeight: 600 }}>{r.station}</td>
                            <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{r.arrival}</td>
                            <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{r.departure}</td>
                            <td style={{ padding: '12px 16px', color: 'var(--text-dim)' }}>Day {r.day}</td>
                            <td style={{ padding: '12px 16px', color: 'var(--text-dim)' }}>{r.distance} km</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[120, 200, 160].map(h => (
                <div key={h} className="skeleton" style={{ height: h, borderRadius: 20 }} />
            ))}
        </div>
    );
}
