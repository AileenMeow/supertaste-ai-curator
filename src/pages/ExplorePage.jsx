import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { THEMES } from '../data/themes';
import ThemeCard from '../components/ui/ThemeCard';
import { ArrowLeftIcon, FilterIcon } from '../components/icons';
import FilterModal from '../components/ui/FilterModal';

const CITY_TABS = ['全部', '台北', '台南', '花蓮'];

export default function ExplorePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [activeCity, setActiveCity] = useState(location.state?.city || '全部');

  const results = location.state?.results;

  const displayed = results
    ? results
    : activeCity === '全部'
    ? THEMES
    : THEMES.filter((t) => t.city === activeCity);

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#F0F0F0] px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#666] hover:text-[#333]"
          >
            <ArrowLeftIcon size={20} />
            <span className="text-sm font-medium">首頁</span>
          </button>
          <h1 className="font-bold text-[#333]">探索所有玩法</h1>
          <button
            onClick={() => setShowFilter(true)}
            className="flex items-center gap-1 text-sm text-[#FF6B35] font-medium"
          >
            <FilterIcon size={16} color="#FF6B35" />
            篩選
          </button>
        </div>
      </div>

      {/* City tabs (only show when not filtered) */}
      {!results && (
        <div className="bg-white border-b border-[#F0F0F0] px-4">
          <div className="max-w-5xl mx-auto flex gap-1">
            {CITY_TABS.map((city) => (
              <button
                key={city}
                onClick={() => setActiveCity(city)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeCity === city
                    ? 'border-[#FF6B35] text-[#FF6B35]'
                    : 'border-transparent text-[#999] hover:text-[#666]'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {results && (
          <div className="mb-6">
            <p className="text-sm text-[#666]">
              根據你的偏好，找到 <span className="font-bold text-[#FF6B35]">{results.length}</span> 個玩法
            </p>
          </div>
        )}

        {displayed.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#999] mb-4">沒有符合的玩法</p>
            <button className="btn-primary" onClick={() => setShowFilter(true)}>
              調整篩選條件
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayed.map((theme, i) => (
              <ThemeCard key={theme.id} theme={theme} delay={i * 40} />
            ))}
          </div>
        )}
      </div>

      {showFilter && <FilterModal onClose={() => setShowFilter(false)} />}
    </div>
  );
}
