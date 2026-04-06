import { useNavigate } from 'react-router-dom';
import { useSavedSpots } from '../store/savedSpotsStore';
import {
  ArrowLeftIcon, ClockIcon, PinIcon, MoneyIcon, QuoteIcon,
  LinkIcon, StarIcon, HeartIcon, MapIcon,
} from '../components/icons';

// ── Google Maps 多點路線 URL ──────────────────────────────────
function buildGoogleMapsUrl(spots) {
  const locations = spots
    .map((s) => s.location || s.name)
    .filter(Boolean);
  if (locations.length === 0) return null;
  if (locations.length === 1) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locations[0])}`;
  }
  const origin = encodeURIComponent(locations[0]);
  const dest = encodeURIComponent(locations[locations.length - 1]);
  const waypoints = locations.slice(1, -1).map(encodeURIComponent).join('|');
  const base = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}`;
  return waypoints ? `${base}&waypoints=${waypoints}` : base;
}

// ── 單一景點卡片（Travel Guide 風格）───────────────────────────
function SavedCard({ stop, index, onRemove }) {
  const isCommunity = !stop.article_url;

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden mb-4 print:shadow-none print:border print:border-[#eee]">
      {/* Header */}
      <div className="px-5 py-3 border-b border-[#F5F5F5] flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFD23F] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {String(index + 1).padStart(2, '0')}
        </div>
        <div className="flex-1">
          {stop.time && (
            <div className="flex items-center gap-1.5 text-[#FF6B35] font-bold text-sm">
              <ClockIcon size={13} color="#FF6B35" />
              {stop.time}
            </div>
          )}
          <div className="font-bold text-[#333] text-base leading-tight">{stop.name}</div>
        </div>
        {/* Remove button — hidden on print */}
        <button
          onClick={() => onRemove(stop)}
          className="p-1.5 rounded-full hover:bg-red-50 text-[#ccc] hover:text-red-400 transition-colors print:hidden"
          aria-label="移除"
        >
          <HeartIcon size={18} color="currentColor" filled />
        </button>
      </div>

      <div className="px-5 py-4 space-y-3">
        {isCommunity && (
          <span className="inline-flex items-center gap-1 bg-[#F0F7FF] text-[#4A90E2] text-xs font-medium px-2.5 py-0.5 rounded-full">
            💬 網友推薦
          </span>
        )}

        {/* Location */}
        {stop.location && (
          <div className="flex items-start gap-2 text-sm text-[#666]">
            <PinIcon size={14} color="#999" className="mt-0.5 flex-shrink-0" />
            <span>{stop.location}{stop.transport_note && <span className="text-[#999] ml-1">· {stop.transport_note}</span>}</span>
          </div>
        )}

        {/* Quote */}
        {stop.quote && (
          <div className="flex gap-2 bg-[#FFF9E6] rounded-lg p-3">
            <QuoteIcon size={16} color="#FF6B35" className="flex-shrink-0 mt-0.5" />
            <p className="text-[#333] text-sm leading-relaxed italic">{stop.quote}</p>
          </div>
        )}

        {/* Why */}
        {stop.why && (
          <p className="text-sm text-[#555] leading-relaxed">{stop.why}</p>
        )}

        {/* Meta */}
        {(stop.budget_per_person || stop.stay_duration || stop.google_rating) && (
          <div className="flex flex-wrap gap-3 text-sm text-[#666]">
            {stop.budget_per_person && (
              <span className="flex items-center gap-1">
                <MoneyIcon size={13} color="#999" />{stop.budget_per_person}
              </span>
            )}
            {stop.stay_duration && (
              <span className="flex items-center gap-1">
                <ClockIcon size={13} color="#999" />停留 {stop.stay_duration}
              </span>
            )}
            {stop.google_rating && (
              <span className="flex items-center gap-1">
                <StarIcon size={13} color="#F5A623" />Google {stop.google_rating} 星
              </span>
            )}
          </div>
        )}

        {/* Article link */}
        {stop.article_title && stop.article_url && (
          <a
            href={stop.article_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-[#FF6B35] hover:underline print:text-[#333]"
          >
            <LinkIcon size={13} color="#FF6B35" />
            《{stop.article_title}》- 食尚玩家
          </a>
        )}
      </div>
    </div>
  );
}

// ── 主頁面 ────────────────────────────────────────────────────
export default function SavedPage() {
  const navigate = useNavigate();
  const { savedSpots, toggleSpot, clearAll } = useSavedSpots();

  // 依主題分組
  const grouped = savedSpots.reduce((acc, spot) => {
    const key = spot._themeId;
    if (!acc[key]) {
      acc[key] = { themeId: key, themeName: spot._themeName, themeCity: spot._themeCity, spots: [] };
    }
    acc[key].spots.push(spot);
    return acc;
  }, {});
  const groups = Object.values(grouped);

  const mapsUrl = buildGoogleMapsUrl(savedSpots);

  if (savedSpots.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center gap-4 px-4">
        <HeartIcon size={48} color="#ddd" />
        <p className="text-[#999] text-lg">還沒有收藏任何景點</p>
        <button className="btn-primary px-6 py-2" onClick={() => navigate('/')}>
          去探索玩法
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#F0F0F0] px-4 py-3 flex items-center justify-between print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#666] hover:text-[#333] transition-colors"
        >
          <ArrowLeftIcon size={20} />
          <span className="text-sm font-medium">返回</span>
        </button>
        <div className="flex items-center gap-1.5">
          <HeartIcon size={18} color="#FF6B35" filled />
          <span className="text-sm font-bold text-[#333]">我的收藏</span>
        </div>
        <button
          onClick={() => { if (confirm('確定清除所有收藏？')) clearAll(); }}
          className="text-xs text-[#999] hover:text-red-400 transition-colors"
        >
          清除全部
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Print title */}
        <div className="hidden print:block mb-6 text-center">
          <h1 className="text-2xl font-bold text-[#333]">食尚玩家 AI 導遊 — 我的行程</h1>
          <p className="text-sm text-[#999] mt-1">由食尚玩家 500位達人內容策展</p>
        </div>

        {/* Summary bar */}
        <div className="bg-white rounded-2xl shadow-card p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-sm text-[#999]">共收藏</div>
            <div className="text-2xl font-bold text-[#333]">{savedSpots.length} <span className="text-base font-normal text-[#666]">個景點</span></div>
          </div>
          <div className="flex gap-2 print:hidden">
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#4A90E2] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#357ABD] transition-colors"
              >
                <MapIcon size={16} color="white" />
                Google Maps 路線
              </a>
            )}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 border-2 border-[#FF6B35] text-[#FF6B35] text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#FF6B35] hover:text-white transition-all"
            >
              列印行程
            </button>
          </div>
        </div>

        {/* Grouped spots */}
        {groups.map((group) => (
          <div key={group.themeId} className="mb-8">
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className="h-px flex-1 bg-[#F0F0F0]" />
              <span className="text-xs font-bold text-[#999] uppercase tracking-wide">
                {group.themeCity} · {group.themeName}
              </span>
              <div className="h-px flex-1 bg-[#F0F0F0]" />
            </div>
            {group.spots.map((spot, i) => (
              <SavedCard
                key={spot._key}
                stop={spot}
                index={i}
                onRemove={(s) => toggleSpot(s, group.themeId, group.themeName, group.themeCity)}
              />
            ))}
          </div>
        ))}

        {/* Footer note */}
        <p className="text-center text-xs text-[#bbb] pb-20 print:pb-4">
          資料來源：食尚玩家官網 supertaste.tvbs.com.tw
        </p>
      </div>
    </div>
  );
}
