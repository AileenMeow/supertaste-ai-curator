import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ESCAPE_GAMES } from '../../data/escapeGames';
import useEscapeGameStore from '../../store/escapeGameStore';

export default function GameComplete() {
  const { city } = useParams();
  const navigate = useNavigate();
  const game = ESCAPE_GAMES[city];
  const getCityProgress = useEscapeGameStore((s) => s.getCityProgress);

  useEffect(() => { if (!game) navigate('/escape-game'); }, [game, navigate]);
  if (!game) return null;

  const cityProgress = getCityProgress(city);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: game.epilogue.achievementTitle, text: game.epilogue.shareText, url: window.location.href });
    } else {
      navigator.clipboard.writeText(`${game.epilogue.shareText}\n${window.location.href}`);
      alert('已複製分享文字到剪貼簿！');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: game.theme.gradient }}>
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8 animate-bounce">
          <div className="text-7xl sm:text-8xl mb-4">🎉</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">{game.epilogue.title}</h1>
        </div>

        <div className="bg-black/50 backdrop-blur rounded-2xl p-6 sm:p-8 mb-6 border-2" style={{ borderColor: game.theme.primaryColor }}>
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{game.epilogue.achievementTitle}</h2>
          </div>

          <div className="space-y-3 mb-6">
            {game.epilogue.achievements.map((a, i) => (
              <div key={i} className="text-white/90 text-base sm:text-lg">{a}</div>
            ))}
          </div>

          {game.epilogue.specialRewards && (
            <div className="border-t border-white/20 pt-6 mt-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3">特殊獎勵：</h3>
              <div className="space-y-2">
                {game.epilogue.specialRewards.map((r, i) => (
                  <div key={i} className="text-white/80">{r}</div>
                ))}
              </div>
            </div>
          )}

          {cityProgress && (
            <div className="border-t border-white/20 pt-6 mt-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-white">{game.missions.length}</div>
                  <div className="text-white/70 text-sm">完成關卡</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">{game.estimatedTime}</div>
                  <div className="text-white/70 text-sm">冒險時間</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button onClick={handleShare} className="w-full py-4 rounded-full font-bold text-white transition" style={{ backgroundColor: game.theme.accentColor }}>
            📢 分享成就
          </button>
          <Link to="/escape-game" className="block w-full py-4 rounded-full font-bold text-center text-white transition" style={{ backgroundColor: game.theme.primaryColor }}>
            🎮 挑戰其他城市
          </Link>
          <Link to="/" className="block w-full text-center text-white/70 hover:text-white transition py-2">← 回到首頁</Link>
        </div>
      </div>
    </div>
  );
}
