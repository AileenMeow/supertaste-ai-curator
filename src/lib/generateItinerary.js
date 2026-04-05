import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from '../data/systemPrompt';

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateItinerary(theme, onStream) {
  const userMessage = JSON.stringify({
    city: theme.city,
    theme: theme.name,
    description: theme.description,
    days: theme.duration,
    tags: theme.tags,
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

  // Parse JSON from response
  try {
    const cleaned = fullText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    throw new Error('AI回傳格式錯誤，請稍後再試');
  }
}
