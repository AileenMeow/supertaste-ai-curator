// Hand-drawn style SVG icons — wobbly strokes, rounded caps, no fill (or light fill)
// Used to replace emoji throughout the app for a consistent illustrated feel.

const base = {
  fill: 'none',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: 2,
};

export const HdCompass = ({ size = 80, color = '#FF7847' }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" {...base} stroke={color} strokeWidth="3">
    <circle cx="40" cy="40" r="32" />
    <circle cx="40" cy="40" r="26" strokeDasharray="2 4" />
    <path d="M40 16 L44 38 L40 44 L36 38 Z" fill={color} stroke="none" />
    <path d="M40 64 L36 42 L40 36 L44 42 Z" fill={color} opacity="0.4" stroke="none" />
    <circle cx="40" cy="40" r="3" fill={color} stroke="none" />
  </svg>
);

export const HdCalendar = ({ size = 22, color = '#FF7847' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color}>
    <path d="M4 7 Q4 5 6 5 L18 5 Q20 5 20 7 L20 19 Q20 21 18 21 L6 21 Q4 21 4 19 Z" />
    <path d="M4 10 L20 10" />
    <path d="M8 3 L8 7" />
    <path d="M16 3 L16 7" />
    <circle cx="9" cy="14" r="1" fill={color} stroke="none" />
    <circle cx="13" cy="14" r="1" fill={color} stroke="none" />
    <circle cx="17" cy="14" r="1" fill={color} stroke="none" />
  </svg>
);

export const HdFork = ({ size = 16, color = '#1d4ed8' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color} strokeWidth="2.2">
    <path d="M7 3 Q7 8 7 12 Q7 14 9 14 L9 21" />
    <path d="M10 3 L10 9" />
    <path d="M4 3 L4 9" />
    <path d="M16 3 Q14 6 14 10 Q14 13 16 13 L16 21" />
  </svg>
);

export const HdPin = ({ size = 16, color = '#15803d' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color} strokeWidth="2.2">
    <path d="M12 2 Q6 2 5 9 Q5 13 7 16 Q9 19 12 22 Q15 19 17 16 Q19 13 19 9 Q18 2 12 2 Z" />
    <circle cx="12" cy="9" r="3" />
  </svg>
);

export const HdMask = ({ size = 16, color = '#7c3aed' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color} strokeWidth="2.2">
    <path d="M3 8 Q3 6 6 6 L18 6 Q21 6 21 8 Q21 14 18 17 Q15 19 12 19 Q9 19 6 17 Q3 14 3 8 Z" />
    <circle cx="9" cy="11" r="1.5" fill={color} stroke="none" />
    <circle cx="15" cy="11" r="1.5" fill={color} stroke="none" />
  </svg>
);

export const HdBag = ({ size = 16, color = '#be185d' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color} strokeWidth="2.2">
    <path d="M5 8 L19 8 L18 21 L6 21 Z" />
    <path d="M9 8 Q9 4 12 4 Q15 4 15 8" />
  </svg>
);

export const HdTag = ({ size = 14, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color} strokeWidth="2.2">
    <path d="M3 12 L12 3 L21 3 L21 12 L12 21 Z" />
    <circle cx="16" cy="8" r="1.5" fill={color} stroke="none" />
  </svg>
);

export const HdCoin = ({ size = 14, color = '#6b7280' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color} strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7 L12 17" />
    <path d="M9 10 Q12 8 15 10" />
    <path d="M9 14 Q12 16 15 14" />
  </svg>
);

export const HdClock = ({ size = 14, color = '#6b7280' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color} strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7 L12 12 L16 14" />
  </svg>
);

export const HdHours = ({ size = 14, color = '#6b7280' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color} strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 6 L12 12" />
    <path d="M12 12 L17 12" />
  </svg>
);

export const HdWalk = ({ size = 18, color = '#6b7280' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color} strokeWidth="2.2">
    <circle cx="13" cy="4" r="2" />
    <path d="M13 6 L11 12 L8 14" />
    <path d="M11 12 L14 14 L14 20" />
    <path d="M14 14 L16 11 L19 11" />
    <path d="M11 12 L9 18 L9 21" />
  </svg>
);

export const HdNews = ({ size = 22, color = '#1f2937' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color}>
    <path d="M3 5 L18 5 L18 19 Q18 20 19 20 Q20 20 20 19 L20 9 L18 9" />
    <path d="M3 5 L3 19 Q3 20 4 20 L18 20" />
    <path d="M6 9 L15 9" />
    <path d="M6 13 L15 13" />
    <path d="M6 17 L11 17" />
  </svg>
);

export const HdInfo = ({ size = 14, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color} strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11 L12 17" />
    <circle cx="12" cy="7.5" r="1" fill={color} stroke="none" />
  </svg>
);

export const HdCheck = ({ size = 16, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color} strokeWidth="3">
    <path d="M4 12 L10 18 L20 6" />
  </svg>
);

export const HdClose = ({ size = 14, color = '#16a34a' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color} strokeWidth="2.5">
    <path d="M6 6 L18 18" />
    <path d="M18 6 L6 18" />
  </svg>
);

export const HdThinking = ({ size = 80, color = '#9ca3af' }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" {...base} stroke={color} strokeWidth="3">
    <circle cx="40" cy="40" r="30" />
    <circle cx="30" cy="34" r="2.5" fill={color} stroke="none" />
    <circle cx="50" cy="34" r="2.5" fill={color} stroke="none" />
    <path d="M28 52 Q34 48 40 50 Q46 52 52 50" />
    <path d="M55 22 Q62 18 64 24 Q66 30 60 32 Q58 33 58 36" />
    <circle cx="58" cy="40" r="1.5" fill={color} stroke="none" />
  </svg>
);

export const HdLock = ({ size = 64, color = '#FF7847' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" {...base} stroke={color} strokeWidth="3">
    {/* Shackle (slightly wobbly) */}
    <path d="M20 28 Q19 18 24 14 Q32 9 40 14 Q45 18 44 28" />
    {/* Body */}
    <path d="M14 30 Q13 30 13 32 L13 52 Q13 55 16 55 L48 55 Q51 55 51 52 L51 32 Q51 30 50 30 Z" />
    {/* Keyhole */}
    <circle cx="32" cy="40" r="3" />
    <path d="M32 43 L32 48" strokeWidth="3.5" />
  </svg>
);

export const HdRefresh = ({ size = 18, color = '#FF7847' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color} strokeWidth="2.4">
    <path d="M20 6 Q17 3 12 3 Q5 3 4 11" />
    <path d="M20 3 L20 8 L15 8" />
    <path d="M4 18 Q7 21 12 21 Q19 21 20 13" />
    <path d="M4 21 L4 16 L9 16" />
  </svg>
);

export const HdStar = ({ size = 14, color = '#f59e0b' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color} strokeWidth="2">
    <path d="M12 3 L14.5 9 L21 9.5 L16 14 L17.5 20.5 L12 17 L6.5 20.5 L8 14 L3 9.5 L9.5 9 Z" />
  </svg>
);
