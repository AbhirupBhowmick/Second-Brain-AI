import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';
import { useGoogleLogin } from '@react-oauth/google';

const NeuralBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    const particleCount = 40;

    const resize = () => {
      canvas.width = window.innerWidth / 2;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.1)';

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.lineWidth = 1 - dist / 150;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    createParticles();
    animate();

    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40 pointer-events-none" />;
};

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const brainRef = useRef<HTMLImageElement>(null);
  const sideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (brainRef.current) {
      gsap.to(brainRef.current, {
        y: -30,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });

      gsap.to(brainRef.current, {
        rotateY: 20,
        rotateX: 10,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, []);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await axios.post('http://localhost:8080/api/auth/google', {
          token: tokenResponse.access_token
        });
        login(res.data);
        navigate('/');
      } catch (err: any) {
        setError('Google authentication failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Google login was interrupted.')
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    try {
      const response = await axios.post(`http://localhost:8080${endpoint}`, {
        email,
        password
      });
      if (isLogin) {
        login(response.data);
        navigate('/');
      } else {
        setIsLogin(true);
        setError('Account created! Please sign in.');
      }
    } catch (err: any) {
      setError(err.response?.data || 'Operation failed. Server may be starting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#05080f] overflow-hidden font-body selection:bg-primary/30">
      <div className="flex flex-col lg:flex-row w-full min-h-screen relative overflow-y-auto">
        <div ref={sideRef} className="w-full lg:w-1/2 min-h-[500px] lg:min-h-screen relative flex flex-col p-12 overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5 bg-[#05080f] perspective-1000">
          <NeuralBackground />
          <div className="relative z-20">
            <div className="flex items-center gap-3 mb-4 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.2)] transition-all">
                <span className="material-symbols-outlined text-primary text-2xl">hub</span>
              </div>
              <span className="font-headline font-bold text-2xl tracking-wider text-white">Second Brain AI</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center relative z-10">
            <div className="w-full max-w-xl aspect-square relative flex items-center justify-center">
              <div className="absolute w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
              <img 
                ref={brainRef}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuATqw2r81LwXWe9cjlyaJ0ZV3DYw-Z8Lh2GSFl0D5TlJr-W7V2mVv9SAO2iZwRH2ZFWBH3XQLyxH7z6-SBg8AesCcR8LB_L1jEscI0Rr_U85hX1olOWuwjdUqMDL8ctpuJAbbZS6yTlE8iVRiwtYtdy3Di7jwFpmR3d8lgndZsUj-_xUXQioO8gWICIAJibSH-V0_o6aQ-1BJVkNuH766owEhmDnSrh-PcZykKTO44xW4KINEQLrMKwLJKawekbbo2Gi2THtLyivRI" 
                alt="Neural Brain" 
                className="w-full h-full object-contain relative z-10 mix-blend-screen scale-110 contrast-[1.1] brightness-[1.1] [mask-image:radial-gradient(circle,black_50%,transparent_75%)]"
              />
            </div>
            <div className="max-w-lg text-center mt-4 relative z-20">
              <h1 className="font-headline font-bold text-5xl mb-6 text-white leading-[1.1] tracking-tight">
                Architecting Your <br/>
                <span className="bg-gradient-to-r from-sky-400 via-primary to-emerald-400 bg-clip-text text-transparent">Cognitive Horizon</span>
              </h1>
              <p className="text-slate-400 text-xl font-light leading-relaxed max-w-[90%] mx-auto">
                A non-linear workspace that thinks with you.
              </p>
            </div>
          </div>
          <div className="relative z-20 mt-auto opacity-30 text-[10px] uppercase tracking-[0.3em] text-primary flex items-center gap-4">
             <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary"></div>
             Neural Synthesis Engine v1.0
             <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary"></div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-[#05080f] relative z-20">
          <div className="w-full max-w-md relative">
            <div className="absolute inset-0 bg-primary/5 blur-[120px] pointer-events-none"></div>
            <div className="glass-panel-elevated w-full rounded-[2.5rem] p-6 lg:p-10 relative z-10 border border-white/5 bg-[#0a0f1a]/40 shadow-2xl overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
              <div className="text-center mb-8">
                <h2 className="font-headline font-bold text-2xl lg:text-3xl text-white mb-3 tracking-tight">
                  {isLogin ? 'Welcome Back' : 'Join the Nexus'}
                </h2>
                <p className="text-slate-400 text-sm lg:text-base font-light">
                  {isLogin ? 'Resume your cognitive workflow' : 'Initialize your personal neural network'}
                </p>
              </div>
              
              {error && (
                <div className={`text-sm p-4 rounded-2xl mb-8 flex items-center gap-3 animate-in fade-in zoom-in-95 duration-500 ${error.includes('created') ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                  <span className="material-symbols-outlined text-lg">{error.includes('created') ? 'check_circle' : 'error'}</span>
                  {error}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2 group">
                  <label className="block text-xs uppercase tracking-widest font-semibold text-slate-500 ml-1 group-focus-within:text-primary transition-colors" htmlFor="email">Neural ID</label>
                  <input 
                    className="w-full px-5 py-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-primary/40 focus:bg-white/[0.04] transition-all text-base shadow-inner" 
                    id="email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@neural.link"
                  />
                </div>
                <div className="space-y-2 group">
                  <label className="block text-xs uppercase tracking-widest font-semibold text-slate-500 ml-1 group-focus-within:text-primary transition-colors" htmlFor="password">Passphrase</label>
                  <input 
                    className="w-full px-5 py-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-primary/40 focus:bg-white/[0.04] transition-all text-base shadow-inner" 
                    id="password" required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <button className="w-full py-4 px-6 bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(56,189,248,0.1)] active:scale-[0.98]" type="submit" disabled={loading}>
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>{isLogin ? 'Authorize Session' : 'Create Identity'}</span>
                      <span className="material-symbols-outlined text-xl">bolt</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-white/5 space-y-6">
                <div className="flex flex-col items-center gap-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Or continue with</p>
                  <button 
                    onClick={() => googleLogin()}
                    className="w-full py-4 px-6 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5" alt="Google"/>
                    <span>Google Authentication</span>
                  </button>
                </div>
                <div className="text-center">
                  <button onClick={() => setIsLogin(!isLogin)} className="text-xs uppercase tracking-widest text-slate-500 hover:text-primary font-bold transition-all">
                    {isLogin ? 'Initialize New Account' : 'Return to Authorization'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
