import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { THEMES } from '../data/themes';
import { generateItinerary } from '../lib/generateItinerary';
import {
  ArrowLeftIcon, ClockIcon, PinIcon, MoneyIcon, QuoteIcon,
  LinkIcon, StarIcon, TransportIcon, HeartIcon,
} from '../components/icons';

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

// Timeline stop card
function TimelineCard({ stop, index }) {
  return (
    <div className="relative">
      {/* Timeline connector */}
      <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-gradient-to-b from-[#FF6B35]/40 to-transparent" />

      <div className="bg-white rounded-xl shadow-card overflow-hidden mb-6">
        {/* Time header */}
        <div className="px-6 py-4 border-b border-[#F5F5F5] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFD23F] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {String(index + 1).padStart(2, '0')}
          </div>
          <div>
            <div className="flex items-center gap-2 text-[#FF6B35] font-bold text-lg">
              <ClockIcon size={16} color="#FF6B35" />
              {stop.time}
            </div>
            <div className="font-bold text-[#333] text-base">{stop.name}</div>
          </div>
        </div>

        <div className="p-6 space-y-4">
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
          {stop.article_title && (
            <a
              href={stop.article_url || '#'}
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

export default function ItineraryPage() {
  const { themeId } = useParams();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [streamText, setStreamText] = useState('');
  const [saved, setSaved] = useState(false);
  const hasFetched = useRef(false);

  const theme = THEMES.find((t) => t.id === themeId);

  useEffect(() => {
    if (!theme || hasFetched.current) return;
    hasFetched.current = true;

    // Check session cache
    const cached = sessionStorage.getItem(`itinerary_${themeId}`);
    if (cached) {
      try {
        setItinerary(JSON.parse(cached));
        setLoading(false);
        return;
      } catch {}
    }

    generateItinerary(theme, (partial) => {
      setStreamText(partial);
    })
      .then((data) => {
        setItinerary(data);
        sessionStorage.setItem(`itinerary_${themeId}`, JSON.stringify(data));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [themeId, theme]);

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
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#F0F0F0] px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#666] hover:text-[#333] transition-colors"
        >
          <ArrowLeftIcon size={20} />
          <span className="text-sm font-medium">返回</span>
        </button>
        <div className="flex items-center gap-2">
          <Icon size={20} />
          <span className="text-sm font-bold text-[#333] truncate max-w-[160px]">{theme.name}</span>
        </div>
        <button
          onClick={() => setSaved((s) => !s)}
          className="flex items-center gap-1 text-sm text-[#999] hover:text-[#FF6B35] transition-colors"
        >
          <HeartIcon size={20} color={saved ? '#FF6B35' : '#999'} filled={saved} />
        </button>
      </div>

      {/* Hero banner */}
      <div className={`bg-gradient-to-br ${theme.coverGradient} px-6 py-10 text-white`}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Icon size={28} color="white" />
            </div>
            <div>
              <div className="text-white/70 text-sm">{theme.city}</div>
              <h1 className="text-2xl font-bold">{theme.name}</h1>
            </div>
          </div>
          <p className="text-white/80 text-sm leading-relaxed">{theme.description}</p>
          <div className="flex gap-3 mt-4 flex-wrap">
            {theme.tags.map((t) => (
              <span key={t} className="text-xs bg-white/20 rounded-full px-3 py-1">#{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {loading && (
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
                setLoading(true);
                setError(null);
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
                  <TimelineCard key={i} stop={stop} index={i} />
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
    </div>
  );
}
