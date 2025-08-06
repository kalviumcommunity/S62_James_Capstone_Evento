import { Routes, Route } from 'react-router-dom';
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import EventoApp from './EventoApp';
import CreateEvent from './pages/CreateEvent';
import Error404 from './pages/Error404';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import SSOCallback from './pages/SSOCallback';

// Add this route

const App = () => {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignInPage/>} />
      <Route path="/sign-up" element={<SignUpPage/>} />
      <Route path="/sso-callback" element={<SSOCallback />} />

      <Route
        path="/"
        element={
          <>
            <SignedIn>
              <EventoApp />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      <Route
        path="/eventform"
        element={
          <>
            <SignedIn>
              <CreateEvent />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />



      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default App;


