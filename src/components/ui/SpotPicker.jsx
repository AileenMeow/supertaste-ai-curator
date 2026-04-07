import { useState, useMemo } from 'react';

// Only show actual spot types — no 攻略懶人包
const SPOT_TYPES = [
  '必吃美食', '必訪景點', '文化體驗', '生活體驗',
  '娛樂體驗', '親子活動', '戶外活動', '生態體驗',
  '購物體驗', '達人推薦',
];

// Map type → tab group
const TYPE_TO_TAB = {
  '必吃美食': '美食',
  '必訪景點': '景點',
  '文化體驗': '文化',
  '生活體驗': '體驗',
  '娛樂體驗': '體驗',
  '親子活動': '體驗',
  '戶外活動': '戶外',
  '生態體驗': '戶外',
  '購物體驗': '購物',
  '達人推薦': '體驗',
};

const TAB_ORDER = ['全部', '美食', '景點', '文化', '體驗', '戶外', '購物'];

const TAB_EMOJI = {
  '全部': '✦', '美食': '🍜', '景點': '📍',
  '文化': '🏛', '體驗': '⭐', '戶外': '🏔', '購物': '🛍',
};

// Fallback gradients per tab (shown when no image)
const TAB_GRADIENT = {
  '美食': 'from-[#7B1D00] via-[#C0392B] to-[#E04B00]',
  '景點': 'from-[#0D2B4A] via-[#1B4F72] to-[#2E86C1]',
  '文化': 'from-[#1A0533] via-[#6C3483] to-[#9B59B6]',
  '體驗': 'from-[#7D3C00] via-[#D35400] to-[#E67E22]',
  '戶外': 'from-[#0A2D0A] via-[#1E8449] to-[#27AE60]',
  '購物': 'from-[#5D0E2E] via-[#A93226] to-[#E91E63]',
};

function SpotCard({ spot, isSelected, onToggle }) {
  const tab = spot.tab;
  const gradient = TAB_GRADIENT[tab] || TAB_GRADIENT['體驗'];

  return (
    <button
      onClick={() => onToggle(spot.id)}
      className={`relative flex-shrink-0 w-40 h-52 rounded-2xl overflow-hidden text-left transition-all duration-200 group focus:outline-none ${
        isSelected
          ? 'ring-[3px] ring-[#FF6B35] ring-offset-2 shadow-xl scale-[1.02]'
          : 'shadow-md hover:shadow-xl hover:scale-[1.02]'
      }`}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

      {/* Article image overlay */}
      {spot.image && (
        <img
          src={spot.image}
          alt={spot.name}
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={e => { e.target.style.display = 'none'; }}
        />
      )}

      {/* Dark gradient overlay (bottom-heavy) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

      {/* Top row: source badge + check */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between">
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full backdrop-blur-sm ${
          spot.isCommunity
            ? 'bg-[#4A90E2]/80 text-white'
            : 'bg-[#FF6B35]/90 text-white'
        }`}>
          {spot.isCommunity ? '網友推薦' : '食尚玩家'}
        </span>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
          isSelected
            ? 'bg-[#FF6B35] shadow-lg'
            : 'bg-black/40 border border-white/40'
        }`}>
          {isSelected ? (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
          )}
        </div>
      </div>

      {/* Bottom text */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h4 className={`text-white font-bold text-xs leading-snug line-clamp-2 mb-1 transition-colors ${
          isSelected ? 'text-[#FFD23F]' : ''
        }`}>
          {spot.name}
        </h4>
        {spot.quote && (
          <p className="text-white/55 text-[10px] line-clamp-1 leading-snug">
            {spot.quote}
          </p>
        )}
        {spot.priceRange && (
          <p className="text-white/35 text-[9px] mt-1">{spot.priceRange}</p>
        )}
      </div>
    </button>
  );
}

function CategoryRow({ tab, spots, selected, onToggle }) {
  const selectedCount = spots.filter(s => selected.has(s.id)).length;

  return (
    <div className="mb-7">
      <div className="flex items-center gap-2 px-4 mb-3">
        <span className="text-base">{TAB_EMOJI[tab]}</span>
        <span className="text-sm font-bold text-[#1A1A1A]">{tab}</span>
        <span className="text-[11px] text-[#AAA] bg-[#F5F5F5] px-1.5 py-0.5 rounded-full">{spots.length}</span>
        {selectedCount > 0 && (
          <span className="text-[11px] font-bold text-[#FF6B35] bg-[#FFF0EB] px-2 py-0.5 rounded-full">
            ✓ {selectedCount}
          </span>
        )}
      </div>
      <div className="flex gap-3 px-4 overflow-x-auto pb-2 scrollbar-hide">
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
  const [activeTab, setActiveTab] = useState('全部');
  const [selected, setSelected] = useState(new Set());

  // Filter to only real spots (no 攻略), enrich with tab + image
  const enriched = useMemo(() => {
    const filtered = spots.filter(s => SPOT_TYPES.includes(s.type));
    return filtered.map((s, i) => ({
      ...s,
      tab: TYPE_TO_TAB[s.type] || '體驗',
      image: images.length > 0 ? images[i % images.length] : null,
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
    <div className="pb-36">
      {/* Instruction */}
      <div className="px-4 pt-4 pb-3">
        <p className="text-[13px] text-[#444] font-medium">
          選你想去的地方，AI 導遊幫你排成最佳動線
        </p>
        <p className="text-[11px] text-[#AAA] mt-0.5">左右滑動查看，打勾加入行程</p>
      </div>

      {/* Tab filter bar */}
      <div className="flex gap-2 px-4 overflow-x-auto pb-3 scrollbar-hide">
        {availableTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
              activeTab === tab
                ? 'bg-[#FF6B35] text-white shadow-sm shadow-[#FF6B35]/30'
                : 'bg-[#F5F5F5] text-[#666] hover:bg-[#EEE]'
            }`}
          >
            <span>{TAB_EMOJI[tab]}</span>
            <span>{tab}</span>
          </button>
        ))}
      </div>

      <div className="h-px bg-[#F0F0F0] mx-4 mb-5" />

      {/* Category rows */}
      {Object.entries(grouped).map(([tab, tabSpots]) => (
        <CategoryRow
          key={tab}
          tab={tab}
          spots={tabSpots}
          selected={selected}
          onToggle={toggle}
        />
      ))}

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
