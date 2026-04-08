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

// Lookup real theme data (29 themes) by themeId via city + themeName mapping
function getRealTheme(themeId) {
  const map = THEME_EXCEL_MAP[themeId];
  if (!map) return null;
  const id = `${map.city}__${map.theme}`;
  return spotsData.themes.find(t => t.theme_id === id) || null;
}

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 animate-pulse">
      <div className="h-8 bg-[#F0F0F0] rounded-lg w-3/4" />
      <div className="h-4 bg-[#F0F0F0] rounded w-full" />
      <div className="h-4 bg-[#F0F0F0] rounded w-5/6" />
      <div className="h-px bg-[#F0F0F0]" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl p-6 space-y-4 shadow-card">
          <div className="h-6 bg-[#F0F0F0] rounded w-1/2" />
          <div className="h-40 bg-[#F0F0F0] rounded-lg" />
          <div className="h-4 bg-[#F0F0F0] rounded w-full" />
          <div className="h-4 bg-[#F0F0F0] rounded w-4/5" />
        </div>
      ))}
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

  const runGenerate = (selectedSpots) => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    setPhase('loading');
    setError(null);
    generateItinerary(theme, (partial) => setStreamText(partial), selectedSpots)
      .then((data) => {
        setItinerary(data);
        sessionStorage.setItem(`itinerary_${themeId}`, JSON.stringify(data));
        setPhase('done');
      })
      .catch((err) => {
        setError(err.message);
        setPhase('loading'); // stay in loading state to show error
      });
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
      {phase === 'loading' && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          {(() => null)()}
          {(<div className="space-y-4">
            <div className="bg-white rounded-xl p-5 shadow-card flex items-center gap-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-[#FF6B35] animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
              <p className="text-sm text-[#666]">AI 策展人正在為你規劃行程...</p>
            </div>
            <LoadingSkeleton />
          </div>)}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mt-4">
              <p className="text-red-600 font-medium mb-2">行程生成失敗</p>
              <p className="text-sm text-red-500 mb-4">{error}</p>
              <button className="btn-primary text-sm py-2"
                onClick={() => { hasFetched.current = false; setError(null); setPhase('picking'); }}>
                重試
              </button>
            </div>
          )}
        </div>
      )}

      {itinerary && phase === 'done' && (() => {
        const stops = itinerary.itinerary || [];
        const grouped = {
          all: stops,
          restaurant: stops.filter(s => inferType(s) === 'restaurant'),
          attraction: stops.filter(s => inferType(s) === 'attraction'),
          experience: stops.filter(s => inferType(s) === 'experience'),
          shop: stops.filter(s => inferType(s) === 'shop'),
        };
        const restaurantCount = grouped.restaurant.length;
        const filtered = grouped[activeTab] || stops;

        return (
          <div className="fade-in-up">
            {/* ── Hero ───────────────────────────────────── */}
            <section className={`relative bg-gradient-to-br ${theme.coverGradient} min-h-[440px] flex items-center justify-center overflow-hidden pt-20 pb-12`}>
              <button onClick={() => navigate('/')}
                className="absolute top-6 left-6 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2.5 rounded-full transition-all flex items-center gap-2 font-semibold">
                <ArrowLeftIcon size={18} color="white" /> 返回首頁
              </button>
              <div className="relative z-10 text-center text-white px-6 max-w-4xl py-16">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-5">
                  <span>{theme.city}</span><span>·</span><span>{theme.duration}</span>
                </div>
                <h1 className="text-5xl sm:text-6xl font-black mb-4 drop-shadow-lg">{realTheme?.theme_name || theme.name}</h1>
                <p className="text-lg sm:text-xl text-white/90 mb-6 max-w-2xl mx-auto leading-relaxed">
                  {realTheme?.slogan || theme.description}
                </p>
                <div className="flex gap-2 justify-center flex-wrap">
                  {theme.tags.map(t => (
                    <span key={t} className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">#{t}</span>
                  ))}
                </div>
              </div>
            </section>

            {/* ── Tabs ───────────────────────────────────── */}
            <div className="bg-white border-b sticky top-0 z-20">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex gap-6 overflow-x-auto scrollbar-hide">
                  {[
                    { key: 'all', label: '全部', emoji: '✨' },
                    { key: 'restaurant', label: '美食', emoji: '🍽️' },
                    { key: 'attraction', label: '景點', emoji: '📍' },
                    { key: 'experience', label: '文化', emoji: '🎭' },
                    { key: 'shop', label: '購物', emoji: '🛍️' },
                  ].filter(t => grouped[t.key].length > 0).map(t => (
                    <button key={t.key} onClick={() => setActiveTab(t.key)}
                      className={`py-4 px-2 font-semibold whitespace-nowrap border-b-2 transition-all ${
                        activeTab === t.key
                          ? 'text-gray-900 border-[#FF7847]'
                          : 'text-gray-500 border-transparent hover:text-gray-900'
                      }`}>
                      {t.emoji} {t.label} <span className="text-gray-400 text-sm ml-1">({grouped[t.key].length})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Story intro ────────────────────────────── */}
            {itinerary.story && (
              <div className="max-w-7xl mx-auto px-6 pt-10">
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-100 rounded-2xl p-6 sm:p-8">
                  <h2 className="font-black text-[#1A1A1A] text-xl mb-2">這趟旅程的故事</h2>
                  <p className="text-[#555] text-base leading-relaxed">{itinerary.story}</p>
                </div>
              </div>
            )}

            {/* ── Spot Cards Grid ────────────────────────── */}
            <div className="max-w-7xl mx-auto px-6 py-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((stop, i) => (
                  <SpotCard key={i} stop={stop}
                    image={themeImages[i % Math.max(themeImages.length, 1)]}
                    themeId={themeId} themeName={theme.name} themeCity={theme.city}
                    themeGradient={theme.coverGradient} />
                ))}
              </div>
            </div>

            {/* ── Dining recommendation (when restaurants < 3) ── */}
            {restaurantCount < 3 && (
              <div className="bg-orange-50 py-16">
                <div className="max-w-7xl mx-auto px-6">
                  <div className="text-center mb-10">
                    <div className="inline-block bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-sm mb-3">
                      🍽️ 附近用餐推薦
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-gray-900">逛累了？這些餐廳就在附近</h2>
                    <p className="text-gray-600 text-lg mt-2">食尚玩家嚴選，{theme.city}周邊美食</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {themeSpots.filter(s => /美食|餐|食/.test(s.type || '')).slice(0, 3).map((r, i) => (
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

            <SourceCitation spots={stops} />
            <SavedBar count={savedCountForTheme} onView={() => navigate('/saved')} />

            <div className="flex gap-4 justify-center flex-wrap py-10">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-4 rounded-full font-bold text-base transition-all duration-300"
                onClick={() => navigate('/')}>
                ← 返回首頁
              </button>
              <button className="bg-white border-2 border-[#FF7847] text-[#FF7847] hover:bg-orange-50 px-8 py-4 rounded-full font-bold text-base transition-all duration-300"
                onClick={() => {
                  sessionStorage.removeItem(`itinerary_${themeId}`);
                  hasFetched.current = false;
                  setItinerary(null);
                  setActiveTab('all');
                  setPhase('picking');
                }}>
                🔄 重新規劃行程
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
              <p className="text-sm text-[#666]">AI 策展人正在為你規劃行程...</p>
            </div>
            <LoadingSkeleton />
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
