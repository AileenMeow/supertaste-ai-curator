import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FEATURED_THEMES, THEMES } from '../data/themes';
import ThemeCard from '../components/ui/ThemeCard';
import FilterModal from '../components/ui/FilterModal';
import {
  ArrowDownIcon, FilterIcon, MapIcon, RandomIcon,
} from '../components/icons';

export default function HomePage() {
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);

  const handleRandom = () => {
    const random = THEMES[Math.floor(Math.random() * THEMES.length)];
    navigate(`/itinerary/${random.id}`);
  };

  const handleCityBrowse = (city) => {
    navigate('/explore', { state: { city } });
  };

  return (
    <div className="min-h-screen">
      {/* ── HERO (緊湊版，讓主題卡片第一屏可見) ─────────────── */}
      <section className="bg-gradient-to-b from-[#FFF9E6] to-[#FFF3D0]">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFD23F] flex items-center justify-center">
              <span className="text-white font-bold text-xs">食</span>
            </div>
            <span className="font-bold text-[#333] text-lg">食尚玩家 AI 導遊</span>
          </div>
          <div className="flex items-center gap-2">
            {['台北', '台南', '花蓮'].map((city) => (
              <button
                key={city}
                onClick={() => handleCityBrowse(city)}
                className="text-sm font-medium text-[#666] hover:text-[#FF6B35] transition-colors px-3 py-1.5 rounded-full hover:bg-[#FF6B35]/10"
              >
                {city}
              </button>
            ))}
          </div>
        </nav>

        {/* Hero content — 精簡高度 */}
        <div className="text-center px-6 pt-6 pb-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/80 border border-[#FF6B35]/30 rounded-full px-4 py-1 text-sm text-[#FF6B35] font-medium mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
            食尚玩家 500位合作達人 × AI 策展
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#333] mb-2 leading-tight">
            <span className="gradient-text">台灣可以這樣玩！</span>
          </h1>

          <p className="text-base text-[#666] mb-4">
            台北・台南・花蓮 × 各10種玩法，點選主題即刻生成行程
          </p>

          <div className="flex justify-center gap-3">
            <button
              className="btn-primary px-5 py-2 text-sm"
              onClick={() => setShowFilter(true)}
            >
              告訴我你想怎麼玩
            </button>
            <button
              className="px-5 py-2 text-sm font-semibold border-2 border-[#FF6B35] text-[#FF6B35] rounded-lg hover:bg-[#FF6B35] hover:text-white transition-all"
              onClick={() => navigate('/explore')}
            >
              依城市探索
            </button>
          </div>
        </div>
      </section>

      {/* ── FEATURED CARDS ───────────────────────────────────── */}
      <section id="featured" className="px-4 sm:px-6 pt-6 pb-12 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#333] mb-2">
            精選旅遊主題
          </h2>
          <p className="text-[#666]">每個主題都由食尚玩家達人策展，不只是清單，而是有故事的玩法</p>
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {FEATURED_THEMES.map((theme, i) => (
            <ThemeCard key={theme.id} theme={theme} delay={i * 60} />
          ))}
        </div>
      </section>

      {/* ── GUIDE SECTION ────────────────────────────────────── */}
      <section className="bg-white py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-[#333] mb-2">
            看不到喜歡的？
          </h2>
          <p className="text-[#666] text-sm mb-8">讓我幫你找到最適合的玩法</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Filter */}
            <button
              className="flex flex-col items-center gap-3 p-6 bg-[#FFF9E6] border-2 border-[#FF6B35]/30 rounded-2xl hover:border-[#FF6B35] hover:bg-[#FF6B35]/5 transition-all group"
              onClick={() => setShowFilter(true)}
            >
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <FilterIcon size={24} color="#FF6B35" />
              </div>
              <div>
                <div className="font-bold text-[#333] text-sm">告訴我你想怎麼玩</div>
                <div className="text-[#999] text-xs mt-0.5">依風格篩選</div>
              </div>
            </button>

            {/* By city */}
            <button
              className="flex flex-col items-center gap-3 p-6 bg-[#F0F7FF] border-2 border-[#4A90E2]/30 rounded-2xl hover:border-[#4A90E2] hover:bg-[#4A90E2]/5 transition-all group"
              onClick={() => navigate('/explore')}
            >
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapIcon size={24} color="#4A90E2" />
              </div>
              <div>
                <div className="font-bold text-[#333] text-sm">我要去特定縣市</div>
                <div className="text-[#999] text-xs mt-0.5">台北 / 台南 / 花蓮</div>
              </div>
            </button>

            {/* Random */}
            <button
              className="flex flex-col items-center gap-3 p-6 bg-[#F0FFF0] border-2 border-[#7ED321]/30 rounded-2xl hover:border-[#7ED321] hover:bg-[#7ED321]/5 transition-all group"
              onClick={handleRandom}
            >
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <RandomIcon size={24} color="#7ED321" />
              </div>
              <div>
                <div className="font-bold text-[#333] text-sm">隨機推薦給我</div>
                <div className="text-[#999] text-xs mt-0.5">驚喜玩法</div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ── CITY BROWSE ──────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-[#333] mb-8 text-center">
          依城市探索
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { name: '台北', sub: '10 種玩法', gradient: 'from-[#1a2340] to-[#4A90E2]', emoji: '都會深度' },
            { name: '台南', sub: '10 種玩法', gradient: 'from-[#3a1a00] to-[#F5A623]', emoji: '400年古都' },
            { name: '花蓮', sub: '10 種玩法', gradient: 'from-[#0a2a0a] to-[#7ED321]', emoji: '太平洋秘境' },
          ].map(({ name, sub, gradient, emoji }) => (
            <button
              key={name}
              onClick={() => handleCityBrowse(name)}
              className={`bg-gradient-to-br ${gradient} rounded-2xl p-8 text-white text-left hover:scale-[1.02] transition-transform shadow-card`}
            >
              <div className="text-xs font-medium opacity-70 mb-2">{emoji}</div>
              <div className="text-3xl font-bold mb-1">{name}</div>
              <div className="text-sm opacity-80">{sub}</div>
              <div className="mt-4 text-xs opacity-60">點擊探索 →</div>
            </button>
          ))}
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="bg-[#333] text-white text-center py-8 px-4">
        <div className="text-sm opacity-60">
          食尚玩家 AI 導遊 · 由 Claude AI 驅動 · Prototype v1.0
        </div>
      </footer>

      {showFilter && <FilterModal onClose={() => setShowFilter(false)} />}
    </div>
  );
}
