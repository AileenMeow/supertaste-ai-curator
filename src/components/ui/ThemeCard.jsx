import { useNavigate } from 'react-router-dom';
import { PinIcon } from '../icons';
import { COVER_IMAGES } from '../../data/coverImages';

const getTitleSize = (title) => {
  if (title.length > 10) return '2.2rem';
  if (title.length > 7) return '2.8rem';
  return '3.2rem';
};

export default function ThemeCard({ theme, delay = 0, articleImage = null }) {
  const navigate = useNavigate();
  const imgSrc = articleImage || COVER_IMAGES[theme.id];

  return (
    <div
      className="relative cursor-pointer group rounded-2xl overflow-hidden shadow-card hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
      style={{ animationDelay: `${delay}ms`, height: '360px' }}
      onClick={() => navigate(`/itinerary/${theme.id}`)}
    >
      {/* ── Layer 1: Full-bleed photo ── */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.coverGradient}`}>
        {imgSrc && (
          <img
            src={imgSrc}
            alt={theme.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
            onError={e => { e.target.style.display = 'none'; }}
          />
        )}
      </div>

      {/* ── Subtle top dimming only ── */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.20) 0%, transparent 30%)' }} />

      {/* ── Big theme name — vertically centered above info bar ── */}
      <div
        className="absolute inset-x-0 top-0 flex items-center justify-center px-4 z-20"
        style={{ bottom: '112px' }}
      >
        <h3
          className="text-white font-black text-center leading-tight"
          style={{
            fontSize: getTitleSize(theme.name),
            textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.6), 0 0 40px rgba(0,0,0,0.4)',
            letterSpacing: '0.03em',
            WebkitTextStroke: '1px rgba(0,0,0,0.3)',
            whiteSpace: 'nowrap',
          }}
        >
          {theme.name}
        </h3>
      </div>

      {/* ── Bottom info bar — fully opaque ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 bg-gray-900 px-4 py-3 space-y-1"
        style={{ height: '112px' }}
      >
        {/* City + duration */}
        <div className="text-gray-400 text-xs font-medium">
          {theme.city} · {theme.duration}
        </div>

        {/* Slogan */}
        {theme.tagline && (
          <p className="text-white font-semibold leading-snug line-clamp-1"
            style={{ fontSize: '16px' }}>
            {theme.tagline}
          </p>
        )}

        {/* Tags + spots */}
        <div className="flex items-center gap-2 flex-wrap">
          {theme.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-gray-300 text-sm">
              #{tag}
            </span>
          ))}
          <span className="ml-auto text-gray-300 flex items-center gap-1 flex-shrink-0 text-sm">
            <PinIcon size={11} color="rgba(255,255,255,0.7)" />
            {theme.spots} 個景點
          </span>
        </div>
      </div>
    </div>
  );
}
