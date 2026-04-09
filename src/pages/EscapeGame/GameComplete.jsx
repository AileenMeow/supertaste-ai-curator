import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ESCAPE_GAMES } from '../../data/escapeGames';
import useEscapeGameStore from '../../store/escapeGameStore';

export default function GameComplete() {
  const { city } = useParams();
  const navigate = useNavigate();
  const game = ESCAPE_GAMES[city];
  const getCityProgress = useEscapeGameStore((s) => s.getCityProgress);
  const resetCity = useEscapeGameStore((s) => s.resetCity);

  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    if (!game) { navigate('/escape-game'); return; }
    const t = setTimeout(() => setShowBadge(true), 800);
    return () => clearTimeout(t);
  }, [game, navigate]);

  if (!game) return null;
  const cityProgress = getCityProgress(city);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: game.epilogue.achievementTitle, text: game.epilogue.shareText, url: window.location.origin });
    } else {
      navigator.clipboard.writeText(`${game.epilogue.shareText}\n${window.location.origin}`);
      alert('已複製分享文字到剪貼簿！');
    }
  };

  const handleRestart = () => {
    if (confirm('確定要重新開始這個故事嗎？進度將會清除。')) {
      resetCity(city);
      navigate(`/escape-game/${city}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: game.theme.gradient }}>
      {/* Firework background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[
          { left: '20%', top: '30%', delay: '0s', color: '#ffd700' },
          { left: '80%', top: '20%', delay: '0.5s', color: '#ff006e' },
          { left: '50%', top: '50%', delay: '1s', color: '#00d9ff' },
          { left: '30%', top: '70%', delay: '1.5s', color: '#9d00ff' },
          { left: '70%', top: '60%', delay: '2s', color: '#ffb300' },
        ].map((f, i) => (
          <div key={i} className="firework" style={{ left: f.left, top: f.top, animationDelay: f.delay, background: `radial-gradient(circle, #fff, ${f.color})` }} />
        ))}
      </div>

      <div className="max-w-3xl w-full relative z-10">
        <div className="bg-black/80 backdrop-blur-xl rounded-3xl p-6 md:p-12 border-2 border-white/20 shadow-2xl">
          {/* Header celebration */}
          <div className="text-center mb-8">
            <div className="inline-block" style={{ animation: 'bounce-slow 2s ease-in-out infinite' }}>
              <div className="text-7xl sm:text-8xl mb-4">🎉</div>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2">{game.epilogue.title}</h1>
            <div className="text-base sm:text-xl text-white/70">恭喜完成所有關卡！</div>
          </div>

          {/* Badge */}
          <div className={`mb-8 transition-all duration-1000 ${showBadge ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              <div className="relative z-10">
                <div className="text-5xl sm:text-6xl mb-3">🏆</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 drop-shadow-lg">{game.epilogue.achievementTitle}</h2>
                <div className="text-white/90 text-sm font-medium">已解鎖專屬徽章</div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white/5 backdrop-blur rounded-xl p-5 sm:p-6 mb-6 border border-white/10">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              你的成就
            </h3>
            <div className="space-y-3">
              {game.epilogue.achievements.map((a, i) => (
                <div key={i} className="flex items-start gap-3 text-white/90" style={{ animation: `slideInLeft 0.5s ease-out ${i * 0.1}s both` }}>
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{a}</span>
                </div>
              ))}
            </div>
            {game.epilogue.specialRewards && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-base sm:text-lg font-bold text-yellow-400 mb-3">🎁 特殊獎勵</h4>
                <div className="space-y-2">
                  {game.epilogue.specialRewards.map((r, i) => (
                    <div key={i} className="text-white/80 text-sm">{r}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          {cityProgress && (
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
              <div className="bg-white/5 backdrop-blur rounded-xl p-4 text-center border border-white/10">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{game.missions.length}</div>
                <div className="text-white/70 text-xs sm:text-sm">完成關卡</div>
              </div>
              <div className="bg-white/5 backdrop-blur rounded-xl p-4 text-center border border-white/10">
                <div className="text-base sm:text-3xl font-bold text-white mb-1">{game.estimatedTime}</div>
                <div className="text-white/70 text-xs sm:text-sm">冒險時間</div>
              </div>
              <div className="bg-white/5 backdrop-blur rounded-xl p-4 text-center border border-white/10">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">100%</div>
                <div className="text-white/70 text-xs sm:text-sm">完成度</div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-3">
            <button onClick={handleShare}
              className="w-full py-4 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${game.theme.primaryColor}, ${game.theme.accentColor})`, boxShadow: `0 0 30px ${game.theme.primaryColor}80` }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              分享成就
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleRestart} className="py-3 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white transition-all duration-300 border border-white/20">
                🔄 重新開始
              </button>
              <Link to="/escape-game" className="py-3 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white transition-all duration-300 text-center border border-white/20">
                🎮 其他城市
              </Link>
            </div>
            <Link to="/" className="block w-full text-center text-white/70 hover:text-white transition py-2">← 回到首頁</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
