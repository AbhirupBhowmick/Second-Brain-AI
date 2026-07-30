import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';
import AuthVisualization from './auth/AuthVisualization';
import LoginForm from './auth/LoginForm';
import SignupForm from './auth/SignupForm';
import { getApiUrl } from '../config/api';

// ─── Subtle background: tiny animated dots on dark graphite ───────────────────
const AuthBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const dots: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    for (let i = 0; i < 45; i++) {
      dots.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.2 + 0.4,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};

// ─── Success Overlay ──────────────────────────────────────────────────────────
const SuccessOverlay: React.FC = () => (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#09090b]/80 backdrop-blur-sm animate-in fade-in duration-400 rounded-2xl">
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center animate-in zoom-in-75 duration-300">
        <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p className="text-sm font-medium text-zinc-300">Entering your workspace…</p>
    </div>
  </div>
);

// ─── Main Auth Component ───────────────────────────────────────────────────────
export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { login, loginAsGuest } = useAuth();
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);

  // Entrance animation for auth card
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, []);

  // Animate card when switching between login/signup
  const switchView = (toLogin: boolean) => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        opacity: 0,
        y: 12,
        duration: 0.18,
        ease: 'power2.in',
        onComplete: () => {
          setIsLogin(toLogin);
          setError('');
          gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }
          );
        },
      });
    } else {
      setIsLogin(toLogin);
      setError('');
    }
  };

  // ─── Guest Login ─────────────────────────────────────────────────────────────
  const handleGuestLogin = () => {
    setLoading(true);
    setError('');
    loginAsGuest();
    setSuccess(true);
    setTimeout(() => navigate('/dashboard'), 600);
  };

  // ─── Email / Password submit ─────────────────────────────────────────────────
  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(getApiUrl('/api/auth/login'), {
        email,
        password,
      });
      login(response.data, { email });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 600);
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 404) {
        setError('Incorrect email or password. Please try again.');
      } else {
        // Backend unavailable / network error -> fall back gracefully to Demo Mode instead of blocking user
        console.warn('Backend authentication unavailable, falling back to Demo Workspace.');
        loginAsGuest();
        setSuccess(true);
        setTimeout(() => navigate('/dashboard'), 600);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (email: string, password: string, fullName?: string) => {
    setLoading(true);
    setError('');
    try {
      await axios.post(getApiUrl('/api/auth/register'), {
        email,
        password,
        fullName,
      });
      setError('Account created! Please sign in.');
      switchView(true);
    } catch (err: any) {
      const msg = err.response?.data;
      if (err.response?.status === 409) {
        setError('An account with this email already exists.');
      } else if (!err.response) {
        // Fallback to guest mode
        loginAsGuest();
        setSuccess(true);
        setTimeout(() => navigate('/dashboard'), 600);
      } else {
        setError(msg || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#09090b] overflow-hidden flex selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Back to Home Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 lg:left-8 z-30 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-pointer shadow-md group backdrop-blur-md"
      >
        <svg
          className="w-4 h-4 text-zinc-400 group-hover:text-indigo-400 transition-transform duration-200 group-hover:-translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Home</span>
      </button>

      {/* Subtle animated dots background */}
      <AuthBackground />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 subtle-grid-bg opacity-25 pointer-events-none z-0" />

      {/* ─── Left Visualization Panel (desktop only, 60%) ──────────────────── */}
      <AuthVisualization />

      {/* ─── Right Auth Panel (40% desktop, full on mobile) ───────────────── */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full lg:w-[42%] xl:w-[40%] min-h-screen px-6 sm:px-10 py-16">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-indigo-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 3a9 9 0 0 0-9 9" />
              <path d="M21 12a9 9 0 0 0-9-9" />
              <path d="M12 21a9 9 0 0 0 9-9" />
            </svg>
          </div>
          <span className="font-display text-lg font-bold text-zinc-100 tracking-tight">
            Second Brain <span className="text-indigo-400 font-medium">AI</span>
          </span>
        </div>

        {/* Auth Card */}
        <div
          ref={cardRef}
          className="relative w-full max-w-[420px] bg-zinc-900/60 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 shadow-2xl shadow-black/60"
        >
          {/* Success overlay */}
          {success && <SuccessOverlay />}

          {isLogin ? (
            <LoginForm
              onSubmit={handleLogin}
              onGuestLogin={handleGuestLogin}
              onSwitchToSignup={() => switchView(false)}
              loading={loading}
              error={error}
            />
          ) : (
            <SignupForm
              onSubmit={handleSignup}
              onGuestLogin={handleGuestLogin}
              onSwitchToLogin={() => switchView(true)}
              loading={loading}
              error={error}
            />
          )}
        </div>

        {/* Footer note */}
        <p className="mt-8 text-[11px] text-zinc-600 font-mono text-center">
          Protected by JWT authentication · Local-first encryption
        </p>
      </div>
    </div>
  );
};

export default Auth;

