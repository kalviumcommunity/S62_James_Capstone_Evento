import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useClerk, SignOutButton } from '@clerk/clerk-react';

/* ─── Hero Dot Canvas ─────────────────────────────────────────────────── */
const HeroCanvas = () => {
    const canvasRef = useRef(null);
    const mouse = useRef({ x: -9999, y: -9999 });
    const dotsRef = useRef([]);
    const animRef = useRef(null);
    const S = 28;

    const buildDots = useCallback((W, H) => {
        const arr = [];
        for (let r = 0; r < Math.ceil(H / S) + 1; r++)
            for (let c = 0; c < Math.ceil(W / S) + 1; c++)
                arr.push({ x: c * S, y: r * S, b: 0.08 + Math.random() * 0.1, p: Math.random() * Math.PI * 2, ps: 0.006 + Math.random() * 0.008 });
        dotsRef.current = arr;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const parent = canvas.parentElement;
        const resize = () => { canvas.width = parent.offsetWidth; canvas.height = parent.offsetHeight; buildDots(canvas.width, canvas.height); };
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            dotsRef.current.forEach(d => {
                d.p += d.ps;
                const dx = d.x - mouse.current.x, dy = d.y - mouse.current.y;
                const inf = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 150);
                ctx.beginPath(); ctx.arc(d.x, d.y, 1 + inf * 3.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${Math.min(1, d.b + Math.sin(d.p) * 0.04 + inf * 0.65)})`; ctx.fill();
            });
            animRef.current = requestAnimationFrame(draw);
        };
        const onMove = e => { const r = canvas.getBoundingClientRect(); mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top }; };
        const onLeave = () => { mouse.current = { x: -9999, y: -9999 }; };
        resize(); draw();
        const ro = new ResizeObserver(resize); ro.observe(parent);
        parent.addEventListener('mousemove', onMove); parent.addEventListener('mouseleave', onLeave);
        return () => { cancelAnimationFrame(animRef.current); ro.disconnect(); parent.removeEventListener('mousemove', onMove); parent.removeEventListener('mouseleave', onLeave); };
    }, [buildDots]);

    return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
};

/* ─── UserProfilePage ─────────────────────────────────────────────────── */
const UserProfilePage = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const { openUserProfile } = useClerk();
    const [activeTab, setActiveTab] = useState('overview');

    const displayName = user?.fullName || user?.firstName || 'User';
    const email = user?.primaryEmailAddress?.emailAddress || '';
    const initial = displayName[0]?.toUpperCase() || 'U';
    const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' }) : '—';
    const lastSignIn = user?.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

    const isChrist = email.includes('christuniversity.in');

    const cardStyle = { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '28px' };
    const sectionHeaderStyle = { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' };
    const fieldLabelStyle = { fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,255,255,0.25)', fontFamily: "'Space Mono', monospace", marginBottom: '6px' };
    const fieldValueStyle = { fontSize: '14px', color: '#fff', fontWeight: 500 };
    const dividerStyle = { height: '1px', background: 'rgba(255,255,255,0.05)' };

    const actionBtnStyle = {
        width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        color: '#fff', padding: '13px 16px', borderRadius: '2px', cursor: 'pointer',
        fontSize: '12px', fontFamily: "'Space Mono', monospace", letterSpacing: '1px',
        textAlign: 'left', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    };

    const inputStyle = {
        width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
        color: '#fff', padding: '12px 16px', borderRadius: '2px', fontSize: '13px',
        fontFamily: "'DM Sans', sans-serif", outline: 'none',
    };

    const stats = [
        { label: 'REGISTERED', value: '—', color: '#a855f7', bg: 'rgba(168,85,247,0.06)', border: 'rgba(168,85,247,0.15)' },
        { label: 'ATTENDED', value: '—', color: '#06b6d4', bg: 'rgba(6,182,212,0.06)', border: 'rgba(6,182,212,0.15)' },
        { label: 'UPCOMING', value: '—', color: '#f59e0b', bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.15)' },
        { label: 'HOSTED', value: '—', color: 'rgba(34,197,94,0.9)', bg: 'rgba(34,197,94,0.06)', border: 'rgba(34,197,94,0.15)' },
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: "'DM Sans', sans-serif" }}>

            {/* ── TOP NAV ─────────────────────────────────────────────── */}
            <nav style={{
                height: '56px', borderBottom: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'center', padding: '0 40px',
                position: 'sticky', top: 0,
                background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', zIndex: 100,
            }}>
                <button
                    onClick={() => navigate('/')}
                    onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontFamily: "'Space Mono', monospace", letterSpacing: '1px', cursor: 'pointer', transition: 'color 0.2s' }}
                >
                    ← DASHBOARD
                </button>

                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '3px', color: '#fff' }}>EVENTO</div>
                </div>

                <SignOutButton>
                    <button
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,80,80,0.5)'; e.currentTarget.style.color = 'rgba(255,100,100,0.9)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,80,80,0.2)'; e.currentTarget.style.color = 'rgba(255,100,100,0.6)'; }}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid rgba(255,80,80,0.2)', color: 'rgba(255,100,100,0.6)', padding: '7px 16px', borderRadius: '2px', cursor: 'pointer', fontSize: '11px', fontFamily: "'Space Mono', monospace", letterSpacing: '1px', transition: 'all 0.2s' }}
                    >
                        ↳ SIGN OUT
                    </button>
                </SignOutButton>
            </nav>

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 40px 80px' }}>

                {/* ── HERO CARD ──────────────────────────────────────────── */}
                <div style={{ position: 'relative', marginBottom: '32px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden', animation: 'fadeUp 0.6s ease both', animationDelay: '0.05s' }}>
                    <HeroCanvas />
                    {/* Purple gradient overlay */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(99,102,241,0.08) 50%, transparent 100%)', pointerEvents: 'none', zIndex: 1 }} />
                    {/* Grid lines */}
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 59px,rgba(255,255,255,0.03) 59px,rgba(255,255,255,0.03) 60px),repeating-linear-gradient(90deg,transparent,transparent 59px,rgba(255,255,255,0.03) 59px,rgba(255,255,255,0.03) 60px)', pointerEvents: 'none', zIndex: 1 }} />

                    <div style={{ position: 'relative', zIndex: 2, padding: '40px 40px 32px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>

                            {/* Avatar */}
                            <div style={{ width: '80px', height: '80px', borderRadius: '4px', background: user?.imageUrl ? 'transparent' : 'linear-gradient(135deg, #a855f7, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', letterSpacing: '2px', flexShrink: 0, border: '1px solid rgba(255,255,255,0.15)', overflow: 'hidden' }}>
                                {user?.imageUrl
                                    ? <img src={user.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    : initial
                                }
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '11px', letterSpacing: '3px', color: 'rgba(255,255,255,0.3)', fontFamily: "'Space Mono', monospace", marginBottom: '8px' }}>MEMBER PROFILE</div>
                                <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '34px', letterSpacing: '2px', lineHeight: 1, marginBottom: '6px', color: '#fff' }}>
                                    {displayName.toUpperCase()}
                                </h1>
                                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', marginBottom: '20px', fontFamily: "'Space Mono', monospace" }}>{email}</div>

                                {/* Badges */}
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    {isChrist && (
                                        <span style={{ padding: '5px 14px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', color: 'rgba(168,85,247,0.9)', borderRadius: '2px', fontSize: '11px', fontFamily: "'Space Mono', monospace", letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            ◈ CHRIST UNIVERSITY
                                        </span>
                                    )}
                                    <span style={{ padding: '5px 14px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', color: 'rgba(34,197,94,0.8)', borderRadius: '2px', fontSize: '11px', fontFamily: "'Space Mono', monospace", letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        ✓ VERIFIED ACCOUNT
                                    </span>
                                    <span style={{ padding: '5px 14px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', color: 'rgba(99,102,241,0.9)', borderRadius: '2px', fontSize: '11px', fontFamily: "'Space Mono', monospace", letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        ⊹ EVENTO MEMBER
                                    </span>
                                </div>
                            </div>

                            {/* Edit button */}
                            <button
                                onClick={() => openUserProfile()}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                                style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', padding: '12px 24px', borderRadius: '2px', cursor: 'pointer', fontSize: '11px', fontFamily: "'Space Mono', monospace", letterSpacing: '2px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}
                            >
                                ✎ EDIT PROFILE
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── TABS ───────────────────────────────────────────────── */}
                <div style={{ display: 'flex', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.07)', animation: 'fadeUp 0.6s ease both', animationDelay: '0.1s' }}>
                    {['overview', 'account'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '12px 28px', background: 'transparent', border: 'none',
                                borderBottom: activeTab === tab ? '2px solid #a855f7' : '2px solid transparent',
                                color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.35)',
                                cursor: 'pointer', fontSize: '12px', fontFamily: "'Space Mono', monospace",
                                letterSpacing: '2px', transition: 'all 0.2s',
                            }}
                        >
                            {tab.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* ── OVERVIEW PANEL ─────────────────────────────────────── */}
                {activeTab === 'overview' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                        {/* Personal Info */}
                        <div style={{ ...cardStyle, animation: 'fadeUp 0.6s ease both', animationDelay: '0.15s' }}>
                            <div style={sectionHeaderStyle}>
                                <span style={{ color: '#a855f7', fontSize: '16px' }}>◈</span>
                                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '3px', color: 'rgba(255,255,255,0.6)' }}>PERSONAL INFO</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <div style={fieldLabelStyle}>FULL NAME</div>
                                    <div style={fieldValueStyle}>{displayName.toUpperCase()}</div>
                                </div>
                                <div style={dividerStyle} />
                                <div>
                                    <div style={fieldLabelStyle}>EMAIL</div>
                                    <div style={{ ...fieldValueStyle, fontWeight: 400 }}>{email}</div>
                                </div>
                                <div style={dividerStyle} />
                                <div>
                                    <div style={fieldLabelStyle}>INSTITUTION</div>
                                    <div style={fieldValueStyle}>{isChrist ? 'Christ University' : '—'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Activity */}
                        <div style={{ ...cardStyle, animation: 'fadeUp 0.6s ease both', animationDelay: '0.2s' }}>
                            <div style={sectionHeaderStyle}>
                                <span style={{ color: '#06b6d4', fontSize: '16px' }}>◷</span>
                                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '3px', color: 'rgba(255,255,255,0.6)' }}>ACTIVITY</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <div style={fieldLabelStyle}>MEMBER SINCE</div>
                                    <div style={fieldValueStyle}>{memberSince}</div>
                                </div>
                                <div style={dividerStyle} />
                                <div>
                                    <div style={fieldLabelStyle}>LAST SIGN IN</div>
                                    <div style={fieldValueStyle}>{lastSignIn}</div>
                                </div>
                                <div style={dividerStyle} />
                                <div>
                                    <div style={fieldLabelStyle}>ACCOUNT STATUS</div>
                                    <div style={{ fontSize: '14px', color: 'rgba(34,197,94,0.9)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'rgba(34,197,94,0.9)', display: 'inline-block', boxShadow: '0 0 8px rgba(34,197,94,0.5)' }} />
                                        ACTIVE
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Event Stats */}
                        <div style={{ ...cardStyle, animation: 'fadeUp 0.6s ease both', animationDelay: '0.25s' }}>
                            <div style={sectionHeaderStyle}>
                                <span style={{ color: '#f59e0b', fontSize: '16px' }}>✦</span>
                                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '3px', color: 'rgba(255,255,255,0.6)' }}>EVENT STATS</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                {stats.map((s, i) => (
                                    <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '2px', padding: '16px', textAlign: 'center' }}>
                                        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', color: s.color }}>{s.value}</div>
                                        <div style={{ fontSize: '10px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', fontFamily: "'Space Mono', monospace", marginTop: '4px' }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div style={{ ...cardStyle, animation: 'fadeUp 0.6s ease both', animationDelay: '0.3s' }}>
                            <div style={sectionHeaderStyle}>
                                <span style={{ color: '#6366f1', fontSize: '16px' }}>⊹</span>
                                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '3px', color: 'rgba(255,255,255,0.6)' }}>QUICK ACTIONS</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {[
                                    { icon: '◈', label: 'MY REGISTERED EVENTS', path: '/myevents' },
                                    { icon: '⊕', label: 'CREATE NEW EVENT', path: '/eventform' },
                                    { icon: '✦', label: 'DISCOVER EVENTS', path: '/' },
                                    { icon: '✎', label: 'EDIT PROFILE', action: () => openUserProfile() },
                                ].map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => item.action ? item.action() : navigate(item.path)}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                                        style={actionBtnStyle}
                                    >
                                        <span>{item.icon} {item.label}</span>
                                        <span style={{ color: 'rgba(255,255,255,0.3)' }}>→</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                )}

                {/* ── ACCOUNT PANEL ──────────────────────────────────────── */}
                {activeTab === 'account' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', maxWidth: '600px' }}>

                        {/* Account Settings */}
                        <div style={{ ...cardStyle, animation: 'fadeUp 0.6s ease both', animationDelay: '0.15s' }}>
                            <div style={sectionHeaderStyle}>
                                <span style={{ color: '#a855f7', fontSize: '16px' }}>◈</span>
                                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '3px', color: 'rgba(255,255,255,0.6)' }}>ACCOUNT SETTINGS</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ ...fieldLabelStyle, display: 'block', marginBottom: '8px' }}>DISPLAY NAME</label>
                                    <input defaultValue={displayName.toUpperCase()} style={inputStyle}
                                        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(168,85,247,0.5)'; }}
                                        onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }} />
                                </div>
                                <div>
                                    <label style={{ ...fieldLabelStyle, display: 'block', marginBottom: '8px' }}>EMAIL ADDRESS</label>
                                    <input defaultValue={email} readOnly style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }} />
                                </div>
                                <div>
                                    <label style={{ ...fieldLabelStyle, display: 'block', marginBottom: '8px' }}>INSTITUTION</label>
                                    <input defaultValue={isChrist ? 'Christ University' : ''} readOnly style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }} />
                                </div>
                                <div style={{ paddingTop: '8px' }}>
                                    <button
                                        onClick={() => openUserProfile()}
                                        onMouseEnter={e => { e.currentTarget.style.background = '#e8e8e8'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                                        style={{ background: '#fff', color: '#000', border: 'none', padding: '13px 28px', fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '2px', fontWeight: 700, cursor: 'pointer', borderRadius: '2px', transition: 'background 0.2s' }}
                                    >
                                        MANAGE IN CLERK →
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div style={{ background: 'rgba(255,50,50,0.02)', border: '1px solid rgba(255,80,80,0.1)', borderRadius: '4px', padding: '28px', animation: 'fadeUp 0.6s ease both', animationDelay: '0.2s' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                <span style={{ color: 'rgba(255,100,100,0.7)', fontSize: '16px' }}>⚠</span>
                                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '3px', color: 'rgba(255,100,100,0.6)' }}>DANGER ZONE</span>
                            </div>
                            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginBottom: '16px', lineHeight: 1.6 }}>
                                Deleting your account is permanent and cannot be undone. All your data will be removed.
                            </p>
                            <button
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,50,50,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,80,80,0.5)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,80,80,0.25)'; }}
                                style={{ background: 'transparent', color: 'rgba(255,100,100,0.7)', border: '1px solid rgba(255,80,80,0.25)', padding: '11px 20px', borderRadius: '2px', cursor: 'pointer', fontSize: '11px', fontFamily: "'Space Mono', monospace", letterSpacing: '2px', transition: 'all 0.2s' }}
                            >
                                DELETE ACCOUNT
                            </button>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};

export default UserProfilePage;
