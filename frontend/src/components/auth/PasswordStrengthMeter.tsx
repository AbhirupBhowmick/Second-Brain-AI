import React, { useEffect, useState } from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

const getStrength = (pw: string): { score: number; label: string; color: string; bg: string } => {
  if (!pw) return { score: 0, label: '', color: '', bg: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 2) return { score, label: 'Weak', color: 'bg-rose-500', bg: 'text-rose-400' };
  if (score <= 3) return { score, label: 'Medium', color: 'bg-amber-400', bg: 'text-amber-400' };
  return { score, label: 'Strong', color: 'bg-emerald-500', bg: 'text-emerald-400' };
};

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const strength = getStrength(password);
  const [capsLock, setCapsLock] = useState(false);

  useEffect(() => {
    const detectCaps = (e: KeyboardEvent) => {
      setCapsLock(e.getModifierState?.('CapsLock') ?? false);
    };
    window.addEventListener('keydown', detectCaps);
    window.addEventListener('keyup', detectCaps);
    return () => {
      window.removeEventListener('keydown', detectCaps);
      window.removeEventListener('keyup', detectCaps);
    };
  }, []);

  if (!password) return null;

  const filledBars = Math.ceil((strength.score / 5) * 3);

  return (
    <div className="space-y-2 animate-in fade-in duration-200">
      {/* Strength Bars */}
      <div className="flex gap-1.5">
        {[1, 2, 3].map((bar) => (
          <div
            key={bar}
            className="h-1 flex-1 rounded-full transition-all duration-400"
            style={{
              background: bar <= filledBars ? undefined : 'rgba(255,255,255,0.08)',
            }}
          >
            {bar <= filledBars && (
              <div
                className={`h-full w-full rounded-full transition-all duration-500 ${strength.color}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Label & Caps Lock */}
      <div className="flex items-center justify-between">
        {strength.label && (
          <span className={`text-xs font-medium ${strength.bg}`}>
            {strength.label} password
          </span>
        )}
        {capsLock && (
          <span className="text-xs text-amber-400 flex items-center gap-1 ml-auto">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Caps Lock on
          </span>
        )}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
