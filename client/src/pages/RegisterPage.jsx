import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import useAuthStore from '../store/authStore';
import GoldDivider from '../components/GoldDivider';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading } = useAuthStore();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    const result = await register(form.name, form.email, form.password);
    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setError(result.error);
    }
  };

  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return null;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { label: 'Weak', color: 'bg-red-400', width: 'w-1/4' };
    if (score === 2) return { label: 'Fair', color: 'bg-amber-400', width: 'w-2/4' };
    if (score === 3) return { label: 'Good', color: 'bg-emerald-400', width: 'w-3/4' };
    return { label: 'Strong', color: 'bg-emerald-600', width: 'w-full' };
  })();

  return (
    <>
      <Helmet>
        <title>Create Account — Delhi Line Hotel</title>
        <meta name="description" content="Create your Delhi Line Hotel member account for exclusive benefits and easy booking management." />
      </Helmet>

      <div className="min-h-screen bg-surface flex items-stretch">
        {/* Left — decorative panel */}
        <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDCCStM266WfD7_OZPVBL30HdRYfZ55H_CFd1OQ2A2QFJM1A2ozgbN5Wlr5fGssCFTtHZNIgiBiiNuyVRnWaaCnFk3p5KSxwNeCZF_eossxVN1XS8NFY2cpy7yrn6oI_CUd0vWhilK33JTA7ELzX3oSGn6QgVCT-ffrcrvENfsSyYeUkUy42JmzPh4qy0g69NpMOfzYaoetYHA-128qkYyB_wa-ZQMebUNKG-r107jfgKnsgQRuI0CupI5lu4SL8RFPJqalVl_fVY"
            alt="The Line Restaurant fine dining"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/65" />
          <div className="absolute inset-0 flex flex-col justify-end p-14 text-on-primary">
            <span className="font-label-caps text-[10px] tracking-[0.3em] text-secondary-fixed-dim mb-4 block">
              MEMBERSHIP
            </span>
            <h2
              className="font-display-lg text-[36px] leading-tight mb-4"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Begin your story with us.
            </h2>
            <GoldDivider className="w-20 mb-4" />
            <ul className="space-y-3">
              {[
                'Complimentary breakfast on first stay',
                'Early check-in & late check-out',
                'Exclusive member room rates',
                'Priority dining reservations',
              ].map((perk) => (
                <li key={perk} className="flex items-center gap-3 font-body-md text-on-primary/80 text-sm">
                  <span className="material-symbols-outlined text-secondary-fixed text-base">check_circle</span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right — form */}
        <div className="flex-1 flex items-center justify-center px-6 py-16">
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

            <h1 className="font-headline-md text-headline-md text-primary mb-2">Create Account</h1>
            <p className="font-body-md text-on-surface-variant mb-8">
              Join Delhi Line for exclusive member privileges.
            </p>
            <GoldDivider className="w-16 mb-10" />

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="space-y-2">
                <label className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest block">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Arjun Mehta"
                  className="w-full text-base"
                  required
                  autoComplete="name"
                />
              </div>

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
                    placeholder="Minimum 8 characters"
                    className="w-full text-base pr-10"
                    required
                    autoComplete="new-password"
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
                {/* Password strength meter */}
                {passwordStrength && (
                  <div className="mt-2">
                    <div className="h-1 bg-surface-container-highest rounded overflow-hidden">
                      <div className={`h-full rounded transition-all duration-500 ${passwordStrength.color} ${passwordStrength.width}`} />
                    </div>
                    <span className="font-label-caps text-[9px] text-on-surface-variant tracking-wider mt-1 block">
                      {passwordStrength.label}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest block">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  placeholder="Re-enter your password"
                  className="w-full text-base"
                  required
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-on-primary py-4 font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary transition-all rounded disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <p className="mt-8 text-center font-body-md text-on-surface-variant text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-secondary border-b border-secondary pb-0.5 hover:opacity-75 transition-opacity">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
