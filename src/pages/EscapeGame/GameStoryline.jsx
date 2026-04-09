import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ESCAPE_GAMES } from '../../data/escapeGames';
import useEscapeGameStore from '../../store/escapeGameStore';

// Hand-picked SVG icons for missions 1-5
const MissionIcon = ({ n }) => {
  const paths = {
    1: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    2: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    3: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
    4: 'M13 10V3L4 14h7v7l9-11h-7z',
    5: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  };
  return (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paths[n] || paths[5]} />
    </svg>
  );
};

export default function GameStoryline() {
  const { city } = useParams();
  const navigate = useNavigate();
  const game = ESCAPE_GAMES[city];
  const { initCity, getCityProgress, completeMission, completeGame } = useEscapeGameStore();

  const [showPrologue, setShowPrologue] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [currentStory, setCurrentStory] = useState('');

  useEffect(() => {
    if (!game) { navigate('/escape-game'); return; }
    const cp = getCityProgress(city);
    if (!cp) {
      initCity(city);
      setShowPrologue(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  if (!game) return null;

  const cityProgress = getCityProgress(city);
  const currentMissionIndex = cityProgress?.currentMission || 0;
  const completedMissions = cityProgress?.completedMissions || [];

  const handlePhotoUpload = (missionId, event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      completeMission(city, missionId, { url: reader.result });
      const mission = game.missions.find((m) => m.id === missionId);
      setCurrentStory(mission.unlockStory);
      setShowStoryModal(true);
      if (mission.isFinal) {
        completeGame(city);
        setTimeout(() => navigate(`/escape-game/${city}/complete`), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen" style={{ background: game.theme.gradient, fontFamily: game.theme.fontFamily }}>
      <header className="p-6 border-b border-white/10">
        <div className="container mx-auto flex justify-between items-center gap-3">
          <Link to="/escape-game" className="text-white hover:opacity-70 transition text-sm">← 返回</Link>
          <h1 className="text-base sm:text-2xl font-bold text-white text-center flex-1 truncate">{game.title}</h1>
          <div className="text-white text-sm flex-shrink-0">{completedMissions.length}/{game.missions.length}</div>
        </div>
      </header>

      {showPrologue && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setShowPrologue(false)}>
          <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 max-w-2xl w-full border-2 border-white/20 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowPrologue(false)} className="absolute top-4 right-4 text-white/50 hover:text-white transition" aria-label="關閉">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 pr-8">{game.prologue.title}</h2>
            <div className="text-white/90 whitespace-pre-line mb-6 max-h-96 overflow-y-auto text-sm sm:text-base">
              {game.prologue.content}
            </div>
            <button onClick={() => setShowPrologue(false)} className="w-full bg-white text-gray-900 py-3 rounded-full font-bold hover:bg-yellow-300 transition">
              開始任務
            </button>
          </div>
        </div>
      )}

      {showStoryModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setShowStoryModal(false)}>
          <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 max-w-2xl w-full border-2 relative" style={{ borderColor: game.theme.primaryColor }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowStoryModal(false)} className="absolute top-4 right-4 text-white/50 hover:text-white transition" aria-label="關閉">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-white/90 whitespace-pre-line mb-6 max-h-96 overflow-y-auto text-sm sm:text-base pr-8">{currentStory}</div>
            <button onClick={() => setShowStoryModal(false)} className="w-full py-3 rounded-full font-bold transition text-white" style={{ backgroundColor: game.theme.primaryColor }}>
              繼續任務
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="bg-black/30 rounded-full h-3 overflow-hidden">
          <div className="h-full transition-all duration-500" style={{ width: `${(completedMissions.length / game.missions.length) * 100}%`, backgroundColor: game.theme.primaryColor }} />
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-6">
          {game.missions.map((mission, index) => {
            const isCompleted = completedMissions.includes(mission.id);
            const isLocked = index > currentMissionIndex;
            const isCurrent = index === currentMissionIndex;
            return (
              <div
                key={mission.id}
                className={`rounded-2xl p-6 border-2 transition-all ${isLocked ? 'opacity-50' : 'hover:scale-[1.01]'}`}
                style={{
                  background: isCompleted ? 'rgba(0,0,0,0.5)' : mission.style?.cardBg || 'rgba(0,0,0,0.3)',
                  borderColor: isCompleted ? '#4CAF50' : isCurrent ? game.theme.accentColor : 'rgba(255,255,255,0.1)',
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-white/80 mb-3"><MissionIcon n={mission.missionNumber} /></div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{mission.title}</h3>
                    <p className="text-white/70 text-sm flex items-center gap-1">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {mission.location}
                    </p>
                  </div>
                  {isCompleted && <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold flex-shrink-0">✓ 完成</div>}
                  {isLocked && <div className="text-3xl flex-shrink-0">🔒</div>}
                </div>

                {!isLocked && (
                  <>
                    <div className="bg-black/30 rounded-lg p-4 mb-4">
                      <p className="text-white/90 whitespace-pre-line text-sm">{mission.briefing}</p>
                    </div>
                    <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 mb-4">
                      <p className="text-yellow-100 text-sm">💡 提示：{mission.hint}</p>
                    </div>
                    {!isCompleted && (
                      <div>
                        <label htmlFor={`upload-${mission.id}`}
                          className="block w-full text-center py-3 rounded-full font-bold cursor-pointer transition text-white"
                          style={{ backgroundColor: game.theme.accentColor }}>
                          📸 上傳任務照片
                        </label>
                        <input id={`upload-${mission.id}`} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handlePhotoUpload(mission.id, e)} />
                      </div>
                    )}
                    {isCompleted && cityProgress?.uploadedPhotos[mission.id] && (
                      <div className="mt-4">
                        <img src={cityProgress.uploadedPhotos[mission.id].url} alt="任務照片" className="w-full h-48 object-cover rounded-lg" />
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
