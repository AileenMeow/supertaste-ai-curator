import { useState, useEffect } from 'react';
import { HdLock, HdInfo } from './icons/HandDrawn';

const STORAGE_KEY = 'supertaste_gate_v1';
const PASSWORD = 'tvbs2026';

export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === 'ok') setUnlocked(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === PASSWORD) {
      localStorage.setItem(STORAGE_KEY, 'ok');
      setUnlocked(true);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  if (unlocked) return children;

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 22%, #FFB347 48%, #FFE66D 75%, #FFF8E7 100%)' }}>
      <div className={`bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 sm:p-10 ${shake ? 'animate-gate-shake' : 'fade-in-up'}`}>
        {/* Lock icon */}
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 rounded-2xl bg-orange-50 flex items-center justify-center">
            <HdLock size={56} color="#FF7847" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-black text-center text-gray-900 mb-2">食尚玩家 AI 導遊</h1>
        <p className="text-center text-gray-500 text-sm mb-8">內部評審 Demo · 請輸入密碼</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); if (error) setError(false); }}
            placeholder="請輸入評審密碼"
            autoFocus
            className={`w-full px-5 py-4 rounded-2xl border-2 text-lg text-center transition-all outline-none ${
              error
                ? 'border-red-400 bg-red-50 text-red-700 focus:border-red-500'
                : 'border-gray-200 focus:border-[#FF7847] focus:bg-orange-50/40 focus:shadow-[0_0_0_4px_rgba(255,120,71,0.15)]'
            }`}
          />
          {error && (
            <p className="text-red-500 text-sm text-center font-medium">密碼錯誤，請再試一次</p>
          )}

          <button type="submit"
            className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#E04400] hover:to-[#FF6B35] text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
            進入 Demo
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </form>

        {/* Notice */}
        <div className="mt-6 flex items-start gap-2 text-gray-500 text-xs leading-relaxed">
          <div className="flex-shrink-0 mt-0.5">
            <HdInfo size={14} color="#9ca3af" />
          </div>
          <p>這是內部評審版本，內容含食尚玩家授權資料與 AI 整合，請勿外流分享。</p>
        </div>
      </div>

      {/* Shake animation */}
      <style>{`
        @keyframes gate-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-12px); }
          40% { transform: translateX(12px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
        .animate-gate-shake { animation: gate-shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}
