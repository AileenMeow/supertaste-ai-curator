import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ESCAPE_GAMES } from '../../data/escapeGames';
import useEscapeGameStore from '../../store/escapeGameStore';

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
      initCity(city, game.missions.length);
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
      completeMission(city, missionId, { url: reader.result, filename: file.name });
      const mission = game.missions.find((m) => m.id === missionId);
      setCurrentStory(mission.unlockStory);
      setShowStoryModal(true);
      if (mission.isFinal) {
        completeGame(city);
        setTimeout(() => navigate(`/escape-game/${city}/complete`), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  // City theme tokens
  const isTainan = city === 'tainan';
  const isHualien = city === 'hualien';
  const ct = {
    accent: isTainan ? '#F5DEB3' : isHualien ? '#FFB300' : '#00D9FF',
    accentDim: isTainan ? 'rgba(245, 222, 179, 0.7)' : isHualien ? 'rgba(255, 179, 0, 0.7)' : 'rgba(0, 217, 255, 0.7)',
    border: isTainan ? 'rgba(139, 69, 19, 0.4)' : isHualien ? 'rgba(255, 179, 0, 0.3)' : 'rgba(0, 217, 255, 0.3)',
    headerBg: isTainan ? 'rgba(60, 30, 10, 0.85)' : isHualien ? 'rgba(15, 50, 25, 0.85)' : 'rgba(0, 0, 0, 0.5)',
    font: isTainan ? 'serif' : isHualien ? 'sans-serif' : 'monospace',
    glow: isTainan ? 'rgba(220, 20, 60, 0.5)' : isHualien ? 'rgba(255, 179, 0, 0.5)' : 'rgba(0, 217, 255, 0.5)',
    btnBg: isTainan ? 'linear-gradient(to right, #8B4513, #DC143C)' : isHualien ? 'linear-gradient(to right, #2E7D32, #FFB300)' : 'linear-gradient(to right, #06b6d4, #3b82f6)',
    btnText: isTainan ? '#fff' : isHualien ? '#fff' : '#000',
    label: {
      back:    isTainan ? '返回'      : isHualien ? '返回'    : 'RETURN',
      agent:   isTainan ? '時空旅人：' : isHualien ? '勇者：'   : 'AGENT:',
      agentName: isTainan ? '李明華'  : isHualien ? '部落使者' : 'PHOENIX',
      progress: isTainan ? '進度：'   : isHualien ? '進度：'   : 'PROGRESS:',
      systemHeader: isTainan ? '民國二十一年...' : isHualien ? '祖靈傳訊...' : 'SYSTEM INITIALIZING...',
      memoryHeader: isTainan ? '記憶碎片浮現...' : isHualien ? '守護力量覺醒...' : 'MEMORY UNLOCKED',
      acceptBtn: isTainan ? '開始旅程' : isHualien ? '接受使命' : 'ACCEPT MISSION',
      continueBtn: isTainan ? '繼續旅程' : isHualien ? '繼續使命' : 'CONTINUE',
      mission: isTainan ? '碎片' : isHualien ? '試煉' : 'MISSION',
      briefing: isTainan ? '指引：' : isHualien ? '神諭：' : 'BRIEFING:',
      hint: isTainan ? '線索：' : isHualien ? '提示：' : 'HINT:',
      uploadBtn: isTainan ? '記錄此刻' : isHualien ? '見證足跡' : 'UPLOAD EVIDENCE',
      complete: isTainan ? '已收集' : isHualien ? '已通過' : 'COMPLETE',
      locked: isTainan ? '尚未解鎖' : isHualien ? '尚未開啟' : 'LOCKED',
      uploaded: isTainan ? '已記錄：' : isHualien ? '已見證：' : 'EVIDENCE UPLOADED:',
    },
  };

  // Per-mission illustrations
  const getMissionIllustration = (n) => {
    if (isTainan) {
      const tainan = {
        1: {
          gradient: 'linear-gradient(135deg, #2a1a0a 0%, #5a3a1a 50%, #8B4513 100%)',
          pattern: `<svg width="100%" height="100%" opacity="0.2"><defs><pattern id="vg" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse"><circle cx="30" cy="30" r="2" fill="#F5DEB3" opacity="0.3"/><circle cx="0" cy="0" r="2" fill="#F5DEB3" opacity="0.3"/><circle cx="60" cy="60" r="2" fill="#F5DEB3" opacity="0.3"/></pattern></defs><rect width="100%" height="100%" fill="url(#vg)" /></svg>`,
          icon: (
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          ),
          description: '摩登時代的起點，一切從這裡開始倒轉...',
        },
        2: {
          gradient: 'linear-gradient(135deg, #3a1a0a 0%, #6a2a1a 50%, #DC143C 100%)',
          pattern: `<svg width="100%" height="100%" opacity="0.3"><defs><radialGradient id="tg"><stop offset="0%" style="stop-color:#DC143C;stop-opacity:0.3" /><stop offset="100%" style="stop-color:#DC143C;stop-opacity:0" /></radialGradient></defs><circle cx="20%" cy="30%" r="80" fill="url(#tg)" /><circle cx="70%" cy="60%" r="100" fill="url(#tg)" /></svg>`,
          icon: (
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ),
          description: '味道穿越時空，記憶凝結在舌尖...',
        },
        3: {
          gradient: 'linear-gradient(135deg, #1a0a1a 0%, #4a2a2a 50%, #8B4513 100%)',
          pattern: `<svg width="100%" height="100%" opacity="0.25"><defs><pattern id="ap" x="0" y="0" width="40" height="100" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="8" height="100" fill="#F5DEB3" opacity="0.1"/><rect x="32" y="0" width="8" height="100" fill="#F5DEB3" opacity="0.1"/></pattern></defs><rect width="100%" height="100%" fill="url(#ap)" /></svg>`,
          icon: (
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          ),
          description: '老街的記憶在夜色中甦醒...',
        },
        4: {
          gradient: 'linear-gradient(135deg, #0a1a2a 0%, #2a3a4a 50%, #4682B4 100%)',
          pattern: `<svg width="100%" height="100%" opacity="0.2"><defs><pattern id="pl" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="80" stroke="#F5DEB3" stroke-width="1" opacity="0.3"/><line x1="20" y1="0" x2="20" y2="80" stroke="#F5DEB3" stroke-width="1" opacity="0.2"/><line x1="40" y1="0" x2="40" y2="80" stroke="#F5DEB3" stroke-width="1" opacity="0.3"/></pattern></defs><rect width="100%" height="100%" fill="url(#pl)" /></svg>`,
          icon: (
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          description: '兩個時空交疊，記憶開始模糊...',
        },
        5: {
          gradient: 'linear-gradient(135deg, #1a0a0a 0%, #4a2a1a 30%, #8B4513 60%, #F5DEB3 100%)',
          pattern: `<svg width="100%" height="100%" opacity="0.3"><circle cx="50%" cy="50%" r="40%" fill="none" stroke="#F5DEB3" stroke-width="2" opacity="0.3"/><circle cx="50%" cy="50%" r="30%" fill="none" stroke="#F5DEB3" stroke-width="1" opacity="0.2"/></svg>`,
          icon: (
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
          description: '時間的盡頭，找到回家的路...',
        },
      };
      return tainan[n] || tainan[1];
    }

    const illustrations = {
      1: {
        gradient: 'linear-gradient(135deg, #0a0e27 0%, #1a3a52 50%, #00d9ff 100%)',
        pattern: `<svg width="100%" height="100%" opacity="0.3"><defs><pattern id="grid1" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 217, 255, 0.3)" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid1)" /></svg>`,
        icon: (
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        ),
        description: '城市的每一個角落都在監控之下...',
      },
      2: {
        gradient: 'linear-gradient(135deg, #1a0a3e 0%, #4a1a7a 50%, #9d00ff 100%)',
        pattern: `<svg width="100%" height="100%" opacity="0.4"><defs><linearGradient id="dataFlow" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#9d00ff;stop-opacity:0.3" /><stop offset="100%" style="stop-color:#9d00ff;stop-opacity:0" /></linearGradient></defs><rect width="100%" height="100%" fill="url(#dataFlow)" /></svg>`,
        icon: (
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        ),
        description: '數據在光纖中流動，真相在其中...',
      },
      3: {
        gradient: 'linear-gradient(135deg, #1a0e27 0%, #4a1a3a 50%, #ff006e 100%)',
        pattern: `<svg width="100%" height="100%" opacity="0.2"><circle cx="20%" cy="30%" r="50" fill="rgba(255, 0, 110, 0.2)" /><circle cx="60%" cy="60%" r="70" fill="rgba(255, 0, 110, 0.15)" /><circle cx="80%" cy="20%" r="40" fill="rgba(255, 0, 110, 0.25)" /></svg>`,
        icon: (
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
        description: '在人群中消失，是特工的生存之道...',
      },
      4: {
        gradient: 'linear-gradient(135deg, #2a1a0a 0%, #5a4a2a 50%, #ffd700 100%)',
        pattern: `<svg width="100%" height="100%" opacity="0.3"><defs><radialGradient id="glow"><stop offset="0%" style="stop-color:#ffd700;stop-opacity:0.5" /><stop offset="100%" style="stop-color:#ffd700;stop-opacity:0" /></radialGradient></defs><circle cx="50%" cy="50%" r="40%" fill="url(#glow)" /></svg>`,
        icon: (
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
        description: '歷史是記憶的錨點，也是謊言的來源...',
      },
      5: {
        gradient: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 30%, #00d9ff 60%, #ff006e 100%)',
        pattern: `<svg width="100%" height="100%" opacity="0.5"><rect width="100%" height="100%" fill="rgba(0, 217, 255, 0.1)" /></svg>`,
        icon: (
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
        description: '真相終將揭曉，但你準備好面對了嗎？',
      },
    };
    return illustrations[n] || illustrations[1];
  };

  return (
    <div className="min-h-screen" style={{ background: game.theme.gradient, fontFamily: game.theme.fontFamily }}>
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b" style={{ background: ct.headerBg, borderColor: ct.border }}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/escape-game" className="hover:opacity-80 transition flex items-center gap-2 text-sm" style={{ color: ct.accent, fontFamily: ct.font }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {ct.label.back}
            </Link>
            <div className="flex items-center gap-4">
              <div className="text-xs sm:text-sm" style={{ color: ct.accent, fontFamily: ct.font }}>
                <span style={{ opacity: 0.7 }}>{ct.label.agent}</span> {ct.label.agentName}
              </div>
              <div className="text-xs sm:text-sm" style={{ color: ct.accent, fontFamily: ct.font }}>
                <span style={{ opacity: 0.7 }}>{ct.label.progress}</span> {completedMissions.length}/{game.missions.length}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Prologue modal */}
      {showPrologue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur" style={{ background: 'rgba(0,0,0,0.95)' }} onClick={() => setShowPrologue(false)}>
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowPrologue(false)} className="absolute -top-12 right-0 hover:opacity-80 transition" style={{ color: ct.accent }} aria-label="關閉">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="rounded-2xl p-6 sm:p-8 border-2 relative overflow-hidden"
              style={{ background: 'linear-gradient(to bottom right, rgba(20,20,20,0.95), rgba(0,0,0,0.95))', borderColor: ct.border, boxShadow: `0 0 50px ${ct.glow}` }}>
              {isTainan && (
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(245,222,179,0.04) 2px, rgba(245,222,179,0.04) 4px)' }} />
              )}
              <div className="text-sm mb-4 relative z-10" style={{ color: ct.accent, fontFamily: ct.font }}>{ct.label.systemHeader}</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 relative z-10" style={{ textShadow: `0 0 20px ${ct.glow}`, fontFamily: ct.font }}>
                {game.prologue.title}
              </h2>
              <div className="text-gray-300 whitespace-pre-line mb-8 max-h-96 overflow-y-auto text-sm leading-relaxed relative z-10" style={{ fontFamily: ct.font }}>
                {game.prologue.content}
              </div>
              <button onClick={() => setShowPrologue(false)} className="w-full py-3 rounded-lg font-bold transition relative z-10 hover:opacity-90"
                style={{ background: ct.btnBg, color: ct.btnText, boxShadow: `0 0 30px ${ct.glow}` }}>
                {ct.label.acceptBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Story unlock modal */}
      {showStoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur" style={{ background: 'rgba(0,0,0,0.95)' }} onClick={() => setShowStoryModal(false)}>
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowStoryModal(false)} className="absolute -top-12 right-0 hover:opacity-80 transition" style={{ color: ct.accent }} aria-label="關閉">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="rounded-2xl p-6 sm:p-8 border-2 relative overflow-hidden"
              style={{ background: 'linear-gradient(to bottom right, rgba(20,20,20,0.95), rgba(0,0,0,0.95))', borderColor: ct.border, boxShadow: `0 0 50px ${ct.glow}` }}>
              {isTainan && (
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(245,222,179,0.04) 2px, rgba(245,222,179,0.04) 4px)' }} />
              )}
              <div className="text-sm mb-4 relative z-10" style={{ color: ct.accent, fontFamily: ct.font }}>{ct.label.memoryHeader}</div>
              <div className="text-gray-300 whitespace-pre-line mb-8 max-h-96 overflow-y-auto text-sm leading-relaxed relative z-10" style={{ fontFamily: ct.font }}>
                {currentStory}
              </div>
              <button onClick={() => setShowStoryModal(false)} className="w-full py-3 rounded-lg font-bold transition relative z-10 hover:opacity-90"
                style={{ background: ct.btnBg, color: ct.btnText }}>
                {ct.label.continueBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="container mx-auto px-6 py-6">
        <div className="rounded-full h-3 overflow-hidden border" style={{ background: 'rgba(0,0,0,0.5)', borderColor: ct.border }}>
          <div className="h-full transition-all duration-500"
            style={{ width: `${(completedMissions.length / game.missions.length) * 100}%`, background: ct.btnBg, boxShadow: `0 0 20px ${ct.glow}` }} />
        </div>
      </div>

      {/* Missions */}
      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-5xl mx-auto space-y-8">
          {game.missions.map((mission, index) => {
            const isCompleted = completedMissions.includes(mission.id);
            const isCurrent = index === currentMissionIndex;
            const isLocked = index > currentMissionIndex;
            const illustration = getMissionIllustration(mission.missionNumber);

            return (
              <div key={mission.id}
                className={`relative transition-all duration-500 ${isLocked ? 'opacity-40' : 'opacity-100'}`}
                style={{ animation: `slideInRight 0.6s ease-out ${index * 0.1}s both` }}
              >
                <div className="relative overflow-hidden rounded-2xl border-2 transition-all"
                  style={{
                    borderColor: isCompleted ? 'rgba(34,197,94,0.5)' : isCurrent ? ct.border : 'rgba(75,85,99,0.5)',
                    boxShadow: isCompleted ? '0 0 30px rgba(34,197,94,0.3)' : isCurrent ? `0 0 40px ${ct.glow}` : 'none',
                  }}>
                  {/* Illustration area */}
                  <div className="relative h-48 sm:h-64 overflow-hidden" style={{ background: illustration.gradient }}>
                    <div className="absolute inset-0" dangerouslySetInnerHTML={{ __html: illustration.pattern }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 text-white/70" style={{ filter: 'drop-shadow(0 0 20px rgba(0, 217, 255, 0.5))' }}>
                        {illustration.icon}
                      </div>
                    </div>
                    {isCompleted && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.8)]">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {ct.label.complete}
                      </div>
                    )}
                    {isLocked && (
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center">
                          <svg className="w-16 h-16 text-gray-500 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          <div className="text-gray-400" style={{ fontFamily: ct.font }}>{ct.label.locked}</div>
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <p className="text-white/80 text-sm italic text-center font-mono">{illustration.description}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="bg-gradient-to-br from-gray-900/95 to-black/95 p-6">
                    <div className="mb-4">
                      <div className="text-sm mb-2" style={{ color: ct.accent, fontFamily: ct.font }}>
                        {ct.label.mission} {String(mission.missionNumber).padStart(2, '0')}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{mission.title}</h3>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {mission.location}
                      </div>
                    </div>

                    {!isLocked && (
                      <>
                        <div className="bg-black/50 border rounded-lg p-4 mb-4" style={{ borderColor: ct.border }}>
                          <div className="text-xs mb-2" style={{ color: ct.accent, fontFamily: ct.font }}>{ct.label.briefing}</div>
                          <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed" style={{ fontFamily: ct.font }}>{mission.briefing}</p>
                        </div>
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4">
                          <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div>
                              <div className="text-yellow-400 text-xs mb-1" style={{ fontFamily: ct.font }}>{ct.label.hint}</div>
                              <p className="text-yellow-200/80 text-sm">{mission.hint}</p>
                            </div>
                          </div>
                        </div>
                        {!isCompleted && (
                          <div>
                            <label htmlFor={`upload-${mission.id}`}
                              className="block w-full text-center py-3 rounded-lg font-bold cursor-pointer transition hover:opacity-90"
                              style={{ background: ct.btnBg, color: ct.btnText, boxShadow: `0 0 20px ${ct.glow}`, fontFamily: ct.font }}>
                              {ct.label.uploadBtn}
                            </label>
                            <input id={`upload-${mission.id}`} type="file" accept="image/*" capture="environment" className="hidden"
                              onChange={(e) => handlePhotoUpload(mission.id, e)} />
                          </div>
                        )}
                        {isCompleted && cityProgress?.uploadedPhotos[mission.id] && (
                          <div className="mt-4">
                            <div className="text-green-400 text-xs mb-2" style={{ fontFamily: ct.font }}>{ct.label.uploaded}</div>
                            <img src={cityProgress.uploadedPhotos[mission.id].url} alt="Evidence"
                              className="w-full h-48 object-cover rounded-lg border-2 border-green-500/50" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
