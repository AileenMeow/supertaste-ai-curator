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
  const spotsForPrompt = selectedSpots.map((s, i) => ({
    i,
    name: s.name,
    type: s.type,
    area: s.area || '',
    tagline: s.tagline || '',
  }));

  // Restaurant candidates from the broader theme pool (for AI meal picking)
  const restaurants = (allThemeSpots || [])
    .filter(s => s.type === 'restaurant')
    .slice(0, 30)
    .map(s => ({ name: s.name, area: s.area || '', tagline: s.tagline || '' }));

  const userPrompt = `你是「食尚玩家 AI 導遊」。我選了主題「${theme.name}」(${theme.city}・${theme.duration})，slogan：「${theme.tagline || theme.description}」。

【我選的景點 (${spotsForPrompt.length} 個)】
${spotsForPrompt.map(s => `${s.i}. ${s.name} | ${s.type} | ${s.area} | ${s.tagline}`).join('\n')}

【可用餐廳池】
${restaurants.map(r => `- ${r.name} | ${r.area} | ${r.tagline}`).join('\n')}

請只回傳一個 JSON 物件，不要多餘文字、不要 markdown：
{
  "story": "2~3 句個人化開場（70-120 字），口語、有溫度，提到我選的元素",
  "ordered_indices": [依地理位置與動線合理性重排後的 i 索引陣列],
  "lunch_pick": "餐廳名稱 (從餐廳池選一家最適合作午餐 / 同區優先)，若餐廳池為空則回 null",
  "dinner_pick": "餐廳名稱 (從餐廳池選一家最適合作晚餐)，若餐廳池為空則回 null"
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
