import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ESCAPE_GAME_LIST } from '../../data/escapeGames';
import useEscapeGameStore from '../../store/escapeGameStore';

const CITY_CONFIG = {
  taipei: {
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="6.5" cy="13" r="3.5" strokeWidth={1.8} />
        <circle cx="17.5" cy="13" r="3.5" strokeWidth={1.8} />
        <path strokeLinecap="round" strokeWidth={1.8} d="M10 13h4" />
        <path strokeLinecap="round" strokeWidth={1.8} d="M2 11l2-3M22 11l-2-3" />
      </svg>
    ),
    accentColor: '#1f2937',
    bgPattern: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)',
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
  const navigate = useNavigate();
  const progress = useEscapeGameStore((s) => s.progress);
  const resetCity = useEscapeGameStore((s) => s.resetCity);
  const [confirmCityId, setConfirmCityId] = useState(null);

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
      <div className="container mx-auto px-6 pt-6 pb-4 text-center">
        <div className="inline-block mb-3">
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-5 py-1.5 rounded-full text-xs font-bold shadow-lg">
            ✨ 獨家互動體驗
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
          城市逃脫遊戲
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          不只是旅遊，而是一場<span className="text-orange-600 font-bold">沉浸式冒險</span>
        </p>
      </div>

      {/* Cards */}
      <div className="container mx-auto px-6 pb-8">
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent flex-1 max-w-xs" />
          <span className="text-orange-600 font-medium text-sm">選擇你的冒險</span>
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
                <div className="relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                  style={{ background: game.theme.gradient }}>
                    {/* Bg pattern overlay */}
                    <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: config.bgPattern }} />


                    {/* Horizontal layout: info left, icon right */}
                    <div className="relative z-10 p-5 flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-white/90 text-gray-800 px-3 py-0.5 rounded-full text-xs font-bold">
                            {game.city}
                          </div>
                          {isCompleted && (
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              已完成
                            </div>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1 leading-tight">{game.title}</h3>
                        <p className="text-sm text-white/80 leading-snug">{game.subtitle}</p>
                      </div>
                      <div className="flex-shrink-0 w-14 h-14 text-white/90 group-hover:scale-110 transition-transform duration-500">
                        {config.icon}
                      </div>
                    </div>

                    {/* Meta + progress + CTA on white */}
                    <div className="relative z-10 bg-white p-4">
                      <div className="flex flex-wrap gap-3 mb-3">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>難度 {game.difficulty}/5</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {game.estimatedTime}
                        </div>
                      </div>

                      {/* Progress slot — always reserves height for consistent card layout */}
                      <div className="mb-3 h-9">
                        {isStarted && (
                          <>
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>遊戲進度</span>
                              <span className="font-semibold">{completedCount}/{total}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(completedCount / total) * 100}%`, backgroundColor: config.accentColor }} />
                            </div>
                          </>
                        )}
                      </div>

                      {isCompleted ? (
                        <div className="grid grid-cols-2 gap-2">
                          <Link to={`/escape-game/${game.id}/complete`}
                            className="py-2.5 rounded-full font-bold text-center transition-all duration-300 text-xs flex items-center justify-center gap-1"
                            style={{ backgroundColor: `${config.accentColor}20`, color: config.accentColor, border: `2px solid ${config.accentColor}` }}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            查看回顧
                          </Link>
                          <button
                            onClick={() => setConfirmCityId(game.id)}
                            className="py-2.5 rounded-full font-bold text-center transition-all duration-300 text-xs flex items-center justify-center gap-1"
                            style={{ backgroundColor: config.accentColor, color: '#fff' }}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            重新開始
                          </button>
                        </div>
                      ) : (
                        <Link to={`/escape-game/${game.id}`}
                          className="w-full py-2.5 rounded-full font-bold text-center transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3 text-sm"
                          style={{ backgroundColor: config.accentColor, color: '#fff' }}>
                          {isStarted ? '繼續冒險' : '開始冒險'}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
            );
          })}
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-500 text-xs">
            提示：每個遊戲都需要實地前往景點拍照才能解鎖下一關
          </p>
        </div>
      </div>

      {/* Custom confirm modal */}
      {confirmCityId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmCityId(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 sm:p-8 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">重新開始故事？</h3>
            <p className="text-gray-600 text-sm mb-6">你目前的進度會被清除，這個動作無法復原。</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmCityId(null)}
                className="flex-1 py-3 rounded-full font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all">
                取消
              </button>
              <button
                onClick={() => {
                  resetCity(confirmCityId);
                  const id = confirmCityId;
                  setConfirmCityId(null);
                  navigate(`/escape-game/${id}`);
                }}
                className="flex-1 py-3 rounded-full font-bold bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white transition-all shadow-lg">
                確定重新開始
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
