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

  const [showCelebration, setShowCelebration] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);

  useEffect(() => {
    if (!game) { navigate('/escape-game'); return; }
    window.scrollTo(0, 0);
    const t1 = setTimeout(() => setShowContent(true), 400);
    const t2 = setTimeout(() => setShowCelebration(false), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [game, navigate]);

  if (!game) return null;

  const cityProgress = getCityProgress(city);
  const uploadedPhotos = cityProgress?.uploadedPhotos || {};

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: game.epilogue.achievementTitle, text: game.epilogue.shareText, url: window.location.origin });
    } else {
      navigator.clipboard.writeText(`${game.epilogue.shareText}\n${window.location.origin}`);
      alert('已複製分享文字到剪貼簿！');
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: game.theme.gradient }}>
      {/* Fireworks */}
      {showCelebration && (
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
      )}

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-6xl">
        <div className={`transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <svg className="w-20 h-20 mx-auto text-yellow-400 animate-pulse-slow" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 drop-shadow-2xl">{game.epilogue.title}</h1>
            <p className="text-lg sm:text-xl text-white/80">恭喜完成所有關卡</p>
          </div>

          {/* Achievement Badge */}
          <div className="mb-12">
            <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-3xl p-1 shadow-2xl">
              <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 md:p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                <div className="relative z-10 text-center">
                  <div className="inline-block mb-4">
                    <svg className="w-20 h-20 sm:w-24 sm:h-24 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">{game.epilogue.achievementTitle}</h2>
                  <p className="text-white/80">已解鎖專屬認證</p>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Wall */}
          <div className="mb-12">
            <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                冒險回顧
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {game.missions.map((mission, index) => {
                  const photo = uploadedPhotos[mission.id];
                  return (
                    <div key={mission.id}
                      className="group relative aspect-square rounded-xl overflow-hidden border-2 border-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105"
                      style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}>
                      {photo ? (
                        <>
                          <img src={photo.url} alt={`關卡 ${mission.missionNumber}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                            <div className="text-white font-bold text-sm mb-1">關卡 {String(mission.missionNumber).padStart(2, '0')}</div>
                            <div className="text-white/80 text-xs line-clamp-2">{mission.title}</div>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-black/70 backdrop-blur text-white px-2 py-1 rounded-lg text-xs font-bold">
                        {String(mission.missionNumber).padStart(2, '0')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Story Recap */}
          <div className="mb-12">
            <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                故事回顧
              </h3>
              <div className="space-y-4">
                {game.missions.map((mission, index) => (
                  <div key={mission.id}
                    className="bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10 hover:bg-white/10 transition-all"
                    style={{ animation: `slideInLeft 0.6s ease-out ${index * 0.1}s both` }}>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white"
                        style={{ background: `linear-gradient(135deg, ${game.theme.primaryColor}, ${game.theme.accentColor})` }}>
                        {String(mission.missionNumber).padStart(2, '0')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-bold text-base sm:text-lg mb-2">{mission.title}</h4>
                        <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {mission.location}
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed">
                          {mission.unlockStory.split('\n').filter(l => l.trim()).slice(0, 3).join(' ').substring(0, 180)}...
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements + Stats */}
          <div className="mb-12">
            <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                成就解鎖
              </h3>
              <div className="space-y-3 mb-8">
                {game.epilogue.achievements.map((a, i) => (
                  <div key={i} className="flex items-start gap-3" style={{ animation: `slideInLeft 0.5s ease-out ${i * 0.1}s both` }}>
                    <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white/90 flex-1">{a}</span>
                  </div>
                ))}
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{game.missions.length}</div>
                  <div className="text-white/70 text-sm">完成關卡</div>
                </div>
                <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
                  <div className="text-2xl sm:text-4xl font-bold text-white mb-2">{game.estimatedTime}</div>
                  <div className="text-white/70 text-sm">冒險時間</div>
                </div>
                <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-2">100%</div>
                  <div className="text-white/70 text-sm">完成度</div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-4">
            <button onClick={handleShare}
              className="w-full py-4 rounded-2xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105 shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${game.theme.primaryColor}, ${game.theme.accentColor})`, boxShadow: `0 10px 40px ${game.theme.primaryColor}60` }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              分享成就
            </button>
            <div className="grid md:grid-cols-2 gap-4">
              <button onClick={() => setShowRestartConfirm(true)}
                className="py-4 rounded-2xl font-bold bg-white/10 hover:bg-white/20 text-white transition-all duration-300 border border-white/20 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                重新開始
              </button>
              <Link to="/escape-game"
                className="py-4 rounded-2xl font-bold bg-white/10 hover:bg-white/20 text-white transition-all duration-300 text-center border border-white/20 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                其他城市
              </Link>
            </div>
            <Link to="/" className="block w-full text-center text-white/70 hover:text-white transition py-3">回到首頁</Link>
          </div>
        </div>
      </div>

      {/* Custom restart confirm modal */}
      {showRestartConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowRestartConfirm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 sm:p-8 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">重新開始故事？</h3>
            <p className="text-gray-600 text-sm mb-6">你目前的進度會被清除，這個動作無法復原。</p>
            <div className="flex gap-3">
              <button onClick={() => setShowRestartConfirm(false)}
                className="flex-1 py-3 rounded-full font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all">
                取消
              </button>
              <button
                onClick={() => { resetCity(city); setShowRestartConfirm(false); navigate(`/escape-game/${city}`); }}
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
