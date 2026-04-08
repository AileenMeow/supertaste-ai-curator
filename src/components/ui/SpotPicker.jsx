import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Map English type from real JSON → tab group
const TYPE_TO_TAB = {
  restaurant: '美食',
  attraction: '景點',
  experience: '文化',
  shop:       '購物',
};

const TAB_ORDER = ['全部', '美食', '景點', '文化', '購物'];

const TAB_EMOJI = {
  '全部': '✨', '美食': '🍽️', '景點': '📍', '文化': '🎭', '購物': '🛍️',
};

// Fallback gradients per tab (shown when no image)
const TAB_GRADIENT = {
  '美食': 'from-[#7B1D00] via-[#C0392B] to-[#E04B00]',
  '景點': 'from-[#0D2B4A] via-[#1B4F72] to-[#2E86C1]',
  '文化': 'from-[#1A0533] via-[#6C3483] to-[#9B59B6]',
  '購物': 'from-[#5D0E2E] via-[#A93226] to-[#E91E63]',
};

const TYPE_BADGE = {
  restaurant: { label: '🍽️ 餐廳', cls: 'bg-blue-100 text-blue-700' },
  attraction: { label: '📍 景點', cls: 'bg-green-100 text-green-700' },
  experience: { label: '🎭 體驗', cls: 'bg-purple-100 text-purple-700' },
  shop:       { label: '🛍️ 購物', cls: 'bg-pink-100 text-pink-700' },
};

function SpotCard({ spot, isSelected, onToggle }) {
  const tab = spot.tab;
  const gradient = TAB_GRADIENT[tab] || TAB_GRADIENT['景點'];
  const typeBadge = TYPE_BADGE[spot.type] || TYPE_BADGE.attraction;

  return (
    <div
      onClick={() => onToggle(spot.id)}
      className={`group relative flex gap-4 sm:gap-6 bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 p-4 sm:p-5 border-2 ${
        isSelected
          ? 'border-[#FF7847] bg-orange-50 shadow-xl'
          : 'border-gray-200 hover:border-orange-300 hover:shadow-lg'
      }`}
    >
      {/* Left thumbnail */}
      <div className="relative w-32 h-32 sm:w-44 sm:h-36 flex-shrink-0 rounded-xl overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
          {spot.image && (
            <img src={spot.image} alt={spot.name}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              onError={e => { e.target.style.display = 'none'; }} />
          )}
        </div>
        {isSelected && (
          <div className="absolute inset-0 bg-[#FF7847]/30 flex items-center justify-center">
            <div className="w-12 h-12 bg-[#FF7847] rounded-full flex items-center justify-center shadow-lg">
              <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
                <path d="M2 9l6 6L20 3" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow ${
            spot.isCommunity ? 'bg-[#4A90E2] text-white' : 'bg-[#FF7847] text-white'
          }`}>
            {spot.isCommunity ? '💬 網友' : '🏷️ 食尚'}
          </span>
        </div>
      </div>

      {/* Right content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-lg sm:text-2xl font-black text-gray-900 leading-tight">{spot.name}</h3>
            <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium ${typeBadge.cls}`}>
              {typeBadge.label}
            </span>
          </div>
          {spot.tagline && (
            <p className="text-gray-700 text-sm sm:text-base mb-2 line-clamp-2">{spot.tagline}</p>
          )}
          {spot.description && (
            <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 hidden sm:block">{spot.description}</p>
          )}
        </div>
        <div className="flex items-end justify-between mt-3 pt-3 border-t border-gray-100 gap-3">
          <div className="flex gap-1.5 flex-wrap">
            {spot.tags?.slice(0, 4).map(t => (
              <span key={t} className="bg-gray-100 text-gray-600 text-[11px] px-2 py-0.5 rounded-full">#{t}</span>
            ))}
          </div>
          {spot.area && (
            <div className="text-xs text-gray-500 flex-shrink-0">{spot.area}</div>
          )}
        </div>
      </div>

      {/* Top-right checkbox */}
      <div className={`absolute top-4 right-4 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
        isSelected ? 'bg-[#FF7847] border-[#FF7847]' : 'bg-white border-gray-300 group-hover:border-[#FF7847]'
      }`}>
        {isSelected && (
          <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
            <path d="M1 5l4 4 8-8" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
    </div>
  );
}

function CategoryRow({ tab, spots, selected, onToggle }) {
  const selectedCount = spots.filter(s => selected.has(s.id)).length;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl">{TAB_EMOJI[tab]}</span>
        <h3 className="text-2xl font-black text-[#1A1A1A]">{tab}</h3>
        <span className="text-sm text-[#AAA] bg-[#F5F5F5] px-2 py-0.5 rounded-full">{spots.length}</span>
        {selectedCount > 0 && (
          <span className="text-sm font-bold text-[#FF7847] bg-[#FFF0EB] px-3 py-1 rounded-full">
            ✓ 已選 {selectedCount}
          </span>
        )}
      </div>
      <div className="space-y-3">
        {spots.map(spot => (
          <SpotCard
            key={spot.id}
            spot={spot}
            isSelected={selected.has(spot.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}

export default function SpotPicker({ theme, spots, images = [], onGenerate, onAiPick, loading }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('全部');
  const [selected, setSelected] = useState(new Set());

  // Filter to only real spots (no 攻略), enrich with tab + image
  const enriched = useMemo(() => {
    return spots.map((s, i) => ({
      ...s,
      id: s.id || `${s.name}-${i}`,
      tab: TYPE_TO_TAB[s.type] || '景點',
      image: images.length > 0 ? images[i % images.length] : null,
      isCommunity: !s.source_article,
    }));
  }, [spots, images]);

  const availableTabs = useMemo(() => {
    const tabSet = new Set(enriched.map(s => s.tab));
    return TAB_ORDER.filter(t => t === '全部' || tabSet.has(t));
  }, [enriched]);

  const visibleSpots = activeTab === '全部' ? enriched : enriched.filter(s => s.tab === activeTab);

  // Group visible spots by tab
  const grouped = useMemo(() => {
    const map = {};
    visibleSpots.forEach(s => {
      if (!map[s.tab]) map[s.tab] = [];
      map[s.tab].push(s);
    });
    const ordered = {};
    TAB_ORDER.slice(1).forEach(t => { if (map[t]) ordered[t] = map[t]; });
    return ordered;
  }, [visibleSpots]);

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleGenerate = () => {
    onGenerate(enriched.filter(s => selected.has(s.id)));
  };

  if (loading) {
    return (
      <div className="px-4 pt-4 pb-8 space-y-6 animate-pulse">
        <div className="h-8 bg-[#F0F0F0] rounded-full w-3/4" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-7 w-16 bg-[#F0F0F0] rounded-full flex-shrink-0" />)}
        </div>
        {[1, 2].map(i => (
          <div key={i}>
            <div className="h-3.5 bg-[#F0F0F0] rounded w-20 mb-3" />
            <div className="flex gap-3">
              {[1, 2, 3].map(j => <div key={j} className="w-40 h-52 bg-[#F0F0F0] rounded-2xl flex-shrink-0" />)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="pb-36 bg-white">
      {/* Hero matching ItineraryPage done view */}
      {theme && (
        <section className={`relative bg-gradient-to-br ${theme.coverGradient} min-h-[440px] flex items-center justify-center overflow-hidden pt-20 pb-12`}>
          <button onClick={() => navigate('/')}
            className="absolute top-6 left-6 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2.5 rounded-full transition-all flex items-center gap-2 font-semibold text-sm">
            ← 返回首頁
          </button>
          <div className="relative z-10 text-center text-white px-6 max-w-4xl py-14">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-5">
              <span>{theme.city}</span><span>·</span><span>{theme.duration}</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-black mb-4 drop-shadow-lg">{theme.name}</h1>
            <p className="text-lg sm:text-xl text-white/90 mb-6 max-w-2xl mx-auto leading-relaxed">{theme.description}</p>
            <p className="text-white/80 text-sm">✦ 選你想去的地方，AI 幫你排成最佳動線</p>
          </div>
        </section>
      )}

      {/* Step indicator */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-7 h-7 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs font-bold">1</div>
            <span className="text-sm font-medium">選擇主題</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-300" />
          <div className="flex items-center gap-2 text-[#FF7847]">
            <div className="w-7 h-7 rounded-full bg-[#FF7847] text-white flex items-center justify-center text-xs font-bold">2</div>
            <span className="text-sm font-bold">選擇景點</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-300" />
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-7 h-7 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs font-bold">3</div>
            <span className="text-sm font-medium">完成行程</span>
          </div>
        </div>
      </div>

      {/* Sticky tabs */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6 overflow-x-auto scrollbar-hide">
            {availableTabs.map(tab => {
              const count = tab === '全部' ? enriched.length : enriched.filter(s => s.tab === tab).length;
              return (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 font-semibold whitespace-nowrap border-b-2 transition-all ${
                    activeTab === tab
                      ? 'text-gray-900 border-[#FF7847]'
                      : 'text-gray-500 border-transparent hover:text-gray-900'
                  }`}>
                  {TAB_EMOJI[tab]} {tab} <span className="text-gray-400 text-sm ml-1">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category sections */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {Object.entries(grouped).map(([tab, tabSpots]) => (
          <CategoryRow
            key={tab}
            tab={tab}
            spots={tabSpots}
            selected={selected}
            onToggle={toggle}
          />
        ))}
      </div>

      {enriched.length === 0 && !loading && (
        <div className="text-center py-12 px-4">
          <p className="text-[#AAA] text-sm mb-4">暫無可選景點</p>
          <button onClick={onAiPick} className="btn-primary px-6 py-2.5 text-sm">
            讓 AI 導遊推薦行程
          </button>
        </div>
      )}

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-[#F0F0F0]">
        <div className="max-w-2xl mx-auto px-4 py-3.5">
          {selected.size > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#555]">
                  已選 <span className="font-bold text-[#FF6B35]">{selected.size}</span> 個景點
                </span>
                <button onClick={() => setSelected(new Set())} className="text-xs text-[#AAA] hover:text-[#666]">
                  清除
                </button>
              </div>
              <button onClick={handleGenerate} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white text-sm font-bold shadow-md shadow-[#FF6B35]/30 hover:shadow-lg transition-shadow">
                生成我的專屬行程 →
              </button>
              <button onClick={onAiPick} className="w-full text-center text-xs text-[#AAA] hover:text-[#555] py-1">
                或讓 AI 導遊幫我推薦
              </button>
            </div>
          ) : (
            <div className="space-y-1.5">
              <button onClick={onAiPick} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white text-sm font-bold shadow-md shadow-[#FF6B35]/30">
                讓 AI 導遊幫我挑選推薦景點
              </button>
              <p className="text-center text-[11px] text-[#CCC]">或點選上方景點，自訂你的行程</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
