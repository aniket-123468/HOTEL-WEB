import { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import useAuthStore from '../store/authStore';
import GoldDivider from '../components/GoldDivider';

import imgGrandLobby from '../assets/hotel_grand_lobby.png';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuthStore();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Where to redirect after login
  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(form.email, form.password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign In — Delhi Line Hotel</title>
        <meta name="description" content="Sign in to your Delhi Line Hotel account to manage bookings and reservations." />
      </Helmet>

      <div className="min-h-screen bg-surface flex items-stretch">
        {/* Left — decorative panel */}
        <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
          <img
            src={imgGrandLobby}
            alt="Delhi Line Hotel grand entrance"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/60" />
          <div className="absolute inset-0 flex flex-col justify-end p-14 text-on-primary">
            <span className="font-label-caps text-[10px] tracking-[0.3em] text-secondary-fixed-dim mb-4 block">
              DELHI LINE HOTEL
            </span>
            <h2
              className="font-display-lg text-[36px] leading-tight mb-4"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              "Heritage lives in every detail."
            </h2>
            <GoldDivider className="w-20 mb-4" />
            <p className="font-body-md text-on-primary/75 text-sm max-w-xs">
              Sign in to access exclusive member benefits, manage your reservations, and experience Delhi Line at its finest.
            </p>
          </div>
        </div>

        {/* Right — form */}
        <div className="flex-1 flex items-center justify-center px-6 py-20">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Logo */}
            <Link to="/" className="flex flex-col mb-10">
              <span
                className="font-display-lg text-primary tracking-[0.18em] text-[18px] font-bold uppercase"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Delhi Line
              </span>
              <span className="font-label-caps text-label-caps text-secondary tracking-[0.25em] text-[9px]">Hotel</span>
            </Link>

            <h1 className="font-headline-md text-headline-md text-primary mb-2">Welcome Back</h1>
            <p className="font-body-md text-on-surface-variant mb-8">
              Sign in to your account to continue.
            </p>
            <GoldDivider className="w-16 mb-10" />

            {/* Error alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest block">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full text-base"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <label className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full text-base pr-10"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-1 bottom-2 text-on-surface-variant hover:text-secondary transition-colors"
                    tabIndex={-1}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPass ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-on-primary py-4 font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary transition-all rounded disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="mt-8 text-center font-body-md text-on-surface-variant text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-secondary border-b border-secondary pb-0.5 hover:opacity-75 transition-opacity">
                Create one
              </Link>
            </p>

            <p className="mt-4 text-center font-body-md text-on-surface-variant/60 text-xs">
              Demo credentials: <strong>user@delhiline.com</strong> / <strong>Password123</strong>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
