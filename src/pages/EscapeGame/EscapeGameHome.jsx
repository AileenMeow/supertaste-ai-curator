import { Link } from 'react-router-dom';
import { ESCAPE_GAME_LIST } from '../../data/escapeGames';
import useEscapeGameStore from '../../store/escapeGameStore';

const CITY_CONFIG = {
  taipei: {
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 21V9l3-6 3 6v12M9 21h6M9 13h6M9 17h6M12 3v6" />
      </svg>
    ),
    accentColor: '#00D9FF',
    bgPattern: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,217,255,0.05) 10px, rgba(0,217,255,0.05) 20px)',
  },
  tainan: {
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 3h12M6 21h12M6 3v3a6 6 0 006 6 6 6 0 006-6V3M6 21v-3a6 6 0 016-6 6 6 0 016 6v3" />
      </svg>
    ),
    accentColor: '#DC143C',
    bgPattern: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(220,20,60,0.05) 10px, rgba(220,20,60,0.05) 20px)',
  },
  hualien: {
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 20l5-9 4 6 3-4 6 7H3z" />
        <circle cx="17" cy="6" r="2" strokeWidth={1.5} />
      </svg>
    ),
    accentColor: '#FFB300',
    bgPattern: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,179,0,0.05) 10px, rgba(255,179,0,0.05) 20px)',
  },
};

export default function EscapeGameHome() {
  const progress = useEscapeGameStore((s) => s.progress);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-white/80 border-b border-orange-200/50">
        <div className="container mx-auto px-6 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 transition font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            回首頁
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="container mx-auto px-6 py-16 text-center">
        <div className="inline-block mb-6">
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
            ✨ 獨家互動體驗
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
          城市逃脫遊戲
        </h1>
        <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed">
          不只是旅遊，而是一場<span className="text-orange-600 font-bold">沉浸式冒險</span>
        </p>
        <p className="text-gray-500 max-w-xl mx-auto">
          解謎、探索、發現真相 — 用遊戲的方式重新認識台灣
        </p>
      </div>

      {/* Cards */}
      <div className="container mx-auto px-6 pb-24">
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent flex-1 max-w-xs" />
          <span className="text-orange-600 font-medium">選擇你的冒險</span>
          <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent flex-1 max-w-xs" />
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {ESCAPE_GAME_LIST.map((game, index) => {
            const cp = progress[game.id];
            const isStarted = !!cp;
            const isCompleted = cp?.completedAt;
            const completedCount = cp?.completedMissions?.length || 0;
            const total = game.missions.length;
            const config = CITY_CONFIG[game.id];

            return (
              <div key={game.id} className="group relative" style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}>
                <Link to={`/escape-game/${game.id}`} className="block">
                  <div className="relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white border border-gray-100">
                    {isCompleted && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          已完成
                        </div>
                      </div>
                    )}

                    <div className="relative h-48 flex items-center justify-center overflow-hidden" style={{ background: game.theme.gradient }}>
                      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: config.bgPattern }} />
                      <div className="relative z-10 w-24 h-24 text-white/90 group-hover:scale-110 transition-transform duration-500">
                        {config.icon}
                      </div>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background: `radial-gradient(circle at center, ${config.accentColor}40 0%, transparent 70%)` }} />
                    </div>

                    <div className="p-6">
                      <div className="inline-block mb-3">
                        <div className="text-white px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: config.accentColor }}>
                          {game.city}
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition">{game.title}</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">{game.subtitle}</p>

                      <div className="flex flex-wrap gap-3 mb-4">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>難度 {game.difficulty}/5</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {game.estimatedTime}
                        </div>
                      </div>

                      {isStarted && !isCompleted && (
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-gray-500 mb-2">
                            <span>遊戲進度</span>
                            <span className="font-semibold">{completedCount}/{total}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(completedCount / total) * 100}%`, backgroundColor: config.accentColor }} />
                          </div>
                        </div>
                      )}

                      <div className="pt-2">
                        <div className="w-full py-3 rounded-full font-bold text-center transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3"
                          style={{ backgroundColor: config.accentColor, color: '#fff' }}>
                          {isCompleted ? '重新體驗' : isStarted ? '繼續冒險' : '開始冒險'}
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-500 text-sm">
            提示：每個遊戲都需要實地前往景點拍照才能解鎖下一關
          </p>
        </div>
      </div>
    </div>
  );
}
