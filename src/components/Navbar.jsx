import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
    const { t, i18n } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleLang = () => {
        const next = i18n.language === 'en' ? 'hi' : 'en';
        i18n.changeLanguage(next);
        localStorage.setItem('lang', next);
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-logo">
                <div className="nav-logo-icon">🚂</div>
                <span className="nav-logo-text">{t('app_name')}</span>
            </Link>

            <div className="nav-links">
                <NavLink to="/" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')} end>{t('nav_home')}</NavLink>
                <NavLink to="/train" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>{t('nav_train')}</NavLink>
                <NavLink to="/pnr" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>{t('nav_pnr')}</NavLink>
                <NavLink to="/about" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>{t('nav_about')}</NavLink>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button className="btn btn-outline nav-lang" onClick={toggleLang} style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                    {i18n.language === 'en' ? '🇮🇳 हिन्दी' : '🇬🇧 English'}
                </button>
            </div>
        </nav>
    );
}
