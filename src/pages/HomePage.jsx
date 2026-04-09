import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FEATURED_THEMES, THEMES } from '../data/themes';
import ThemeCard from '../components/ui/ThemeCard';
import FilterModal from '../components/ui/FilterModal';

// ═══════════════════════════════════════════════════════════════════
// Decorative SVG elements
// ═══════════════════════════════════════════════════════════════════

const HeartSVG = ({ size = 20, color = '#FF6B6B', opacity = 0.9, rotate = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 24 22" fill={color}
    style={{ opacity, transform: `rotate(${rotate}deg)` }}>
    <path d="M12 20.5 C11.5 20 2 13.5 2 7.5 C2 4.5 4.2 2 7 2 C9 2 11 3.2 12 5 C13 3.2 15 2 17 2 C19.8 2 22 4.5 22 7.5 C22 13.5 12.5 20 12 20.5 Z"/>
  </svg>
);

const StarSVG = ({ size = 18, color = '#FFD23F', opacity = 0.9, rotate = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}
    style={{ opacity, transform: `rotate(${rotate}deg)` }}>
    <path d="M12 2 L14 8.5 L21 8.5 L15.5 12.8 L17.5 19.5 L12 15.5 L6.5 19.5 L8.5 12.8 L3 8.5 L10 8.5 Z"/>
  </svg>
);

const SparkSVG = ({ size = 16, color = 'white', opacity = 0.8 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill={color} style={{ opacity }}>
    <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z"/>
  </svg>
);

// ═══════════════════════════════════════════════════════════════════
// Taiwan-themed hero hand-drawn elements
// ═══════════════════════════════════════════════════════════════════

const BobaSVG = ({ className }) => (
  <svg viewBox="0 0 180 200" className={className} fill="none"
    stroke="#FFF8F0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M50 42 Q48 60 52 105 Q56 160 70 178 Q88 184 110 178 Q126 160 130 105 Q132 60 128 42 Z"/>
    <ellipse cx="90" cy="40" rx="42" ry="9" fill="rgba(255,255,255,0.08)"/>
    <path d="M86 18 Q84 60 86 100" strokeWidth="4"/>
    <path d="M82 18 L92 18" strokeWidth="3"/>
    <circle cx="68" cy="148" r="5" fill="rgba(255,255,255,0.35)" stroke="none"/>
    <circle cx="84" cy="156" r="5" fill="rgba(255,255,255,0.35)" stroke="none"/>
    <circle cx="100" cy="150" r="5" fill="rgba(255,255,255,0.35)" stroke="none"/>
    <circle cx="76" cy="162" r="4" fill="rgba(255,255,255,0.3)" stroke="none"/>
    <circle cx="94" cy="164" r="4" fill="rgba(255,255,255,0.3)" stroke="none"/>
    <circle cx="110" cy="158" r="4" fill="rgba(255,255,255,0.3)" stroke="none"/>
  </svg>
);

const XiaolongbaoSVG = ({ className }) => (
  <svg viewBox="0 0 130 130" className={className} fill="none"
    stroke="#FFF8F0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="65" cy="105" rx="55" ry="10"/>
    <path d="M14 100 Q18 50 65 32 Q112 50 116 100"/>
    <path d="M65 32 Q60 44 56 50 Q50 56 44 56" />
    <path d="M65 32 Q70 44 74 50 Q80 56 86 56" />
    <path d="M65 32 Q66 46 65 56" />
    <path d="M44 56 Q50 64 56 64 Q62 60 65 56" />
    <path d="M86 56 Q80 64 74 64 Q68 60 65 56" />
    <path d="M28 86 Q40 78 52 86" strokeWidth="2" opacity="0.6"/>
    <path d="M78 86 Q90 78 102 86" strokeWidth="2" opacity="0.6"/>
    <path d="M58 18 Q62 8 58 0" strokeWidth="2.5"/>
    <path d="M68 16 Q72 6 68 -2" strokeWidth="2.5"/>
  </svg>
);

const TrainSVG = ({ className }) => (
  <svg viewBox="0 0 150 100" className={className} fill="none"
    stroke="#FFF8F0" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 20 Q4 14 12 12 L120 12 Q140 14 144 36 L144 64 Q144 72 134 72 L18 72 Q8 72 8 62 Z"/>
    <path d="M120 12 Q140 22 144 40"/>
    <rect x="20" y="24" width="22" height="22" rx="2"/>
    <rect x="50" y="24" width="22" height="22" rx="2"/>
    <rect x="80" y="24" width="22" height="22" rx="2"/>
    <path d="M112 28 L138 38 L138 50 L112 50 Z"/>
    <circle cx="34" cy="80" r="9"/>
    <circle cx="68" cy="80" r="9"/>
    <circle cx="104" cy="80" r="9"/>
    <path d="M0 92 L150 92" strokeWidth="2"/>
  </svg>
);

const LanternSVG = ({ className }) => (
  <svg viewBox="0 0 100 140" className={className} fill="none"
    stroke="#FFF8F0" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M30 80 L30 40 Q30 18 50 12 Q70 18 70 40 L70 80 Q70 92 50 96 Q30 92 30 80 Z"/>
    <path d="M22 80 L78 80" strokeWidth="2.5"/>
    <path d="M26 40 L74 40" strokeWidth="2.5"/>
    <path d="M50 12 L50 4" />
    <path d="M40 96 L40 110" strokeWidth="1.8"/>
    <path d="M50 96 L50 116" strokeWidth="1.8"/>
    <path d="M60 96 L60 110" strokeWidth="1.8"/>
    <path d="M50 116 L50 132" strokeWidth="1.5"/>
    <path d="M44 56 L56 56" strokeWidth="1.8" opacity="0.7"/>
    <path d="M42 64 L58 64" strokeWidth="1.8" opacity="0.7"/>
  </svg>
);

const TaiwanSVG = ({ className }) => (
  <svg viewBox="0 0 80 120" className={className} fill="none"
    stroke="#FFF8F0" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M40 6 Q34 12 32 22 Q26 30 24 42 Q18 52 18 64 Q14 76 18 88 Q22 100 30 108 Q40 114 50 110 Q58 100 60 88 Q64 76 62 64 Q60 50 56 38 Q52 24 48 14 Q44 6 40 6 Z"/>
    <circle cx="38" cy="56" r="2.5" fill="#FFF8F0" stroke="none"/>
  </svg>
);

// ═══════════════════════════════════════════════════════════════════
// Guide section hand-drawn icons
// ═══════════════════════════════════════════════════════════════════

const ChatBubbleIcon = ({ size = 44, color = '#FF7847' }) => (
  <svg width={size} height={size} viewBox="0 0 60 56" fill="none"
    stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9 Q5 4 10 4 L50 4 Q55 4 55 9 L55 37 Q55 42 50 42 L28 42 L16 54 L20 42 L10 42 Q5 42 5 37 Z"/>
    <circle cx="20" cy="23" r="3" fill={color} stroke="none"/>
    <circle cx="30" cy="23" r="3" fill={color} stroke="none"/>
    <circle cx="40" cy="23" r="3" fill={color} stroke="none"/>
  </svg>
);

const MapPinDrawnIcon = ({ size = 44, color = '#4A90E2' }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 52 62" fill="none"
    stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M26 6 Q12 5 8 19 Q6 30 12 40 Q18 50 26 62 Q34 50 40 40 Q46 30 44 19 Q40 5 26 6 Z"/>
    <circle cx="26" cy="24" r="9"/>
    <path d="M20 20 Q26 18 32 20" strokeWidth="1.8"/>
  </svg>
);

const DiceDrawnIcon = ({ size = 44, color = '#7CB342' }) => (
  <svg width={size} height={size} viewBox="0 0 62 62" fill="none"
    stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 21 L31 8 L56 21 L56 46 L31 59 L6 46 Z"/>
    <path d="M6 21 L6 46 L31 59"/>
    <path d="M56 21 L31 34 L31 59"/>
    <path d="M6 21 L31 34 L56 21"/>
    <circle cx="31" cy="17" r="3" fill={color} stroke="none"/>
    <circle cx="45" cy="30" r="2.5" fill={color} stroke="none"/>
    <circle cx="45" cy="43" r="2.5" fill={color} stroke="none"/>
    <circle cx="17" cy="30" r="2.5" fill={color} stroke="none"/>
    <circle cx="17" cy="37" r="2.5" fill={color} stroke="none"/>
    <circle cx="17" cy="44" r="2.5" fill={color} stroke="none"/>
  </svg>
);

// ═══════════════════════════════════════════════════════════════════
// City landmark SVGs for city cards
// ═══════════════════════════════════════════════════════════════════

const Taipei101SVG = ({ className }) => (
  <svg viewBox="0 0 90 200" className={className} fill="none"
    stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
    <rect x="18" y="158" width="54" height="38" rx="2"/>
    <path d="M25 158 L25 78 L65 78 L65 158"/>
    {[88, 100, 112, 124, 136, 148, 158].map(y => (
      <path key={y} d={`M23 ${y} L67 ${y}`}/>
    ))}
    <path d="M25 78 L30 62 L60 62 L65 78"/>
    <path d="M30 62 L34 50 L56 50 L60 62"/>
    <path d="M34 50 L38 40 L52 40 L56 50"/>
    <path d="M38 40 L42 30 L48 30 L52 40"/>
    <path d="M45 30 L45 18"/>
    <path d="M42 23 L48 23"/>
    <path d="M43 19 L47 19"/>
  </svg>
);

const ChihkanSVG = ({ className }) => (
  <svg viewBox="0 0 170 165" className={className} fill="none"
    stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
    <rect x="6" y="122" width="158" height="40" rx="3"/>
    <path d="M25 162 L25 142 Q25 132 35 132 Q45 132 45 142 L45 162"/>
    <path d="M65 162 L65 142 Q65 132 75 132 Q85 132 85 142 L85 162"/>
    <path d="M105 162 L105 142 Q105 132 115 132 Q125 132 125 142 L125 162"/>
    <rect x="18" y="82" width="134" height="44"/>
    <path d="M4 82 Q42 60 85 64 Q128 60 166 82"/>
    <path d="M52 64 Q85 52 118 64"/>
    <rect x="35" y="42" width="100" height="44"/>
    <path d="M22 42 Q85 22 148 42"/>
    <rect x="32" y="92" width="20" height="22" rx="3"/>
    <rect x="75" y="92" width="20" height="22" rx="3"/>
    <rect x="118" y="92" width="20" height="22" rx="3"/>
    <path d="M76 22 Q85 10 94 22"/>
    <path d="M82 14 L85 7 L88 14"/>
  </svg>
);

const TarokoSVG = ({ className }) => (
  <svg viewBox="0 0 190 150" className={className} fill="none"
    stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
    <path d="M0 150 L0 82 Q12 38 34 52 Q50 62 52 38 Q56 16 68 28 Q78 36 78 58 Q80 72 88 150"/>
    <path d="M190 150 L190 78 Q178 32 158 48 Q142 60 140 35 Q136 12 124 24 Q114 32 114 56 Q112 70 102 150"/>
    <path d="M88 148 Q95 138 102 148" strokeWidth="2"/>
    <path d="M18 95 Q30 72 48 80" opacity="0.7"/>
    <path d="M142 90 Q158 65 174 76" opacity="0.7"/>
    <path d="M24 56 Q28 45 32 56" strokeWidth="2"/>
    <path d="M42 42 Q46 32 50 42" strokeWidth="2"/>
    <path d="M152 50 Q156 38 160 50" strokeWidth="2"/>
    <path d="M62 62 Q64 80 62 100" strokeWidth="1.5" strokeDasharray="2 3"/>
    <circle cx="95" cy="22" r="9" strokeWidth="1.8"/>
    <path d="M95 10 L95 2"/>
    <path d="M104 13 L109 7"/>
    <path d="M86 13 L81 7"/>
    <path d="M108 22 L116 22"/>
    <path d="M82 22 L74 22"/>
  </svg>
);

// ═══════════════════════════════════════════════════════════════════
// City cards config
// ═══════════════════════════════════════════════════════════════════

const CITY_CARDS = [
  {
    name: '台北', label: '都會深度', sub: '10 種玩法', hint: '台北 101 · 信義區',
    gradient: 'from-[#0B1829] via-[#1B3A5C] to-[#2C5F8A]',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Taipei_101_from_afar.jpg/1280px-Taipei_101_from_afar.jpg',
    fallback: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Taipei_101_as_seen_from_Xiangshan.jpg/800px-Taipei_101_as_seen_from_Xiangshan.jpg',
    Landmark: Taipei101SVG,
  },
  {
    name: '台南', label: '400年古都', sub: '10 種玩法', hint: '赤崁樓 · 中西區',
    gradient: 'from-[#2C1600] via-[#7A3E00] to-[#C06000]',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Chihkan_towers_tainan_taiwan.jpg/1280px-Chihkan_towers_tainan_taiwan.jpg',
    fallback: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Chihkan_Tower_-_front.jpg/800px-Chihkan_Tower_-_front.jpg',
    Landmark: ChihkanSVG,
  },
  {
    name: '花蓮', label: '太平洋秘境', sub: '10 種玩法', hint: '太魯閣峽谷 · 花蓮縣',
    gradient: 'from-[#051A05] via-[#0D3B1A] to-[#145A30]',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Taroko_Gorge_09.jpg/1280px-Taroko_Gorge_09.jpg',
    fallback: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Taroko_Gorge_09.jpg/800px-Taroko_Gorge_09.jpg',
    Landmark: TarokoSVG,
  },
];

// Scattered decorative element positions
const HERO_DECO = [
  { comp: HeartSVG,  props: { size: 22, color: '#FF6B6B', opacity: 0.55, rotate: 15 },  style: { top: '12%', left: '8%' } },
  { comp: HeartSVG,  props: { size: 16, color: '#FFB347', opacity: 0.45, rotate: -20 }, style: { top: '38%', right: '12%' } },
  { comp: StarSVG,   props: { size: 20, color: '#FFD23F', opacity: 0.6,  rotate: 10 },  style: { top: '8%',  right: '30%' } },
  { comp: StarSVG,   props: { size: 14, color: '#FFF8E7', opacity: 0.5,  rotate: -8 },  style: { top: '55%', left: '32%' } },
  { comp: SparkSVG,  props: { size: 18, color: 'white', opacity: 0.5 },                 style: { top: '22%', right: '20%' } },
  { comp: SparkSVG,  props: { size: 12, color: '#FFE66D', opacity: 0.55 },               style: { top: '48%', left: '18%' } },
  { comp: HeartSVG,  props: { size: 13, color: '#FF9999', opacity: 0.4,  rotate: 8 },   style: { top: '65%', right: '25%' } },
  { comp: StarSVG,   props: { size: 16, color: '#FFD23F', opacity: 0.45, rotate: 25 },  style: { top: '30%', left: '42%' } },
];

// ═══════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════

export default function HomePage() {
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [themeImages, setThemeImages] = useState({});

  useEffect(() => {
    fetch('/data/theme-images.json')
      .then(r => r.ok ? r.json() : {})
      .then(setThemeImages)
      .catch(() => {});
  }, []);

  const handleRandom = () =>
    navigate(`/itinerary/${THEMES[Math.floor(Math.random() * THEMES.length)].id}`);
  const handleCity = (city) => navigate('/explore', { state: { city } });

  return (
    <div className="min-h-screen bg-white">

      {/* ══ HERO ═════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 20%, #FFB347 40%, #FFC857 60%, #FFE66D 80%, #FFF8DC 100%)'
      }}>
        {/* Taiwan-themed hand-drawn elements */}
        <BobaSVG className="absolute bottom-16 left-6 sm:left-10 w-[140px] sm:w-[180px] opacity-25 -rotate-6 pointer-events-none select-none hidden sm:block" />
        <XiaolongbaoSVG className="absolute bottom-20 left-[180px] sm:left-[220px] w-[90px] sm:w-[120px] opacity-25 rotate-[8deg] pointer-events-none select-none hidden md:block" />
        <TrainSVG className="absolute top-16 right-6 sm:right-12 w-[110px] sm:w-[150px] opacity-25 -rotate-[8deg] pointer-events-none select-none hidden sm:block" />
        <LanternSVG className="absolute top-[42%] right-[8%] w-[70px] sm:w-[100px] opacity-25 rotate-[6deg] pointer-events-none select-none hidden md:block" />
        <TaiwanSVG className="absolute bottom-24 right-[14%] w-[60px] sm:w-[80px] opacity-25 rotate-[-10deg] pointer-events-none select-none hidden md:block" />

        {/* Scattered hearts, stars, sparks */}
        {HERO_DECO.map(({ comp: Comp, props, style }, i) => (
          <div key={i} className="absolute pointer-events-none hidden sm:block" style={style}>
            <Comp {...props} />
          </div>
        ))}

        {/* ── Navbar ── */}
        <nav className="relative flex items-center justify-between px-5 sm:px-8 py-3 max-w-6xl mx-auto">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-11 h-11 relative">
              <svg viewBox="0 0 48 48" className="w-full h-full">
                <circle cx="24" cy="24" r="23" fill="white" opacity="0.92"/>
                <g transform="translate(14, 10)">
                  <path d="M5 8 L5 22 Q5 26 10 26 L15 26 Q20 26 20 22 L20 8 Z"
                    stroke="#FF7847" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  <ellipse cx="12.5" cy="8" rx="8" ry="1.6" stroke="#FF7847" strokeWidth="1.6" fill="none"/>
                  <line x1="12" y1="3" x2="12" y2="18" stroke="#FF7847" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="9" cy="20" r="1.5" fill="#FF7847"/>
                  <circle cx="13" cy="22" r="1.5" fill="#FF7847"/>
                  <circle cx="16" cy="20" r="1.5" fill="#FF7847"/>
                </g>
              </svg>
            </div>
            <span className="font-black text-white text-base sm:text-lg tracking-tight drop-shadow-sm">食尚玩家 AI 導遊</span>
          </button>
          <div className="flex items-center">
            {['台北', '台南', '花蓮'].map(city => (
              <button key={city} onClick={() => handleCity(city)}
                className="text-[13px] font-bold text-white/80 hover:text-white px-2.5 py-1.5 rounded-full hover:bg-white/20 transition-colors">
                {city}
              </button>
            ))}
          </div>
        </nav>

        {/* ── Hero content ── */}
        <div className="relative text-center px-5 pt-2 pb-16 sm:pb-20 max-w-3xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/75 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7847] animate-pulse flex-shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold text-[#E04400] whitespace-nowrap">
              食尚玩家 500位合作達人 × AI 策展
            </span>
          </div>

          {/* Main title — ZCOOL KuaiLe playful font */}
          <h1 className="font-kuaile text-[2.6rem] sm:text-[3.4rem] lg:text-[4rem] leading-[1.2] mb-2"
            style={{ color: '#fff', textShadow: '2px 3px 12px rgba(180,60,0,0.35)', letterSpacing: '0.02em' }}>
            台灣新玩法，
            <br />
            <span style={{ color: '#FFF8E7' }}>開啟一場有溫度的旅行</span>
          </h1>

          <p className="text-sm sm:text-base text-white/70 mb-7 font-medium">
            台北・台南・花蓮 × 各10種玩法，點選主題即刻生成行程
          </p>

          {/* CTAs */}
          <div className="flex justify-center gap-4 flex-wrap">
            <button onClick={() => setShowFilter(true)}
              className="bg-white text-[#E04400] px-8 py-4 rounded-full font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-105 hover:bg-orange-50 transition-all duration-300">
              告訴我你想怎麼玩
            </button>
            <button onClick={() => navigate('/explore')}
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-base sm:text-lg hover:bg-white/20 backdrop-blur-sm transition-all duration-300">
              依城市探索
            </button>
            <button onClick={() => navigate('/escape-game')}
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white px-8 py-4 rounded-full font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
              🔍 城市逃脫遊戲
            </button>
          </div>
        </div>

        {/* Wavy bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
            style={{ display: 'block', width: '100%', height: '90px' }}>
            <path d="M0,50 Q360,10 720,50 T1440,50 L1440,100 L0,100 Z" fill="#FFFFFF"/>
          </svg>
        </div>
      </section>

      {/* ══ FEATURED CARDS ════════════════════════════════════════ */}
      <section className="bg-white px-4 sm:px-6 pt-12 pb-16 max-w-7xl mx-auto">
        <div className="mb-10">
          <span className="inline-block text-[#FF7847] text-sm font-bold bg-[#FFE5D9] rounded-full px-4 py-1.5 mb-4">
            ✦ 精選旅遊主題
          </span>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1A1A1A]">探索台灣的多樣玩法</h2>
            <button onClick={() => navigate('/explore')}
              className="text-[#FF7847] hover:text-[#E04400] flex items-center gap-1 text-base sm:text-lg font-bold flex-shrink-0 pb-1">
              全部 →
            </button>
          </div>
          <p className="text-[#666] text-base sm:text-lg mt-3">每個主題都由食尚玩家達人策展，有故事、有溫度</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {FEATURED_THEMES.map((theme, i) => (
            <ThemeCard key={theme.id} theme={theme} delay={i * 60}
              articleImage={themeImages[theme.id]?.[0] || null} />
          ))}
        </div>
      </section>

      {/* ══ GUIDE SECTION ═════════════════════════════════════════ */}
      <section className="bg-[#FFF8F0] py-20 px-4 sm:px-6 border-y border-[#FFE5D9]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-[#FF7847] text-sm font-bold bg-[#FFE5D9] rounded-full px-4 py-1.5 mb-3">
              ✦ 找不到喜歡的？
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1A1A1A]">讓 AI 導遊幫你找到最適合的玩法</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { Icon: ChatBubbleIcon, bgCircle: 'bg-[#FF7847]', cardBg: 'from-orange-50 to-pink-50', border: 'border-orange-100', hoverAnim: 'group-hover:rotate-6',
                label: '告訴我你想怎麼玩', sub: '輸入你的喜好，AI 為你量身策劃行程', onClick: () => setShowFilter(true) },
              { Icon: MapPinDrawnIcon, bgCircle: 'bg-[#4A90E2]', cardBg: 'from-blue-50 to-cyan-50', border: 'border-blue-100', hoverAnim: 'group-hover:scale-110',
                label: '我要直接查地點', sub: '搜尋特定景點或美食餐廳', onClick: () => navigate('/explore') },
              { Icon: DiceDrawnIcon, bgCircle: 'bg-[#7CB342]', cardBg: 'from-green-50 to-emerald-50', border: 'border-green-100', hoverAnim: 'group-hover:-translate-y-2',
                label: '隨機推薦給我', sub: '讓 AI 給你驚喜，探索未知的精彩', onClick: handleRandom },
            ].map(({ Icon, bgCircle, cardBg, border, hoverAnim, label, sub, onClick }) => (
              <button key={label} onClick={onClick}
                className={`group relative bg-gradient-to-br ${cardBg} rounded-3xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 ${border} text-center`}>
                <div className={`w-20 h-20 mx-auto mb-5 ${bgCircle} rounded-full flex items-center justify-center transition-transform ${hoverAnim}`}>
                  <Icon size={42} color="white" />
                </div>
                <h3 className="text-xl font-black text-[#1A1A1A] mb-2">{label}</h3>
                <p className="text-[#666] text-sm leading-relaxed">{sub}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CITY BROWSE ═══════════════════════════════════════════ */}
      <section className="bg-white py-14 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-block text-[#FF7847] text-[11px] font-bold bg-[#FFE5D9] rounded-full px-3 py-1 mb-2">
            ✦ 依城市探索
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#1A1A1A]">選個城市，開始你的旅行故事</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {CITY_CARDS.map(({ name, label, sub, img, fallback, hint, gradient, Landmark }) => (
            <button key={name} onClick={() => handleCity(name)}
              className="relative rounded-3xl overflow-hidden text-white text-left hover:scale-105 transition-all duration-300 shadow-xl h-96 group">
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
              <img src={img} alt={name}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500"
                onError={e => { e.target.src = fallback; e.target.onerror = () => { e.target.style.display = 'none'; }; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
              {/* Landmark silhouette */}
              <Landmark className="absolute bottom-4 right-2 opacity-[0.20] group-hover:opacity-30 transition-opacity"
                style={{ height: '70%', width: 'auto' }} />
              <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                <div className="text-white/60 text-base mb-2">{label}</div>
                <h3 className="text-6xl font-black text-white mb-3 drop-shadow-lg">{name}</h3>
                <div className="text-white/80 text-xl mb-5">{sub}</div>
                <div className="text-xs text-white/50 mb-3">{hint}</div>
                <span className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-6 py-3 rounded-full inline-flex items-center gap-2 w-fit text-sm font-bold transition-all duration-300">
                  點擊探索 →
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════ */}
      <footer className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white text-sm">
            食尚玩家 AI 導遊 · 由 Claude AI 驅動 · Prototype v1.0
          </p>
        </div>
      </footer>

      {showFilter && <FilterModal onClose={() => setShowFilter(false)} />}
    </div>
  );
}
