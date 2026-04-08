import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { THEMES } from '../data/themes';
import { generateItinerary } from '../lib/generateItinerary';
import {
  ArrowLeftIcon, ClockIcon, PinIcon, MoneyIcon, QuoteIcon,
  LinkIcon, StarIcon, TransportIcon, HeartIcon,
} from '../components/icons';
import SourceCitation from '../components/ui/SourceCitation';
import SpotPicker from '../components/ui/SpotPicker';
import { useSavedSpots } from '../store/savedSpotsStore';
import { THEME_EXCEL_MAP } from '../data/themeMapping';
import spotsData from '../data/supertaste_spots_data.json';
import { mapSpotData } from '../utils/spotDataMapper';
import { planItinerary } from '../lib/aiPlanner';
import {
  HdCompass, HdCalendar, HdFork, HdPin, HdMask, HdBag, HdTag,
  HdCoin, HdClock, HdHours, HdWalk, HdNews, HdRefresh,
} from '../components/icons/HandDrawn';

// Lookup real theme data (29 themes) by themeId via city + themeName mapping
function getRealTheme(themeId) {
  const map = THEME_EXCEL_MAP[themeId];
  if (!map) return null;
  const id = `${map.city}__${map.theme}`;
  return spotsData.themes.find(t => t.theme_id === id) || null;
}

// Animated loading screen
const LOADING_MESSAGES = [
  '正在分析你的喜好...',
  '尋找最佳景點組合...',
  '規劃最順的移動路線...',
  '安排用餐時間...',
  '快完成了！',
];

function LoadingScreen() {
  const [msgIdx, setMsgIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setMsgIdx(i => (i + 1) % LOADING_MESSAGES.length), 1800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 px-6">
      <div className="max-w-xl w-full text-center">
        {/* Animated guide character */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          <div className="absolute inset-0 border-[6px] border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <div className="absolute inset-4 border-[4px] border-pink-200 border-b-pink-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-bounce" style={{ animationDuration: '2s' }}>
              <HdCompass size={96} color="#FF7847" />
            </div>
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
          AI 導遊正在為你規劃行程
        </h2>

        <div className="text-lg text-orange-600 font-semibold h-7 mb-8" key={msgIdx}>
          <span className="inline-block animate-fade-up">{LOADING_MESSAGES[msgIdx]}</span>
        </div>

        {/* Animated progress bar */}
        <div className="w-full bg-orange-100 rounded-full h-2.5 overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-orange-400 via-pink-500 to-orange-400 h-2.5 rounded-full"
            style={{
              width: '100%',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s linear infinite',
            }} />
        </div>
        <p className="text-sm text-gray-500">正在考慮營業時間、移動動線和用餐時間...</p>

        {/* Inline keyframes */}
        <style>{`
          @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
          @keyframes fade-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-up { animation: fade-up 0.5s ease-out; }
        `}</style>
      </div>
    </div>
  );
}

// ─── Timeline builder ──────────────────────────────────────────
function pad(n) { return String(n).padStart(2, '0'); }
function fmtTime(mins) { return `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`; }

// Estimate travel time between two spots based on area difference
function estimateTravel(a, b) {
  if (!a || !b) return { mins: 15, method: '步行' };
  const aArea = (a.area || '').trim();
  const bArea = (b.area || '').trim();
  if (!aArea || !bArea || aArea === bArea) {
    return { mins: 10, method: '步行' };
  }
  // Different district → estimate longer
  return { mins: 25, method: '捷運 / 公車' };
}

function buildTimeline(stops, themeName = '', lunchPick = null, dinnerPick = null) {
  const items = [];
  const isNightTheme = /不夜|夜|晚|凌晨/.test(themeName);
  let cur = isNightTheme ? 18 * 60 : 9 * 60;
  let lunchAdded = isNightTheme;
  let dinnerAdded = false;

  stops.forEach((spot, idx) => {
    if (!lunchAdded && cur >= 11 * 60 + 30 && cur <= 14 * 60) {
      items.push({ type: 'meal', time: fmtTime(cur), mealType: 'lunch', duration: '60-90 分鐘', pick: lunchPick });
      cur += 75;
      lunchAdded = true;
    }
    if (!dinnerAdded && cur >= 18 * 60 && cur <= 20 * 60 + 30) {
      items.push({ type: 'meal', time: fmtTime(cur), mealType: 'dinner', duration: '60-90 分鐘', pick: dinnerPick });
      cur += 75;
      dinnerAdded = true;
    }

    items.push({
      type: 'spot',
      time: spot.time || fmtTime(cur),
      duration: spot.stay_duration || '約 90 分鐘',
      spot,
    });
    cur += 90;

    // Travel between spots — area-aware
    if (idx < stops.length - 1) {
      const travel = estimateTravel(spot, stops[idx + 1]);
      items.push({ type: 'travel', travelTime: travel.mins, travelMethod: travel.method });
      cur += travel.mins;
    }
  });
  return items;
}

function TimelineItem({ item, isLast, image, themeId, themeName, themeCity }) {
  const { toggleSpot, isSpotSaved } = useSavedSpots();

  if (item.type === 'travel') {
    return (
      <div className="flex gap-4 sm:gap-6 mb-4">
        <div className="flex-shrink-0 w-16 sm:w-20" />
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="w-3 h-3 rounded-full bg-gray-300" />
          {!isLast && <div className="w-0.5 flex-1 bg-gray-200 min-h-[40px]" />}
        </div>
        <div className="flex-1 pb-4">
          <div className="bg-gray-50 rounded-xl p-3 border-2 border-dashed border-gray-200 inline-flex items-center gap-2 text-sm text-gray-600">
            <HdWalk size={16} color="#6b7280" /> 移動約 {item.travelTime} 分鐘 · {item.travelMethod}
          </div>
        </div>
      </div>
    );
  }

  if (item.type === 'meal') {
    return (
      <div className="flex gap-4 sm:gap-6 mb-6">
        <div className="flex-shrink-0 w-16 sm:w-20 text-right">
          <div className="text-xl font-black text-blue-500">{item.time}</div>
          <div className="text-xs text-gray-500">{item.duration}</div>
        </div>
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-blue-500 border-4 border-blue-100" />
          {!isLast && <div className="w-0.5 flex-1 bg-gray-200 min-h-[60px]" />}
        </div>
        <div className="flex-1">
          <div className="bg-blue-50 rounded-xl p-5 border-2 border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <HdFork size={22} color="#1d4ed8" />
              <h3 className="text-lg font-black text-gray-900">
                {item.mealType === 'lunch' ? '午餐時間' : '晚餐時間'}
              </h3>
              <span className="text-[10px] font-bold bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">AI 推薦</span>
            </div>
            {item.pick ? (
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">食尚報導</span>
                  {item.pick.area && <span className="text-gray-500 text-xs">{item.pick.area}</span>}
                </div>
                <h4 className="font-black text-gray-900 text-base mb-1">{item.pick.name}</h4>
                {item.pick.tagline && <p className="text-gray-600 text-sm line-clamp-2">{item.pick.tagline}</p>}
                {item.pick.source_url && (
                  <a href={item.pick.source_url} target="_blank" rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-700 text-xs font-semibold mt-1 inline-block">
                    查看食尚玩家完整報導 →
                  </a>
                )}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">建議在附近餐廳用餐，約 60-90 分鐘</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // spot
  const stop = item.spot;
  const saved = isSpotSaved(stop, themeId);
  const type = inferType(stop);
  const typeMap = {
    restaurant: { label: '美食', Icon: HdFork, cls: 'bg-blue-100 text-blue-700', iconColor: '#1d4ed8' },
    attraction: { label: '景點', Icon: HdPin,  cls: 'bg-green-100 text-green-700', iconColor: '#15803d' },
    experience: { label: '文化', Icon: HdMask, cls: 'bg-purple-100 text-purple-700', iconColor: '#7c3aed' },
    shop:       { label: '購物', Icon: HdBag,  cls: 'bg-pink-100 text-pink-700', iconColor: '#be185d' },
  };
  const tBadge = typeMap[type];
  const TIcon = tBadge.Icon;

  return (
    <div className="flex gap-4 sm:gap-6 mb-6">
      <div className="flex-shrink-0 w-16 sm:w-20 text-right">
        <div className="text-xl font-black text-[#FF7847]">{item.time}</div>
        <div className="text-xs text-gray-500">{item.duration}</div>
      </div>
      <div className="flex-shrink-0 flex flex-col items-center">
        <div className="w-4 h-4 rounded-full bg-[#FF7847] border-4 border-orange-100" />
        {!isLast && <div className="w-0.5 flex-1 bg-gray-200 min-h-[80px]" />}
      </div>
      <div className="flex-1 pb-2">
        <div className="bg-gray-50 hover:bg-white hover:shadow-md rounded-xl p-5 transition-all">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-orange-300 to-pink-400">
              {image && (
                <img src={image} alt={stop.name} className="w-full h-full object-cover"
                  onError={e => { e.target.style.display = 'none'; }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                {stop.source_url && (
                  <span className="bg-orange-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <HdTag size={11} color="#fff" /> 食尚報導
                  </span>
                )}
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${tBadge.cls}`}>
                  <TIcon size={12} color={tBadge.iconColor} /> {tBadge.label}
                </span>
                {stop.area && <span className="text-gray-500 text-xs">{stop.area}</span>}
              </div>
              <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-1.5 leading-tight">{stop.name}</h3>
              {stop.tagline && (
                <p className="text-gray-700 text-sm font-medium mb-2 line-clamp-2">{stop.tagline}</p>
              )}
              <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap mb-2">
                {stop.budget && <span className="inline-flex items-center gap-1"><HdCoin size={13} color="#6b7280" /> {stop.budget}</span>}
                {stop.suggestedDuration && <span className="inline-flex items-center gap-1"><HdClock size={13} color="#6b7280" /> 停留 {stop.suggestedDuration}</span>}
                {stop.businessHours && <span className="inline-flex items-center gap-1"><HdHours size={13} color="#6b7280" /> {stop.businessHours}</span>}
              </div>
              {stop.source_url && (
                <a href={stop.source_url}
                  target="_blank" rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-orange-600 hover:text-orange-700 text-xs font-semibold inline-flex items-center gap-1">
                  查看食尚玩家完整報導 →
                </a>
              )}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); toggleSpot(stop, themeId, themeName, themeCity); }}
              className="flex-shrink-0 p-2 rounded-full hover:bg-orange-50 transition-colors"
              aria-label={saved ? '取消收藏' : '加入收藏'}
            >
              <HeartIcon size={20} color="#FF7847" filled={saved} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Spot type helpers ─────────────────────────────────────────
const TYPE_LABELS = {
  restaurant: { label: '美食', emoji: '🍽️', badge: 'bg-[#FF7847]' },
  attraction: { label: '景點', emoji: '📍', badge: 'bg-[#4A90E2]' },
  experience: { label: '文化', emoji: '🎭', badge: 'bg-[#9B59B6]' },
  shop:       { label: '購物', emoji: '🛍️', badge: 'bg-[#E91E63]' },
};

const inferType = (stop) => {
  if (stop.type && TYPE_LABELS[stop.type]) return stop.type;
  const t = (stop.name || '') + (stop.why || '') + (stop.quote || '');
  if (/餐廳|料理|食|麵|飯|湯|包|咖啡|店|甜|酒|吧|燒|煮|炸|烤/.test(t)) return 'restaurant';
  if (/購物|百貨|商場|市集|逛街|買/.test(t)) return 'shop';
  if (/體驗|手作|DIY|文化|博物|展|館/.test(t)) return 'experience';
  return 'attraction';
};

// IG-style spot card (matches homepage ThemeCard)
function SpotCard({ stop, image, themeId, themeName, themeCity, themeGradient }) {
  const { toggleSpot, isSpotSaved } = useSavedSpots();
  const saved = isSpotSaved(stop, themeId);
  const type = inferType(stop);
  const meta = TYPE_LABELS[type];
  const isCommunity = !stop.article_url;

  const titleSize = stop.name?.length > 10 ? '2rem'
    : stop.name?.length > 7 ? '2.6rem' : '3rem';

  return (
    <div
      className="relative group rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 shadow-lg"
      style={{ height: '360px' }}
    >
      {/* Photo */}
      <div className={`absolute inset-0 bg-gradient-to-br ${themeGradient}`}>
        {image && (
          <img src={image} alt={stop.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
            onError={e => { e.target.style.display = 'none'; }} />
        )}
      </div>

      {/* Top dim */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 35%)' }} />

      {/* Top-left badges */}
      <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-20">
        <div className="flex gap-2 flex-wrap">
          {!isCommunity && (
            <span className="bg-[#FF7847] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
              🏷️ 食尚報導
            </span>
          )}
          <span className={`${meta.badge} text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md`}>
            {meta.emoji} {meta.label}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); toggleSpot(stop, themeId, themeName, themeCity); }}
          className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:scale-110 transition-transform flex-shrink-0"
          aria-label={saved ? '取消收藏' : '加入收藏'}
        >
          <HeartIcon size={16} color="#FF7847" filled={saved} />
        </button>
      </div>

      {/* Centered name */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-center px-4 z-20"
        style={{ bottom: '120px' }}>
        <h3 className="text-white font-black text-center leading-tight"
          style={{
            fontSize: titleSize,
            textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.6), 0 0 40px rgba(0,0,0,0.4)',
            WebkitTextStroke: '1px rgba(0,0,0,0.3)',
            letterSpacing: '0.02em',
          }}>
          {stop.name}
        </h3>
      </div>

      {/* Bottom info — fully opaque */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gray-900 px-4 py-3 space-y-1"
        style={{ height: '120px' }}>
        <div className="text-gray-400 text-xs font-medium truncate">
          {stop.time && <>{stop.time} · </>}
          {stop.location || themeCity}
          {stop.budget_per_person && <> · {stop.budget_per_person}</>}
        </div>
        {stop.quote && (
          <p className="text-white font-semibold leading-snug line-clamp-2"
            style={{ fontSize: '14px' }}>
            {stop.quote}
          </p>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-300">
          {stop.google_rating && <span>⭐ {stop.google_rating}</span>}
          {stop.stay_duration && <span>· 停留 {stop.stay_duration}</span>}
        </div>
      </div>
    </div>
  );
}

// Timeline stop card (legacy — kept but unused after redesign)
// eslint-disable-next-line no-unused-vars
function TimelineCard({ stop, index, themeId, themeName, themeCity }) {
  const { toggleSpot, isSpotSaved } = useSavedSpots();
  const saved = isSpotSaved(stop, themeId);
  const isCommunity = !stop.article_url;

  return (
    <div className="relative">
      {/* Timeline connector */}
      <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-gradient-to-b from-[#FF6B35]/40 to-transparent" />

      <div className={`bg-white rounded-xl shadow-card overflow-hidden mb-6 transition-all ${saved ? 'ring-2 ring-[#FF6B35]/40' : ''}`}>
        {/* Time header */}
        <div className="px-6 py-4 border-b border-[#F5F5F5] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFD23F] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {String(index + 1).padStart(2, '0')}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-[#FF6B35] font-bold text-lg">
              <ClockIcon size={16} color="#FF6B35" />
              {stop.time}
            </div>
            <div className="font-bold text-[#333] text-base">{stop.name}</div>
          </div>
          {/* Save button */}
          <button
            onClick={() => toggleSpot(stop, themeId, themeName, themeCity)}
            className="p-2 rounded-full hover:bg-[#FFF0EB] transition-colors flex-shrink-0"
            aria-label={saved ? '取消收藏' : '加入收藏'}
          >
            <HeartIcon size={22} color="#FF6B35" filled={saved} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Community badge */}
          {isCommunity && (
            <div className="inline-flex items-center gap-1 bg-[#F0F7FF] text-[#4A90E2] text-xs font-medium px-2.5 py-1 rounded-full">
              💬 網友推薦
            </div>
          )}

          {/* Location */}
          <div className="flex items-start gap-2 text-sm text-[#666]">
            <PinIcon size={16} color="#999" className="mt-0.5" />
            <div>
              <span>{stop.location}</span>
              {stop.transport_note && (
                <span className="text-[#999] ml-1">· {stop.transport_note}</span>
              )}
            </div>
          </div>

          {/* Quote */}
          {stop.quote && (
            <div className="quote-block flex gap-3">
              <QuoteIcon size={20} color="#FF6B35" className="flex-shrink-0 mt-0.5" />
              <p className="text-[#333] text-sm leading-relaxed italic">{stop.quote}</p>
            </div>
          )}

          {/* Why */}
          {stop.why && (
            <div>
              <p className="text-xs font-bold text-[#999] uppercase tracking-wide mb-1">為什麼推薦</p>
              <p className="text-sm text-[#555] leading-relaxed">{stop.why}</p>
            </div>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap gap-3 bg-[#F9F9F9] rounded-lg p-3">
            {stop.budget_per_person && (
              <div className="flex items-center gap-1.5 text-sm text-[#666]">
                <MoneyIcon size={15} color="#999" />
                {stop.budget_per_person}
              </div>
            )}
            {stop.stay_duration && (
              <div className="flex items-center gap-1.5 text-sm text-[#666]">
                <ClockIcon size={15} color="#999" />
                停留 {stop.stay_duration}
              </div>
            )}
            {stop.google_rating && (
              <div className="flex items-center gap-1.5 text-sm text-[#666]">
                <StarIcon size={15} color="#F5A623" />
                Google {stop.google_rating} 星
              </div>
            )}
          </div>

          {/* Article link */}
          {stop.article_title && stop.article_url && (
            <a
              href={stop.article_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#FF6B35] hover:underline"
            >
              <LinkIcon size={14} color="#FF6B35" />
              《{stop.article_title}》- 食尚玩家
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// Floating saved spots bar
function SavedBar({ count, onView }) {
  if (count === 0) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-up">
      <div className="bg-[#333] text-white rounded-2xl px-5 py-3 flex items-center gap-4 shadow-xl">
        <div className="flex items-center gap-2">
          <HeartIcon size={18} color="#FF6B35" filled />
          <span className="text-sm font-medium">已收藏 {count} 個景點</span>
        </div>
        <button
          onClick={onView}
          className="bg-[#FF6B35] text-white text-sm font-bold px-4 py-1.5 rounded-xl hover:bg-[#E55A25] transition-colors"
        >
          查看收藏
        </button>
      </div>
    </div>
  );
}

export default function ItineraryPage() {
  const { themeId } = useParams();
  const navigate = useNavigate();
  // phase: 'picking' | 'loading' | 'done'
  const [phase, setPhase] = useState('picking');
  const [themeSpots, setThemeSpots] = useState([]);
  const [themeImages, setThemeImages] = useState([]);
  const [spotsLoading, setSpotsLoading] = useState(true);
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState(null);
  const [streamText, setStreamText] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const hasFetched = useRef(false);
  const { savedSpots } = useSavedSpots();
  const savedCountForTheme = savedSpots.filter((s) => s._themeId === themeId).length;

  const theme = THEMES.find((t) => t.id === themeId);
  const realTheme = getRealTheme(themeId);

  // Check session cache — if already generated, skip picker
  useEffect(() => {
    if (!theme) return;
    const cached = sessionStorage.getItem(`itinerary_${themeId}`);
    if (cached) {
      try {
        setItinerary(JSON.parse(cached));
        setPhase('done');
        setSpotsLoading(false);
        return;
      } catch {}
    }
    // Load article images + Excel spots in parallel
    fetch('/data/theme-images.json')
      .then(r => r.ok ? r.json() : {})
      .then(data => setThemeImages(data[themeId] || []))
      .catch(() => {});

    // Use real curated JSON data (29 themes, ~10 spots each)
    if (realTheme) {
      setThemeSpots(realTheme.spots || []);
    }
    setSpotsLoading(false);
  }, [themeId, theme]);

  const runGenerate = async (selectedSpots) => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    setPhase('loading');
    setError(null);

    const sourceSpots = (selectedSpots && selectedSpots.length > 0)
      ? selectedSpots
      : (realTheme?.spots || []).slice(0, 8);

    const allThemeSpots = realTheme?.spots || [];

    try {
      // Call Claude: gets story + ordered route + meal picks in one shot
      const ai = await planItinerary({ theme, selectedSpots: sourceSpots, allThemeSpots });

      // Reorder per AI suggestion (fallback to original order if name doesn't match)
      const orderedSource = ai.orderedNames.length > 0
        ? ai.orderedNames.map(n => sourceSpots.find(s => s.name === n)).filter(Boolean)
        : sourceSpots;

      const mappedStops = orderedSource.map(mapSpotData).filter(Boolean);

      // Resolve meal picks → mapped spot objects
      const findInPool = (name) => {
        if (!name) return null;
        const raw = allThemeSpots.find(s => s.name === name);
        return raw ? mapSpotData(raw) : null;
      };

      const data = {
        story: ai.story || realTheme?.slogan || theme.description,
        itinerary: mappedStops,
        lunchPick: findInPool(ai.lunchPick),
        dinnerPick: findInPool(ai.dinnerPick),
        highlights: [],
      };

      setItinerary(data);
      sessionStorage.setItem(`itinerary_${themeId}`, JSON.stringify(data));
      setPhase('done');
    } catch (err) {
      console.error('[AI planner] failed:', err);
      // Detect credit / quota errors vs others
      const msg = String(err?.message || err);
      const isQuota = /credit|quota|billing|insufficient|429|payment/i.test(msg);
      setError(isQuota
        ? '錢不夠用了 QAQ\n\nAileen 的 API 額度用完了，請通知 Aileen 並歡迎贊助費用 🙏\n\n（你還是可以瀏覽景點，AI 規劃功能暫時關閉）'
        : `AI 服務暫時無法使用：${msg}`);
      setPhase('loading');
      // Allow retry
      hasFetched.current = false;
    }
  };

  const handleAiPick = () => runGenerate(null);
  const handleCustomGenerate = (selectedSpots) => runGenerate(selectedSpots);

  if (!theme) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-[#666] mb-4">找不到這個主題</p>
          <button className="btn-primary" onClick={() => navigate('/')}>回首頁</button>
        </div>
      </div>
    );
  }

  const Icon = theme.icon;

  return (
    <div className="min-h-screen bg-white">
      {/* Spot Picker Phase */}
      {phase === 'picking' && (
        <SpotPicker
          theme={theme}
          spots={themeSpots}
          images={themeImages}
          loading={spotsLoading}
          onGenerate={handleCustomGenerate}
          onAiPick={handleAiPick}
        />
      )}

      {/* Loading / Error / Done */}
      {phase !== 'picking' && (
      <div>
      {phase === 'loading' && !error && <LoadingScreen />}
      {phase === 'loading' && error && (
        <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-orange-50 to-yellow-50">
          <div className="max-w-lg w-full bg-white border-2 border-orange-200 rounded-3xl p-8 text-center shadow-xl">
            <div className="text-6xl mb-4">💸</div>
            <p className="text-orange-600 font-black text-xl mb-3">AI 服務暫停中</p>
            <p className="text-sm text-gray-600 mb-6 whitespace-pre-line leading-relaxed">{error}</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-bold transition-all"
                onClick={() => navigate('/')}>
                返回首頁
              </button>
              <button className="bg-[#FF7847] hover:bg-[#E04400] text-white px-6 py-3 rounded-full font-bold transition-all"
                onClick={() => { setError(null); setPhase('picking'); }}>
                重新挑選景點
              </button>
            </div>
          </div>
        </div>
      )}

      {itinerary && phase === 'done' && (() => {
        const stops = itinerary.itinerary || [];
        const restaurantCount = stops.filter(s => inferType(s) === 'restaurant').length;

        return (
          <div className="fade-in-up">
            {/* ── Hero ───────────────────────────────────── */}
            <section className={`relative bg-gradient-to-br ${theme.coverGradient} min-h-[320px] flex items-center justify-center overflow-hidden pt-20 pb-8`}>
              <button onClick={() => navigate('/')}
                className="absolute top-6 left-6 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2.5 rounded-full transition-all flex items-center gap-2 font-semibold">
                <ArrowLeftIcon size={18} color="white" /> 返回首頁
              </button>
              <div className="relative z-10 text-center text-white px-6 max-w-4xl">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-3">
                  <span>{theme.city}</span><span>·</span><span>{theme.duration}</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-black mb-3 drop-shadow-lg">{realTheme?.theme_name || theme.name}</h1>
                <p className="text-base sm:text-lg text-white/90 mb-3 max-w-2xl mx-auto leading-relaxed">
                  {realTheme?.slogan || theme.description}
                </p>
                <div className="flex gap-2 justify-center flex-wrap">
                  {theme.tags.map(t => (
                    <span key={t} className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">#{t}</span>
                  ))}
                </div>
              </div>
            </section>

            {/* ── Story intro ────────────────────────────── */}
            {itinerary.story && (
              <div className="max-w-5xl mx-auto px-6 pt-10">
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-100 rounded-2xl p-6 sm:p-8">
                  <h2 className="font-black text-[#1A1A1A] text-xl mb-2">這趟旅程的故事</h2>
                  <p className="text-[#555] text-base leading-relaxed">{itinerary.story}</p>
                </div>
              </div>
            )}

            {/* ── Timeline ────────────────────────────── */}
            <div className="max-w-5xl mx-auto px-6 py-12">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 flex items-center gap-3">
                <HdCalendar size={28} color="#1f2937" />
                一日行程時間軸
              </h2>
              <p className="text-gray-500 text-sm mb-8">已考慮營業時間、移動動線與用餐時間</p>
              <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                {buildTimeline(stops, theme.name, itinerary.lunchPick, itinerary.dinnerPick).map((item, i, arr) => (
                  <TimelineItem key={i} item={item} isLast={i === arr.length - 1}
                    image={item.type === 'spot' ? themeImages[i % Math.max(themeImages.length, 1)] : null}
                    themeId={themeId} themeName={theme.name} themeCity={theme.city} />
                ))}
              </div>
            </div>

            {/* ── Dining recommendation (when restaurants < 3) ── */}
            {restaurantCount < 3 && (
              <div className="bg-orange-50 py-16">
                <div className="max-w-7xl mx-auto px-6">
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-sm mb-3">
                      <HdFork size={14} color="#ea580c" /> 附近用餐推薦
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-gray-900">逛累了？這些餐廳就在附近</h2>
                    <p className="text-gray-600 text-lg mt-2">食尚玩家嚴選，{theme.city}周邊美食</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {themeSpots.filter(s => s.type === 'restaurant').slice(0, 3).map((r, i) => (
                      <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                        <div className={`h-48 bg-gradient-to-br ${theme.coverGradient} relative`}>
                          {themeImages[i] && (
                            <img src={themeImages[i]} alt={r.name}
                              className="w-full h-full object-cover"
                              onError={e => { e.target.style.display = 'none'; }} />
                          )}
                        </div>
                        <div className="p-5">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full">食尚報導</span>
                            <span className="text-gray-500 text-sm">{r.area || theme.city}</span>
                          </div>
                          <h3 className="text-xl font-black text-gray-900 mb-2">{r.name}</h3>
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{r.quote || r.description || ''}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Highlights / Budget / Articles ─────────── */}
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {itinerary.highlights?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="font-black text-[#1A1A1A] text-xl mb-4">行程亮點</h2>
                  <div className="space-y-3">
                    {itinerary.highlights.map((h, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF7847] to-[#FFD23F] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {i + 1}
                        </div>
                        <div>
                          <div className="font-bold text-[#1A1A1A] text-sm">{h.title}</div>
                          <div className="text-[#666] text-sm mt-0.5">{h.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {itinerary.budget_breakdown && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="font-black text-[#1A1A1A] text-xl mb-4 flex items-center gap-2">
                    <MoneyIcon size={20} color="#FF7847" />預算總估算
                  </h2>
                  <div className="space-y-2 text-base">
                    {[
                      ['交通', itinerary.budget_breakdown.transport],
                      ['餐飲', itinerary.budget_breakdown.food],
                      ['門票/體驗', itinerary.budget_breakdown.tickets],
                    ].filter(([, v]) => v).map(([label, val]) => (
                      <div key={label} className="flex justify-between text-[#666]">
                        <span>{label}</span><span>{val}</span>
                      </div>
                    ))}
                    <div className="border-t border-[#F0F0F0] pt-2 flex justify-between font-black text-[#1A1A1A]">
                      <span>總計</span><span className="text-[#FF7847]">{itinerary.budget_breakdown.total}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Data source — show all supertaste articles */}
            <div className="max-w-5xl mx-auto px-6 pb-8">
              <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6">
                <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                  <HdNews size={22} color="#1f2937" /> 資料來源
                </h3>
                <div className="text-sm font-medium text-gray-700 mb-3">食尚玩家報導：</div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {Array.from(new Map(stops.filter(s => s.source_url).map(s => [s.source_url, s])).values()).map((s, i) => (
                    <a key={i} href={s.source_url}
                      target="_blank" rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-700 text-sm bg-white px-3 py-1.5 rounded-full border border-orange-200 hover:border-orange-400 transition-all">
                      {s.name}
                    </a>
                  ))}
                </div>
                <p className="text-xs text-gray-500">本行程由 AI 根據食尚玩家達人推薦內容，結合營業時間、移動動線自動規劃生成</p>
              </div>
            </div>
            <SavedBar count={savedCountForTheme} onView={() => navigate('/saved')} />

            <div className="flex gap-4 justify-center flex-wrap py-10">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-4 rounded-full font-bold text-base transition-all duration-300"
                onClick={() => navigate('/')}>
                ← 返回首頁
              </button>
              <button className="bg-white border-2 border-[#FF7847] text-[#FF7847] hover:bg-orange-50 px-8 py-4 rounded-full font-bold text-base transition-all duration-300 inline-flex items-center gap-2"
                onClick={() => {
                  sessionStorage.removeItem(`itinerary_${themeId}`);
                  hasFetched.current = false;
                  setItinerary(null);
                  setActiveTab('all');
                  setPhase('picking');
                }}>
                <HdRefresh size={18} color="#FF7847" /> 重新規劃行程
              </button>
              <button className="bg-[#FF7847] hover:bg-[#E04400] text-white px-8 py-4 rounded-full font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                onClick={() => navigate('/explore')}>
                探索更多玩法 →
              </button>
            </div>
          </div>
        );
      })()}

      {/* legacy block hidden */}
      {false && (
      <div className="max-w-2xl mx-auto px-4 py-8">
        {phase === 'loading' && (
          <div className="space-y-4">
            {/* Streaming indicator */}
            <div className="bg-white rounded-xl p-5 shadow-card flex items-center gap-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#FF6B35] animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
              <p className="text-sm text-[#666]">AI 導遊正在為你規劃行程...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 font-medium mb-2">行程生成失敗</p>
            <p className="text-sm text-red-500 mb-4">{error}</p>
            <p className="text-xs text-[#999] mb-4">請確認已設定 VITE_ANTHROPIC_API_KEY 環境變數</p>
            <button
              className="btn-primary text-sm py-2"
              onClick={() => {
                hasFetched.current = false;
                setError(null);
                setPhase('picking');
              }}
            >
              重試
            </button>
          </div>
        )}

        {itinerary && (
          <div className="fade-in-up space-y-6">
            {/* Story intro */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <h2 className="font-bold text-[#333] text-lg mb-2">這趟旅程的故事</h2>
              <p className="text-[#555] text-sm leading-relaxed">{itinerary.story}</p>
            </div>

            {/* Overview */}
            {itinerary.overview && (
              <div className="bg-white rounded-xl shadow-card p-6">
                <h2 className="font-bold text-[#333] mb-4">行程總覽</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: ClockIcon, label: '建議時間', val: itinerary.overview.duration },
                    { icon: MoneyIcon, label: '預算估算', val: itinerary.overview.budget },
                    { icon: TransportIcon, label: '交通方式', val: itinerary.overview.transport },
                    { icon: PinIcon, label: '景點數量', val: `${itinerary.overview.spots} 個精選` },
                  ].map(({ icon: Ic, label, val }) => val ? (
                    <div key={label} className="flex items-start gap-2">
                      <Ic size={16} color="#FF6B35" className="mt-0.5" />
                      <div>
                        <div className="text-xs text-[#999]">{label}</div>
                        <div className="text-sm font-medium text-[#333]">{val}</div>
                      </div>
                    </div>
                  ) : null)}
                </div>
              </div>
            )}

            {/* Timeline */}
            {itinerary.itinerary?.length > 0 && (
              <div>
                <h2 className="font-bold text-[#333] text-lg mb-4 px-1">時間軸行程</h2>
                {itinerary.itinerary.map((stop, i) => (
                  <TimelineCard
                    key={i}
                    stop={stop}
                    index={i}
                    themeId={themeId}
                    themeName={theme.name}
                    themeCity={theme.city}
                  />
                ))}
              </div>
            )}

            {/* Highlights */}
            {itinerary.highlights?.length > 0 && (
              <div className="bg-white rounded-xl shadow-card p-6">
                <h2 className="font-bold text-[#333] mb-4">行程亮點</h2>
                <div className="space-y-3">
                  {itinerary.highlights.map((h, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFD23F] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-medium text-[#333] text-sm">{h.title}</div>
                        <div className="text-[#666] text-xs mt-0.5">{h.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Budget breakdown */}
            {itinerary.budget_breakdown && (
              <div className="bg-white rounded-xl shadow-card p-6">
                <h2 className="font-bold text-[#333] mb-4 flex items-center gap-2">
                  <MoneyIcon size={18} color="#FF6B35" />
                  預算總估算
                </h2>
                <div className="space-y-2 text-sm">
                  {[
                    ['交通', itinerary.budget_breakdown.transport],
                    ['餐飲', itinerary.budget_breakdown.food],
                    ['門票/體驗', itinerary.budget_breakdown.tickets],
                  ].filter(([, v]) => v).map(([label, val]) => (
                    <div key={label} className="flex justify-between text-[#666]">
                      <span>{label}</span>
                      <span>{val}</span>
                    </div>
                  ))}
                  <div className="border-t border-[#F0F0F0] pt-2 flex justify-between font-bold text-[#333]">
                    <span>總計</span>
                    <span className="text-[#FF6B35]">{itinerary.budget_breakdown.total}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Related articles */}
            {itinerary.related_articles?.length > 0 && (
              <div className="bg-white rounded-xl shadow-card p-6">
                <h2 className="font-bold text-[#333] mb-4 flex items-center gap-2">
                  <LinkIcon size={18} color="#FF6B35" />
                  延伸閱讀
                </h2>
                <div className="space-y-2">
                  {itinerary.related_articles.map((a, i) => (
                    <a
                      key={i}
                      href={a.url || 'https://supertaste.tvbs.com.tw/travel'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-[#4A90E2] hover:underline py-1"
                    >
                      <LinkIcon size={13} color="#4A90E2" />
                      《{a.title}》- 食尚玩家懶人包
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Source citation */}
            <SourceCitation spots={itinerary.itinerary} />

            {/* Floating save bar */}
            <SavedBar
              count={savedCountForTheme}
              onView={() => navigate('/saved')}
            />

            {/* CTA */}
            <div className="text-center py-6">
              <button
                className="btn-primary px-8 py-3"
                onClick={() => navigate('/')}
              >
                探索更多玩法
              </button>
            </div>
          </div>
        )}
      </div>
      )}
      </div>
      )}
    </div>
  );
}
