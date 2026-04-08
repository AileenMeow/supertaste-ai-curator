/**
 * Map a raw JSON spot (from supertaste_spots_data.json) → display-ready spot.
 * Adds estimated budget / duration / business hours and unifies source_url.
 */

const TYPE_DEFAULTS = {
  restaurant: { budget: '$100-400元', duration: '1-2小時', hours: '11:00-21:00' },
  attraction: { budget: '$0-300元',   duration: '1-1.5小時', hours: '09:00-17:00' },
  experience: { budget: '$100-500元', duration: '1.5-2小時', hours: '10:00-18:00' },
  shop:       { budget: '$100-1000元', duration: '30分鐘-1小時', hours: '10:00-20:00' },
};

function estimateBudget(spot) {
  const desc = spot.description || '';
  const m = desc.match(/(?:NT)?\$?\s*(\d{2,4})\s*[-~~]\s*(\d{2,4})\s*元?/);
  if (m) return `$${m[1]}-${m[2]}元`;
  return TYPE_DEFAULTS[spot.type]?.budget || '$100-300元';
}

function estimateDuration(spot) {
  const text = `${spot.description || ''} ${(spot.highlights || []).join(' ')}`;
  if (/2\s*[-~]\s*3\s*小時/.test(text)) return '2-3小時';
  if (/1\.5\s*[-~]\s*2\s*小時/.test(text)) return '1.5-2小時';
  if (/1\s*[-~]\s*2\s*小時/.test(text)) return '1-2小時';
  if (/半小時|30\s*分/.test(text)) return '30分鐘';
  return TYPE_DEFAULTS[spot.type]?.duration || '1-2小時';
}

function estimateBusinessHours(spot) {
  const desc = spot.description || '';
  const m = desc.match(/(\d{1,2}):(\d{2})\s*[-~至到]\s*(\d{1,2}):(\d{2})/);
  if (m) return `${m[1].padStart(2, '0')}:${m[2]}-${m[3].padStart(2, '0')}:${m[4]}`;
  if (/24\s*小時|全天候/.test(desc)) return '24小時營業';
  return TYPE_DEFAULTS[spot.type]?.hours || '10:00-18:00';
}

export function mapSpotData(spot) {
  if (!spot) return null;
  return {
    name: spot.name,
    type: spot.type,
    tagline: spot.tagline,
    description: spot.description,
    tags: spot.tags || [],
    area: spot.area,
    address: spot.address,
    highlights: spot.highlights || [],
    // unify field name
    source_url: spot.source_article || spot.source_url || null,
    source_article: spot.source_article || spot.source_url || null,
    // estimated fields
    budget: estimateBudget(spot),
    suggestedDuration: estimateDuration(spot),
    businessHours: estimateBusinessHours(spot),
  };
}
