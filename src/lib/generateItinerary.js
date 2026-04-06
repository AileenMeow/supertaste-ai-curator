import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from '../data/systemPrompt';
import { THEME_EXCEL_MAP } from '../data/themeMapping';

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Module-level cache so Excel is only loaded once per session
let excelCache = null;

async function getExcelSpots(themeId) {
  if (!excelCache) {
    const { loadDataFromExcel } = await import('../utils/dataLoader');
    excelCache = await loadDataFromExcel();
  }

  const mapping = THEME_EXCEL_MAP[themeId];
  if (!mapping) return { articles: [], places: [] };

  const { city, theme } = mapping;
  const allSpots = excelCache.spots.filter(
    (s) => s.city === city && s.theme === theme
  );

  // 有食尚玩家文章連結 → 作為參考文章
  const articles = allSpots
    .filter((s) => s.url && s.url.includes('supertaste.tvbs.com.tw'))
    .map((s) => ({ title: s.name, url: s.url, quote: s.quote, priceRange: s.priceRange }));

  // 沒有連結 → 個別店家/景點（行程主體）
  const places = allSpots
    .filter((s) => !s.url || !s.url.includes('supertaste.tvbs.com.tw'))
    .map((s) => ({ title: s.name, quote: s.quote, priceRange: s.priceRange, category: s.category, type: s.type }));

  // 若 places 太少，把 articles 也當景點用
  if (places.length < 3) {
    return { articles, places: [...places, ...articles] };
  }

  return { articles, places };
}

export async function generateItinerary(theme, onStream) {
  // 嘗試載入預先生成的靜態 JSON（速度最快）
  try {
    const res = await fetch(`/data/itineraries/${theme.id}.json`);
    if (res.ok) {
      const data = await res.json();
      onStream?.(JSON.stringify(data));
      return data;
    }
  } catch {
    // 無預先生成的檔案，fallback 到 API
  }

  // 從 Excel 取出真實資料
  const { articles, places } = await getExcelSpots(theme.id);

  const userMessage = JSON.stringify({
    city: theme.city,
    theme: theme.name,
    description: theme.description,
    days: theme.duration,
    tags: theme.tags,
    // 真實食尚玩家資料 — Claude 只能用這些
    articles,  // 有 url 的文章，供 related_articles 使用
    places,    // 個別店家/景點，供 itinerary 使用
  });

  let fullText = '';

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  });

  for await (const chunk of stream) {
    if (
      chunk.type === 'content_block_delta' &&
      chunk.delta.type === 'text_delta'
    ) {
      fullText += chunk.delta.text;
      onStream?.(fullText);
    }
  }

  try {
    const cleaned = fullText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    throw new Error('AI回傳格式錯誤，請稍後再試');
  }
}
