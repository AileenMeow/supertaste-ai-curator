import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { THEMES } from '../data/themes';
import ThemeCard from '../components/ui/ThemeCard';
import { ArrowLeftIcon, FilterIcon } from '../components/icons';
import { HdThinking } from '../components/icons/HandDrawn';
import FilterModal from '../components/ui/FilterModal';

const CITY_TABS = ['全部', '台北', '台南', '花蓮'];
const CITY_META = {
  台北: { gradient: 'from-[#0D1B2A] to-[#1B3A5C]', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Taipei_101_from_afar.jpg/800px-Taipei_101_from_afar.jpg' },
  台南: { gradient: 'from-[#2C1A06] to-[#7A4A10]', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Chihkan_towers_tainan_taiwan.jpg/800px-Chihkan_towers_tainan_taiwan.jpg' },
  花蓮: { gradient: 'from-[#0A1F0A] to-[#0A3020]', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Taroko_Gorge_09.jpg/800px-Taroko_Gorge_09.jpg' },
};

export default function ExplorePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [activeCity, setActiveCity] = useState(location.state?.city || '全部');
  const [selectedCity, setSelectedCity] = useState(null);
  const [themeImages, setThemeImages] = useState({});

  // Resolve theme IDs back to full theme objects (state.results was deprecated due to function serialization)
  const resultIds = location.state?.resultIds;
  const results = resultIds ? resultIds.map(id => THEMES.find(t => t.id === id)).filter(Boolean) : null;
  const showCityPicker = location.state?.showCityPicker && !selectedCity;

  useEffect(() => {
    fetch('/data/theme-images.json')
      .then(r => r.ok ? r.json() : {})
      .then(setThemeImages)
      .catch(() => {});
  }, []);

  const displayed = (() => {
    if (results) {
      return selectedCity ? results.filter(t => t.city === selectedCity) : results;
    }
    return activeCity === '全部' ? THEMES : THEMES.filter(t => t.city === activeCity);
  })();

  const resultCities = results ? [...new Set(results.map(t => t.city))] : [];

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#F0F0F0] px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => selectedCity ? setSelectedCity(null) : navigate('/')}
            className="flex items-center gap-2 text-[#666] hover:text-[#333]"
          >
            <ArrowLeftIcon size={20} />
            <span className="text-sm font-medium">{selectedCity ? '重新選城市' : '首頁'}</span>
          </button>
          <h1 className="font-bold text-[#333]">
            {selectedCity ? `${selectedCity} · 符合的玩法` : '探索所有玩法'}
          </h1>
          <button
            onClick={() => setShowFilter(true)}
            className="flex items-center gap-1 text-sm text-[#FF6B35] font-medium"
          >
            <FilterIcon size={16} color="#FF6B35" />
            篩選
          </button>
        </div>
      </div>

      {/* City picker（篩選後有多城市時） */}
      {showCityPicker && (
        <div className="max-w-5xl mx-auto px-4 py-6">
          <p className="text-sm text-[#666] mb-4">
            找到 <span className="font-bold text-[#FF6B35]">{results.length}</span> 個玩法，先選你想去的城市：
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {resultCities.map(city => {
              const count = results.filter(t => t.city === city).length;
              const meta = CITY_META[city] || {};
              return (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className="relative rounded-2xl overflow-hidden h-36 text-left hover:scale-[1.02] transition-transform shadow-card"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient}`} />
                  {meta.img && (
                    <img src={meta.img} alt={city} className="absolute inset-0 w-full h-full object-cover opacity-40"
                      onError={e => e.target.style.display='none'} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <div className="text-2xl font-bold">{city}</div>
                    <div className="text-sm opacity-80">{count} 個玩法符合</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* City tabs (only show when not filtered) */}
      {!results && (
        <div className="bg-white border-b border-[#F0F0F0] px-4">
          <div className="max-w-5xl mx-auto flex gap-1">
            {CITY_TABS.map((city) => (
              <button
                key={city}
                onClick={() => setActiveCity(city)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeCity === city ? 'border-[#FF6B35] text-[#FF6B35]' : 'border-transparent text-[#999] hover:text-[#666]'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {!showCityPicker && (
        <div className="max-w-5xl mx-auto px-4 py-8">
          {results && (
            <p className="text-sm text-[#666] mb-6">
              {selectedCity
                ? `${selectedCity} 共 ${displayed.length} 個符合玩法`
                : `根據你的偏好，找到 ${results.length} 個玩法`}
            </p>
          )}

          {displayed.length === 0 ? (
            <div className="text-center py-20">
              <div className="flex justify-center mb-4"><HdThinking size={80} color="#9ca3af" /></div>
              <p className="text-gray-700 text-lg font-bold mb-2">找不到符合條件的主題</p>
              <p className="text-gray-500 text-sm mb-6">試試調整篩選條件，或看看全部玩法</p>
              <div className="flex gap-3 justify-center">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-bold transition-all" onClick={() => setShowFilter(true)}>
                  重新篩選
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-bold transition-all" onClick={() => navigate('/explore', { replace: true, state: null })}>
                  看全部玩法
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayed.map((theme, i) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  delay={i * 40}
                  articleImage={themeImages[theme.id]?.[0] || null}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {showFilter && <FilterModal onClose={() => setShowFilter(false)} />}
    </div>
  );
}
