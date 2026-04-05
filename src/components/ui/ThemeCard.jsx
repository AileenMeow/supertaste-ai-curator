import { useNavigate } from 'react-router-dom';
import { ClockIcon, PinIcon } from '../icons';
import { COVER_IMAGES } from '../../data/coverImages';

const CITY_BADGE_COLOR = {
  台北: 'bg-[#4A90E2]',
  台南: 'bg-[#F5A623]',
  花蓮: 'bg-[#7ED321]',
};

export default function ThemeCard({ theme, delay = 0 }) {
  const navigate = useNavigate();
  const Icon = theme.icon;
  const imgSrc = COVER_IMAGES[theme.id];

  return (
    <div
      className="theme-card cursor-pointer group"
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => navigate(`/itinerary/${theme.id}`)}
    >
      {/* Cover image */}
      <div className={`relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-br ${theme.coverGradient}`}>
        {imgSrc && (
          <img
            src={imgSrc}
            alt={theme.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* City badge */}
        <span className={`absolute top-2 left-2 ${CITY_BADGE_COLOR[theme.city]} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
          {theme.city}
        </span>

        {/* Duration badge */}
        <span className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
          <ClockIcon size={10} color="white" />
          {theme.duration}
        </span>

        {/* Title overlay on image */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon size={14} color="white" />
            </div>
            <h3 className="text-white font-bold text-sm leading-tight">{theme.name}</h3>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Tags */}
        <div className="flex gap-1 mb-2 flex-wrap">
          {theme.tags.map((tag) => (
            <span key={tag} className="text-[10px] text-[#999] bg-[#F5F5F5] rounded-full px-1.5 py-0.5">
              #{tag}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-xs text-[#666] leading-relaxed mb-3 line-clamp-2">
          {theme.description}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-[10px] text-[#999] mb-3">
          <span className="flex items-center gap-1">
            <PinIcon size={11} color="#999" />
            {theme.spots} 個景點
          </span>
        </div>

        {/* CTA */}
        <button className="btn-primary w-full text-xs py-2">
          查看完整行程
        </button>
      </div>
    </div>
  );
}
