import { Link } from 'react-router-dom';
import { ESCAPE_GAME_LIST } from '../../data/escapeGames';
import useEscapeGameStore from '../../store/escapeGameStore';

const CITY_EMOJI = { taipei: '🤖', tainan: '⏰', hualien: '⚔️' };

export default function EscapeGameHome() {
  const progress = useEscapeGameStore((s) => s.progress);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      <header className="p-6 border-b border-purple-700/50">
        <Link to="/" className="text-white hover:text-purple-300 transition">← 回首頁</Link>
      </header>

      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">🔍 城市逃脫遊戲</h1>
        <p className="text-lg sm:text-xl text-purple-200">選擇你的冒險故事，解謎、探索、發現真相</p>
      </div>

      <div className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {ESCAPE_GAME_LIST.map((game) => {
            const cp = progress[game.id];
            const isCompleted = cp?.completedAt;
            const isStarted = !!cp;
            const completedCount = cp?.completedMissions?.length || 0;
            const total = game.missions.length;
            return (
              <Link
                key={game.id}
                to={`/escape-game/${game.id}`}
                className="group relative overflow-hidden rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
                style={{ background: game.theme.gradient }}
              >
                {isCompleted && (
                  <div className="absolute top-4 right-4 z-10 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-bold text-sm">
                    ✓ 已完成
                  </div>
                )}
                <div className="p-8 relative z-10">
                  <div className="text-6xl mb-4">{CITY_EMOJI[game.id]}</div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{game.title}</h2>
                  <p className="text-white/80 mb-4">{game.subtitle}</p>
                  <div className="flex items-center gap-4 text-sm text-white/70 mb-4">
                    <span>{'⭐'.repeat(game.difficulty)}</span>
                    <span>⏱️ {game.estimatedTime}</span>
                  </div>
                  {isStarted && !isCompleted && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-white/80 mb-1">
                        <span>進度</span>
                        <span>{completedCount}/{total}</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-white h-2 rounded-full transition-all" style={{ width: `${(completedCount / total) * 100}%` }} />
                      </div>
                    </div>
                  )}
                  <div className="mt-6">
                    <span className="inline-block bg-white text-gray-900 px-6 py-2 rounded-full font-bold group-hover:bg-yellow-300 transition">
                      {isCompleted ? '重新體驗' : isStarted ? '繼續冒險' : '開始冒險'} →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
