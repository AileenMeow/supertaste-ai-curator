import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HdFork, HdPin, HdMask, HdBag, HdTag, HdInfo, HdCheck, HdClose, HdStar } from '../icons/HandDrawn';

// Map English type from real JSON → tab group
const TYPE_TO_TAB = {
  restaurant: '美食',
  attraction: '景點',
  experience: '文化',
  shop:       '購物',
};

// Normalize spot type — apply heuristics in priority order
const ATTRACTION_KEYWORDS = ['步道', '瀑布', '峽谷', '公園', '景觀', '秘境', '海灘', '海邊', '山', '湖', '橋', '島', '岸', '林', '寺', '廟', '祠', '塔', '台', '棧道'];
const RESTAURANT_KEYWORDS = ['咖啡', '餐廳', '小吃', '料理', '美食', '麵', '飯', '湯', '甜點', '冰', '茶', '酒吧', '燒肉', '火鍋', '早餐', '便當', '燒烤', '麵包', '蛋糕'];
const SHOP_KEYWORDS = ['伴手禮', '購物', '商店', '百貨', '市集', '名產'];
const CULTURE_KEYWORDS = ['博物館', '展覽', '古蹟', '文物', '美術館', '園區', '老屋'];

// Strong override keywords — these always win over JSON's `type` field
const FORCE_ATTRACTION = ['老街', '步道', '瀑布', '峽谷', '公園', '景觀', '秘境', '海灘', '海岸', '夜市', '森林', '湖', '橋', '島', '岸', '寺', '廟', '祠', '塔', '棧道', '園區'];

function normalizeSpotType(spot) {
  const name = spot.name || '';
  const blob = `${name} ${(spot.tags || []).join(' ')}`;
  // Force-override: e.g. JSON tags 安平老街 as restaurant, but it's clearly an attraction
  if (FORCE_ATTRACTION.some(k => name.includes(k))) return { ...spot, type: 'attraction' };
  // Otherwise priority: attraction > restaurant > shop > experience
  if (ATTRACTION_KEYWORDS.some(k => blob.includes(k))) return { ...spot, type: 'attraction' };
  if (RESTAURANT_KEYWORDS.some(k => blob.includes(k))) return { ...spot, type: 'restaurant' };
  if (SHOP_KEYWORDS.some(k => blob.includes(k))) return { ...spot, type: 'shop' };
  if (CULTURE_KEYWORDS.some(k => blob.includes(k))) return { ...spot, type: 'experience' };
  return spot;
}

// Per-theme decorative emoji for Hero (quick implementation)
const THEME_DECO = {
  '不夜城': '🌃', '都市綠洲': '🌳', '明星潮流': '🌟', '港星記憶': '🎬',
  'AI教父美食地圖': '🍜', '動漫聖地': '🎌', '網美打卡': '📸', '文青之旅': '☕',
  '步道健行': '🥾', '購物血拼': '🛍️',
  '古都巡禮': '🏛️', '凌晨美食': '🍲', '百年老店': '🏮', '螞蟻人的台南': '🍰',
  '米其林之旅': '⭐', '台版亞馬遜': '🌿', '廟宇奇觀': '⛩️', '老屋時光': '🏚️',
  '峽谷秘境': '⛰️', '部落文化': '🪶', '太平洋看海放空': '🌊', '單車日記': '🚴',
  '老屋裡的昭和': '🏯', '親子放電': '🎈', '在地老味': '🥟',
};

const TAB_ORDER = ['全部', '美食', '景點', '文化', '購物'];

const TAB_ICON = {
  '全部': { Icon: HdStar, color: '#f59e0b' },
  '美食': { Icon: HdFork, color: '#1d4ed8' },
  '景點': { Icon: HdPin,  color: '#15803d' },
  '文化': { Icon: HdMask, color: '#7c3aed' },
  '購物': { Icon: HdBag,  color: '#be185d' },
};

// Fallback gradients per tab (shown when no image)
const TAB_GRADIENT = {
  '美食': 'from-[#7B1D00] via-[#C0392B] to-[#E04B00]',
  '景點': 'from-[#0D2B4A] via-[#1B4F72] to-[#2E86C1]',
  '文化': 'from-[#1A0533] via-[#6C3483] to-[#9B59B6]',
  '購物': 'from-[#5D0E2E] via-[#A93226] to-[#E91E63]',
};

const TYPE_BADGE = {
  restaurant: { label: '餐廳', Icon: HdFork, cls: 'bg-blue-100 text-blue-700',  iconColor: '#1d4ed8' },
  attraction: { label: '景點', Icon: HdPin,  cls: 'bg-green-100 text-green-700', iconColor: '#15803d' },
  experience: { label: '體驗', Icon: HdMask, cls: 'bg-purple-100 text-purple-700', iconColor: '#7c3aed' },
  shop:       { label: '購物', Icon: HdBag,  cls: 'bg-pink-100 text-pink-700',  iconColor: '#be185d' },
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
          ? 'border-green-500 bg-green-50 shadow-xl ring-2 ring-green-200'
          : 'border-gray-200 hover:border-green-300 hover:shadow-lg'
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
          <div className="absolute inset-0 bg-green-500/30 backdrop-blur-[1px] flex items-center justify-center">
            <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <svg width="26" height="20" viewBox="0 0 22 18" fill="none">
                <path d="M2 9l6 6L20 3" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow inline-flex items-center gap-1 ${
            spot.isCommunity ? 'bg-[#4A90E2] text-white' : 'bg-[#FF7847] text-white'
          }`}>
            <HdTag size={10} color="#fff" /> {spot.isCommunity ? '網友' : '食尚'}
          </span>
        </div>
      </div>

      {/* Right content — pr-12 reserves space for top-right checkbox */}
      <div className="flex-1 min-w-0 flex flex-col justify-between pr-10">
        <div>
          <h3 className="text-lg sm:text-2xl font-black text-gray-900 leading-tight mb-2">{spot.name}</h3>
          <div className="mb-2">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${typeBadge.cls}`}>
              <typeBadge.Icon size={12} color={typeBadge.iconColor} /> {typeBadge.label}
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
          <div className="flex gap-1.5 flex-wrap min-w-0">
            {spot.tags?.slice(0, 3).map(t => (
              <span key={t} className="bg-gray-100 text-gray-600 text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap">#{t}</span>
            ))}
          </div>
          {spot.area && (
            <div className="text-xs text-gray-500 flex-shrink-0">{spot.area}</div>
          )}
        </div>
      </div>

      {/* Top-right checkbox — bigger & greener */}
      <div className={`absolute top-4 right-4 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
        isSelected
          ? 'bg-green-500 border-green-500 scale-110 shadow-lg'
          : 'bg-white border-gray-300 group-hover:border-green-400 group-hover:scale-105'
      }`}>
        {isSelected ? (
          <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
            <path d="M2 8l5 5L18 2" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <div className="w-3 h-3 rounded-full border-2 border-gray-400" />
        )}
      </div>
    </div>
  );
}

function CategoryRow({ tab, spots, selected, onToggle }) {
  const selectedCount = spots.filter(s => selected.has(s.id)).length;

  const tabIcon = TAB_ICON[tab];
  const TIc = tabIcon?.Icon;
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-5">
        {TIc && <TIc size={24} color={tabIcon.color} />}
        <h3 className="text-2xl font-black text-[#1A1A1A]">{tab}</h3>
        <span className="text-sm text-[#AAA] bg-[#F5F5F5] px-2 py-0.5 rounded-full">{spots.length}</span>
        {selectedCount > 0 && (
          <span className="text-sm font-bold text-[#FF7847] bg-[#FFF0EB] px-3 py-1 rounded-full inline-flex items-center gap-1">
            <HdCheck size={12} color="#FF7847" /> 已選 {selectedCount}
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
    // 1) dedupe by name+area, keeping the one with the longest description
    const seen = new Map();
    spots.forEach(s => {
      const key = `${(s.name || '').trim().toLowerCase()}-${(s.area || '').trim().toLowerCase()}`;
      const existing = seen.get(key);
      if (!existing || (s.description?.length || 0) > (existing.description?.length || 0)) {
        seen.set(key, s);
      }
    });
    // 2) normalize types (cafes → 美食, gifts → 購物)
    const unique = Array.from(seen.values()).map(normalizeSpotType);
    // 3) enrich
    return unique.map((s, i) => ({
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

  const selectAllVisible = () => {
    setSelected(prev => {
      const next = new Set(prev);
      visibleSpots.forEach(s => next.add(s.id));
      return next;
    });
  };
  const clearSelection = () => setSelected(new Set());

  const selectedSpotsList = enriched.filter(s => selected.has(s.id));

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
    <div className="pb-44 sm:pb-36 bg-white">
      {/* Hero — shorter, with per-theme decorative emoji background */}
      {theme && (
        <section className={`relative bg-gradient-to-br ${theme.coverGradient} min-h-[320px] flex items-center justify-center overflow-hidden pt-20 pb-8`}>
          <button onClick={() => navigate('/')}
            className="absolute top-6 left-6 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2.5 rounded-full transition-all flex items-center gap-2 font-semibold text-sm">
            ← 返回首頁
          </button>
          {/* Per-theme deco emoji (large, faded) */}
          <div aria-hidden className="absolute right-4 sm:right-12 bottom-0 text-[180px] sm:text-[240px] leading-none opacity-15 select-none pointer-events-none">
            {THEME_DECO[theme.name] || '✨'}
          </div>
          <div aria-hidden className="absolute left-4 sm:left-12 top-16 text-[120px] sm:text-[160px] leading-none opacity-10 select-none pointer-events-none rotate-12">
            {THEME_DECO[theme.name] || '✨'}
          </div>
          <div className="relative z-10 text-center text-white px-6 max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-3">
              <span>{theme.city}</span><span>·</span><span>{theme.duration}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-3 drop-shadow-lg">{theme.name}</h1>
            <p className="text-base sm:text-lg text-white/90 mb-3 max-w-2xl mx-auto leading-relaxed">{theme.description}</p>
            <p className="text-white/75 text-sm flex items-center justify-center gap-2">
              <HdInfo size={14} color="#fff" /> 選擇你想去的地方，AI 幫你排成最順的路線
            </p>
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
                  className={`py-4 px-2 font-semibold whitespace-nowrap border-b-2 transition-all inline-flex items-center gap-1.5 ${
                    activeTab === tab
                      ? 'text-gray-900 border-[#FF7847]'
                      : 'text-gray-500 border-transparent hover:text-gray-900'
                  }`}>
                  {TAB_ICON[tab] && (() => { const I = TAB_ICON[tab].Icon; return <I size={16} color={TAB_ICON[tab].color} />; })()}
                  {tab} <span className="text-gray-400 text-sm">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick action toolbar */}
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <div className="flex gap-3 flex-wrap">
          <button onClick={selectAllVisible}
            className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5">
            <HdCheck size={14} color="#15803d" /> 全選當前分類
          </button>
          {selected.size > 0 && (
            <button onClick={clearSelection}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5">
              <HdClose size={14} color="#6b7280" /> 清除選擇
            </button>
          )}
        </div>
      </div>

      {/* Selected spots chips area */}
      {selectedSpotsList.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 pt-4">
          <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-green-800 font-bold flex items-center gap-2">
                <HdCheck size={16} color="#16a34a" /> 已選擇 {selectedSpotsList.length} 個景點
              </span>
              <button onClick={clearSelection}
                className="text-gray-500 hover:text-gray-700 text-sm">
                清除全部
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {selectedSpotsList.map(s => (
                <span key={s.id}
                  className="bg-white text-green-700 px-3 py-1.5 rounded-full text-sm font-medium border border-green-200 flex items-center gap-2 shadow-sm">
                  {s.name}
                  <button onClick={(e) => { e.stopPropagation(); toggle(s.id); }}
                    className="text-green-600 hover:text-green-800 text-base leading-none">×</button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

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

      {/* Fixed bottom bar — always visible */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-2xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-baseline gap-1.5 sm:gap-2 flex-shrink-0">
            <span className="text-gray-700 text-sm sm:text-base font-medium">已選</span>
            <span className="text-green-500 text-2xl sm:text-3xl font-black leading-none">{selected.size}</span>
            <span className="text-gray-700 text-sm sm:text-base font-medium">個景點</span>
          </div>
          <div className="flex gap-2 sm:gap-3 items-center flex-shrink-0">
            {selected.size > 0 && (
              <button onClick={clearSelection}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full font-medium transition-all text-sm">
                清除
              </button>
            )}
            {selected.size > 0 ? (
              <button onClick={handleGenerate}
                className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-1 text-sm sm:text-base whitespace-nowrap">
                生成行程 →
              </button>
            ) : (
              <button onClick={onAiPick}
                className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:shadow-xl text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold shadow-lg transition-all text-sm sm:text-base whitespace-nowrap">
                AI 導遊幫我挑 →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
