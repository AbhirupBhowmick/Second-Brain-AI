import React, { useState } from 'react';
import PasswordStrengthMeter from './PasswordStrengthMeter';

interface SignupFormProps {
  onSubmit: (email: string, password: string, fullName?: string) => Promise<void>;
  onGuestLogin: () => void;
  onSwitchToLogin: () => void;
  loading: boolean;
  error: string;
}

const EyeIcon: React.FC<{ open: boolean }> = ({ open }) => (
  open ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  )
);

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, onGuestLogin, onSwitchToLogin, loading, error }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [confirmError, setConfirmError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match.');
      return;
    }
    if (!acceptTerms) return;
    setConfirmError('');
    onSubmit(email, password, fullName);
  };

  const isSuccess = error.toLowerCase().includes('created');

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-400">
      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="font-display text-2xl font-bold text-white tracking-tight">
          Create your workspace
        </h1>
        <p className="text-sm text-zinc-400 font-normal leading-relaxed">
          Your second brain starts here.
        </p>
      </div>

      {/* Error / Success Banner */}
      {error && (
        <div
          className={`flex items-start gap-3 p-3.5 rounded-xl text-sm border animate-in fade-in duration-300 ${
            isSuccess
              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/25 text-rose-400'
          }`}
          role="alert"
          aria-live="polite"
        >
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isSuccess ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            )}
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="signup-name" className="block text-xs font-medium text-zinc-400">
            Full name
          </label>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ada Lovelace"
            aria-label="Full name"
            className="w-full px-4 py-3 bg-zinc-900/80 border border-white/[0.08] rounded-xl text-zinc-100 text-sm placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/15 transition-all duration-200"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="signup-email" className="block text-xs font-medium text-zinc-400">
            Email address
          </label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label="Email address"
            className="w-full px-4 py-3 bg-zinc-900/80 border border-white/[0.08] rounded-xl text-zinc-100 text-sm placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/15 transition-all duration-200"
          />
        </div>

        {/* Password with Strength Meter */}
        <div className="space-y-2">
          <label htmlFor="signup-password" className="block text-xs font-medium text-zinc-400">
            Password
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              aria-label="Password"
              className="w-full px-4 py-3 pr-11 bg-zinc-900/80 border border-white/[0.08] rounded-xl text-zinc-100 text-sm placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/15 transition-all duration-200"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
          <PasswordStrengthMeter password={password} />
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label htmlFor="signup-confirm" className="block text-xs font-medium text-zinc-400">
            Confirm password
          </label>
          <div className="relative">
            <input
              id="signup-confirm"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setConfirmError(''); }}
              placeholder="••••••••••"
              aria-label="Confirm password"
              className={`w-full px-4 py-3 pr-11 bg-zinc-900/80 border rounded-xl text-zinc-100 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                confirmError
                  ? 'border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/15'
                  : confirmPassword && confirmPassword === password
                  ? 'border-emerald-500/40 focus:border-emerald-500/40 focus:ring-emerald-500/15'
                  : 'border-white/[0.08] focus:border-indigo-500/50 focus:ring-indigo-500/15'
              }`}
            />
            <button
              type="button"
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              <EyeIcon open={showConfirm} />
            </button>
          </div>
          {confirmError && (
            <p className="text-xs text-rose-400 animate-in fade-in duration-200">{confirmError}</p>
          )}
          {!confirmError && confirmPassword && confirmPassword === password && (
            <p className="text-xs text-emerald-400 flex items-center gap-1 animate-in fade-in duration-200">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Passwords match
            </p>
          )}
        </div>

        {/* Accept Terms */}
        <label className="flex items-start gap-2.5 cursor-pointer group select-none">
          <div className="relative mt-0.5">
            <div
              onClick={() => setAcceptTerms(!acceptTerms)}
              className={`w-4 h-4 rounded-[4px] border transition-all duration-200 flex items-center justify-center cursor-pointer shrink-0 ${
                acceptTerms
                  ? 'bg-indigo-600 border-indigo-600'
                  : 'bg-zinc-900 border-white/[0.12] group-hover:border-zinc-600'
              }`}
            >
              {acceptTerms && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-xs text-zinc-400 leading-relaxed">
            I agree to the{' '}
            <a href="#terms" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#privacy" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Privacy Policy
            </a>
          </span>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !acceptTerms}
          aria-label="Create workspace"
          className="w-full py-3.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2.5 group cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Creating Workspace…</span>
            </>
          ) : (
            <>
              <span>Create Workspace</span>
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/[0.07]" />
        <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">or</span>
        <div className="flex-1 h-px bg-white/[0.07]" />
      </div>

      {/* Secondary Button: Continue as Guest */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={onGuestLogin}
          disabled={loading}
          aria-label="Continue as Guest"
          className="w-full py-3.5 px-5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/[0.2] text-zinc-100 font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer group hover:-translate-y-0.5 shadow-md shadow-black/40"
        >
          <svg className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Continue as Guest</span>
        </button>
        <p className="text-[11px] text-center text-zinc-500 font-normal">
          Explore the full application instantly.
        </p>
      </div>

      {/* Switch to Login */}
      <p className="text-center text-sm text-zinc-500 pt-1">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors cursor-pointer"
        >
          Sign in
        </button>
      </p>
    </div>
  );
};

export default SignupForm;

