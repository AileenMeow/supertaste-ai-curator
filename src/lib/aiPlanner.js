import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

/**
 * Single Claude call that does three things at once:
 *   1. Order the selected spots into the most logical route
 *   2. Generate a personalized 2-3 sentence opening story
 *   3. Pick best lunch / dinner restaurants from the available pool
 *
 * Returns: { story, orderedNames: string[], lunchPick: string|null, dinnerPick: string|null }
 *
 * Throws on API failure — caller decides how to surface to user.
 */
export async function planItinerary({ theme, selectedSpots, allThemeSpots }) {
  // Estimate hours inline so AI sees when each spot is open
  const guessHours = (s) => {
    const d = s.description || '';
    const m = d.match(/(\d{1,2}):(\d{2})\s*[-~至到]\s*(\d{1,2}):(\d{2})/);
    if (m) return `${m[1].padStart(2,'0')}:${m[2]}-${m[3].padStart(2,'0')}:${m[4]}`;
    if (/24\s*小時/.test(d)) return '24h';
    if (s.type === 'restaurant') return '11:00-21:00';
    if (s.type === 'shop') return '10:00-20:00';
    return '09:00-17:00';
  };

  const spotsForPrompt = selectedSpots.map((s, i) => ({
    i,
    name: s.name,
    type: s.type,
    area: s.area || '',
    hours: guessHours(s),
    tagline: s.tagline || '',
  }));

  const isNightTheme = /不夜|夜|晚|凌晨/.test(theme.name);
  const startTime = isNightTheme ? '18:00' : '09:00';

  // Restaurant candidates from the broader theme pool (for AI meal picking)
  const restaurants = (allThemeSpots || [])
    .filter(s => s.type === 'restaurant')
    .slice(0, 30)
    .map(s => ({ name: s.name, area: s.area || '', tagline: s.tagline || '' }));

  const userPrompt = `你是「食尚玩家 AI 導遊」。我選了主題「${theme.name}」(${theme.city}・${theme.duration})。
行程從 ${startTime} 開始，每個點停留約 90 分鐘。

【我選的景點 (${spotsForPrompt.length} 個)】
${spotsForPrompt.map(s => `${s.i}. ${s.name} | ${s.type} | ${s.area} | 營業 ${s.hours} | ${s.tagline}`).join('\n')}

【可用餐廳池】
${restaurants.map(r => `- ${r.name} | ${r.area} | ${r.tagline}`).join('\n')}

排序規則（重要！）：
1. 開始時間是 ${startTime}，**絕對不能把當下還沒開門的店排在第一個**（例如餐廳通常 11:00 才開，09:00 開始就應該先去景點/早餐店）
2. 同區的景點要排在一起，避免來回奔波
3. 午餐時段（11:30-14:00）盡量安排美食類
4. 晚餐時段（18:00-20:30）盡量安排美食類
5. 戶外/景點優先排白天，咖啡/酒吧/夜景排傍晚後

請只回傳一個 JSON 物件，不要多餘文字、不要 markdown：
{
  "story": "2~3 句個人化開場（70-120 字），口語、有溫度，提到我選的元素",
  "ordered_indices": [依上述規則排好的 i 索引陣列],
  "lunch_pick": "餐廳池中最適合午餐的店名 / null",
  "dinner_pick": "餐廳池中最適合晚餐的店名 / null"
}`;

  const resp = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const text = resp.content?.[0]?.type === 'text' ? resp.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('AI 回應格式錯誤');

  const parsed = JSON.parse(jsonMatch[0]);
  const orderedIndices = Array.isArray(parsed.ordered_indices) ? parsed.ordered_indices : spotsForPrompt.map(s => s.i);
  const orderedNames = orderedIndices
    .map(i => spotsForPrompt[i]?.name)
    .filter(Boolean);

  return {
    story: parsed.story || '',
    orderedNames,
    lunchPick: parsed.lunch_pick || null,
    dinnerPick: parsed.dinner_pick || null,
  };
}
