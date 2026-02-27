import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import EventoApp from './EventoApp';
import CreateEvent from './pages/CreateEvent';
import Error404 from './pages/Error404';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import UserProfilePage from './pages/UserProfilePage';
import EditEvent from './pages/EditEvent';

/* ── Protected route helper ── */
const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '3px' }}>
      ◈ LOADING...
    </div>
  );
  return user ? children : <Navigate to="/sign-in" replace />;
};

/* ── Public-only route (redirect away if already signed in) ── */
const PublicOnly = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/" replace /> : children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/sign-in" element={<PublicOnly><SignInPage /></PublicOnly>} />
      <Route path="/sign-up" element={<PublicOnly><SignUpPage /></PublicOnly>} />

      <Route path="/" element={<Protected><EventoApp /></Protected>} />
      <Route path="/eventform" element={<Protected><CreateEvent /></Protected>} />
      <Route path="/edit-event/:id" element={<Protected><EditEvent /></Protected>} />
      <Route path="/profile" element={<Protected><UserProfilePage /></Protected>} />

      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default App;
