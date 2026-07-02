import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useScrollShrink from '../hooks/useScrollShrink';
import useAuthStore from '../store/authStore';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const scrolled = useScrollShrink(50);
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);

  const { isAuthenticated, user, logout } = useAuthStore();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Rooms', to: '/rooms' },
    { label: 'Dining', to: '/dining' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'About', to: '/#about' },
  ];

  // Get initials from user name
  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-secondary/20 shadow-sm transition-all duration-300 ${
          scrolled ? 'h-16' : 'h-20'
        }`}
      >
        <div className="flex justify-between items-center w-full px-5 md:px-[80px] h-full max-w-[1280px] mx-auto">
          {/* Logo / Wordmark */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex flex-col leading-none">
              <span
                className="font-display-lg text-primary tracking-[0.18em] text-[15px] md:text-[17px] font-bold uppercase"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Delhi Line
              </span>
              <span className="font-label-caps text-label-caps text-secondary tracking-[0.25em] text-[9px]">
                Hotel
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `font-label-caps text-label-caps transition-colors duration-300 cursor-pointer ${
                    isActive
                      ? 'text-secondary border-b border-secondary pb-0.5'
                      : 'text-on-surface-variant hover:text-secondary'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              /* ---- Authenticated: Avatar + dropdown ---- */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 group"
                  aria-label="User menu"
                >
                  {/* Avatar circle */}
                  <div className="w-9 h-9 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-label-caps text-[12px] tracking-wider border-2 border-secondary/40 group-hover:border-secondary transition-all">
                    {initials}
                  </div>
                  <span className="hidden md:block font-label-caps text-label-caps text-on-surface-variant group-hover:text-secondary transition-colors max-w-[100px] truncate">
                    {user.name?.split(' ')[0]}
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px] hidden md:block">
                    {userMenuOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-3 w-52 bg-white shadow-ambient border border-secondary/10 rounded overflow-hidden z-50"
                    >
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-secondary/10 bg-surface-container-low">
                        <p className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">Signed in as</p>
                        <p className="font-body-md font-semibold text-primary truncate text-sm mt-0.5">{user.name}</p>
                        <p className="font-body-md text-on-surface-variant text-xs truncate">{user.email}</p>
                      </div>

                      {/* Menu items */}
                      <div className="py-1">
                        <button
                          onClick={() => { navigate('/book'); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 font-label-caps text-[11px] text-on-surface-variant hover:bg-surface-container-low hover:text-secondary transition-colors tracking-wider"
                        >
                          <span className="material-symbols-outlined text-[18px]">hotel</span>
                          Reserve a Room
                        </button>

                        {user.role === 'admin' && (
                          <button
                            onClick={() => { navigate('/admin'); setUserMenuOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 font-label-caps text-[11px] text-on-surface-variant hover:bg-surface-container-low hover:text-secondary transition-colors tracking-wider"
                          >
                            <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                            Admin Dashboard
                          </button>
                        )}

                        <div className="border-t border-secondary/10 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 font-label-caps text-[11px] text-red-500 hover:bg-red-50 transition-colors tracking-wider"
                          >
                            <span className="material-symbols-outlined text-[18px]">logout</span>
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* ---- Guest: Sign In + Reserve Now ---- */
              <>
                <Link
                  to="/login"
                  className="hidden md:block font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-colors"
                >
                  Sign In
                </Link>
                <button
                  onClick={() => navigate('/book')}
                  className="bg-primary text-on-primary px-6 py-3 font-label-caps text-label-caps hover:opacity-80 transition-opacity uppercase tracking-widest rounded"
                >
                  Reserve Now
                </button>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden flex flex-col gap-1.5 p-2"
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-0.5 bg-primary transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-primary transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-primary transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 bg-surface flex flex-col pt-24 px-8 md:hidden"
          >
            <nav className="flex flex-col gap-8 mt-8">
              {navLinks.map(({ label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `font-display-lg text-headline-sm transition-colors ${
                      isActive ? 'text-secondary' : 'text-primary'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-12">
              <div className="gold-divider mb-12" />
              <button
                onClick={() => { navigate('/book'); setMobileOpen(false); }}
                className="w-full bg-primary text-on-primary py-5 font-label-caps text-label-caps uppercase tracking-widest rounded"
              >
                Reserve Now
              </button>

              {isAuthenticated ? (
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="w-full mt-4 border border-red-300 text-red-500 py-4 font-label-caps text-label-caps uppercase tracking-widest rounded flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Sign Out — {user?.name?.split(' ')[0]}
                </button>
              ) : (
                <div className="flex gap-4 mt-4">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center border border-primary text-primary py-4 font-label-caps text-label-caps uppercase tracking-widest rounded"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center border border-secondary text-secondary py-4 font-label-caps text-label-caps uppercase tracking-widest rounded"
                  >
                    Join
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-auto pb-8">
              <p className="font-label-caps text-label-caps text-on-surface-variant text-[10px] tracking-widest">
                88 Heritage Path, New Delhi, 110001
              </p>
              <p className="font-body-md text-body-md text-secondary mt-2">+91 11 4050 6070</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
