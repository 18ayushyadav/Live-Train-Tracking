import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LiveFeed from '../components/LiveFeed';
import styles from './Home.module.css';

export default function Home() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [trainNo, setTrainNo] = useState('');
    const [pnrNo, setPnrNo] = useState('');
    const [tab, setTab] = useState('train');

    return (
        <main className={styles.main}>
            {/* ── Hero ───────────────────────────────────────────── */}
            <section className={styles.hero}>
                <div className={styles.heroBadge}>
                    <span className="live-dot" />
                    <span>{t('live_badge')}</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px', fontStyle: 'italic' }}>
                    ( website and app still under development )
                </div>
                <h1 className={styles.heroTitle}>{t('hero_title')}</h1>
                <p className={styles.heroSub}>{t('hero_subtitle')}</p>

                {/* ── Search card ─────────────────────────────────── */}
                <div className={`card ${styles.searchCard}`}>
                    <div className={styles.tabs}>
                        <button className={`${styles.tab} ${tab === 'train' ? styles.tabActive : ''}`}
                            onClick={() => setTab('train')}>
                            🚂 {t('tab_train')}
                        </button>
                        <button className={`${styles.tab} ${tab === 'pnr' ? styles.tabActive : ''}`}
                            onClick={() => setTab('pnr')}>
                            🎫 {t('tab_pnr')}
                        </button>
                    </div>

                    {tab === 'train' ? (
                        <div className={styles.searchRow}>
                            <input
                                className="input"
                                placeholder={t('search_train_placeholder')}
                                value={trainNo}
                                maxLength={5}
                                onChange={e => setTrainNo(e.target.value.replace(/\D/g, ''))}
                                onKeyDown={e => e.key === 'Enter' && trainNo.length === 5 && navigate(`/train/${trainNo}`)}
                            />
                            <button
                                className="btn btn-primary"
                                onClick={() => trainNo.length === 5 && navigate(`/train/${trainNo}`)}
                            >
                                {t('search_btn')} →
                            </button>
                        </div>
                    ) : (
                        <div className={styles.searchRow}>
                            <input
                                className="input"
                                placeholder={t('search_pnr_placeholder')}
                                value={pnrNo}
                                maxLength={10}
                                onChange={e => setPnrNo(e.target.value.replace(/\D/g, ''))}
                                onKeyDown={e => e.key === 'Enter' && pnrNo.length === 10 && navigate(`/pnr/${pnrNo}`)}
                            />
                            <button
                                className="btn btn-primary"
                                onClick={() => pnrNo.length === 10 && navigate(`/pnr/${pnrNo}`)}
                            >
                                {t('check_btn')} →
                            </button>
                        </div>
                    )}

                    <p className={styles.tryLabel}>{t('try_eg')}:
                        <button className={styles.exampleBtn} onClick={() => { setTab('train'); setTrainNo('12951'); }}>12951</button>
                        <button className={styles.exampleBtn} onClick={() => { setTab('train'); setTrainNo('12302'); }}>12302</button>
                        <button className={styles.exampleBtn} onClick={() => { setTab('pnr'); setPnrNo('1234567890'); }}>1234567890</button>
                    </p>
                </div>
            </section>

            {/* ── Live feed ──────────────────────────────────────── */}
            <section className={styles.feedSection}>
                <h2 className={styles.sectionTitle}>{t('live_trains_title')}</h2>
                <LiveFeed />
            </section>

            {/* ── Feature cards ──────────────────────────────────── */}
            <section className={styles.features}>
                {[
                    { icon: '📡', title: t('feat_offline_title'), desc: t('feat_offline_desc') },
                    { icon: '🗺️', title: t('feat_map_title'), desc: t('feat_map_desc') },
                    { icon: '⏰', title: t('feat_alarm_title'), desc: t('feat_alarm_desc') },
                    { icon: '👥', title: t('feat_crowd_title'), desc: t('feat_crowd_desc') },
                ].map(f => (
                    <div key={f.title} className={`card ${styles.featureCard}`}>
                        <span className={styles.featureIcon}>{f.icon}</span>
                        <h3>{f.title}</h3>
                        <p className="text-muted">{f.desc}</p>
                    </div>
                ))}
            </section>
        </main>
    );
}
