// Fetch og:title for every unique source_article URL in supertaste_spots_data.json
// Output: src/data/article-titles.json  → { "url": "title", ... }

import fs from 'node:fs';
import path from 'node:path';

const DATA_PATH = path.resolve('src/data/supertaste_spots_data.json');
const OUT_PATH  = path.resolve('src/data/article-titles.json');

const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
const urls = [...new Set(data.themes.flatMap(t => t.spots).map(s => s.source_article).filter(Boolean))];

console.log(`Fetching ${urls.length} article titles…`);

const existing = fs.existsSync(OUT_PATH) ? JSON.parse(fs.readFileSync(OUT_PATH, 'utf8')) : {};
const result = { ...existing };

let done = 0;
for (const url of urls) {
  if (result[url]) { done++; continue; }
  try {
    const html = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (curator-bot)' } }).then(r => r.text());
    const m = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i)
           || html.match(/<title>([^<]+)<\/title>/i);
    const title = m ? m[1].replace(/\s*[-|]\s*食尚玩家.*$/, '').trim() : null;
    result[url] = title || url.split('/').pop();
    done++;
    console.log(`[${done}/${urls.length}] ${result[url]}`);
  } catch (e) {
    console.error(`[${done}/${urls.length}] FAIL ${url}: ${e.message}`);
    result[url] = url.split('/').pop();
    done++;
  }
  // Polite delay
  await new Promise(r => setTimeout(r, 250));
}

fs.writeFileSync(OUT_PATH, JSON.stringify(result, null, 2), 'utf8');
console.log(`\n✓ Saved ${Object.keys(result).length} titles → ${OUT_PATH}`);
