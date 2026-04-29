import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import TunerPage from './pages/TunerPage';
import SongsPage from './pages/SongsPage';
import ScalePage from './pages/ScalePage';
import FretboardPage from './pages/FretboardPage';
import PracticePage from './pages/PracticePage';
import SettingsPage from './pages/SettingsPage';

const NAV_LINKS = [
  { to: '/',          label: 'Tuner',    exact: true  },
  { to: '/songs',     label: 'Songs',    exact: false },
  { to: '/scale',     label: 'Scale',    exact: false },
  { to: '/fretboard', label: 'Fret',     exact: false },
  { to: '/practice',  label: 'Practice', exact: false },
  { to: '/settings',  label: 'Settings', exact: false },
];

const pageVariants = {
  initial: { opacity: 0, y: 6 },
  in:      { opacity: 1, y: 0 },
  out:     { opacity: 0, y: -6 },
};

function AppLayout() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-full" style={{ background: 'var(--color-bg)' }}>
      <main className="flex-1 overflow-auto pb-14">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={{ duration: 0.15 }}
            className="w-full"
          >
            <Routes location={location}>
              <Route path="/"          element={<TunerPage />} />
              <Route path="/songs"     element={<SongsPage />} />
              <Route path="/scale"     element={<ScalePage />} />
              <Route path="/fretboard" element={<FretboardPage />} />
              <Route path="/practice"  element={<PracticePage />} />
              <Route path="/settings"  element={<SettingsPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 flex border-t"
        style={{
          borderColor: 'var(--color-border)',
          background: 'var(--color-surface-1)',
        }}
      >
        {NAV_LINKS.map(({ to, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className="flex-1 flex flex-col items-center py-3 font-medium transition-colors duration-150"
            style={({ isActive }) => ({
              fontSize: '10px',
              color: isActive ? 'var(--color-accent)' : 'var(--color-text-3)',
            })}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
