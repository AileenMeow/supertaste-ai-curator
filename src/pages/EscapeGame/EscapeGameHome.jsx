import { Link } from 'react-router-dom';
import { ESCAPE_GAME_LIST } from '../../data/escapeGames';
import useEscapeGameStore from '../../store/escapeGameStore';

// City icons (SVG, no emoji)
const CityIcon = ({ city }) => {
  if (city === 'taipei') {
    // Cyber building / antenna
    return (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 21V9l3-6 3 6v12M9 21h6M9 13h6M9 17h6M12 3v6" />
      </svg>
    );
  }
  if (city === 'tainan') {
    // Hourglass / time
    return (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 3h12M6 21h12M6 3v3a6 6 0 006 6 6 6 0 006-6V3M6 21v-3a6 6 0 016-6 6 6 0 016 6v3" />
      </svg>
    );
  }
  // hualien — mountains
  return (
    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 20l5-9 4 6 3-4 6 7H3z" />
      <circle cx="17" cy="6" r="2" strokeWidth={1.5} />
    </svg>
  );
};

export default function EscapeGameHome() {
  const progress = useEscapeGameStore((s) => s.progress);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      <header className="p-6 border-b border-purple-700/30 backdrop-blur">
        <Link to="/" className="text-white/70 hover:text-white transition flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          回首頁
        </Link>
      </header>

      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block mb-6">
          <svg className="w-20 h-20 mx-auto text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">城市逃脫遊戲</h1>
        <p className="text-lg sm:text-xl text-purple-200">選擇你的冒險故事，解謎、探索、發現真相</p>
      </div>

      <div className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {ESCAPE_GAME_LIST.map((game) => {
            const cp = progress[game.id];
            const isStarted = !!cp;
            const isCompleted = cp?.completedAt;
            const completedCount = cp?.completedMissions?.length || 0;
            const total = game.missions.length;

            return (
              <Link
                key={game.id}
                to={`/escape-game/${game.id}`}
                className="group relative overflow-hidden rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white/10 hover:border-white/30"
                style={{ background: game.theme.gradient }}
              >
                {isCompleted && (
                  <div className="absolute top-4 right-4 z-10 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                    ✓ 已完成
                  </div>
                )}
                <div className="p-8 relative z-10">
                  <div className="text-white mb-4 opacity-80 group-hover:opacity-100 transition">
                    <CityIcon city={game.id} />
                  </div>
                  <div className="inline-block bg-white/20 backdrop-blur text-white px-3 py-1 rounded-full text-sm mb-3 font-medium">
                    {game.city}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{game.title}</h2>
                  <p className="text-white/80 mb-4">{game.subtitle}</p>
                  <div className="flex items-center gap-4 text-sm text-white/70 mb-4 flex-wrap">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      難度 {game.difficulty}/5
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {game.estimatedTime}
                    </span>
                  </div>
                  {isStarted && !isCompleted && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-white/80 mb-1">
                        <span>進度</span>
                        <span>{completedCount}/{total}</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                        <div className="bg-white h-2 rounded-full transition-all duration-500" style={{ width: `${(completedCount / total) * 100}%` }} />
                      </div>
                    </div>
                  )}
                  <div className="mt-6">
                    <span className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-2 rounded-full font-bold group-hover:bg-yellow-300 transition">
                      {isCompleted ? '重新體驗' : isStarted ? '繼續冒險' : '開始冒險'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition pointer-events-none" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
