import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './services/supabase';
import type { Session } from '@supabase/supabase-js';

import { AppLayout } from './components/layout/AppLayout';
import { Toaster } from 'react-hot-toast';
import { Login } from './pages/Login';
import { CajaView } from './pages/CajaView';
import { CocinaView } from './pages/CocinaView';
import { AdminView } from './pages/AdminView';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen app-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={!session ? <Login /> : <Navigate to="/caja" replace />}
          />

          {/* Protected Routes */}
          <Route
            path="/caja"
            element={session ? <AppLayout><CajaView /></AppLayout> : <Navigate to="/login" replace />}
          />
          <Route
            path="/cocina"
            element={session ? <AppLayout><CocinaView /></AppLayout> : <Navigate to="/login" replace />}
          />
          <Route
            path="/admin"
            element={session ? <AppLayout><AdminView /></AppLayout> : <Navigate to="/login" replace />}
          />

          {/* Default Redirect */}
          <Route
            path="/"
            element={<Navigate to={session ? "/caja" : "/login"} replace />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
