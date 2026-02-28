import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import HomePage from './pages/Home';
import CreateEvent from './pages/CreateEvent';
import MyEventsPage from './pages/MyEventsPage';
import Error404 from './pages/Error404';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import UserProfilePage from './pages/UserProfilePage';
import EditEvent from './pages/EditEvent';

/* ── Loading screen ── */
const Loading = () => (
  <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '3px' }}>
    ◈ LOADING...
  </div>
);

/* ── Layout wrapper — persists across route changes via <Outlet> ─────────
   sidebarOpen state lives HERE, not in individual pages.
   This means navigating between pages never resets the sidebar state. ── */
const AppLayout = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/sign-in" replace />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main style={{ flex: 1, overflowX: 'hidden', minWidth: 0 }}>
        <Outlet />  {/* child pages render here — no layout re-mount on navigation */}
      </main>
    </div>
  );
};

/* ── Public-only route ── */
const PublicOnly = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/" replace /> : children;
};

const App = () => (
  <Routes>
    {/* Auth pages — no sidebar */}
    <Route path="/sign-in" element={<PublicOnly><SignInPage /></PublicOnly>} />
    <Route path="/sign-up" element={<PublicOnly><SignUpPage /></PublicOnly>} />

    {/* App pages — all share one persistent AppLayout (sidebar state stays alive) */}
    <Route element={<AppLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/myevents" element={<MyEventsPage />} />
      <Route path="/eventform" element={<CreateEvent />} />
      <Route path="/edit-event/:id" element={<EditEvent />} />
      <Route path="/profile" element={<UserProfilePage />} />
    </Route>

    <Route path="*" element={<Error404 />} />
  </Routes>
);

export default App;
