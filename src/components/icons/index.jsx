// All SVG icon components — 2px stroke, rounded caps, 24x24 default

export const ClockIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`icon ${className}`}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="7" x2="12" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="12" x2="16" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const PinIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`icon ${className}`}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
      stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <circle cx="12" cy="9" r="2.5" fill={color} />
  </svg>
);

export const MoneyIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`icon ${className}`}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <path d="M12 6v12M9 8.5c0-1.1.9-2 3-2s3 .9 3 2-3 2-3 2-3 .9-3 2 .9 2 3 2 3-.9 3-2"
      stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const QuoteIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`icon ${className}`}>
    <path d="M3 21c3 0 7-1 7-8V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h2c0 3-1 5-3 5z"
      fill={color} opacity="0.8" />
    <path d="M14 21c3 0 7-1 7-8V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h2c0 3-1 5-3 5z"
      fill={color} opacity="0.8" />
  </svg>
);

export const LinkIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`icon ${className}`}>
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const StarIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`icon ${className}`}>
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const FilterIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`icon ${className}`}>
    <line x1="4" y1="6" x2="20" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="8" y1="12" x2="16" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="11" y1="18" x2="13" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const MapIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`icon ${className}`}>
    <polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="8" y1="2" x2="8" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="16" y1="6" x2="16" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const RandomIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`icon ${className}`}>
    <rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="2" />
    <circle cx="8.5" cy="8.5" r="1.5" fill={color} />
    <circle cx="15.5" cy="8.5" r="1.5" fill={color} />
    <circle cx="12" cy="12" r="1.5" fill={color} />
    <circle cx="8.5" cy="15.5" r="1.5" fill={color} />
    <circle cx="15.5" cy="15.5" r="1.5" fill={color} />
  </svg>
);

export const ArrowDownIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`icon ${className}`}>
    <line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <polyline points="19,12 12,19 5,12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ArrowLeftIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`icon ${className}`}>
    <line x1="19" y1="12" x2="5" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <polyline points="12,5 5,12 12,19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const HeartIcon = ({ size = 24, color = 'currentColor', filled = false, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} className={`icon ${className}`}>
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const TransportIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`icon ${className}`}>
    <rect x="3" y="6" width="18" height="12" rx="3" stroke={color} strokeWidth="2" />
    <path d="M3 10h18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="7" cy="20" r="1.5" fill={color} />
    <circle cx="17" cy="20" r="1.5" fill={color} />
    <line x1="7" y1="18" x2="7" y2="20" stroke={color} strokeWidth="1.5" />
    <line x1="17" y1="18" x2="17" y2="20" stroke={color} strokeWidth="1.5" />
  </svg>
);

export const ChevronRightIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`icon ${className}`}>
    <polyline points="9,18 15,12 9,6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// --- Theme Icons ---

export const NightCityIcon = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={`icon ${className}`}>
    <path d="M28 22H4l4-8h4l2-6h2l2 6h4l4 8z" stroke="#4A90E2" strokeWidth="2" strokeLinejoin="round" />
    <path d="M25 6a4 4 0 11-4 4 4 4 0 014-4z" stroke="#4A90E2" strokeWidth="1.5" fill="none" />
    <circle cx="25" cy="10" r="1.5" fill="#4A90E2" />
  </svg>
);

export const UrbanOasisIcon = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={`icon ${className}`}>
    <circle cx="16" cy="16" r="13" stroke="#7ED321" strokeWidth="2" />
    <path d="M16 22v-6M13 13c1-2 5-2 6 0M10 16c2-3 9-3 12 0" stroke="#7ED321" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M16 16c0 0 0-5 0-7" stroke="#7ED321" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const KoreanTaipeiIcon = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={`icon ${className}`}>
    <rect x="4" y="4" width="24" height="24" rx="6" stroke="#FF6B35" strokeWidth="2" />
    <text x="16" y="22" textAnchor="middle" fontSize="16" fill="#FF6B35" fontWeight="bold">한</text>
  </svg>
);

export const HKMemoryIcon = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={`icon ${className}`}>
    <rect x="4" y="8" width="24" height="16" rx="2" stroke="#555" strokeWidth="2" />
    <circle cx="16" cy="16" r="4" stroke="#555" strokeWidth="1.5" />
    <line x1="4" y1="8" x2="4" y2="6" stroke="#555" strokeWidth="2" strokeLinecap="round" />
    <line x1="28" y1="8" x2="28" y2="6" stroke="#555" strokeWidth="2" strokeLinecap="round" />
    <line x1="8" y1="8" x2="8" y2="5" stroke="#555" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="24" y1="8" x2="24" y2="5" stroke="#555" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const AIFoodMapIcon = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={`icon ${className}`}>
    <rect x="8" y="8" width="16" height="16" rx="2" stroke="#4A90E2" strokeWidth="2" />
    <rect x="12" y="12" width="8" height="8" rx="1" stroke="#4A90E2" strokeWidth="1.5" />
    <circle cx="14" cy="14" r="1" fill="#4A90E2" />
    <circle cx="18" cy="14" r="1" fill="#4A90E2" />
    <circle cx="14" cy="18" r="1" fill="#4A90E2" />
    <circle cx="18" cy="18" r="1" fill="#4A90E2" />
    <line x1="16" y1="4" x2="16" y2="8" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
    <line x1="16" y1="24" x2="16" y2="28" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
    <line x1="4" y1="16" x2="8" y2="16" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
    <line x1="24" y1="16" x2="28" y2="16" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const AnimeIcon = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={`icon ${className}`}>
    <path d="M6 10h14a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V10z" stroke="#333" strokeWidth="2" />
    <path d="M20 14l6-2v10l-6-2" stroke="#333" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="11" cy="15" r="2" fill="#333" />
    <circle cx="17" cy="15" r="2" fill="#333" />
  </svg>
);

export const InstagramIcon = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={`icon ${className}`}>
    <rect x="5" y="5" width="22" height="22" rx="6" stroke="#FF6B35" strokeWidth="2" />
    <circle cx="16" cy="16" r="5" stroke="#FF6B35" strokeWidth="2" />
    <circle cx="22" cy="10" r="1.5" fill="#FF6B35" />
  </svg>
);

export const BookCoffeeIcon = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={`icon ${className}`}>
    <rect x="4" y="8" width="16" height="14" rx="1" stroke="#8B6914" strokeWidth="2" />
    <line x1="12" y1="8" x2="12" y2="22" stroke="#8B6914" strokeWidth="1.5" />
    <path d="M22 14h2a3 3 0 010 6h-2" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
    <line x1="20" y1="22" x2="24" y2="22" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 10c.5-1 1.5-1 2 0" stroke="#8B6914" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const HikingIcon = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={`icon ${className}`}>
    <polyline points="4,26 12,10 20,18 28,6" stroke="#7ED321" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ShoppingIcon = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={`icon ${className}`}>
    <path d="M6 8h20l-2 14H8L6 8z" stroke="#FF6B35" strokeWidth="2" strokeLinejoin="round" />
    <path d="M12 8V6a4 4 0 018 0v2" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const AncientCityIcon = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={`icon ${className}`}>
    <rect x="4" y="12" width="24" height="14" stroke="#F5A623" strokeWidth="2" />
    <path d="M4 12h24" stroke="#F5A623" strokeWidth="2" />
    <rect x="8" y="8" width="4" height="4" stroke="#F5A623" strokeWidth="1.5" />
    <rect x="20" y="8" width="4" height="4" stroke="#F5A623" strokeWidth="1.5" />
    <rect x="14" y="4" width="4" height="8" stroke="#F5A623" strokeWidth="1.5" />
    <rect x="13" y="18" width="6" height="8" stroke="#F5A623" strokeWidth="1.5" />
  </svg>
);

export const LateNightFoodIcon = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={`icon ${className}`}>
    <circle cx="16" cy="16" r="12" stroke="#555" strokeWidth="2" />
    <line x1="16" y1="8" x2="16" y2="16" stroke="#555" strokeWidth="2" strokeLinecap="round" />
    <line x1="16" y1="16" x2="20" y2="20" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
    <path d="M22 6a7 7 0 01-8 14" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
  </svg>
);

export const OldShopIcon = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={`icon ${className}`}>
    <rect x="6" y="12" width="20" height="14" stroke="#F5A623" strokeWidth="2" />
    <path d="M4 12l4-8h16l4 8H4z" stroke="#F5A623" strokeWidth="2" strokeLinejoin="round" />
    <line x1="16" y1="4" x2="16" y2="12" stroke="#F5A623" strokeWidth="1.5" />
    <path d="M10 26v-6h12v6" stroke="#F5A623" strokeWidth="1.5" />
  </svg>
);

export const AntManIcon = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={`icon ${className}`}>
    <ellipse cx="16" cy="12" rx="4" ry="3" stroke="#F5A623" strokeWidth="2" />
    <ellipse cx="16" cy="22" rx="5" ry="4" stroke="#F5A623" strokeWidth="2" />
    <line x1="12" y1="12" x2="8" y2="8" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="20" y1="12" x2="24" y2="8" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="10" y1="18" x2="6" y2="20" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="22" y1="18" x2="26" y2="20" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="10" y1="22" x2="6" y2="26" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="22" y1="22" x2="26" y2="26" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="16" y1="9" x2="14" y2="6" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="16" y1="9" x2="18" y2="6" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const MichelinIcon = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={`icon ${className}`}>
    <polygon points="16,4 19.5,13 29,13 21.5,18.5 24,28 16,22.5 8,28 10.5,18.5 3,13 12.5,13"
      stroke="#F5A623" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export const MangroveIcon = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={`icon ${className}`}>
    <path d="M4 22c3-2 6-3 8-2M12 20c2-3 5-5 8-4M20 16c3-4 6-4 8-2" stroke="#7ED321" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 28h24" stroke="#4A90E2" strokeWidth="2" strokeLinecap="round" />
    <path d="M4 26c6-2 12-2 16 0" stroke="#4A90E2" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const TempleIcon = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={`icon ${className}`}>
    <path d="M6 28V14l10-10 10 10v14H6z" stroke="#CC2200" strokeWidth="2" strokeLinejoin="round" />
    <path d="M3 14h26" stroke="#CC2200" strokeWidth="2" strokeLinecap="round" />
    <path d="M3 18l3-4h20l3 4" stroke="#CC2200" strokeWidth="1.5" strokeLinejoin="round" />
    <rect x="13" y="20" width="6" height="8" stroke="#CC2200" strokeWidth="1.5" />
  </svg>
);

export const OldHouseIcon = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={`icon ${className}`}>
    <path d="M4 18l12-12 12 12" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="8" y="18" width="16" height="10" stroke="#8B6914" strokeWidth="2" />
    <path d="M8 18v-4h4v4" stroke="#8B6914" strokeWidth="1.5" />
    <rect x="13" y="22" width="6" height="6" stroke="#8B6914" strokeWidth="1.5" />
    <path d="M20 14h4v4" stroke="#8B6914" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const CanyonIcon = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={`icon ${className}`}>
    <path d="M4 28V8l4 8V8l4 12V10l4 14V8l4 12V8l4 8v12H4z" stroke="#7ED321" strokeWidth="2" strokeLinejoin="round" fill="none" />
  </svg>
);

export const TribeIcon = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={`icon ${className}`}>
    <circle cx="16" cy="16" r="12" stroke="#FF6B35" strokeWidth="2" />
    <path d="M16 8v4M8 12l3.5 2M24 12l-3.5 2M10 22l3-3.5M22 22l-3-3.5M16 22v-6" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="16" cy="16" r="3" stroke="#FF6B35" strokeWidth="1.5" />
  </svg>
);

export const SeaIcon = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={`icon ${className}`}>
    <path d="M4 18c2-3 4-4 6-4s4 4 6 4 4-4 6-4 4 1 6 4" stroke="#4A90E2" strokeWidth="2" strokeLinecap="round" />
    <path d="M4 24c2-3 4-4 6-4s4 4 6 4 4-4 6-4 4 1 6 4" stroke="#4A90E2" strokeWidth="2" strokeLinecap="round" />
    <circle cx="22" cy="10" r="4" stroke="#FFD23F" strokeWidth="1.5" />
    <path d="M22 4v2M22 14v2M16 10h2M26 10h2" stroke="#FFD23F" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const BikeIcon = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={`icon ${className}`}>
    <circle cx="8" cy="22" r="5" stroke="#7ED321" strokeWidth="2" />
    <circle cx="24" cy="22" r="5" stroke="#7ED321" strokeWidth="2" />
    <path d="M8 22l6-10h6l4 10" stroke="#7ED321" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 12h4" stroke="#7ED321" strokeWidth="2" strokeLinecap="round" />
    <circle cx="14" cy="10" r="2" stroke="#7ED321" strokeWidth="1.5" />
  </svg>
);

export const ContainerIcon = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={`icon ${className}`}>
    <rect x="4" y="6" width="24" height="8" rx="1" stroke="#888" strokeWidth="2" />
    <rect x="4" y="16" width="24" height="8" rx="1" stroke="#888" strokeWidth="2" />
    <line x1="10" y1="6" x2="10" y2="14" stroke="#888" strokeWidth="1.5" />
    <line x1="16" y1="6" x2="16" y2="14" stroke="#888" strokeWidth="1.5" />
    <line x1="22" y1="6" x2="22" y2="14" stroke="#888" strokeWidth="1.5" />
    <line x1="10" y1="16" x2="10" y2="24" stroke="#888" strokeWidth="1.5" />
    <line x1="16" y1="16" x2="16" y2="24" stroke="#888" strokeWidth="1.5" />
    <line x1="22" y1="16" x2="22" y2="24" stroke="#888" strokeWidth="1.5" />
  </svg>
);

export const FamilyIcon = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={`icon ${className}`}>
    <circle cx="10" cy="8" r="4" stroke="#7ED321" strokeWidth="2" />
    <circle cx="22" cy="10" r="3" stroke="#7ED321" strokeWidth="2" />
    <path d="M4 28v-6a6 6 0 0112 0v6" stroke="#7ED321" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 28v-4a5 5 0 0110 0v4" stroke="#7ED321" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ScallionPancakeIcon = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={`icon ${className}`}>
    <ellipse cx="16" cy="18" rx="12" ry="6" stroke="#FF6B35" strokeWidth="2" />
    <ellipse cx="16" cy="16" rx="9" ry="4" stroke="#FF6B35" strokeWidth="1.5" />
    <path d="M12 8c0-4 8-4 8 0" stroke="#7ED321" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="16" y1="8" x2="16" y2="14" stroke="#7ED321" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
